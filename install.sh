#!/usr/bin/env bash
# ============================================================================
# Antigravity 2.0 简体中文汉化补丁 - 一键安装脚本 (macOS / Linux)
# 特性：
#   1. 零外部依赖：无需安装 Node.js，自动复用 Antigravity 内置运行时
#   2. 即装即用：无需重启客户端，已打开窗口秒级切换中文
#   3. 免疫更新：注册系统级 LaunchAgent / systemd 守护，客户端自动更新后秒级自动重打补丁
# ============================================================================

set -euo pipefail

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]:-$0}")" 2>/dev/null && pwd || pwd)"
INSTALL_DIR="${HOME}/.gemini/antigravity-zh-cn"
REPO_RAW_BASE="https://raw.githubusercontent.com/Leo-Li-Dev/antigravity-zh-cn/main"
LAUNCH_AGENT_LABEL="com.google.antigravity.zh-cn"
LAUNCH_AGENT_PLIST="${HOME}/Library/LaunchAgents/${LAUNCH_AGENT_LABEL}.plist"

echo -e "${BLUE}============================================================${NC}"
echo -e "${BLUE}   Antigravity 2.0 简体中文持久化汉化补丁 (免疫更新版)      ${NC}"
echo -e "${BLUE}============================================================${NC}"

# 1. 探测可用的 JS 运行时（优先使用 Antigravity 内置 Electron Helper 或系统 Node 18+）
detect_runtime() {
  # 优先检查 macOS Antigravity Helper (自带 Node 22 + WebSocket，且不会在 Dock 栏跳图标)
  local mac_helper="/Applications/Antigravity.app/Contents/Frameworks/Antigravity Helper.app/Contents/MacOS/Antigravity Helper"
  if [[ -x "$mac_helper" ]]; then
    echo "ELECTRON_HELPER:$mac_helper"
    return 0
  fi

  local user_mac_helper="${HOME}/Applications/Antigravity.app/Contents/Frameworks/Antigravity Helper.app/Contents/MacOS/Antigravity Helper"
  if [[ -x "$user_mac_helper" ]]; then
    echo "ELECTRON_HELPER:$user_mac_helper"
    return 0
  fi

  # 检查系统 Node.js
  for candidate in "$(command -v node 2>/dev/null || true)" "/opt/homebrew/bin/node" "/usr/local/bin/node" "/usr/bin/node"; do
    if [[ -n "$candidate" && -x "$candidate" ]]; then
      echo "NODE:$candidate"
      return 0
    fi
  done

  # Linux Antigravity 主程序
  for linux_bin in "/opt/Antigravity/antigravity" "/usr/lib/antigravity/antigravity"; do
    if [[ -x "$linux_bin" ]]; then
      echo "ELECTRON_HELPER:$linux_bin"
      return 0
    fi
  done

  return 1
}

RUNTIME_INFO="$(detect_runtime || true)"
if [[ -z "$RUNTIME_INFO" ]]; then
  echo -e "${RED}[错误] 未检测到 Antigravity 客户端或 Node.js 运行时，请确认已安装 Antigravity.app。${NC}"
  exit 1
fi

RUNTIME_TYPE="${RUNTIME_INFO%%:*}"
RUNTIME_BIN="${RUNTIME_INFO#*:}"
echo -e "${GREEN}[✓] 已检测到内置运行时:${NC} ${RUNTIME_BIN} (${RUNTIME_TYPE})"

# 2. 部署文件到 ~/.gemini/antigravity-zh-cn（支持本地目录复制与远程在线拉取）
mkdir -p "${INSTALL_DIR}/src" "${INSTALL_DIR}/bin" "${INSTALL_DIR}/backups" "${INSTALL_DIR}/logs"

if [[ -f "${SCRIPT_DIR}/src/zh-cn-inject.js" && -f "${SCRIPT_DIR}/src/patch-daemon.mjs" ]]; then
  if [[ "${SCRIPT_DIR}" != "${INSTALL_DIR}" ]]; then
    cp -f "${SCRIPT_DIR}/src/zh-cn-inject.js" "${INSTALL_DIR}/src/zh-cn-inject.js"
    cp -f "${SCRIPT_DIR}/src/patch-daemon.mjs" "${INSTALL_DIR}/src/patch-daemon.mjs"
    [[ -f "${SCRIPT_DIR}/uninstall.sh" ]] && cp -f "${SCRIPT_DIR}/uninstall.sh" "${INSTALL_DIR}/uninstall.sh"
    [[ -f "${SCRIPT_DIR}/install.sh" ]] && cp -f "${SCRIPT_DIR}/install.sh" "${INSTALL_DIR}/install.sh"
    [[ -f "${SCRIPT_DIR}/README.md" ]] && cp -f "${SCRIPT_DIR}/README.md" "${INSTALL_DIR}/README.md"
  fi
elif [[ ! -f "${INSTALL_DIR}/src/zh-cn-inject.js" || ! -f "${INSTALL_DIR}/src/patch-daemon.mjs" ]]; then
  echo -e "${BLUE}[*] 正在从 GitHub 下载最新汉化核心组件...${NC}"
  curl -fsSL "${REPO_RAW_BASE}/src/zh-cn-inject.js" -o "${INSTALL_DIR}/src/zh-cn-inject.js"
  curl -fsSL "${REPO_RAW_BASE}/src/patch-daemon.mjs" -o "${INSTALL_DIR}/src/patch-daemon.mjs"
  curl -fsSL "${REPO_RAW_BASE}/uninstall.sh" -o "${INSTALL_DIR}/uninstall.sh" || true
  curl -fsSL "${REPO_RAW_BASE}/install.sh" -o "${INSTALL_DIR}/install.sh" || true
fi

# 3. 生成自适应启动包装器 run-patch.sh
RUNNER_SCRIPT="${INSTALL_DIR}/bin/run-patch.sh"
cat > "${RUNNER_SCRIPT}" << 'EOF'
#!/usr/bin/env bash
set -euo pipefail
INSTALL_DIR="${HOME}/.gemini/antigravity-zh-cn"
DAEMON_MJS="${INSTALL_DIR}/src/patch-daemon.mjs"

MAC_HELPER="/Applications/Antigravity.app/Contents/Frameworks/Antigravity Helper.app/Contents/MacOS/Antigravity Helper"
USER_MAC_HELPER="${HOME}/Applications/Antigravity.app/Contents/Frameworks/Antigravity Helper.app/Contents/MacOS/Antigravity Helper"

if [[ -x "$MAC_HELPER" ]]; then
  ELECTRON_RUN_AS_NODE=1 exec "$MAC_HELPER" "$DAEMON_MJS" "$@"
elif [[ -x "$USER_MAC_HELPER" ]]; then
  ELECTRON_RUN_AS_NODE=1 exec "$USER_MAC_HELPER" "$DAEMON_MJS" "$@"
else
  for node_bin in "$(command -v node 2>/dev/null || true)" "/opt/homebrew/bin/node" "/usr/local/bin/node" "/usr/bin/node"; do
    if [[ -n "$node_bin" && -x "$node_bin" ]]; then
      exec "$node_bin" "$DAEMON_MJS" "$@"
    fi
  done
  for linux_bin in "/opt/Antigravity/antigravity" "/usr/lib/antigravity/antigravity"; do
    if [[ -x "$linux_bin" ]]; then
      ELECTRON_RUN_AS_NODE=1 exec "$linux_bin" "$DAEMON_MJS" "$@"
    fi
  done
fi
EOF
chmod +x "${RUNNER_SCRIPT}"
chmod +x "${INSTALL_DIR}/uninstall.sh" 2>/dev/null || true

# 4. 立即执行 ASAR 静态补丁 + CDP 实时热注入
echo -e "${BLUE}[*] 正在写入 ASAR 预加载与原生菜单补丁，并向当前运行窗口热注入汉化...${NC}"
"${RUNNER_SCRIPT}" --patch-asar --inject-live

# 5. 注册系统级防更新守护服务
OS_NAME="$(uname -s)"
if [[ "$OS_NAME" == "Darwin" ]]; then
  mkdir -p "${HOME}/Library/LaunchAgents"
  cat > "${LAUNCH_AGENT_PLIST}" << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>${LAUNCH_AGENT_LABEL}</string>
    <key>ProgramArguments</key>
    <array>
        <string>/bin/bash</string>
        <string>${RUNNER_SCRIPT}</string>
        <string>--patch-asar</string>
        <string>--inject-live</string>
        <string>--quiet</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>StartInterval</key>
    <integer>30</integer>
    <key>WatchPaths</key>
    <array>
        <string>/Applications/Antigravity.app/Contents/Resources</string>
        <string>${HOME}/Library/Application Support/Antigravity/DevToolsActivePort</string>
    </array>
    <key>StandardOutPath</key>
    <string>${INSTALL_DIR}/logs/daemon.log</string>
    <key>StandardErrorPath</key>
    <string>${INSTALL_DIR}/logs/daemon.err.log</string>
</dict>
</plist>
EOF

  UID_NUM="$(id -u)"
  launchctl bootout "gui/${UID_NUM}/${LAUNCH_AGENT_LABEL}" >/dev/null 2>&1 || true
  launchctl unload "${LAUNCH_AGENT_PLIST}" >/dev/null 2>&1 || true
  if ! launchctl bootstrap "gui/${UID_NUM}" "${LAUNCH_AGENT_PLIST}" >/dev/null 2>&1; then
    launchctl load -w "${LAUNCH_AGENT_PLIST}" >/dev/null 2>&1 || true
  fi
  echo -e "${GREEN}[✓] 已注册 macOS LaunchAgent 防更新自愈服务 (${LAUNCH_AGENT_LABEL})${NC}"

elif [[ "$OS_NAME" == "Linux" ]]; then
  SYSTEMD_DIR="${HOME}/.config/systemd/user"
  mkdir -p "${SYSTEMD_DIR}"
  cat > "${SYSTEMD_DIR}/antigravity-zh-cn.service" << EOF
[Unit]
Description=Antigravity 2.0 Simplified Chinese Auto-Patcher Daemon
After=default.target

[Service]
Type=simple
ExecStart=${RUNNER_SCRIPT} --daemon --watch
Restart=always
RestartSec=10

[Install]
WantedBy=default.target
EOF
  systemctl --user daemon-reload >/dev/null 2>&1 || true
  systemctl --user enable --now antigravity-zh-cn.service >/dev/null 2>&1 || true
  echo -e "${GREEN}[✓] 已注册 Linux systemd 防更新自愈服务 (antigravity-zh-cn.service)${NC}"
fi

echo ""
echo -e "${GREEN}============================================================${NC}"
echo -e "${GREEN} 🎉 Antigravity 2.0 简体中文汉化补丁安装完成！${NC}"
echo -e "${GREEN}============================================================${NC}"
echo -e " • ${YELLOW}实时切换语言${NC}：点击窗口右下角「${GREEN}中 / EN${NC}」悬浮胶囊，或按快捷键 ${GREEN}Cmd/Ctrl + Shift + L${NC}"
echo -e " • ${YELLOW}免疫版本更新${NC}：客户端自动更新后，后台守护会自动重新注入汉化，无需手动重装"
echo -e " • ${YELLOW}补丁安装目录${NC}：${INSTALL_DIR}"
echo -e " • ${YELLOW}一键卸载恢复${NC}：bash ${INSTALL_DIR}/uninstall.sh"
