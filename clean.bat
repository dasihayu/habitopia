@echo off
echo Cleaning Next.js and Turbopack cache...
if exist .next (
  echo Removing .next folder...
  rmdir /s /q .next
)
if exist node_modules\.cache\turbo (
  echo Removing turbo cache...
  rmdir /s /q node_modules\.cache\turbo
)
echo.
echo Clean complete. Please restart 'npm run dev' now.
pause
