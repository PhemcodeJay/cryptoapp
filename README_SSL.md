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
