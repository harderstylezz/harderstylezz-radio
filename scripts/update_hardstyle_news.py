
import json
import re
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime
from html import unescape
from pathlib import Path

SOURCES = {
    "Hardstyle.com": "https://hardstyle.com/feed",
    "Hard News": "https://hardnews.nl/feed/",
    "Hardstyle Mag": "https://hardstylemag.com/feed/",
}

OUTPUT = Path("news.json")
articles = []

def clean(value):
    return re.sub(r"<[^>]+>", "", unescape(value or "")).strip()

def fetch(source, url):
    request = urllib.request.Request(
        url,
        headers={"User-Agent": "Mozilla/5.0 HarderstyleZZ-News/1.0"}
    )

    with urllib.request.urlopen(request, timeout=20) as response:
        root = ET.fromstring(response.read())

    for item in root.findall(".//item"):
        title = clean(item.findtext("title"))
        link = clean(item.findtext("link"))
        date_text = item.findtext("pubDate", "")

        if not title or not link:
            continue

        try:
            published = parsedate_to_datetime(date_text)
            published = published.astimezone(timezone.utc)
        except Exception:
            published = datetime(1970, 1, 1, tzinfo=timezone.utc)

        articles.append({
            "title": title,
            "url": link,
            "source": source,
            "date": published.strftime("%Y-%m-%d"),
            "_sort": published.timestamp()
        })

for source, url in SOURCES.items():
    try:
        fetch(source, url)
        print(f"Loaded: {source}")
    except Exception as error:
        print(f"Feed unavailable: {source}: {error}")

unique = {}
for article in articles:
    unique[article["url"]] = article

latest = sorted(
    unique.values(),
    key=lambda item: item["_sort"],
    reverse=True
)[:9]

for article in latest:
    article.pop("_sort", None)

if latest:
    OUTPUT.write_text(
        json.dumps(latest, ensure_ascii=False, indent=2),
        encoding="utf-8"
    )
    print(f"Saved {len(latest)} articles")
else:
    print("No new articles; keeping existing news.json")
