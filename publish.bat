@echo off
echo ==========================================
echo   STAYGENIE - Update & Publish Site
echo ==========================================

:: 1. Re-encrypt the file
echo.
echo [1/3] Encrypting index_original.html...
call npx staticrypt index_original.html staygenie2024 --template "bootstrap" --title "STAYGENIE Login" > nul
if %errorlevel% neq 0 (
    echo Error: Encryption failed. Make sure you have edited 'index_original.html'.
    pause
    exit /b %errorlevel%
)

:: Move the encrypted file to index.html (Staticrypt outputs to 'encrypted/index.html' by default or we need to handle it)
:: actually staticrypt creates 'encrypted/index_original.html' if input is index_original.html
:: Let's check where it went. content inside is usually in 'encrypted' folder.
if exist "encrypted\index_original.html" (
    move /Y "encrypted\index_original.html" "index.html" > nul
    rmdir "encrypted"
) else (
    echo Error: Could not find encrypted file.
    pause
    exit /b 1
)

:: 2. Git operations
echo.
echo [2/3] Committing changes...
git add .
git commit -m "update: content update"

echo.
echo [3/3] Pushing to GitHub...
git push

echo.
echo ==========================================
echo   SUCCESS! Site updated.
echo   Wait ~1-2 mins for changes to appear.
echo ==========================================
pause
