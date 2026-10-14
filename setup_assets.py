import os
import shutil

knife_dir = os.path.join(os.path.dirname(__file__), 'assets', 'knives')
files = os.listdir(knife_dir)

# Mapping from partial name or exact file to standardized filename + display name in VN & EN
# Let's inspect each file safely
mapping = [
    # (search substring, standard_file_name, vn_name, en_name, rarity_tier, default_price_vnd, float_val)
    ('Bayonet.webp', 'bayonet.webp', 'Dao lưỡi lê (Bayonet)', 'Bayonet | Doppler Phase 2', 'covert_gold', 18500000),
    ('Classic', 'classic.webp', 'Dao cổ điển (Classic Knife)', 'Classic Knife | Crimson Web', 'covert_gold', 11200000),
    ('Bowie', 'bowie.webp', 'Dao Bowie', 'Bowie Knife | Fade 99%', 'covert_gold', 8900000),
    ('bướm', 'butterfly.webp', 'Dao bướm (Butterfly Knife)', 'Butterfly Knife | Gamma Doppler Emerald', 'special_legendary', 75000000),
    ('bu?m', 'butterfly.webp', 'Dao bướm (Butterfly Knife)', 'Butterfly Knife | Gamma Doppler Emerald', 'special_legendary', 75000000),
    ('bấm', 'flip.webp', 'Dao bấm (Flip Knife)', 'Flip Knife | Lore MW', 'covert_gold', 9500000),
    ('b?m', 'flip.webp', 'Dao bấm (Flip Knife)', 'Flip Knife | Lore MW', 'covert_gold', 9500000),
    ('Falchion', 'falchion.webp', 'Dao Falchion', 'Falchion Knife | Marble Fade', 'covert_gold', 7200000),
    ('chữ T', 'shadow_daggers.webp', 'Dao găm chữ T (Shadow Daggers)', 'Shadow Daggers | Tiger Tooth', 'covert_gold', 4500000),
    ('ch? T', 'shadow_daggers.webp', 'Dao găm chữ T (Shadow Daggers)', 'Shadow Daggers | Tiger Tooth', 'covert_gold', 4500000),
    ('Huntsman', 'huntsman.webp', 'Dao Huntsman', 'Huntsman Knife | Slaughter', 'covert_gold', 8200000),
    ('Kukri', 'kukri.webp', 'Dao Kukri', 'Kukri Knife | Fade', 'special_legendary', 24000000),
    ('móc', 'gut.webp', 'Dao móc (Gut Knife)', 'Gut Knife | Autotronic', 'covert_gold', 3800000),
    ('mc', 'gut.webp', 'Dao móc (Gut Knife)', 'Gut Knife | Autotronic', 'covert_gold', 3800000),
    ('Navaja', 'navaja.webp', 'Dao Navaja', 'Navaja Knife | Case Hardened Blue Gem', 'covert_gold', 3200000),
    ('Nomad', 'nomad.webp', 'Dao Nomad', 'Nomad Knife | Fade 100%', 'special_legendary', 28000000),
    ('Paracord', 'paracord.webp', 'Dao Paracord', 'Paracord Knife | Crimson Web', 'covert_gold', 9800000),
    ('sinh tồn', 'survival.webp', 'Dao sinh tồn (Survival Knife)', 'Survival Knife | Case Hardened', 'covert_gold', 6500000),
    ('sinh t?n', 'survival.webp', 'Dao sinh tồn (Survival Knife)', 'Survival Knife | Case Hardened', 'covert_gold', 6500000),
    ('Skeleton', 'skeleton.webp', 'Dao Skeleton', 'Skeleton Knife | Fade 99.8%', 'special_legendary', 42000000),
    ('Stiletto', 'stiletto.webp', 'Dao Stiletto', 'Stiletto Knife | Doppler Phase 4', 'special_legendary', 22500000),
    ('Talon', 'talon.webp', 'Dao Talon', 'Talon Knife | Marble Fade Fire & Ice', 'special_legendary', 31000000),
    ('Ursus', 'ursus.webp', 'Dao Ursus', 'Ursus Knife | Doppler Sapphire', 'special_legendary', 29000000),
    ('Karambit.webp', 'karambit.webp', 'Dao Karambit', '★ Karambit | Doppler Phase 2 Pink Galaxy', 'special_legendary', 58000000),
    ('M9 Bayonet.webp', 'm9_bayonet.webp', 'Dao M9 Bayonet', '★ M9 Bayonet | Lore Factory New', 'special_legendary', 62000000),
]

copied = {}
for filename in files:
    src = os.path.join(knife_dir, filename)
    matched = False
    for sub, std_name, vn_name, en_name, rarity, price in mapping:
        if sub.lower() in filename.lower():
            dst = os.path.join(knife_dir, std_name)
            if not os.path.exists(dst):
                shutil.copyfile(src, dst)
            copied[std_name] = {
                'id': std_name.replace('.webp', ''),
                'file': f'assets/knives/{std_name}',
                'vnName': vn_name,
                'enName': en_name,
                'rarity': rarity,
                'price': price
            }
            matched = True
            break

print(f"Processed and standardized {len(copied)} knives.")
for k, v in copied.items():
    print(f" - {v['id']}: {v['enName']} ({v['price']:,} VNĐ)")
