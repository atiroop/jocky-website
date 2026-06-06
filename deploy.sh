#!/bin/bash
set -e

VPS_USER="jocky"
VPS_HOST="109.123.233.155"
VPS_PATH="/home/jocky/apps/jocky-website"
SSH_KEY="$HOME/.ssh/id_ed25519"

echo "→ Pushing to GitHub..."
git push origin main

echo "→ Deploying to VPS..."
ssh -i "$SSH_KEY" "$VPS_USER@$VPS_HOST" << 'ENDSSH'
  set -e
  cd /home/jocky/apps/jocky-website
  echo "  • git pull..."
  git pull origin main
  echo "  • npm install..."
  npm install
  echo "  • prisma generate..."
  npx prisma generate
  echo "  • prisma migrate deploy..."
  npx prisma migrate deploy
  echo "  • npm run build..."
  npm run build
  echo "  • restarting pm2..."
  npx pm2 restart jocky-website || npx pm2 start npm --name jocky-website -- start
  echo "  • done"
ENDSSH

echo "✓ Deploy complete → https://jocky.website"
