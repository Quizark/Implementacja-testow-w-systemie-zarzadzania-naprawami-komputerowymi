@echo off
rem Uruchamianie API w osobnym oknie CMD
start "Uruchamianie API" cmd /c "call Run_Api.bat"

rem Uruchamianie Aplikacji Internetowej w osobnym oknie CMD
start "Uruchamianie Aplikacji Internetowej" cmd /c "call Run_App.bat"

pause