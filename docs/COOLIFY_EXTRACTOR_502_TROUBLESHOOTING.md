# Coolify + Cloudflare 502 Bad Gateway Troubleshooting

## Problem
The extractor service is running in Docker on Coolify VPS, but Cloudflare returns 502 Bad Gateway errors even though the service logs show it's running.

## Architecture
```
Browser → Cloudflare → Coolify VPS (Docker) → Extractor Service
          ✅           ❌ 502 Error
```

## Common Causes & Solutions

### 1. Port Mapping Issues in Coolify

**Problem**: Docker container port isn't exposed to the host

**Check**:
- In Coolify dashboard, go to your extractor service
- Check "Ports" or "Network" settings
- Verify the container port (usually 8000) is mapped to a host port

**Fix**:
```
Container Port: 8000
Host Port: 8000 (or any available port)
Protocol: HTTP
```

### 2. Coolify Proxy Configuration

**Problem**: Coolify's internal proxy (Traefik) isn't routing correctly

**Check**:
- Domain/subdomain settings in Coolify
- Ensure `promopack-extractor.powellmatt.com` is configured correctly
- Check if SSL/HTTPS is enabled

**Fix**:
- In Coolify, edit your service
- Set domain: `promopack-extractor.powellmatt.com`
- Enable "Generate SSL Certificate" if using HTTPS
- Save and redeploy

### 3. Container Health/Status

**Problem**: Container is running but not healthy or still starting

**Check**:
```bash
# SSH to your VPS
ssh your-server

# Check container status
docker ps | grep extractor

# Check container logs
docker logs <container-id>

# Test from within the VPS
curl http://localhost:8000/health
curl http://127.0.0.1:8000/health
```

**Expected**: Should see 200 OK response

### 4. Firewall Rules

**Problem**: VPS firewall blocking external access

**Check**:
```bash
# Check if port is open
sudo ufw status

# Check if service is listening
sudo netstat -tlnp | grep 8000
# or
sudo ss -tlnp | grep 8000
```

**Fix**:
```bash
# If using UFW
sudo ufw allow 8000/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

### 5. Cloudflare DNS/Proxy Settings

**Problem**: Cloudflare DNS pointing to wrong IP or proxy settings incorrect

**Check in Cloudflare Dashboard**:
- DNS Records for `promopack-extractor.powellmatt.com`
- Should point to your VPS IP address
- Proxy status: Orange cloud (proxied) or Grey cloud (DNS only)

**Recommended Settings**:
```
Type: A
Name: promopack-extractor
Content: <your-vps-ip>
Proxy: Proxied (orange cloud) ✅
TTL: Auto
```

### 6. SSL/TLS Mode in Cloudflare

**Problem**: Cloudflare trying to use HTTPS to origin when origin only supports HTTP

**Check in Cloudflare**:
- Go to SSL/TLS → Overview
- Check SSL/TLS encryption mode

**Recommended Settings**:

If Coolify has SSL certificate:
```
SSL/TLS Mode: Full (strict)
```

If Coolify does NOT have SSL certificate:
```
SSL/TLS Mode: Flexible
```

### 7. Container Binding to Wrong Interface

**Problem**: Container bound to 127.0.0.1 instead of 0.0.0.0

**Check your Dockerfile or startup script**:
```python
# BAD - only localhost
app.run(host='127.0.0.1', port=8000)

# GOOD - all interfaces
app.run(host='0.0.0.0', port=8000)
```

**Fix**: Update your extractor service to bind to `0.0.0.0`

## Step-by-Step Debugging

### Step 1: Verify Container is Running
```bash
ssh your-vps
docker ps | grep extractor
# Should show running container
```

### Step 2: Test from VPS Localhost
```bash
curl http://localhost:8000/health
# Should return 200 OK
```

### Step 3: Test from VPS External IP
```bash
curl http://<vps-ip>:8000/health
# Should return 200 OK
```

### Step 4: Check Coolify Logs
- In Coolify dashboard → Your service → Logs
- Look for startup errors or binding issues

### Step 5: Check Traefik (Coolify's Proxy) Logs
```bash
docker logs coolify-proxy
# or
docker logs traefik
```

### Step 6: Verify Cloudflare Connection
```bash
# From your local machine
curl -I https://promopack-extractor.powellmatt.com/health
# Check response headers for Cloudflare presence
```

## Quick Fixes for Coolify

### Option A: Use Coolify's Domain Management
1. In Coolify, go to your extractor service
2. Settings → Domains
3. Add: `promopack-extractor.powellmatt.com`
4. Save and redeploy
5. Coolify will automatically configure Traefik

### Option B: Bypass Cloudflare Temporarily (for testing)
1. In Cloudflare DNS, change proxy status to "DNS only" (grey cloud)
2. Wait 1-2 minutes for DNS propagation
3. Test: `curl https://promopack-extractor.powellmatt.com/health`
4. If it works, the issue is Cloudflare ↔ Origin configuration
5. If it still fails, the issue is Coolify/Docker configuration

### Option C: Check Coolify Generated Labels
```bash
# View Docker container labels
docker inspect <container-id> | grep -A 20 Labels

# Should see Traefik labels like:
# traefik.enable=true
# traefik.http.routers.extractor.rule=Host(`promopack-extractor.powellmatt.com`)
# traefik.http.services.extractor.loadbalancer.server.port=8000
```

## Coolify-Specific Checklist

- [ ] Service is deployed and showing "Running" status
- [ ] Domain is configured in Coolify service settings
- [ ] Port 8000 is exposed in Docker configuration
- [ ] Container logs show service started successfully
- [ ] Service responds to `curl localhost:8000/health` from VPS
- [ ] Coolify proxy (Traefik) is running: `docker ps | grep traefik`
- [ ] DNS in Cloudflare points to correct VPS IP
- [ ] SSL/TLS mode in Cloudflare matches origin (Flexible if HTTP, Full if HTTPS)

## Expected Configuration

### In Coolify (Service Settings):
```
Name: promopack-extractor
Domains: promopack-extractor.powellmatt.com
Port: 8000
Health Check Path: /health
```

### In Cloudflare (DNS):
```
Type: A
Name: promopack-extractor
Content: <your-vps-ip>
Proxy: Proxied ✅
```

### In Cloudflare (SSL/TLS):
```
Mode: Flexible (if Coolify uses HTTP)
  or
Mode: Full (if Coolify has SSL certificate)
```

## Most Likely Issue

Based on the symptoms (service logging requests but Cloudflare getting 502), the most likely cause is:

**🎯 Coolify/Traefik isn't properly routing to the container**

**Quick Fix**:
1. Go to Coolify dashboard
2. Find your extractor service
3. Go to Settings → Domains
4. Ensure `promopack-extractor.powellmatt.com` is listed
5. Click "Redeploy"
6. Wait 30 seconds
7. Test again

If that doesn't work, try changing Cloudflare SSL/TLS mode from "Full" to "Flexible".

## Need More Help?

Provide these details:
1. Coolify service configuration screenshot
2. Output of: `docker ps | grep extractor`
3. Output of: `curl localhost:8000/health` (from VPS)
4. Cloudflare SSL/TLS mode setting
5. Container logs from Coolify dashboard
