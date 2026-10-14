import re

with open('app.js', 'r', encoding='utf-8') as f:
    app_js = f.read()

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Find all document.getElementById('...') in app.js
lookup_ids = set(re.findall(r"document\.getElementById\(['\"]([^'\"]+)['\"]\)", app_js))
print(f"Total getElementById lookups in app.js: {len(lookup_ids)}")

missing = []
for gid in sorted(lookup_ids):
    if f'id="{gid}"' not in html and f"id='{gid}'" not in html:
        missing.append(gid)

print("IDs in app.js missing in index.html:", missing)
if not missing:
    print("SUCCESS: 100% of all IDs referenced in app.js exist in index.html!")
