@echo off

if exist %SYSTEMROOT%\SYSTEM32\WDI\LOGFILES goto gotadmin
echo:
echo Admin Access Denied [ Required for copying files ]. Run as administrator.
echo:
pause
exit /b 1

:gotadmin
for /d %%G in ("%ProgramFiles%\Adobe\Adobe Photoshop*") do (
    set PhotoshopDir=%%G
    goto :found
)

if not defined PhotoshopDir (
    echo Photoshop installation not found.  
    echo: 
    pause
    exit /b 1
)

:found
set ScriptsDir=%PhotoshopDir%\Presets\Scripts

if not exist "%ScriptsDir%" (
    mkdir "%ScriptsDir%"
)

echo Install SeamLess v0.2
pause

>NUL copy "%~dp0SeamLess.jsx" "%ScriptsDir%"
>NUL copy "%~dp0slice.exe" "%ScriptsDir%"

echo:
echo Script "SeamLess v0.2" has been installed.
echo NOTE: Restart Photoshop (if script doesn't show up). 
echo:
pause
