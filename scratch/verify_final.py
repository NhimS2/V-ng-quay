with open('app.js', 'r', encoding='utf-8') as f:
    app_js = f.read()
with open('audio.js', 'r', encoding='utf-8') as f:
    audio_js = f.read()
with open('spinner.js', 'r', encoding='utf-8') as f:
    spinner_js = f.read()
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Verify brackets in JS files
for name, content in [('audio.js', audio_js), ('spinner.js', spinner_js), ('app.js', app_js)]:
    open_c = content.count('{')
    close_c = content.count('}')
    print(f"{name}: {{ = {open_c}, }} = {close_c} (diff: {open_c - close_c})")
    assert open_c == close_c, f"Mismatched braces in {name}!"

# Verify all key elements in index.html
required_ids = [
    'slotKnife', 'slotSkin', 'slotQuantity',
    'startSpinFlowBtn', 'spinSpotlightModal', 'spotlightSpinnerArea',
    'winnerRevealCardArea', 'revealCard', 'revealCardImg', 'revealTitle',
    'revealSubtitle', 'revealCasesWrap', 'revealCasesBadges', 'revealContinueBtn',
    'todayMissionSection', 'tmsMissionText', 'tmsTargetWeaponImg',
    'tmsTargetWeaponName', 'tmsDropCasesList', 'tmsTargetCaseImg',
    'tmsTargetCaseName', 'tmsPressureTag', 'tmsNewHuntBtn',
    'collectionModal', 'openCollectionBtn', 'closeCollectionBtn'
]

for rid in required_ids:
    assert f'id="{rid}"' in html, f"Missing id={rid} in index.html"

print("ALL JS BRACES & ALL HTML REQUIRED IDS 100% VERIFIED!")
