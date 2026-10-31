@echo off
rem Study Hub for Windows: adds a "Study Hub" shortcut to the Start Menu, and optionally the desktop.
rem The shortcut runs serve.bat from this folder. If you move the folder, run this again.
rem Remove the shortcuts with:  install-shortcut.bat /uninstall
setlocal
cd /d "%~dp0"
set "SH_TARGET=%~dp0serve.bat"
set "SH_ICON=%~dp0assets\img\study-hub.ico"
set "SH_DIR=%~dp0"

if /i "%~1"=="/uninstall" goto uninstall

if not exist "%SH_TARGET%" (
  echo serve.bat was not found next to this file. Run this from the unzipped Study Hub folder.
  pause
  exit /b 1
)

call :make Programs
if errorlevel 1 goto failed
echo Added "Study Hub" to the Start Menu.

choice /c YN /m "Also add a desktop shortcut"
if errorlevel 2 goto done
call :make Desktop
if errorlevel 1 goto failed
echo Added "Study Hub" to the desktop.
goto done

:make
rem %1 is a .NET special folder name: Programs (Start Menu) or Desktop.
set "SH_FOLDER=%~1"
powershell -NoProfile -Command "$ws = New-Object -ComObject WScript.Shell; $lnk = $ws.CreateShortcut((Join-Path ([Environment]::GetFolderPath($env:SH_FOLDER)) 'Study Hub.lnk')); $lnk.TargetPath = $env:SH_TARGET; $lnk.WorkingDirectory = $env:SH_DIR; $lnk.IconLocation = $env:SH_ICON + ',0'; $lnk.Description = 'Study Hub: offline certification study sites'; $lnk.WindowStyle = 7; $lnk.Save()"
exit /b %errorlevel%

:uninstall
powershell -NoProfile -Command "foreach ($f in 'Programs', 'Desktop') { $p = Join-Path ([Environment]::GetFolderPath($f)) 'Study Hub.lnk'; if (Test-Path -LiteralPath $p) { Remove-Item -LiteralPath $p; Write-Host ('Removed ' + $p) } }"
goto done

:failed
echo.
echo Could not create the shortcut. You can add it by hand: right-click serve.bat, Create shortcut,
echo then move the shortcut into the folder that opens from Win+R  shell:programs
pause
exit /b 1

:done
echo.
pause
endlocal
