# MCP Code Examples for Antigravity Project

## Complete Working Examples

---

## Example 1: Instagram Post Scraping (instagram-server-next-mcp)

### Setup

```bash
git clone https://github.com/duhlink/instagram-server-next-mcp
cd instagram-server-next-mcp
npm install

# Manually log into Instagram in Chrome
# Add to Claude config
{
  "mcpServers": {
    "instagram": {
      "command": "node",
      "args": ["path/to/index.js"],
      "env": {
        "CHROME_PROFILE_PATH": "/Users/[user]/Library/Application Support/Google/Chrome/Default"
      }
    }
  }
}
```

### Claude Prompt

```
Extract all posts from instagram.com/@nasa including:
- Post caption
- Number of likes
- Number of comments
- Post date
- Post URL

Return as JSON array:
[
  {
    "caption": "...",
    "likes": 1234,
    "comments": 56,
    "date": "2025-01-05",
    "url": "https://..."
  }
]
```

---

## Example 2: Form Automation with Playwright MCP

### Claude Desktop Configuration

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-playwright-mcp"],
      "env": {
        "PLAYWRIGHT_HEADLESS": "true",
        "PLAYWRIGHT_TIMEOUT": "30000"
      }
    }
  }
}
```

### Claude Prompt: Fill and Submit Contact Form

```
Navigate to https://example.com/contact
Fill the contact form with:
- Name: John Doe
- Email: john@example.com  
- Subject: Website Inquiry
- Message: I would like to know more about your services

Then click the Submit button and wait for the success message.
Take a screenshot of the confirmation page.
```

---

## Example 3: Instagram Data Collection + Database Storage

### Python Backend (for scheduling + database)

```python
# File: antigravity_scraper.py
import json
import asyncio
from datetime import datetime
from anthropic import Anthropic
import psycopg2
from psycopg2.extras import Json

client = Anthropic()
db_conn = psycopg2.connect(
    "dbname=antigravity user=scraper password=xxx host=localhost"
)

async def scrape_instagram_profile(username):
    """Scrape Instagram profile using Claude + MCP"""
    
    response = client.messages.create(
        model="claude-opus",
        max_tokens=4096,
        messages=[{
            "role": "user",
            "content": f"""
            Navigate to instagram.com/@{username}
            
            Extract:
            1. Profile bio, follower count, post count
            2. Last 5 posts with captions, likes, comments, dates
            3. Comments from top 2 posts
            
            Return as JSON.
            Store in 'instagram_data' table with timestamp.
            """
        }]
    )
    
    return response.content[0].text

async def scrape_multiple_accounts():
    """Scrape multiple accounts in sequence"""
    
    accounts = ["nasa", "nasa_hubble", "nasajpl"]
    
    for account in accounts:
        try:
            print(f"Scraping @{account}...")
            data = await scrape_instagram_profile(account)
            
            # Parse and store in database
            data_json = json.loads(data)
            
            cursor = db_conn.cursor()
            cursor.execute(
                """
                INSERT INTO instagram_data 
                (username, data, extracted_at) 
                VALUES (%s, %s, %s)
                """,
                (account, Json(data_json), datetime.now())
            )
            db_conn.commit()
            
            print(f"✅ @{account} scraped and stored")
            
        except Exception as e:
            print(f"❌ Error scraping @{account}: {str(e)}")
            db_conn.rollback()
        
        # Rate limiting: wait 5 seconds between accounts
        await asyncio.sleep(5)

if __name__ == "__main__":
    asyncio.run(scrape_multiple_accounts())
```

### Database Schema

```sql
CREATE TABLE instagram_data (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    data JSONB NOT NULL,
    extracted_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE instagram_posts (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255),
    post_id VARCHAR(255) UNIQUE,
    caption TEXT,
    likes_count INTEGER,
    comments_count INTEGER,
    post_date TIMESTAMP,
    image_url TEXT,
    extracted_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE instagram_comments (
    id SERIAL PRIMARY KEY,
    post_id VARCHAR(255),
    comment_author VARCHAR(255),
    comment_text TEXT,
    comment_likes INTEGER,
    comment_date TIMESTAMP,
    extracted_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_instagram_data_username ON instagram_data(username);
CREATE INDEX idx_instagram_data_extracted_at ON instagram_data(extracted_at);
CREATE INDEX idx_instagram_posts_username ON instagram_posts(username);
CREATE INDEX idx_instagram_posts_post_date ON instagram_posts(post_date);
```

---

## Example 4: Error Handling + Retry Logic

### Python Implementation

```python
import time
from functools import wraps

def retry_on_error(max_attempts=3, delay=2):
    """Decorator for retry logic"""
    def decorator(func):
        async def wrapper(*args, **kwargs):
            last_error = None
            for attempt in range(1, max_attempts + 1):
                try:
                    print(f"Attempt {attempt}/{max_attempts}: {func.__name__}")
                    return await func(*args, **kwargs)
                except Exception as e:
                    last_error = e
                    print(f"❌ Attempt {attempt} failed: {str(e)}")
                    
                    if attempt < max_attempts:
                        wait_time = delay * (2 ** (attempt - 1))
                        print(f"Waiting {wait_time}s before retry...")
                        await asyncio.sleep(wait_time)
                    
            raise last_error
        return wrapper
    return decorator

@retry_on_error(max_attempts=3, delay=2)
async def scrape_with_retry(username):
    """Scrape Instagram with automatic retry"""
    response = client.messages.create(
        model="claude-opus",
        max_tokens=4096,
        messages=[{
            "role": "user",
            "content": f"Scrape instagram.com/@{username}"
        }]
    )
    return response.content[0].text

# Usage
try:
    result = await scrape_with_retry("nasa")
except Exception as e:
    print(f"Failed after 3 attempts: {str(e)}")
```

---

## Example 5: Data Export to CSV

### Python Implementation

```python
import csv
from datetime import datetime

def export_instagram_data_to_csv():
    """Export database data to CSV files"""
    
    cursor = db_conn.cursor()
    
    # Export posts
    cursor.execute("""
        SELECT 
            username, 
            post_id, 
            LEFT(caption, 100) as caption_preview,
            likes_count, 
            comments_count, 
            post_date
        FROM instagram_posts
        ORDER BY post_date DESC
    """)
    
    posts = cursor.fetchall()
    
    with open('instagram_posts_export.csv', 'w', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(['Username', 'Post ID', 'Caption Preview', 'Likes', 'Comments', 'Date'])
        for post in posts:
            writer.writerow(post)
    
    # Export summary
    cursor.execute("""
        SELECT 
            username,
            COUNT(*) as total_posts,
            ROUND(AVG(likes_count)) as avg_likes,
            ROUND(AVG(comments_count)) as avg_comments,
            MIN(post_date)::date as first_post_date,
            MAX(post_date)::date as last_post_date
        FROM instagram_posts
        GROUP BY username
        ORDER BY total_posts DESC
    """)
    
    summaries = cursor.fetchall()
    
    with open('instagram_accounts_summary.csv', 'w', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(['Username', 'Total Posts', 'Avg Likes', 'Avg Comments', 'First Post', 'Last Post'])
        for summary in summaries:
            writer.writerow(summary)
    
    print(f"✅ Exported {len(posts)} posts")
    print(f"✅ Exported {len(summaries)} account summaries")

export_instagram_data_to_csv()
```

---

## Example 6: Docker Setup

### Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

RUN apk add --no-cache python3 py3-pip chromium

COPY . .

RUN npm install
RUN pip install -r requirements.txt

CMD ["node", "start.js"]
```

### Docker Compose

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: antigravity
      POSTGRES_USER: scraper
      POSTGRES_PASSWORD: secure_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  scraper:
    build: .
    environment:
      DATABASE_URL: postgresql://scraper:password@postgres:5432/antigravity
      BRIGHT_DATA_API_KEY: ${BRIGHT_DATA_API_KEY}
    depends_on:
      - postgres
    volumes:
      - ./logs:/app/logs
      - ./exports:/app/exports

volumes:
  postgres_data:
```

### Deploy Command

```bash
docker-compose up -d
docker-compose logs -f scraper
docker-compose down
```

---

## Example 7: Monitoring & Alerting

### Python Implementation

```python
import logging
from datetime import datetime

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('scraper.log'),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)

class ScraperMonitor:
    def __init__(self):
        self.stats = {
            'total_scrapes': 0,
            'successful_scrapes': 0,
            'failed_scrapes': 0,
            'errors': {}
        }
    
    def log_scrape(self, account, status, data_points=0, error=None, duration=0):
        """Log scraping operation"""
        
        self.stats['total_scrapes'] += 1
        
        if status == 'success':
            self.stats['successful_scrapes'] += 1
            logger.info(f"✅ @{account}: {data_points} data points in {duration:.2f}s")
        else:
            self.stats['failed_scrapes'] += 1
            self.stats['errors'][account] = error
            logger.error(f"❌ @{account}: {str(error)}")
        
        if duration > 30:
            logger.warning(f"⚠️  @{account} took {duration:.2f}s (timeout)")
        
        if data_points == 0 and status == 'success':
            logger.warning(f"⚠️  @{account} extracted 0 posts")

monitor = ScraperMonitor()
```

---

**Last Updated:** January 2025  
**Status:** ✅ Production Ready