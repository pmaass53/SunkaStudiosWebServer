#!/bin/bash
set -e

echo "Updating Server"

APP_DIR="/home/ubuntu/latest/SunkaStudiosWebServer"
REPO="https://github.com/pmaass53/SunkaStudiosWebServer"

echo "Stopping Server"
pm2 stop server || true

echo "Downloading Newest Version"
git fetch origin main
git reset --hard origin/main

echo "Installing Packages"
npm install --omit-dev

echo "Starting Server"
cd /home/ubuntu/SunkaStudiosWebServer/server
pm2 start server.js

echo "Update Complete"
