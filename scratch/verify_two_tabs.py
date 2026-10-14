import re

# Check index.html
with open('index.html', 'r', encoding='utf-8') as f:
    index_html = f.read()

# Check control.html
with open('control.html', 'r', encoding='utf-8') as f:
    control_html = f.read()

# Check app.js
with open('app.js', 'r', encoding='utf-8') as f:
    app_js = f.read()

# Check control.js
with open('control.js', 'r', encoding='utf-8') as f:
    control_js = f.read()

# Check Chay_Vong_Quay.bat
with open('Chay_Vong_Quay.bat', 'r', encoding='utf-8') as f:
    bat_content = f.read()

print("--- VERIFYING INDEX.HTML ---")
if 'id="mainHeaderActions" style="display: none;"' in index_html:
    print("[PASS] Header actions hidden in index.html for viewers.")
else:
    print("[FAIL] Header actions NOT hidden in index.html!")

print("\n--- VERIFYING CONTROL.HTML ---")
if 'control.js' in control_html and 'control.css' in control_html:
    print("[PASS] control.html properly links control.js and control.css.")
else:
    print("[FAIL] Missing links in control.html!")

print("\n--- VERIFYING BATCH FILE ---")
if 'start "" "http://localhost:8080/index.html' in bat_content and 'start "" "http://localhost:8080/control.html' in bat_content:
    print("[PASS] Chay_Vong_Quay.bat opens both Viewer and Streamer Control tabs.")
else:
    print("[FAIL] Batch file does not launch both tabs!")

print("\n--- VERIFYING SYNC CHANNEL ---")
if 'cs2_sync_channel' in app_js and 'cs2_sync_channel' in control_js:
    print("[PASS] Both app.js and control.js use cs2_sync_channel BroadcastChannel.")
else:
    print("[FAIL] Missing BroadcastChannel setup!")

# Check syntax with node if available or basic brace matching
def check_braces(name, text):
    curly = text.count('{') - text.count('}')
    parens = text.count('(') - text.count(')')
    brackets = text.count('[') - text.count(']')
    print(f"Braces in {name}: {{}} diff={curly}, () diff={parens}, [] diff={brackets}")
    if curly == 0 and parens == 0 and brackets == 0:
        print(f"[PASS] {name} balanced brackets.")
    else:
        print(f"[WARN] {name} unbalanced brackets!")

check_braces('app.js', app_js)
check_braces('control.js', control_js)
