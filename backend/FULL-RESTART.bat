@echo off
echo ========================================
echo COMPLETE BACKEND RESTART SCRIPT
echo ========================================
echo.
echo Step 1: Killing all Node.js processes...
taskkill /F /IM node.exe 2>nul
if %errorlevel% equ 0 (
    echo ✅ Node processes killed
) else (
    echo ℹ️  No Node processes found
)
echo.
timeout /t 2 /nobreak >nul

echo Step 2: Navigating to backend directory...
cd /d "D:\Governor Sindh It Initiative\code\clothing_website\backend"
echo ✅ In backend directory
echo.

echo Step 3: Regenerating Prisma Client...
call npx prisma generate
echo ✅ Prisma client regenerated
echo.

echo Step 4: Starting backend server...
echo.
echo ========================================
echo Backend server starting...
echo Press Ctrl+C to stop the server
echo ========================================
echo.
call npm run dev
