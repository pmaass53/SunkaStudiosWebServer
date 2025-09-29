#!/bin/bash
set -e

APP_DIR="/home/ubuntu/latest/SunkaStudiosWebServer"
REPO="https://github.com/pmaass53/SunkaStudiosWebServer"

git fetch origin main
git reset --hard origin/main

# fix deps
npm install --omit-dev
