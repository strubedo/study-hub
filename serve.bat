@echo off
rem Study Hub for Windows: double-click to start the server and open the hub.
rem Needs Python 3 (python.org or the Microsoft Store). Close this window to stop.
cd /d "%~dp0"
where py >nul 2>nul
if %errorlevel%==0 (
  py -3 scripts\serve.py --open %*
) else (
  python scripts\serve.py --open %*
)
if errorlevel 1 (
  echo.
  echo Could not start. Install Python 3 from https://www.python.org/downloads/ and try again.
  pause
)
