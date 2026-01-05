import re
from collections import defaultdict
from datetime import datetime

# Read the file
with open("Instagram Scrape_VintageInfo.txt", "r", encoding="utf-8") as f:
    content = f.read()

# Split into lines
lines = content.split('\n')

# Parse Instagram posts - looking for date patterns
date_pattern = re.compile(r'^(\d{1,2}) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{4})$')

# Aggregate by date
daily_data = defaultdict(lambda: {"views": 0, "reach": 0, "interactions": 0, "follows": 0, "clicks": 0, "visits": 0})

i = 0
while i < len(lines):
    line = lines[i].strip()
    
    # Check if this is a date line
    match = date_pattern.match(line)
    if match:
        day, month, year = match.groups()
        
        # Convert to ISO date
        month_num = {"Jan":"01","Feb":"02","Mar":"03","Apr":"04","May":"05","Jun":"06",
                     "Jul":"07","Aug":"08","Sep":"09","Oct":"10","Nov":"11","Dec":"12"}[month]
        iso_date = f"{year}-{month_num}-{day.zfill(2)}"
        
        # Next line should be views
        if i+1 < len(lines):
            try:
                views = int(lines[i+1].strip().replace(",", "").replace("‑‑", "0"))
                daily_data[iso_date]["views"] += views
            except:
                pass
        
        # Line i+2 should be reach
        if i+2 < len(lines):
            try:
                reach = int(lines[i+2].strip().replace(",", "").replace("‑‑", "0"))
                daily_data[iso_date]["reach"] += reach
            except:
                pass
        
        # Line i+4 should be interactions
        if i+4 < len(lines):
            try:
                interactions = int(lines[i+4].strip().replace(",", "").replace("‑‑", "0"))
                daily_data[iso_date]["interactions"] += interactions
            except:
                pass
        
        # Line i+12 should be follows
        if i+12 < len(lines):
            try:
                follows = int(lines[i+12].strip().replace(",", "").replace("‑‑", "0"))
                daily_data[iso_date]["follows"] += follows
            except:
                pass
    
    i += 1

# Sort by date and print
for date in sorted(daily_data.keys()):
    d = daily_data[date]
    print(f'{{ date: "{date}", views: {d["views"]}, reach: {d["reach"]}, interactions: {d["interactions"]}, follows: {d["follows"]}, clicks: 0, visits: 0 }},')

# Print total
total_views = sum(d["views"] for d in daily_data.values())
total_reach = sum(d["reach"] for d in daily_data.values())
total_follows = sum(d["follows"] for d in daily_data.values())
print(f"\n// TOTALS: Views={total_views}, Reach={total_reach}, Follows={total_follows}")
