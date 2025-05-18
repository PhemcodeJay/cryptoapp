# Deployment Guide

## With Docker
1. Set environment in `.env.production`
2. Build and run:
```bash
docker-compose up --build -d
```

## With PM2 (alternative)
1. Install PM2 globally: `npm install -g pm2`
2. Start the app: `pm2 start server/server.js --name crypto-app`
3. Save and autostart: `pm2 save && pm2 startup`

## Nginx Reverse Proxy
Use the `nginx.conf` file provided to forward traffic from domain to React + Node.

# Enable HTTPS with Nginx and Certbot

1. Install Certbot:
   ```bash
   sudo apt install certbot python3-certbot-nginx
   ```

2. Generate certificate:
   ```bash
   sudo certbot --nginx -d yourdomain.com
   ```

3. Auto renew (already configured via cron):
   ```bash
   sudo certbot renew --dry-run
   ```
