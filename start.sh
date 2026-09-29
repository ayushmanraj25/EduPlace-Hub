#!/usr/bin/env bash

# EduPlace-Hub Start Script
echo "========================================="
echo "   Starting EduPlace-Hub Platform"
echo "========================================="

# Kill any existing server on port 5001 or 3000
echo "Checking ports..."

cleanup() {
  echo ""
  echo "Shutting down servers..."
  kill $(jobs -p) 2>/dev/null
  exit 0
}

trap cleanup SIGINT SIGTERM EXIT

echo "Starting Backend server (Port 5001)..."
(cd backend && npm start) &

echo "Starting Frontend React app (Port 3000)..."
(cd frontend && npm start) &

wait
