import re

with open('control.html', 'r', encoding='utf-8') as f:
    text = f.read()

ids = re.findall(r'id=["\']([a-zA-Z0-9_-]+)["\']', text)
print("Total IDs found in control.html:", len(ids))
for item in sorted(ids):
    print(" -", item)
