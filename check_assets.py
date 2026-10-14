import os
import sys

# Ensure UTF-8 output on Windows
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

assets_dir = os.path.join(os.path.dirname(__file__), 'assets')
dirs = [d for d in sorted(os.listdir(assets_dir)) if os.path.isdir(os.path.join(assets_dir, d))]

print(f"Tổng số thư mục trong assets: {len(dirs)}")
total_skins = 0
for d in dirs:
    p = os.path.join(assets_dir, d)
    files = [f for f in os.listdir(p) if f.lower().endswith('.png')]
    if d == 'Case':
        print(f"[*] {d}: {len(files)} ảnh hòm CS2")
    else:
        total_skins += len(files)
        has_vanilla = any('vanilla' in f.lower() for f in files)
        print(f" - {d}: {len(files)} skins (Vanilla: {'YES' if has_vanilla else 'NO'})")

print(f"\nTổng cộng: 20 loại dao với {total_skins} skins CS2!")
