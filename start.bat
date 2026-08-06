@echo off
echo Starting Backend Server...
start cmd /k "cd backend && npm run dev"

echo Starting Frontend Server...
start cmd /k "cd frontend && npm run dev"

echo Project started! You can close this window.
