#!/usr/bin/env bash
# ============================================================================
# Antigravity 2.0 简体中文汉化补丁 - 一键卸载与恢复脚本 (macOS / Linux)
# ============================================================================

set -euo pipefail

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

INSTALL_DIR="${HOME}/.gemini/antigravity-zh-cn"
RUNNER_SCRIPT="${INSTALL_DIR}/bin/run-patch.sh"
LAUNCH_AGENT_LABEL="com.google.antigravity.zh-cn"
LAUNCH_AGENT_PLIST="${HOME}/Library/LaunchAgents/${LAUNCH_AGENT_LABEL}.plist"

echo -e "${BLUE}============================================================${NC}"
echo -e "${BLUE}   正在卸载 Antigravity 2.0 简体中文汉化补丁并恢复原版...   ${NC}"
echo -e "${BLUE}============================================================${NC}"

# 1. 停止并移除系统级守护服务
OS_NAME="$(uname -s)"
if [[ "$OS_NAME" == "Darwin" ]]; then
  UID_NUM="$(id -u)"
  launchctl bootout "gui/${UID_NUM}/${LAUNCH_AGENT_LABEL}" >/dev/null 2>&1 || true
  launchctl unload "${LAUNCH_AGENT_PLIST}" >/dev/null 2>&1 || true
  rm -f "${LAUNCH_AGENT_PLIST}"
  echo -e "${GREEN}[✓] 已移除 macOS LaunchAgent 自动守护服务${NC}"
elif [[ "$OS_NAME" == "Linux" ]]; then
  systemctl --user disable --now antigravity-zh-cn.service >/dev/null 2>&1 || true
  rm -f "${HOME}/.config/systemd/user/antigravity-zh-cn.service"
  systemctl --user daemon-reload >/dev/null 2>&1 || true
  echo -e "${GREEN}[✓] 已移除 Linux systemd 自动守护服务${NC}"
fi

# 2. 还原 app.asar 备份并实时将已打开的窗口恢复为英文
if [[ -x "${RUNNER_SCRIPT}" ]]; then
  "${RUNNER_SCRIPT}" --restore-asar || true
  echo -e "${GREEN}[✓] 已恢复原版 app.asar 并实时还原运行中窗口为英文${NC}"
fi

echo ""
echo -e "${GREEN}============================================================${NC}"
echo -e "${GREEN} ✅ 已成功卸载汉化补丁并恢复原版英文界面！${NC}"
echo -e "${GREEN}============================================================${NC}"
