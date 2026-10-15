# ============================================================================
# Antigravity 2.0 简体中文汉化补丁 - Windows PowerShell 一键安装脚本
# 用法：在 PowerShell 中执行 .\install.ps1
# ============================================================================

$ErrorActionPreference = "Stop"

$ScriptDir = if ($MyInvocation.MyCommand.Path) { Split-Path -Parent $MyInvocation.MyCommand.Path } else { $PWD.Path }
$InstallDir = Join-Path $HOME ".gemini\antigravity-zh-cn"
$RepoRawBase = "https://raw.githubusercontent.com/Leemating/antigravity-zh-cn/main"
$TaskName = "AntigravityZhCnAutoPatcher"

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "   Antigravity 2.0 简体中文持久化汉化补丁 (Windows 版)      " -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan

New-Item -ItemType Directory -Force -Path "$InstallDir\src" | Out-Null
New-Item -ItemType Directory -Force -Path "$InstallDir\backups" | Out-Null
New-Item -ItemType Directory -Force -Path "$InstallDir\logs" | Out-Null

if ((Test-Path "$ScriptDir\src\zh-cn-inject.js") -and (Test-Path "$ScriptDir\src\patch-daemon.mjs")) {
    if ($ScriptDir -ne $InstallDir) {
        Copy-Item -Force "$ScriptDir\src\zh-cn-inject.js" "$InstallDir\src\zh-cn-inject.js"
        Copy-Item -Force "$ScriptDir\src\patch-daemon.mjs" "$InstallDir\src\patch-daemon.mjs"
        if (Test-Path "$ScriptDir\uninstall.ps1") { Copy-Item -Force "$ScriptDir\uninstall.ps1" "$InstallDir\uninstall.ps1" }
    }
} else {
    Write-Host "[*] 正在从 GitHub 下载最新汉化核心组件..." -ForegroundColor Cyan
    Invoke-WebRequest -UseBasicParsing -Uri "$RepoRawBase/src/zh-cn-inject.js" -OutFile "$InstallDir\src\zh-cn-inject.js"
    Invoke-WebRequest -UseBasicParsing -Uri "$RepoRawBase/src/patch-daemon.mjs" -OutFile "$InstallDir\src\patch-daemon.mjs"
    Invoke-WebRequest -UseBasicParsing -Uri "$RepoRawBase/uninstall.ps1" -OutFile "$InstallDir\uninstall.ps1"
}

# 探测 Node.js 或 Antigravity.exe 内置运行时
$NodeCmd = Get-Command node -ErrorAction SilentlyContinue
$AgyExe = Join-Path $env:LOCALAPPDATA "Programs\Antigravity\Antigravity.exe"
if (-not (Test-Path $AgyExe)) {
    $AgyExe = Join-Path $env:ProgramFiles "Antigravity\Antigravity.exe"
}

$DaemonScript = Join-Path $InstallDir "src\patch-daemon.mjs"

if ($NodeCmd) {
    Write-Host "[✓] 使用系统 Node.js 运行时: $($NodeCmd.Source)" -ForegroundColor Green
    & $NodeCmd.Source $DaemonScript --patch-asar --inject-live
    $ActionExec = $NodeCmd.Source
    $ActionArgs = "`"$DaemonScript`" --patch-asar --inject-live --quiet"
} elseif (Test-Path $AgyExe) {
    Write-Host "[✓] 使用 Antigravity 内置 Electron 运行时: $AgyExe" -ForegroundColor Green
    $env:ELECTRON_RUN_AS_NODE = "1"
    & $AgyExe $DaemonScript --patch-asar --inject-live
    Remove-Item Env:\ELECTRON_RUN_AS_NODE -ErrorAction SilentlyContinue
    $ActionExec = "powershell.exe"
    $ActionArgs = "-NoProfile -WindowStyle Hidden -Command `"`$env:ELECTRON_RUN_AS_NODE='1'; & '$AgyExe' '$DaemonScript' --patch-asar --inject-live --quiet`""
} else {
    Write-Error "未找到 Antigravity 安装目录或 Node.js 运行时！"
    exit 1
}

# 注册 Windows 计划任务（登录时 + 每 5 分钟巡检一次，免疫自动更新）
try {
    $Action = New-ScheduledTaskAction -Execute $ActionExec -Argument $ActionArgs
    $TriggerLogon = New-ScheduledTaskTrigger -AtLogOn
    $TriggerRepeat = New-ScheduledTaskTrigger -Once -At (Get-Date) -RepetitionInterval (New-TimeSpan -Minutes 5)
    Register-ScheduledTask -TaskName $TaskName -Action $Action -Trigger @($TriggerLogon, $TriggerRepeat) -Force | Out-Null
    Write-Host "[✓] 已注册 Windows 计划任务 ($TaskName) 实现更新后自动汉化" -ForegroundColor Green
} catch {
    Write-Warning "计划任务注册提示: $($_.Exception.Message)"
}

Write-Host ""
Write-Host "🎉 Antigravity 2.0 简体中文汉化补丁安装成功！" -ForegroundColor Green
Write-Host " • 快捷键 Ctrl + Shift + L 或点击左下角「中 / EN」按钮可随时无损切换中英文。"
