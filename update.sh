#!/bin/bash
set -e

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
pm2 start /home/ubuntu/SunkaStudiosWebServer/server/serve.js --name webserver
