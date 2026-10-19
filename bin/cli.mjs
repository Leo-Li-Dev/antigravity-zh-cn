#!/usr/bin/env node
/**
 * Antigravity 2.0 简体中文汉化补丁 - 跨平台 CLI 入口 (支持 npx github:Leo-Li-Dev/antigravity-zh-cn)
 */

import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const args = process.argv.slice(2);
const cmd = (args[0] || 'install').toLowerCase();

if (cmd === '-h' || cmd === '--help' || cmd === 'help') {
  console.log(`
Antigravity 2.0 简体中文持久化汉化补丁 (antigravity-zh-cn)

用法:
  npx github:Leo-Li-Dev/antigravity-zh-cn [command]

命令:
  install      安装汉化补丁并开启防更新自动守护 (默认)
  uninstall    卸载汉化补丁并实时恢复原版英文界面
  inject       仅向当前运行中的窗口实时热注入中文
  help         显示帮助信息
`);
  process.exit(0);
}

const isWin = process.platform === 'win32';

if (cmd === 'uninstall' || cmd === 'remove' || cmd === 'restore') {
  if (isWin) {
    const script = path.join(ROOT_DIR, 'uninstall.ps1');
    const res = spawnSync('powershell.exe', ['-ExecutionPolicy', 'Bypass', '-File', script], {
      stdio: 'inherit',
    });
    process.exit(res.status ?? 0);
  } else {
    const script = path.join(ROOT_DIR, 'uninstall.sh');
    const res = spawnSync('bash', [script], { stdio: 'inherit' });
    process.exit(res.status ?? 0);
  }
} else if (cmd === 'inject') {
  const daemonScript = path.join(ROOT_DIR, 'src', 'patch-daemon.mjs');
  const res = spawnSync(process.execPath, [daemonScript, '--inject-live'], {
    stdio: 'inherit',
    env: { ...process.env, ELECTRON_RUN_AS_NODE: '1' },
  });
  process.exit(res.status ?? 0);
} else {
  if (isWin) {
    const script = path.join(ROOT_DIR, 'install.ps1');
    const res = spawnSync('powershell.exe', ['-ExecutionPolicy', 'Bypass', '-File', script], {
      stdio: 'inherit',
    });
    process.exit(res.status ?? 0);
  } else {
    const script = path.join(ROOT_DIR, 'install.sh');
    const res = spawnSync('bash', [script], { stdio: 'inherit' });
    process.exit(res.status ?? 0);
  }
}
