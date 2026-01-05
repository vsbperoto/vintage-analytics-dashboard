# MCP Browser Automation: Quick Reference & Setup Guide

## Quick Start (5 Minutes)

### Step 1: Choose Your Tool

```
Need: Browser form automation, clicks, navigation
→ USE: Playwright MCP (Official Microsoft)

Need: Headless screenshots, fast Chrome automation
→ USE: Puppeteer MCP (Official)

Need: Web scraping with CAPTCHA solving
→ USE: Bright Data Web MCP ($99-199/mo)

Need: Instagram/Facebook data extraction
→ USE: instagram-server-next-mcp (Free, local Chrome session)

Need: Simple HTML parsing
→ USE: BeautifulSoup Scraper (Free)
```

---

## Installation Recipes

### Recipe 1: Playwright MCP + Claude Desktop (5 min setup)

```bash
# No installation needed! Just edit config:

# macOS/Linux:
~/.config/Claude/claude_desktop_config.json

# Windows:
%APPDATA%\Claude\claude_desktop_config.json
```

**Add this content:**
```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-playwright-mcp"],
      "env": {
        "PLAYWRIGHT_HEADLESS": "true"
      }
    }
  }
}
```

**Restart Claude Desktop. Done!** ✅

### Recipe 2: Puppeteer MCP + Cursor IDE (5 min setup)

```json
{
  "mcp": {
    "servers": {
      "puppeteer": {
        "command": "npx",
        "args": ["-y", "@modelcontextprotocol/server-puppeteer"]
      }
    }
  }
}
```

### Recipe 3: Instagram-Server + Local Chrome Session (15 min setup)

```bash
# 1. Clone repository
git clone https://github.com/duhlink/instagram-server-next-mcp
cd instagram-server-next-mcp

# 2. Install dependencies
npm install

# 3. Ensure Chrome is logged into Instagram manually
# Open: /Users/[user]/Library/Application Support/Google/Chrome/Default
# Visit instagram.com and log in

# 4. Add to Claude config
{
  "mcpServers": {
    "instagram": {
      "command": "node",
      "args": ["path/to/instagram-server-next-mcp/index.js"],
      "env": {
        "CHROME_PROFILE_PATH": "/Users/[user]/Library/Application Support/Google/Chrome/Default"
      }
    }
  }
}

# 5. Restart Claude Desktop
```

### Recipe 4: Bright Data Web MCP (15 min setup)

```bash
# 1. Create Bright Data account
# Go: https://brightdata.com

# 2. Get API key from dashboard
# Save as environment variable: BRIGHT_DATA_API_KEY

# 3. Add to Claude config
{
  "mcpServers": {
    "bright-data": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "https://mcp.brightdata.com/sse",
        "--header", "Authorization: Bearer YOUR_API_KEY_HERE"
      ]
    }
  }
}

# 4. Restart Claude Desktop
```

---

## Common Commands by Tool

### Playwright MCP

```
User → Claude:
"Navigate to example.com and fill the contact form with name 'John' and email 'john@example.com' then submit"

Behind-the-scenes Claude uses:
1. browser_navigate("https://example.com")
2. browser_fill_form([
     {role: "textbox", name: "name", value: "John"},
     {role: "textbox", name: "email", value: "john@example.com"}
   ])
3. browser_click({role: "button", name: "Submit"})
4. browser_snapshot()  // Verify result
```

### Puppeteer MCP

```
User → Claude:
"Take a screenshot of twitter.com homepage"

Behind-the-scenes:
1. puppeteer_navigate("https://twitter.com")
2. puppeteer_screenshot()
   → Returns PNG image displayed in chat
```

### Bright Data Web MCP

```
User → Claude:
"Extract all product names and prices from amazon.com for 'laptop'"

Behind-the-scenes:
1. scrape_as_html("https://amazon.com/s?k=laptop")
2. scrape_as_markdown()  // Clean HTML
3. Claude extracts: {products: [{name, price}]}
```

### Instagram-Server-Next

```
User → Claude:
"Extract all posts from instagram.com/@nasa - return post captions and like counts"

Behind-the-scenes:
1. navigate_instagram("https://instagram.com/@nasa")
2. extract_posts()
   → Returns: {posts: [{caption, likes}]}
```

---

## MCP Server Tools Reference

### Playwright MCP Tools

| Tool | Input | Output | Example |
|------|-------|--------|---------|
| **browser_snapshot** | (selector?) | Accessibility tree JSON | Get page structure |
| **browser_navigate** | url, waitUntil? | Page loaded | Go to website |
| **browser_click** | role, name | Click confirmed | Click submit button |
| **browser_fill_field** | role, name, value | Field filled | Type into input |
| **browser_fill_form** | fields: array | Form completed | Fill multiple fields |
| **browser_run_code** | code: string | JS result | Execute custom JS |
| **browser_wait_for** | text or time | Condition met | Wait for element |
| **browser_verify_element_visible** | role, name | true/false | Check visibility |

### Puppeteer MCP Tools

| Tool | Input | Output |
|------|-------|--------|
| **puppeteer_navigate** | url | Navigation complete |
| **puppeteer_screenshot** | selector? fullPage? | PNG image (base64) |
| **puppeteer_click** | selector | Element clicked |
| **puppeteer_hover** | selector | Mouse hovered |
| **puppeteer_fill** | selector, value | Text filled |
| **puppeteer_select** | selector, option | Option selected |
| **puppeteer_evaluate** | code | JavaScript result |

### Bright Data Web MCP Tools

| Tool | Input | Output |
|------|-------|--------|
| **scrape_as_html** | url, options | Raw HTML |
| **scrape_as_markdown** | url, options | Cleaned markdown |
| **scrape_as_json** | url, options | Structured JSON |
| **browser_render** | url, options | Full JS-rendered page |
| **browser_click** | url, selector | Action result |

---

## Troubleshooting Quick Fixes

### "Tool not found" error

**Problem:** Claude doesn't see MCP tools

**Fix:**
```bash
# 1. Check config file syntax (JSON must be valid)
cat ~/.config/Claude/claude_desktop_config.json

# 2. Restart Claude Desktop completely
# 3. Check console for errors
# 4. Verify command is in PATH:
which npx
which node
```

### "Chrome not found" error

**Problem:** Playwright can't find Chrome/Chromium

**Fix:**
```bash
# Reinstall browser binaries
npx playwright install chromium

# Or specify explicit path:
{
  "env": {
    "PLAYWRIGHT_CHROMIUM_PATH": "/usr/bin/chromium"
  }
}
```

### "Rate limit exceeded"

**Problem:** Website blocking requests

**Fix:**
```
1. Add delays in Claude prompt: "Wait 5 seconds between requests"
2. Use Bright Data MCP (automatic rate limit handling)
3. Use residential proxy rotation
```

### "Element not found"

**Problem:** DOM element not yet loaded

**Fix:**
```
1. Ask Claude: "Wait for the element to load, then click"
2. Use: browser_wait_for({text: "element text"})
3. Increase timeout in MCP config
```

### Instagram "Not found" after login

**Problem:** Anti-bot detection

**Fix:**
```
Option 1: Use instagram-server-next-mcp (Chrome session auth)
Option 2: Use Bright Data MCP (automatic anti-bot)
Option 3: Add delays and rotateUserAgent()
```

---

## Real-World Prompt Examples

### Example 1: Login + Extract Data

```
User prompt:
"
1. Navigate to https://example.com/login
2. Log in with username 'user@example.com' and password 'pass123'
3. Wait for dashboard to load
4. Extract all user data visible on dashboard
5. Format as JSON table
"

What happens:
→ Playwright navigates, fills login form
→ Waits for dashboard element
→ Extracts all visible text/data
→ Returns JSON to you
```

### Example 2: Scrape with Anti-Bot

```
User prompt (using Bright Data):
"
Scrape the following Instagram profiles and extract:
- Profile name
- Biography
- Follower count
- Post count
- Average likes per post (sample 3 recent posts)

Profiles: @nasa, @nasa_hubble, @nasa_images

Handle any anti-bot blocking automatically.
"

What happens:
→ Bright Data rotates IPs
→ Solves CAPTCHAs if needed
→ Extracts data from each profile
→ Returns structured JSON
```

### Example 3: Automated Form Filling

```
User prompt:
"
1. Navigate to google.com
2. Search for 'machine learning'
3. Click on first Wikipedia result
4. Extract section headings
5. Save to file
"

What happens:
→ Opens Google
→ Types search query
→ Clicks result
→ Extracts headings via JavaScript
→ Returns to you
```

---

## Cost Comparison

| Tool | Cost | Use Case | Setup Time |
|------|------|----------|-----------|
| **Playwright MCP** | Free | Browser automation, forms | 5 min |
| **Puppeteer MCP** | Free | Headless, screenshots | 5 min |
| **Selenium MCP** | Free | Enterprise, cross-browser | 10 min |
| **instagram-server-next** | Free | Instagram (personal use) | 15 min |
| **BeautifulSoup** | Free | HTML scraping (no JS) | 5 min |
| **Bright Data Web MCP** | $99-500/mo | Enterprise scraping, anti-bot | 15 min |
| **Apify** | $49-300/mo | Serverless automation | 10 min |
| **Firecrawl** | Free-$99/mo | LLM-based extraction | 10 min |
| **Scrapling** | Free/Pro | Stealth + fingerprinting | 10 min |

---

## Performance Metrics

| Metric | Playwright | Puppeteer | Selenium | Bright Data |
|--------|-----------|-----------|----------|------------|
| **Tool invocation latency** | 100-500ms | 50-300ms | 200-800ms | 500-2000ms |
| **Page load time** | 2-5s | 1-3s | 3-8s | 3-5s (proxy) |
| **Memory per browser** | 80-150MB | 60-120MB | 100-200MB | N/A (cloud) |
| **Concurrent instances** | 5-10 | 10-20 | 3-5 | Unlimited |
| **Screenshot speed** | ~200ms | ~100ms | ~300ms | N/A |
| **Form fill speed** | ~1s | ~1s | ~2s | ~2s |

---

## Checklists

### Pre-Scraping Checklist

- [ ] Check `robots.txt` and Terms of Service
- [ ] Verify target website allows automation
- [ ] Test with 1 small target first
- [ ] Add delays between requests (2-5 sec)
- [ ] Set up error logging
- [ ] Implement retry logic (3 attempts)
- [ ] Monitor rate limit headers
- [ ] Use appropriate proxy/anti-bot service

### Post-Setup Checklist

- [ ] MCP server appears in Claude tools list
- [ ] Test with simple command ("navigate to google.com")
- [ ] Verify data is extracted correctly
- [ ] Check for errors in Claude console
- [ ] Test error handling (invalid URL, missing element)
- [ ] Verify database connection (if applicable)
- [ ] Set up monitoring/logging

### Antigravity Project Checklist

- [ ] Instagram-server-next setup on local machine
- [ ] Chrome profile logged into Instagram
- [ ] Bright Data account created (budget set)
- [ ] Database schema designed for post/comment data
- [ ] File system MCP configured for CSV export
- [ ] Rate limit monitoring setup
- [ ] Anti-bot detection handling tested
- [ ] Daily schedule configured
- [ ] Data validation tests written
- [ ] Error alerts configured

---

## Integration with Claude / Cursor / VS Code

### Claude Desktop Integration

1. **Open config file:**
   - macOS/Linux: `~/.config/Claude/claude_desktop_config.json`
   - Windows: `%APPDATA%\Claude\claude_desktop_config.json`

2. **Add MCP server:**
   ```json
   {
     "mcpServers": {
       "playwright": {
         "command": "npx",
         "args": ["-y", "@modelcontextprotocol/server-playwright-mcp"]
       }
     }
   }
   ```

3. **Restart Claude Desktop**

4. **In Claude chat, ask:** "What MCP tools do you have available?"

### Cursor IDE Integration

1. **Open Cursor settings → Extensions → Model Context Protocol**

2. **Add server:**
   ```json
   {
     "mcp": {
       "servers": {
         "playwright": {
           "command": "npx",
           "args": ["-y", "@modelcontextprotocol/server-playwright-mcp"]
         }
       }
     }
   }
   ```

3. **Use in codebase.** Cursor will suggest MCP tools in code

### VS Code Integration

1. **Install:** "Model Context Protocol" extension

2. **Configure in `settings.json`:**
   ```json
   {
     "mcpServers": {
       "playwright": {
         "command": "npx",
         "args": ["-y", "@modelcontextprotocol/server-playwright-mcp"]
       }
     }
   }
   ```

3. **Use in chat or code generation**

---

## Resources

**GitHub:**
- microsoft/playwright-mcp
- modelcontextprotocol/servers
- duhlink/instagram-server-next-mcp
- D4Vinci/Scrapling
- firecrawl/firecrawl-mcp-server

**Official Docs:**
- https://modelcontextprotocol.io
- https://playwright.dev
- https://github.com/microsoft/playwright

**Videos:**
- Playwright MCP Live (Microsoft)
- How I Scrape Any Site Using MCP + Claude

**Community:**
- GitHub Discussions
- MCP Discord/Forums

---

**Last Updated:** January 2025  
**Status:** ✅ Ready to use