@echo off
REM Start Backend
start "Backend" cmd /k "cd backend && npm start"

timeout 5

REM Start Frontend
start "Frontend" cmd /k "cd frontend && npm run dev"

