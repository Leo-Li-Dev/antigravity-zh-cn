# Antigravity 2.0 简体中文持久化汉化补丁 (`antigravity-zh-cn`)

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Platform](https://img.shields.io/badge/Platform-macOS%20%7C%20Windows%20%7C%20Linux-blue.svg)](https://github.com/Leemating/antigravity-zh-cn)
[![Zero Dependency](https://img.shields.io/badge/Dependencies-Zero%20(Built--in%20Runtime)-brightgreen.svg)](https://github.com/Leemating/antigravity-zh-cn)

专为 **Google Antigravity 2.0** 桌面客户端打造的全量简体中文汉化开源工具。采用**「零外部依赖 + 双引擎防更新自愈架构」**，无需在电脑上安装 Node.js 或任何第三方依赖，支持 **macOS / Windows / Linux** 全平台，客户端版本自动更新后依然自动保持中文界面。

---

## 🤖 方式一（强烈推荐）：复制提示词交给 AI 自动配置

既然你正在使用 **Antigravity**（或 Claude Code / Cursor 等 AI 编程助手），**无需自己敲命令行或配置环境**，直接复制下方对应的提示词发送给你的 AI Agent，AI 就会全自动帮你完成下载、汉化注入、防更新守护配置或个性化词条定制！

### 1️⃣ 一键安装汉化提示词（直接复制发给 AI）

```text
请帮我安装并配置开源的 Antigravity 2.0 简体中文持久化汉化补丁（仓库地址：https://github.com/Leemating/antigravity-zh-cn ）。
请按以下步骤自动执行：
1. 将 https://github.com/Leemating/antigravity-zh-cn.git 克隆到 ~/.gemini/antigravity-zh-cn（如果目录已存在则拉取最新代码）；
2. 根据我当前的操作系统（macOS / Linux 运行 `bash ~/.gemini/antigravity-zh-cn/install.sh`，Windows PowerShell 运行 `powershell -ExecutionPolicy Bypass -File "$HOME\.gemini\antigravity-zh-cn\install.ps1"`）执行一键安装脚本；
3. 检查脚本输出，确认 ASAR 静态预加载补丁、CDP 实时窗口热注入以及系统防更新自愈守护服务均已成功生效，并向我汇报安装结果与中英文切换快捷键。
```

### 2️⃣ 个性化修改/新增翻译词条提示词（按需发给 AI）

```text
我已安装了 Antigravity 汉化补丁（位于 ~/.gemini/antigravity-zh-cn）。
请帮我修改 `~/.gemini/antigravity-zh-cn/src/zh-cn-inject.js` 中的词库：
- 我希望将界面上的「<填写原英文词条>」翻译/修改为「<填写你想要的中文>」；
- 修改完成后，请运行 `~/.gemini/antigravity-zh-cn/bin/run-patch.sh --patch-asar --inject-live` 让修改立即在当前窗口热更新生效。
```

### 3️⃣ 一键卸载并恢复英文原版提示词（按需发给 AI）

```text
请帮我卸载 Antigravity 简体中文汉化补丁并恢复英文原版界面：
- macOS / Linux 请执行：`bash ~/.gemini/antigravity-zh-cn/uninstall.sh`
- Windows 请执行：`powershell -ExecutionPolicy Bypass -File "$HOME\.gemini\antigravity-zh-cn\uninstall.ps1"`
执行完成后告知我恢复结果。
```

---

## ⚡ 方式二：终端一行命令极速安装（零依赖）

本工具会自动探测并复用 Antigravity 客户端自带的内置运行时（`ELECTRON_RUN_AS_NODE=1`），**即使电脑没有安装 Node.js 或 npm 也能直接运行**。

### macOS / Linux

**一行命令在线安装（无需重启客户端，当前已打开的窗口立即变成中文）：**

```bash
curl -fsSL https://raw.githubusercontent.com/Leemating/antigravity-zh-cn/main/install.sh | bash
```

**或者克隆仓库安装：**

```bash
git clone https://github.com/Leemating/antigravity-zh-cn.git ~/.gemini/antigravity-zh-cn
bash ~/.gemini/antigravity-zh-cn/install.sh
```

**一键卸载并恢复英文原版（实时生效）：**

```bash
bash ~/.gemini/antigravity-zh-cn/uninstall.sh
```

---

### Windows (PowerShell)

**一行命令在线安装：**

```powershell
irm https://raw.githubusercontent.com/Leemating/antigravity-zh-cn/main/install.ps1 | iex
```

**一键卸载并恢复英文原版：**

```powershell
powershell -ExecutionPolicy Bypass -File "$HOME\.gemini\antigravity-zh-cn\uninstall.ps1"
```

---

## 📦 方式三：使用 NPX 运行（适合 Node.js 开发者）

如果你电脑上已安装 Node.js (v18+)，也可以直接通过 `npx` 从 GitHub 运行：

```bash
# 一键安装汉化并开启防更新守护
npx github:Leemating/antigravity-zh-cn install

# 一键卸载并恢复原版英文
npx github:Leemating/antigravity-zh-cn uninstall
```

---

## ✨ 核心特性与技术架构

1. **真正不受更新影响（双引擎防更新自愈架构）**
   - **引擎 A（ASAR 预加载与原生菜单层）**：纯 JS 原生解析并重写 `Resources/app.asar`（自动计算 4MB 分块 SHA256 Integrity 校验并在 macOS 上保留权限重签名），将汉化脚本注入 `preload.js`，并同步汉化系统菜单栏、托盘图标菜单与系统原生弹窗。
   - **引擎 B（CDP 热注入与系统级文件监控守护）**：利用 Antigravity 内置开启的 `DevToolsActivePort` 调试端口与系统级 `LaunchAgent` (`WatchPaths`) / `systemd` / `Scheduled Task`，一旦检测到客户端版本更新覆盖了 `app.asar` 或打开了新窗口，**3 秒内自动重新打入补丁并热注入当前窗口**。
2. **零外部依赖，开箱即用**
   - 无需用户电脑预先安装 Node.js、npm 或 Python。安装脚本会自动调用 Antigravity 客户端自带的 Electron Helper 二进制（通过 `ELECTRON_RUN_AS_NODE=1`）执行纯 JS 补丁逻辑。
3. **无损实时「中 / EN」双语切换**
   - 界面右下角自带半透明 `中 / EN` 悬浮切换胶囊按钮，或随时按下快捷键 **`Cmd + Shift + L`**（Windows/Linux 为 **`Ctrl + Shift + L`**），无需刷新页面即可在简体中文与原版英文之间毫秒级无损切换。
4. **代码与编辑器安全隔离**
   - 智能跳过 `<pre>`、`<code>`、`.monaco-editor`（代码编辑器）、`.xterm`（终端）及输入框内容，绝不污染代码、命令输出、文件路径或 Git 分支名。

---

## 📁 目录结构

```text
antigravity-zh-cn/
├── bin/
│   └── cli.mjs             # 跨平台 NPX / CLI 命令行入口
├── src/
│   ├── zh-cn-inject.js     # 核心前端汉化词库与 MutationObserver 引擎 (1300+ 行全覆盖)
│   └── patch-daemon.mjs    # 零依赖纯 JS ASAR 读写引擎 + CDP 实时热注入与更新自愈守护
├── install.sh              # macOS / Linux 一键安装脚本（支持本地与 curl 在线执行）
├── uninstall.sh            # macOS / Linux 一键卸载与恢复原版脚本
├── install.ps1             # Windows PowerShell 一键安装脚本
├── uninstall.ps1           # Windows PowerShell 一键卸载脚本
├── package.json            # 包配置（支持 npx github:Leemating/antigravity-zh-cn）
├── LICENSE                 # MIT 开源许可证
└── README.md               # 使用说明与 AI 提示词文档
```

---

## 🛠️ 自定义词条与参与贡献

如果你想新增或调整特定翻译词条，只需编辑 [`src/zh-cn-inject.js`](./src/zh-cn-inject.js)：

1. **`EXACT_MAP`**：用于静态 UI 文本的 `1:1` 精确映射（大小写敏感 + 自动忽略首尾空格匹配）。
2. **`REGEX_RULES`**：用于包含动态数字、文件名、时间、行号等变量的正则模式替换。

修改完成后，运行 `bash install.sh`（或让 AI 帮你执行热注入命令）即可立即在当前正在运行的客户端窗口中看到效果。欢迎提交 Issue 或 Pull Request 一起完善词库！

---

## 📄 开源协议

本项目基于 [MIT License](./LICENSE) 完全开源。
