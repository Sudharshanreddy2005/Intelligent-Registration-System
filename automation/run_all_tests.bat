@echo off
cd /d "%~dp0"

echo Activating Virtual Environment...
call venv\Scripts\activate.bat

echo Running Negative Test...
python automation\tests\test_negative.py
echo -----------------------------------------

echo Running Positive Test...
python automation\tests\test_positive.py
echo -----------------------------------------

echo Running Logic Test...
python automation\tests\test_logic.py
echo -----------------------------------------

echo All tests completed.
pause
