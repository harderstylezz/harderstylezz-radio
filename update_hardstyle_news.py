#!/usr/bin/env python3
"""Fetch fresh headlines from three publications through Google News RSS.
Runs in GitHub Actions; falls back to existing news.json on feed outages.
"""
import datetime as dt, email.utils, html, json, pathlib, re, urllib.parse, urllib.request, xml.etree.ElementTree as ET
ROOT=pathlib.Path(__file__).resolve().parents[1]
DEST=ROOT/'news.json'
SOURCES=[('Hardstyle.com','hardstyle.com'),('Hard News','hardnews.nl'),('Hardstyle Mag','hardstylemag.com')]

def fetch(source,domain):
    q=urllib.parse.quote(f'site:{domain} hardstyle when:30d')
    url=f'https://news.google.com/rss/search?q={q}&hl=en&gl=NL&ceid=NL:en'
    req=urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0 (compatible; HarderstyleZZ-News/1.0)'})
    with urllib.request.urlopen(req,timeout=18) as response: xml=response.read(1_500_000)
    root=ET.fromstring(xml)
    items=[]
    for item in root.findall('./channel/item'):
        title=html.unescape(' '.join((item.findtext('title') or '').split()))
        title=re.sub(r'\s+-\s+[^-]+$','',title).strip()
        link=(item.findtext('link') or '').strip()
        if not title or not link.startswith('https://'):continue
        published=item.findtext('pubDate') or ''
        try: date=email.utils.parsedate_to_datetime(published).astimezone(dt.timezone.utc)
        except (TypeError,ValueError):continue
        items.append({'title':title[:180],'date':date.strftime('%d %b %Y').upper(),
                      'url':link,'source':source,'_sort':date.timestamp()})
    return items

def main():
    found=[]
    for source,domain in SOURCES:
        try:
            results=fetch(source,domain)
            print(source,len(results))
            found.extend(results)
        except Exception as exc:print(source,'unavailable:',exc)
    if not found:
        print('No feeds available; preserving existing news.json')
        return
    seen=set();unique=[]
    for item in sorted(found,key=lambda x:x['_sort'],reverse=True):
        key=re.sub(r'\W+','',item['title'].lower())
        if key in seen:continue
        seen.add(key);item.pop('_sort',None);unique.append(item)
    # Preserve previously shown news from sources that temporarily have no new articles.
    try:
        previous=json.loads(DEST.read_text(encoding='utf-8')).get('items',[])
        for item in previous:
            key=re.sub(r'\W+','',item.get('title','').lower())
            if key and key not in seen and item.get('url','').startswith('https://'):
                seen.add(key);unique.append(item)
    except (OSError,ValueError):pass
    DEST.write_text(json.dumps({'items':unique[:24],'mode':'automated multi-source headlines'},ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
if __name__=='__main__':main()
