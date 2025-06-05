@echo off
REM Start Frontend
start "Frontend" cmd /k "cd frontend && npm run dev"

REM Start Backend
start "Backend" cmd /k "cd backend && npm start"