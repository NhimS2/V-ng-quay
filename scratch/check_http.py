import urllib.request

for url in ['http://localhost:8080/index.html', 'http://localhost:8080/control.html']:
    with urllib.request.urlopen(url) as r:
        html = r.read().decode('utf-8')
        has_stats_hidden = 'id="mainStatsStrip" style="display: none;"' in html
        has_actions_hidden = 'id="mainHeaderActions" style="display: none;"' in html
        print(f"{url}: stats_hidden={has_stats_hidden}, actions_hidden={has_actions_hidden}")
