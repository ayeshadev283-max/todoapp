@echo off
REM Deploy Backend to Hugging Face Spaces (Windows)
REM Usage: deploy-to-hf.bat YOUR_USERNAME YOUR_SPACE_NAME

if "%~2"=="" (
    echo Usage: deploy-to-hf.bat YOUR_USERNAME YOUR_SPACE_NAME
    echo Example: deploy-to-hf.bat johndoe todo-api-backend
    exit /b 1
)

set USERNAME=%1
set SPACE_NAME=%2
set SPACE_URL=https://huggingface.co/spaces/%USERNAME%/%SPACE_NAME%

echo ======================================
echo Deploying to Hugging Face Spaces
echo ======================================
echo Space: %SPACE_URL%
echo.

REM Create temp directory
set TEMP_DIR=%TEMP%\hf-deploy-%RANDOM%
echo Creating temp directory: %TEMP_DIR%
mkdir "%TEMP_DIR%"

REM Clone the Space
echo Cloning Space repository...
git clone https://huggingface.co/spaces/%USERNAME%/%SPACE_NAME% "%TEMP_DIR%"
if errorlevel 1 goto error

REM Copy backend files
echo Copying backend files...
xcopy /E /I /Y backend\app "%TEMP_DIR%\app"
xcopy /E /I /Y backend\alembic "%TEMP_DIR%\alembic"
copy /Y backend\Dockerfile "%TEMP_DIR%\"
copy /Y backend\README.md "%TEMP_DIR%\"
copy /Y backend\requirements.txt "%TEMP_DIR%\"
copy /Y backend\alembic.ini "%TEMP_DIR%\"
copy /Y backend\.dockerignore "%TEMP_DIR%\" 2>nul
copy /Y backend\CLAUDE.md "%TEMP_DIR%\" 2>nul
copy /Y backend\HUGGINGFACE_DEPLOY.md "%TEMP_DIR%\" 2>nul

REM Commit and push
cd /d "%TEMP_DIR%"
echo Staging files...
git add .

echo Creating commit...
git commit -m "Deploy FastAPI backend to Hugging Face Spaces"
if errorlevel 1 goto error

echo Pushing to Hugging Face...
git push
if errorlevel 1 goto error

echo.
echo ======================================
echo Deployment Complete!
echo ======================================
echo.
echo Your API will be available at:
echo %SPACE_URL%
echo.
echo Build will start automatically (takes 2-5 minutes)
echo Check build status at: %SPACE_URL%
echo.
echo Once deployed:
echo   - API Docs: %SPACE_URL%/docs
echo   - Health Check: %SPACE_URL%/health
echo.

REM Cleanup
cd /d "%~dp0"
rmdir /S /Q "%TEMP_DIR%"
echo Cleaned up temporary files
goto end

:error
echo.
echo ======================================
echo ERROR: Deployment failed!
echo ======================================
cd /d "%~dp0"
rmdir /S /Q "%TEMP_DIR%" 2>nul
exit /b 1

:end
