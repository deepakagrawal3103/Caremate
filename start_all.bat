@echo off
echo Starting CareMate Intelligent Health Platform...

:: 1. Start Frontend
start cmd /k "echo Starting Frontend... && npm run dev"

:: 2. Start Backend
start cmd /k "echo Starting Backend... && cd backend && python main.py"

:: 3. Start Sensor Simulator
start cmd /k "echo Starting Simulator... && cd backend && python simulator.py"

echo All systems initiated. Please check the individual terminal windows for logs.
echo Dashboard will be available at http://localhost:3001 (or 3000)
pause
