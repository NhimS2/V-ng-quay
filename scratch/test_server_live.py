import urllib.request

resp = urllib.request.urlopen('http://localhost:8080/index.html')
data = resp.read().decode('utf-8')
print('HTTP 200 OK:', resp.status == 200)
print('tms-counter-zone is gone:', 'tms-counter-zone' not in data)
print('tms-actions is gone:', 'tms-actions' not in data)
print('tmsNewHuntBtn exists in header:', 'id="tmsNewHuntBtn"' in data)
print('Has v13:', 'v=20261014_v13' in data)
