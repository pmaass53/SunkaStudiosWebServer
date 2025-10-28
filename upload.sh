echo "Uploading latest Version"

git add .
git commit -m "Upload from Server"
git push origin main

echo "Upload Complete"
pm2 monit server
