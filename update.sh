#!/bin/bash
set -e

echo "Updating Server"

APP_DIR="/home/ubuntu/latest/SunkaStudiosWebServer"
REPO="https://github.com/pmaass53/SunkaStudiosWebServer"

echo "Stopping Server"
pm2 stop webserver || true

echo "Downloading Newest Version"
git fetch origin main
git reset --hard origin/main

echo "Installing Packages"
npm install --omit-dev

echo "Starting Server"
pm2 start server.js --name webserver

echo "Update Complete"
