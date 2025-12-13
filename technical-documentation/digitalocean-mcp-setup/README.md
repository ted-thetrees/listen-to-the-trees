# DigitalOcean MCP Server Setup

This guide documents how to set up and manage MCP (Model Context Protocol) servers on DigitalOcean, enabling Claude to manage cloud infrastructure and run remote MCP services.

## Overview

There are two layers of DigitalOcean integration:

| Method | Purpose |
|--------|---------|
| **DigitalOcean MCP** | Manages infrastructure — create/destroy Droplets, deploy apps, view logs, scale resources |
| **Remote MCP Servers** | Services running on a Droplet that Claude can connect to via SSE |

---

## Part 1: DigitalOcean MCP (Infrastructure Management)

This MCP server lets Claude manage your DigitalOcean account directly.

### Prerequisites

- DigitalOcean account
- Claude Desktop installed
- Node.js/npm available locally

### Step 1: Generate API Token

1. Log into [DigitalOcean Control Panel](https://cloud.digitalocean.com)
2. Navigate to **API** in the left sidebar (near the bottom, under "Account")
3. Click **Generate New Token**
4. Name it something like "Claude MCP"
5. Select **Full Access** (third option in Scopes section)
6. Set expiration to **No expire** (or your preference)
7. Click **Generate Token**
8. **Copy the token immediately** — you won't see it again

### Step 2: Configure Claude Desktop

Add the DigitalOcean MCP server to your Claude Desktop configuration.

**Config file location (macOS):**
```
~/Library/Application Support/Claude/claude_desktop_config.json
```

**Add this to the `mcpServers` object:**
```json
{
  "mcpServers": {
    "digitalocean": {
      "command": "npx",
      "args": ["-y", "@digitalocean/mcp"],
      "env": {
        "DIGITALOCEAN_API_TOKEN": "your-token-here"
      }
    }
  }
}
```

### Step 3: Restart Claude Desktop

Completely quit and reopen Claude Desktop for the new server to load.

### What You Can Do

Once connected, Claude can:
- Create and destroy Droplets
- List running servers
- Deploy apps from GitHub
- Check logs and metrics
- Restart services
- Scale resources up or down

---

## Part 2: Remote MCP Servers on a Droplet

Run MCP servers in the cloud so they're always available without keeping your Mac running.

### Droplet Setup

**Recommended specs for running multiple MCP servers:**
- Ubuntu 24.04 LTS
- 2GB RAM minimum (4GB if running browser-based servers)
- Node.js 20.x
- Python 3.12+
- Docker

**Current setup:**
- IP: `142.93.25.24`
- Domain: `infrastructure.listentothetrees.com`
- Reverse proxy: Caddy (automatic SSL)

### Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    DigitalOcean Droplet                 │
│                                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │ Playwright  │  │  Filesystem │  │   Memory    │     │
│  │    MCP      │  │     MCP     │  │    MCP      │     │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘     │
│         │                │                │             │
│         └────────────────┼────────────────┘             │
│                          │                              │
│                    ┌─────┴─────┐                        │
│                    │   Caddy   │  ← Reverse proxy       │
│                    │  (HTTPS)  │    + auto SSL          │
│                    └─────┬─────┘                        │
└──────────────────────────┼──────────────────────────────┘
                           │
                      Port 443
                           │
                    ┌──────┴──────┐
                    │   Claude    │
                    │  Desktop    │
                    └─────────────┘
```

### Transport Requirements

MCP servers need **SSE (Server-Sent Events)** transport for remote access:

- **Native SSE support**: Can run directly (e.g., `@playwright/mcp`)
- **stdio-based servers**: Need a wrapper like `supergateway` to convert to SSE

### Installing an MCP Server (Example: Playwright)

1. **SSH into the droplet:**
   ```bash
   ssh root@infrastructure.listentothetrees.com
   ```

2. **Install the MCP server globally:**
   ```bash
   npm install -g @playwright/mcp
   ```

3. **Run with SSE transport:**
   ```bash
   npx @playwright/mcp --port 3000
   ```

4. **For persistent running, use Docker or systemd**

### Caddy Configuration

Caddy handles reverse proxy and automatic SSL certificates.

**Caddyfile location:** `/etc/caddy/Caddyfile`

**Example configuration:**
```
infrastructure.listentothetrees.com {
    reverse_proxy /sse localhost:3000
    reverse_proxy /playwright/* localhost:3001
}
```

**Reload after changes:**
```bash
sudo systemctl reload caddy
```

### Adding a New Subdomain

1. **Add DNS A record** pointing to `142.93.25.24`
2. **Add entry to Caddyfile**
3. **Reload Caddy** — SSL certificate is automatic

### Connecting Claude Desktop to Remote MCP

Add the remote server to your Claude Desktop config:

```json
{
  "mcpServers": {
    "playwright-remote": {
      "url": "https://infrastructure.listentothetrees.com/sse"
    }
  }
}
```

---

## Monitoring & Maintenance

### Check Resource Usage

```bash
# Memory
free -h

# CPU and processes
htop

# Disk space
df -h
```

### View Running Containers

```bash
docker ps
```

### Check Caddy Status

```bash
sudo systemctl status caddy
```

### View Logs

```bash
# Caddy logs
sudo journalctl -u caddy -f

# Docker container logs
docker logs <container-name> -f
```

---

## Access Methods

### SSH (from local machine)
```bash
ssh root@infrastructure.listentothetrees.com
# or
ssh root@142.93.25.24
```

### DigitalOcean Web Console
Navigate to: Droplets → [your droplet] → Access → Launch Droplet Console

---

## Security Notes

1. **Rotate API tokens** if they're ever exposed (like in chat history)
2. **Use environment variables** for sensitive values, not hardcoded in configs
3. **Keep the droplet updated:**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

---

## Troubleshooting

### MCP server not connecting
- Check if the service is running: `docker ps` or `systemctl status <service>`
- Verify Caddy is proxying correctly: `curl -I https://infrastructure.listentothetrees.com/sse`
- Check firewall: `sudo ufw status`

### Out of memory
- Check usage: `free -h`
- Options: upgrade droplet, add swap, or remove unused services

### SSL certificate issues
- Caddy handles this automatically, but if issues arise:
  ```bash
  sudo systemctl restart caddy
  ```
