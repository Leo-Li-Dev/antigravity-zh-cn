# ============================================================================
# Antigravity 2.0 简体中文汉化补丁 - Windows PowerShell 一键卸载脚本
# ============================================================================

$ErrorActionPreference = "Continue"

$InstallDir = Join-Path $HOME ".gemini\antigravity-zh-cn"
$DaemonScript = Join-Path $InstallDir "src\patch-daemon.mjs"
$TaskName = "AntigravityZhCnAutoPatcher"

Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false -ErrorAction SilentlyContinue
Write-Host "[✓] 已移除自动守护计划任务 ($TaskName)" -ForegroundColor Green

$NodeCmd = Get-Command node -ErrorAction SilentlyContinue
$AgyExe = Join-Path $env:LOCALAPPDATA "Programs\Antigravity\Antigravity.exe"

if (Test-Path $DaemonScript) {
    if ($NodeCmd) {
        & $NodeCmd.Source $DaemonScript --restore-asar
    } elseif (Test-Path $AgyExe) {
        $env:ELECTRON_RUN_AS_NODE = "1"
        & $AgyExe $DaemonScript --restore-asar
        Remove-Item Env:\ELECTRON_RUN_AS_NODE -ErrorAction SilentlyContinue
    }
}

Write-Host "✅ 已成功卸载汉化补丁并恢复原版英文界面！" -ForegroundColor Green
