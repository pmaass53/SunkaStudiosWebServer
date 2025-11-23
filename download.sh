#!/bin/bash
set -e

echo "Updating Server"

APP_DIR="/home/pmaass/latest/SunkaStudiosWebServer"
REPO="https://github.com/pmaass53/SunkaStudiosWebServer"

echo "Stopping Server"
pm2 stop server || true

echo "Downloading Newest Version"
git fetch origin main
git reset --hard origin/main

echo "Installing Packages"
npm install --omit-dev

echo "Starting Server"
cd /home/pmaass/SunkaStudiosWebServer/server
pm2 start server.js

echo "Update Complete"
pm2 monit server
