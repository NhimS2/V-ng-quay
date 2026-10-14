import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

for line_no, line in enumerate(html.split('\n'), 1):
    l = line.lower()
    if '<section' in l or 'knivesgrid' in l or 'knives-grid' in l:
        clean = line.strip().encode('ascii', 'replace').decode('ascii')
        print(f"{line_no}: {clean}")
