#!/usr/bin/env node
/**
 * Antigravity 2.0 简体中文持久化补丁与守护引擎 (patch-daemon.mjs)
 * ============================================================================
 * 零外部依赖 (Zero Dependencies)：
 * - 直接使用 Node.js 内置模块 (fs, path, os, http, crypto, child_process)
 * - 支持通过系统 Node.js 或 Antigravity 自带的 Electron 二进制 (ELECTRON_RUN_AS_NODE=1) 运行
 *
 * 双引擎无死角防更新架构：
 * 1. [引擎 A - ASAR 静态预加载与原生菜单补丁]
 *    纯 JS 解析并重写 Resources/app.asar，将汉化脚本注入 dist/preload.js，
 *    同时汉化主进程菜单栏、托盘、对话框 (menu.js / tray.js / updater.js / main.js / ipcHandlers.js)，
 *    并在 macOS 上自动执行保留权限的顶层重签名。
 * 2. [引擎 B - CDP 实时热注入与自愈守护]
 *    读取 DevToolsActivePort，通过 Chrome DevTools Protocol 实时将汉化脚本注入
 *    正在运行的窗口，并在后台监听客户端更新，一旦发现版本更新自动秒级重打补丁。
 */

// 关键：禁用 Electron 的 ASAR 虚拟文件系统拦截，使 fs 将 .asar 视为普通二进制文件
process.noAsar = true;

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import http from 'node:http';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PATCH_MARKER_START = '/* === ANTIGRAVITY_ZH_CN_PATCH_START === */';
const PATCH_MARKER_END = '/* === ANTIGRAVITY_ZH_CN_PATCH_END === */';
const BLOCK_SIZE = 4 * 1024 * 1024; // 4MB ASAR Integrity Block Size

// ============================================================================
// 1. 跨平台路径自动探测
// ============================================================================

function resolvePaths() {
  const platform = process.platform;
  const home = os.homedir();

  const injectScriptPath = path.resolve(__dirname, 'zh-cn-inject.js');
  const installRoot = path.resolve(__dirname, '..');
  const backupDir = path.join(installRoot, 'backups');

  // 探测 UserData 目录 (DevToolsActivePort 所在位置)
  const userDataCandidates = [];
  if (platform === 'darwin') {
    userDataCandidates.push(
      path.join(home, 'Library', 'Application Support', 'Antigravity'),
      path.join(home, 'Library', 'Application Support', 'Antigravity Insiders')
    );
  } else if (platform === 'win32') {
    const appData = process.env.APPDATA || path.join(home, 'AppData', 'Roaming');
    userDataCandidates.push(
      path.join(appData, 'Antigravity'),
      path.join(appData, 'Antigravity Insiders')
    );
  } else {
    const configHome = process.env.XDG_CONFIG_HOME || path.join(home, '.config');
    userDataCandidates.push(
      path.join(configHome, 'Antigravity'),
      path.join(configHome, 'Antigravity Insiders')
    );
  }

  // 探测应用安装目录与 app.asar 路径
  const appCandidates = [];
  if (platform === 'darwin') {
    appCandidates.push(
      {
        appBundle: '/Applications/Antigravity.app',
        asarPath: '/Applications/Antigravity.app/Contents/Resources/app.asar',
      },
      {
        appBundle: path.join(home, 'Applications', 'Antigravity.app'),
        asarPath: path.join(home, 'Applications', 'Antigravity.app', 'Contents', 'Resources', 'app.asar'),
      },
      {
        appBundle: '/Applications/Antigravity Insiders.app',
        asarPath: '/Applications/Antigravity Insiders.app/Contents/Resources/app.asar',
      }
    );
  } else if (platform === 'win32') {
    const localAppData = process.env.LOCALAPPDATA || path.join(home, 'AppData', 'Local');
    const progFiles = process.env.ProgramFiles || 'C:\\Program Files';
    appCandidates.push(
      {
        appBundle: path.join(localAppData, 'Programs', 'Antigravity'),
        asarPath: path.join(localAppData, 'Programs', 'Antigravity', 'resources', 'app.asar'),
      },
      {
        appBundle: path.join(progFiles, 'Antigravity'),
        asarPath: path.join(progFiles, 'Antigravity', 'resources', 'app.asar'),
      }
    );
  } else {
    appCandidates.push(
      {
        appBundle: '/opt/Antigravity',
        asarPath: '/opt/Antigravity/resources/app.asar',
      },
      {
        appBundle: '/usr/lib/antigravity',
        asarPath: '/usr/lib/antigravity/resources/app.asar',
      },
      {
        appBundle: '/usr/share/antigravity',
        asarPath: '/usr/share/antigravity/resources/app.asar',
      }
    );
  }

  // 支持通过环境变量强制指定路径
  if (process.env.ANTIGRAVITY_ASAR_PATH) {
    appCandidates.unshift({
      appBundle: path.dirname(path.dirname(process.env.ANTIGRAVITY_ASAR_PATH)),
      asarPath: process.env.ANTIGRAVITY_ASAR_PATH,
    });
  }

  const activeApps = appCandidates.filter((c) => {
    try {
      return fs.existsSync(c.asarPath);
    } catch {
      return false;
    }
  });

  const activeUserData = userDataCandidates.filter((d) => {
    try {
      return fs.existsSync(d);
    } catch {
      return false;
    }
  });

  return {
    injectScriptPath,
    installRoot,
    backupDir,
    activeApps,
    activeUserData,
  };
}

// ============================================================================
// 2. 纯 JS ASAR 解包与重打包器 (零外部依赖)
// ============================================================================

function computeAsarIntegrity(buffer) {
  const hash = crypto.createHash('sha256').update(buffer).digest('hex');
  const blocks = [];
  for (let offset = 0; offset < buffer.length; offset += BLOCK_SIZE) {
    const slice = buffer.subarray(offset, Math.min(offset + BLOCK_SIZE, buffer.length));
    blocks.push(crypto.createHash('sha256').update(slice).digest('hex'));
  }
  return {
    algorithm: 'SHA256',
    hash,
    blockSize: BLOCK_SIZE,
    blocks,
  };
}

function readAsarArchive(asarPath) {
  const raw = fs.readFileSync(asarPath);
  const headerSize = raw.readUInt32LE(4);
  const stringSize = raw.readUInt32LE(12);
  const headerJsonStr = raw.subarray(16, 16 + stringSize).toString('utf8');
  const header = JSON.parse(headerJsonStr);
  const dataOffset = 8 + headerSize;

  // 递归提取文件树到内存 Map (路径 -> Buffer)
  const filesMap = new Map();

  function walkTree(node, prefix = '') {
    if (!node || !node.files) return;
    for (const [name, meta] of Object.entries(node.files)) {
      const relPath = prefix ? `${prefix}/${name}` : name;
      if (meta.files) {
        walkTree(meta, relPath);
      } else if (!meta.unpacked && meta.offset !== undefined && meta.size !== undefined) {
        const start = dataOffset + Number(meta.offset);
        const end = start + Number(meta.size);
        filesMap.set(relPath, Buffer.from(raw.subarray(start, end)));
      }
    }
  }

  walkTree(header);
  return { header, filesMap };
}

function writeAsarArchive(asarPath, header, filesMap) {
  const chunks = [];
  let currentOffset = 0;

  function rebuildTree(node, prefix = '') {
    if (!node || !node.files) return;
    for (const [name, meta] of Object.entries(node.files)) {
      const relPath = prefix ? `${prefix}/${name}` : name;
      if (meta.files) {
        rebuildTree(meta, relPath);
      } else if (!meta.unpacked && meta.offset !== undefined && meta.size !== undefined) {
        const buf = filesMap.get(relPath);
        if (!buf) {
          throw new Error(`Missing buffer for file in ASAR: ${relPath}`);
        }
        meta.offset = String(currentOffset);
        meta.size = buf.length;
        meta.integrity = computeAsarIntegrity(buf);
        chunks.push(buf);
        currentOffset += buf.length;
      }
    }
  }

  rebuildTree(header);

  const headerBuf = Buffer.from(JSON.stringify(header), 'utf8');
  const stringSize = headerBuf.length;
  // 4字节对齐填充
  const alignedStringSize = Math.ceil(stringSize / 4) * 4;
  const headerPicklePayload = 4 + alignedStringSize;
  const headerSize = 4 + headerPicklePayload;

  const preamble = Buffer.alloc(16 + alignedStringSize);
  preamble.writeUInt32LE(4, 0); // sizePicklePayload
  preamble.writeUInt32LE(headerSize, 4);
  preamble.writeUInt32LE(headerPicklePayload, 8);
  preamble.writeUInt32LE(stringSize, 12);
  headerBuf.copy(preamble, 16);

  const finalBuffer = Buffer.concat([preamble, ...chunks]);
  const tmpPath = `${asarPath}.tmp.${process.pid}`;
  fs.writeFileSync(tmpPath, finalBuffer);
  fs.renameSync(tmpPath, asarPath);
}

// ============================================================================
// 3. 主进程与 Preload 源码补丁转换器
// ============================================================================

function transformPreloadJs(source, injectCode, injectHash) {
  // 移除旧版补丁块（如果存在）
  let cleaned = source;
  const startIdx = cleaned.indexOf(PATCH_MARKER_START);
  const endIdx = cleaned.indexOf(PATCH_MARKER_END);
  if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
    cleaned = cleaned.slice(0, startIdx).trimEnd() + '\n';
  }

  const encodedScript = JSON.stringify(injectCode);

  const patchBlock = `
${PATCH_MARKER_START}
// Hash: ${injectHash}
;(function () {
  try {
    const __agyZhSource = ${encodedScript};
    const __runZhInject = () => {
      try {
        if (electron_1 && electron_1.webFrame && typeof electron_1.webFrame.executeJavaScript === 'function') {
          void electron_1.webFrame.executeJavaScript(__agyZhSource).catch(() => {});
        }
      } catch (_e) {}
    };
    if (typeof document !== 'undefined') {
      if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', __runZhInject, { once: true });
      } else {
        __runZhInject();
      }
      window.addEventListener('load', __runZhInject, { once: true });
    } else {
      setTimeout(__runZhInject, 50);
    }
  } catch (_err) {}
})();
${PATCH_MARKER_END}
`;

  return cleaned + patchBlock;
}

function transformMenuJs(source) {
  let out = source;
  out = out.replace(`label: 'New Window'`, `label: '新建窗口'`);
  out = out.replace(`label: 'Docs'`, `label: '使用文档'`);
  out = out.replace(`label: 'Connect to WSL'`, `label: '连接到 WSL'`);
  out = out.replace(`label: 'Reopen Locally'`, `label: '在本地重新打开'`);

  // 在 hideDevTools 遍历菜单时顺便将 Electron 默认英文菜单汉化
  const menuTranslateSnippet = `
            const __zhMenuMap = {
                'File': '文件',
                'Edit': '编辑',
                'View': '视图',
                'Window': '窗口',
                'Help': '帮助',
                'About Antigravity': '关于 Antigravity',
                'Services': '服务',
                'Hide Antigravity': '隐藏 Antigravity',
                'Hide Others': '隐藏其他',
                'Show All': '全部显示',
                'Quit Antigravity': '退出 Antigravity',
                'Quit': '退出',
                'Undo': '撤销',
                'Redo': '重做',
                'Cut': '剪切',
                'Copy': '复制',
                'Paste': '粘贴',
                'Paste and Match Style': '粘贴并匹配样式',
                'Delete': '删除',
                'Select All': '全选',
                'Speech': '语音',
                'Start Speaking': '开始朗读',
                'Stop Speaking': '停止朗读',
                'Reload': '重新加载',
                'Force Reload': '强制重新加载',
                'Actual Size': '实际大小',
                'Zoom In': '放大',
                'Zoom Out': '缩小',
                'Toggle Full Screen': '切换全屏',
                'Minimize': '最小化',
                'Zoom': '缩放',
                'Close': '关闭窗口',
                'Bring All to Front': '前置全部窗口'
            };
            if (item.label && __zhMenuMap[item.label]) {
                item.label = __zhMenuMap[item.label];
            }
`;
  if (!out.includes('__zhMenuMap')) {
    out = out.replace(
      `if (item.role?.toLocaleLowerCase() === 'toggledevtools') {`,
      `${menuTranslateSnippet}\n            if (item.role?.toLocaleLowerCase() === 'toggledevtools') {`
    );
  }
  return out;
}

function transformTrayJs(source) {
  let out = source;
  out = out.replace(
    `(count > 0 ? \`\${count}\` : 'No') +\n                    ' agent' +\n                    (count === 1 ? '' : 's') +\n                    ' running'`,
    `(count > 0 ? \`\${count} 个代理正在运行\` : '无正在运行的代理')`
  );
  return out;
}

function transformUpdaterJs(source) {
  let out = source;
  out = out.replace(`MenuUpdateStep["CheckForUpdates"] = "Check for Updates";`, `MenuUpdateStep["CheckForUpdates"] = "检查更新";`);
  out = out.replace(`MenuUpdateStep["CheckingForUpdates"] = "Checking for Updates...";`, `MenuUpdateStep["CheckingForUpdates"] = "正在检查更新...";`);
  out = out.replace(`MenuUpdateStep["DownloadingUpdate"] = "Downloading Update...";`, `MenuUpdateStep["DownloadingUpdate"] = "正在下载更新...";`);
  out = out.replace(`MenuUpdateStep["RestartToUpdate"] = "Restart to Update";`, `MenuUpdateStep["RestartToUpdate"] = "重启以完成更新";`);
  out = out.replace(`title: 'Check for Updates'`, `title: '检查更新'`);
  out = out.replace(`message: 'No updates available'`, `message: '当前已是最新版本'`);
  out = out.replace(`buttons: ['OK']`, `buttons: ['确定']`);
  return out;
}

function transformIpcHandlersJs(source) {
  let out = source;
  out = out.replace(`title: 'Open workspace'`, `title: '打开工作区'`);
  out = out.replace(`title: 'Open workspaces'`, `title: '打开多个工作区'`);
  out = out.replace(`'Cannot open folder'`, `'无法打开文件夹'`);
  out = out.replace(`'Folder is on the Windows filesystem'`, `'文件夹位于 Windows 文件系统中'`);

  // 汉化原生右键上下文菜单项
  const ctxMenuTranslate = `
    const __zhCtxMap = {
        'Cut': '剪切',
        'Copy': '复制',
        'Paste': '粘贴',
        'Select All': '全选',
        'Undo': '撤销',
        'Redo': '重做',
        'Delete': '删除',
        'Rename': '重命名',
        'Open': '打开',
        'Reveal in Finder': '在访达中显示',
        'Reveal in File Explorer': '在文件资源管理器中显示',
        'Copy Path': '复制路径',
        'Copy Relative Path': '复制相对路径'
    };
`;
  if (!out.includes('__zhCtxMap')) {
    out = out.replace(
      `function buildContextMenuTemplate(items, onSelect) {`,
      `function buildContextMenuTemplate(items, onSelect) {${ctxMenuTranslate}`
    );
    out = out.replaceAll(
      `label: item.label ?? '',`,
      `label: (__zhCtxMap[item.label] || item.label) ?? '',`
    );
  }
  return out;
}

function transformMainJs(source) {
  let out = source;
  out = out.replace(`label: 'New Window'`, `label: '新建窗口'`);
  out = out.replace(`label: 'No agents running'`, `label: '无正在运行的代理'`);
  out = out.replace('label: `Open ${electron_1.app.getName()}`', 'label: `打开 ${electron_1.app.getName()}`');
  out = out.replace(`label: 'Quit'`, `label: '退出'`);
  out = out.replace(`buttons: ['Cancel', 'Quit']`, `buttons: ['取消', '退出']`);
  out = out.replace(`title: 'Confirm Quit'`, `title: '确认退出'`);
  out = out.replace(`message: 'Are you sure you want to quit?'`, `message: '确定要退出 Antigravity 吗？'`);
  out = out.replace(`detail: 'There may be agents or background tasks running.'`, `detail: '当前可能有代理或后台任务仍在运行。'`);
  return out;
}

// ============================================================================
// 4. ASAR 补丁安装与恢复逻辑
// ============================================================================

function patchAsarAll(options = { force: false, quiet: false }) {
  const { injectScriptPath, backupDir, activeApps } = resolvePaths();
  if (!fs.existsSync(injectScriptPath)) {
    throw new Error(`找不到汉化注入脚本: ${injectScriptPath}`);
  }

  const injectCode = fs.readFileSync(injectScriptPath, 'utf8');
  const injectHash = crypto.createHash('sha256').update(injectCode).digest('hex').slice(0, 16);

  fs.mkdirSync(backupDir, { recursive: true });

  let patchedCount = 0;

  for (const appInfo of activeApps) {
    const { appBundle, asarPath } = appInfo;
    try {
      const { header, filesMap } = readAsarArchive(asarPath);
      const pkgBuf = filesMap.get('package.json');
      const pkg = pkgBuf ? JSON.parse(pkgBuf.toString('utf8')) : { version: 'unknown' };
      const version = pkg.version || 'unknown';

      const preloadBuf = filesMap.get('dist/preload.js');
      if (!preloadBuf) {
        if (!options.quiet) {
          console.warn(`[WARN] ${asarPath} 中未找到 dist/preload.js，跳过。`);
        }
        continue;
      }

      const preloadSource = preloadBuf.toString('utf8');
      const isAlreadyPatchedWithCurrentHash =
        preloadSource.includes(PATCH_MARKER_START) &&
        preloadSource.includes(`// Hash: ${injectHash}`);

      if (isAlreadyPatchedWithCurrentHash && !options.force) {
        if (!options.quiet) {
          console.log(`[OK] ${asarPath} (v${version}) 已包含最新汉化补丁 (Hash: ${injectHash})。`);
        }
        continue;
      }

      // 备份原始未打补丁的 app.asar
      const backupFile = path.join(backupDir, `app.asar.v${version}.bak`);
      if (!preloadSource.includes(PATCH_MARKER_START) && !fs.existsSync(backupFile)) {
        fs.copyFileSync(asarPath, backupFile);
        if (!options.quiet) {
          console.log(`[BACKUP] 已备份原始 app.asar -> ${backupFile}`);
        }
      }

      // 转换各模块
      filesMap.set(
        'dist/preload.js',
        Buffer.from(transformPreloadJs(preloadSource, injectCode, injectHash), 'utf8')
      );

      if (filesMap.has('dist/menu.js')) {
        filesMap.set(
          'dist/menu.js',
          Buffer.from(transformMenuJs(filesMap.get('dist/menu.js').toString('utf8')), 'utf8')
        );
      }
      if (filesMap.has('dist/tray.js')) {
        filesMap.set(
          'dist/tray.js',
          Buffer.from(transformTrayJs(filesMap.get('dist/tray.js').toString('utf8')), 'utf8')
        );
      }
      if (filesMap.has('dist/updater.js')) {
        filesMap.set(
          'dist/updater.js',
          Buffer.from(transformUpdaterJs(filesMap.get('dist/updater.js').toString('utf8')), 'utf8')
        );
      }
      if (filesMap.has('dist/ipcHandlers.js')) {
        filesMap.set(
          'dist/ipcHandlers.js',
          Buffer.from(transformIpcHandlersJs(filesMap.get('dist/ipcHandlers.js').toString('utf8')), 'utf8')
        );
      }
      if (filesMap.has('dist/main.js')) {
        filesMap.set(
          'dist/main.js',
          Buffer.from(transformMainJs(filesMap.get('dist/main.js').toString('utf8')), 'utf8')
        );
      }

      // 写回 app.asar
      writeAsarArchive(asarPath, header, filesMap);

      // macOS 顶层应用包重签名（保留 entitlements，不触碰内部 Frameworks 与 language_server）
      if (process.platform === 'darwin' && appBundle.endsWith('.app') && fs.existsSync(appBundle)) {
        try {
          execFileSync(
            'codesign',
            ['--force', '--sign', '-', '--preserve-metadata=entitlements', appBundle],
            { stdio: 'pipe' }
          );
          if (!options.quiet) {
            console.log(`[CODESIGN] 已完成 macOS 应用包顶层重签名: ${appBundle}`);
          }
        } catch (signErr) {
          console.warn(`[WARN] codesign 签名提示: ${signErr.message}`);
        }
      }

      patchedCount++;
      console.log(`[PATCHED] 成功汉化 ${asarPath} (v${version}, Hash: ${injectHash})`);
    } catch (err) {
      console.error(`[ERROR] 处理 ${asarPath} 失败:`, err.message);
    }
  }

  return patchedCount;
}

function restoreAsarAll() {
  const { backupDir, activeApps } = resolvePaths();
  for (const appInfo of activeApps) {
    const { appBundle, asarPath } = appInfo;
    try {
      const { filesMap } = readAsarArchive(asarPath);
      const pkgBuf = filesMap.get('package.json');
      const pkg = pkgBuf ? JSON.parse(pkgBuf.toString('utf8')) : { version: 'unknown' };
      const version = pkg.version || 'unknown';
      const backupFile = path.join(backupDir, `app.asar.v${version}.bak`);

      if (fs.existsSync(backupFile)) {
        fs.copyFileSync(backupFile, asarPath);
        if (process.platform === 'darwin' && appBundle.endsWith('.app') && fs.existsSync(appBundle)) {
          try {
            execFileSync(
              'codesign',
              ['--force', '--sign', '-', '--preserve-metadata=entitlements', appBundle],
              { stdio: 'pipe' }
            );
          } catch {}
        }
        console.log(`[RESTORED] 已从备份恢复原始文件: ${asarPath} (v${version})`);
      } else {
        console.log(`[INFO] 未找到版本 v${version} 的原始备份文件 (${backupFile})。`);
      }
    } catch (err) {
      console.error(`[ERROR] 恢复 ${asarPath} 失败:`, err.message);
    }
  }
}

// ============================================================================
// 5. CDP 实时热注入引擎 (无需重启客户端立即生效)
// ============================================================================

function httpGetJson(url, timeoutMs = 2000) {
  return new Promise((resolve, reject) => {
    const req = http.get(url, { timeout: timeoutMs }, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('HTTP Timeout'));
    });
  });
}

async function sendCdpCommands(wsUrl, commands, timeoutMs = 4000) {
  if (typeof WebSocket === 'undefined') {
    throw new Error('当前运行时不支持全局 WebSocket');
  }
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(wsUrl);
    const pending = new Map();
    let nextId = 1;

    const timer = setTimeout(() => {
      try {
        ws.close();
      } catch {}
      reject(new Error('CDP WebSocket Timeout'));
    }, timeoutMs);

    ws.onopen = async () => {
      try {
        const results = [];
        for (const cmd of commands) {
          const id = nextId++;
          const p = new Promise((res) => pending.set(id, res));
          ws.send(JSON.stringify({ id, method: cmd.method, params: cmd.params || {} }));
          results.push(await p);
        }
        clearTimeout(timer);
        ws.close();
        resolve(results);
      } catch (err) {
        clearTimeout(timer);
        ws.close();
        reject(err);
      }
    };

    ws.onmessage = (event) => {
      try {
        const raw = typeof event.data === 'string' ? event.data : event.data.toString();
        const msg = JSON.parse(raw);
        if (msg.id && pending.has(msg.id)) {
          const fn = pending.get(msg.id);
          pending.delete(msg.id);
          fn(msg);
        }
      } catch {}
    };

    ws.onerror = (err) => {
      clearTimeout(timer);
      reject(err.error || new Error('WebSocket error'));
    };
  });
}

async function injectLiveAll(options = { quiet: false, disable: false }) {
  const { injectScriptPath, activeUserData } = resolvePaths();
  if (!fs.existsSync(injectScriptPath)) return 0;

  const injectCode = fs.readFileSync(injectScriptPath, 'utf8');
  let injectedCount = 0;

  for (const userDataDir of activeUserData) {
    const portFile = path.join(userDataDir, 'DevToolsActivePort');
    if (!fs.existsSync(portFile)) continue;

    try {
      const content = fs.readFileSync(portFile, 'utf8').trim();
      const lines = content.split(/\r?\n/);
      const port = Number(lines[0]);
      if (!port || Number.isNaN(port)) continue;

      const targets = await httpGetJson(`http://127.0.0.1:${port}/json`);
      if (!Array.isArray(targets)) continue;

      for (const target of targets) {
        if (target.type !== 'page' || !target.webSocketDebuggerUrl) continue;

        if (options.disable) {
          const disableExpr = `
            (() => {
              if (typeof window.__ANTIGRAVITY_ZH_CN_DISABLE__ === 'function') {
                window.__ANTIGRAVITY_ZH_CN_DISABLE__();
              } else {
                const btn = document.getElementById('agy-zh-toggle-btn');
                if (btn) btn.remove();
              }
              return 'DISABLED';
            })()
          `;
          await sendCdpCommands(target.webSocketDebuggerUrl, [
            { method: 'Runtime.evaluate', params: { expression: disableExpr, returnByValue: true } },
          ]);
          injectedCount++;
        } else {
          await sendCdpCommands(target.webSocketDebuggerUrl, [
            { method: 'Page.enable' },
            {
              method: 'Page.addScriptToEvaluateOnNewDocument',
              params: { source: injectCode },
            },
            {
              method: 'Runtime.evaluate',
              params: { expression: injectCode, returnByValue: true },
            },
          ]);
          injectedCount++;
          if (!options.quiet) {
            console.log(`[CDP] 已实时汉化运行中窗口: ${target.title || target.url} (Port: ${port})`);
          }
        }
      }
    } catch {
      // 客户端当前未运行或端口已关闭，属正常情况
    }
  }

  return injectedCount;
}

// ============================================================================
// 6. 守护进程模式 (监听客户端热更新与重启)
// ============================================================================

async function runDaemon(watchMode = false) {
  patchAsarAll({ force: false, quiet: false });
  await injectLiveAll({ quiet: false, disable: false });

  if (!watchMode) return;

  console.log('[DAEMON] Antigravity 简体中文防更新守护进程已启动...');

  let debounceTimer = null;
  const triggerSync = () => {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async () => {
      try {
        patchAsarAll({ force: false, quiet: true });
        await injectLiveAll({ quiet: true, disable: false });
      } catch {}
    }, 1500);
  };

  const { activeApps, activeUserData } = resolvePaths();

  for (const { asarPath } of activeApps) {
    const dir = path.dirname(asarPath);
    if (fs.existsSync(dir)) {
      try {
        fs.watch(dir, (_event, filename) => {
          if (!filename || filename.includes('app.asar')) {
            triggerSync();
          }
        });
      } catch {}
    }
  }

  for (const userDataDir of activeUserData) {
    if (fs.existsSync(userDataDir)) {
      try {
        fs.watch(userDataDir, (_event, filename) => {
          if (!filename || filename === 'DevToolsActivePort') {
            triggerSync();
          }
        });
      } catch {}
    }
  }

  // 定期兜底巡检（每 25 秒检查一次新打开窗口或静默更新）
  setInterval(triggerSync, 25000);
}

// ============================================================================
// 7. CLI 入口解析
// ============================================================================

async function main() {
  const args = new Set(process.argv.slice(2));

  if (args.has('--restore-asar')) {
    restoreAsarAll();
    await injectLiveAll({ quiet: false, disable: true });
    return;
  }

  if (args.has('--uninject-live')) {
    await injectLiveAll({ quiet: false, disable: true });
    return;
  }

  if (args.has('--patch-asar')) {
    patchAsarAll({ force: args.has('--force'), quiet: args.has('--quiet') });
  }

  if (args.has('--inject-live')) {
    await injectLiveAll({ quiet: args.has('--quiet'), disable: false });
  }

  if (args.has('--daemon') || args.size === 0) {
    await runDaemon(args.has('--watch'));
  }
}

main().catch((err) => {
  console.error('[FATAL]', err);
  process.exit(1);
});
