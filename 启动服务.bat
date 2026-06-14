@echo off
chcp 65001 >nul
title 每日打卡 - 服务

echo ============================================
echo      每日打卡 - 服务启动器
echo ============================================
echo.
echo [1/2] 启动本地服务器...
echo.

:: Start the server + tunnel
node "%~dp0start.js"

echo.
pause
