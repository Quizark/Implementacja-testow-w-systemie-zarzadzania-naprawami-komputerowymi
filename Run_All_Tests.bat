@echo off
call "test_spirngboot.bat"
cd /d "../"
rem Uruchomienie drugiego skryptu
call "test_angular.bat"
pause