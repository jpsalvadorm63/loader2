echo off
setlocal

call npm run build
if errorlevel 1 goto :error

call npm link
if errorlevel 1 goto :error

call loader2 validParams
if errorlevel 1 goto :error

echo.
echo OK: build + link + validParams
goto :end

:error
echo.
echo ERROR: fallo el comando anterior (errorlevel=%errorlevel%).
exit /b %errorlevel%

:end
endlocal