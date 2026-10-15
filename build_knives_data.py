import json
import re
import sys

# Ensure UTF-8 output
sys.stdout.reconfigure(encoding='utf-8')

# 20 CS2 Knife types definition
KNIFE_CONFIGS = [
    {
        "id": "butterfly",
        "weapon": "Butterfly Knife",
        "name": "Butterfly Knife",
        "vnName": "Dao Butterfly",
        "tier": "S+",
        "accent": "#00ff88",
        "weight": 3,
        "folder": "Butterfly",
        "vanillaPrice": 27500000
    },
    {
        "id": "karambit",
        "weapon": "Karambit",
        "name": "Karambit",
        "vnName": "Dao Karambit",
        "tier": "S+",
        "accent": "#ff2a85",
        "weight": 4,
        "folder": "Karambit",
        "vanillaPrice": 22500000
    },
    {
        "id": "m9_bayonet",
        "weapon": "M9 Bayonet",
        "name": "M9 Bayonet",
        "vnName": "Dao M9 Bayonet",
        "tier": "S+",
        "accent": "#ffc83b",
        "weight": 5,
        "folder": "M9 Bayonet",
        "vanillaPrice": 21000000
    },
    {
        "id": "skeleton",
        "weapon": "Skeleton Knife",
        "name": "Skeleton Knife",
        "vnName": "Dao Skeleton",
        "tier": "S",
        "accent": "#d946ef",
        "weight": 6,
        "folder": "Skeleton",
        "vanillaPrice": 14500000
    },
    {
        "id": "talon",
        "weapon": "Talon Knife",
        "name": "Talon Knife",
        "vnName": "Dao Talon",
        "tier": "S",
        "accent": "#00f0ff",
        "weight": 7,
        "folder": "Talon",
        "vanillaPrice": 12000000
    },
    {
        "id": "kukri",
        "weapon": "Kukri Knife",
        "name": "Kukri Knife",
        "vnName": "Dao Kukri",
        "tier": "A",
        "accent": "#f59e0b",
        "weight": 10,
        "folder": "Kukri",
        "vanillaPrice": 7200000
    },
    {
        "id": "stiletto",
        "weapon": "Stiletto Knife",
        "name": "Stiletto Knife",
        "vnName": "Dao Stiletto",
        "tier": "A",
        "accent": "#06b6d4",
        "weight": 10,
        "folder": "Stiletto",
        "vanillaPrice": 9800000
    },
    {
        "id": "nomad",
        "weapon": "Nomad Knife",
        "name": "Nomad Knife",
        "vnName": "Dao Nomad",
        "tier": "A",
        "accent": "#ec4899",
        "weight": 10,
        "folder": "Nomad",
        "vanillaPrice": 7500000
    },
    {
        "id": "ursus",
        "weapon": "Ursus Knife",
        "name": "Ursus Knife",
        "vnName": "Dao Ursus",
        "tier": "A",
        "accent": "#3b82f6",
        "weight": 10,
        "folder": "Ursus",
        "vanillaPrice": 5500000
    },
    {
        "id": "bayonet",
        "weapon": "Bayonet",
        "name": "Bayonet",
        "vnName": "Dao Bayonet",
        "tier": "A",
        "accent": "#a855f7",
        "weight": 12,
        "folder": "Bayonet",
        "vanillaPrice": 7800000
    },
    {
        "id": "classic",
        "weapon": "Classic Knife",
        "name": "Classic Knife",
        "vnName": "Dao Classic",
        "tier": "B",
        "accent": "#ef4444",
        "weight": 15,
        "folder": "Classic",
        "vanillaPrice": 4800000
    },
    {
        "id": "flip",
        "weapon": "Flip Knife",
        "name": "Flip Knife",
        "vnName": "Dao Flip",
        "tier": "B",
        "accent": "#eab308",
        "weight": 15,
        "folder": "Flip",
        "vanillaPrice": 5200000
    },
    {
        "id": "paracord",
        "weapon": "Paracord Knife",
        "name": "Paracord Knife",
        "vnName": "Dao Paracord",
        "tier": "B",
        "accent": "#dc2626",
        "weight": 15,
        "folder": "Paracord",
        "vanillaPrice": 3500000
    },
    {
        "id": "bowie",
        "weapon": "Bowie Knife",
        "name": "Bowie Knife",
        "vnName": "Dao Bowie",
        "tier": "B",
        "accent": "#f43f5e",
        "weight": 15,
        "folder": "Bowie",
        "vanillaPrice": 3900000
    },
    {
        "id": "huntsman",
        "weapon": "Huntsman Knife",
        "name": "Huntsman Knife",
        "vnName": "Dao Huntsman",
        "tier": "B",
        "accent": "#e11d48",
        "weight": 15,
        "folder": "Huntsman",
        "vanillaPrice": 4200000
    },
    {
        "id": "falchion",
        "weapon": "Falchion Knife",
        "name": "Falchion Knife",
        "vnName": "Dao Falchion",
        "tier": "B",
        "accent": "#10b981",
        "weight": 15,
        "folder": "Falchion",
        "vanillaPrice": 3600000
    },
    {
        "id": "survival",
        "weapon": "Survival Knife",
        "name": "Survival Knife",
        "vnName": "Dao Survival",
        "tier": "C",
        "accent": "#84cc16",
        "weight": 22,
        "folder": "Survival",
        "vanillaPrice": 3200000
    },
    {
        "id": "gut",
        "weapon": "Gut Knife",
        "name": "Gut Knife",
        "vnName": "Dao Gut",
        "tier": "C",
        "accent": "#64748b",
        "weight": 25,
        "folder": "Gut",
        "vanillaPrice": 2700000
    },
    {
        "id": "navaja",
        "weapon": "Navaja Knife",
        "name": "Navaja Knife",
        "vnName": "Dao Navaja",
        "tier": "C",
        "accent": "#78716c",
        "weight": 25,
        "folder": "Navaja",
        "vanillaPrice": 1950000
    },
    {
        "id": "shadow_daggers",
        "weapon": "Shadow Daggers",
        "name": "Shadow Daggers",
        "vnName": "Dao Shadow Daggers",
        "tier": "C",
        "accent": "#6b7280",
        "weight": 25,
        "folder": "Shadow Daggers",
        "vanillaPrice": 2300000
    }
]

WEAR_NAMES = {
    "FN": "Factory New",
    "MW": "Minimal Wear",
    "FT": "Field-Tested",
    "WW": "Well-Worn",
    "BS": "Battle-Scarred"
}

USD_RATE = 25400

def parse_vnd(val):
    if not val:
        return None
    digits = re.sub(r'[^\d]', '', str(val))
    if digits:
        return int(digits)
    return None

def format_vnd(amount):
    return f"{amount:,}".replace(',', '.') + " ₫"

def format_usd(amount_vnd):
    usd = round(amount_vnd / USD_RATE)
    return f"${usd:,}"

def calc_tier(amount_vnd):
    if amount_vnd >= 30000000:
        return "S+"
    elif amount_vnd >= 15000000:
        return "S"
    elif amount_vnd >= 6000000:
        return "A"
    elif amount_vnd >= 2500000:
        return "B"
    return "C"

# Fallback prices for specific rare skins without parsed prices
FALLBACK_RARE_PRICES = {
    # Fade
    "Butterfly Knife | Fade": {"FN": 92500000, "MW": 85000000},
    "Karambit | Fade": {"FN": 58000000, "MW": 52000000},
    "M9 Bayonet | Fade": {"FN": 48000000, "MW": 44000000},
    "Bayonet | Fade": {"FN": 26500000, "MW": 24000000},
    # Doppler Butterfly
    "Butterfly Knife | Doppler": {"FN": 62000000, "MW": 56000000},
    "Butterfly Knife | Gamma Doppler": {"FN": 72000000, "MW": 65000000},
    # Doppler Karambit
    "Karambit | Gamma Doppler": {"FN": 42000000, "MW": 38000000},
}

def main():
    import os
    json_path = 'data cs2/data.json' if os.path.exists('data cs2/data.json') else 'data cs2/cs2_all_database_cached_prices.json'
    with open(json_path, 'r', encoding='utf-8') as f:
        db = json.load(f)

    print(f"Total database items loaded from '{json_path}': {len(db)}")

    # Index database items by weapon
    items_by_weapon = {}
    for item in db:
        w = item.get('weapon')
        if not w:
            continue
        if w not in items_by_weapon:
            items_by_weapon[w] = []
        items_by_weapon[w].append(item)

    final_knives = []

    for cfg in KNIFE_CONFIGS:
        w_name = cfg['weapon']
        skins_raw = items_by_weapon.get(w_name, [])
        print(f"Processing '{w_name}' (config ID: '{cfg['id']}'): found {len(skins_raw)} raw skins.")

        # Find Vanilla item
        vanilla_raw = None
        for s in skins_raw:
            if s.get('name') == f"★ {w_name}" or s.get('name') == w_name or ('|' not in s.get('name', '')):
                vanilla_raw = s
                break

        vanilla_img = vanilla_raw.get('image') if vanilla_raw else ""
        if not vanilla_img and skins_raw:
            # Fallback to first skin's image if somehow no vanilla
            vanilla_img = skins_raw[0].get('image', '')

        processed_skins = []
        seen_names = {}

        for s in skins_raw:
            raw_name = s.get('name', '')
            is_vanilla = ('|' not in raw_name) or ('Vanilla' in raw_name)

            if is_vanilla:
                skin_finish_name = "Vanilla"
                full_name = f"{cfg['name']} | Vanilla"
                vn_full_name = f"{cfg['vnName']} - Nguyên Bản (Vanilla)"
            else:
                skin_finish_name = raw_name.split('|')[1].strip() if '|' in raw_name else raw_name
                full_name = f"{cfg['name']} | {skin_finish_name}"
                vn_full_name = f"{cfg['vnName']} - {skin_finish_name}"

            # Handle duplicate finish names (like Doppler phases)
            count = seen_names.get(skin_finish_name, 0) + 1
            seen_names[skin_finish_name] = count
            display_name = skin_finish_name
            if count > 1:
                display_name = f"{skin_finish_name} #{count}"
                full_name = f"{cfg['name']} | {display_name}"

            # Clean ID
            safe_slug = re.sub(r'[^a-zA-Z0-9_]', '_', display_name.lower()).strip('_')
            skin_id = f"{cfg['id']}_{safe_slug}"

            # Image
            img_url = s.get('image', '')

            # Parse prices
            prices_dict = s.get('prices', {}) or {}
            prices_by_wear = {}

            if is_vanilla:
                v_price = cfg['vanillaPrice']
                prices_by_wear["Vanilla"] = {
                    "wearName": "Vanilla (Tiêu chuẩn)",
                    "priceVND": format_vnd(v_price),
                    "priceUSD": format_usd(v_price),
                    "priceVNDRaw": v_price,
                    "priceUSDRaw": round(v_price / USD_RATE),
                    "stPriceVND": format_vnd(round(v_price * 1.25 / 500) * 500),
                    "stPriceUSD": format_usd(round(v_price * 1.25)),
                    "stPriceVNDRaw": round(v_price * 1.25 / 500) * 500,
                    "stPriceUSDRaw": round(v_price * 1.25 / USD_RATE)
                }
            else:
                # Normal wears: FN, MW, FT, WW, BS
                wears_order = ["FN", "MW", "FT", "WW", "BS"]
                
                # Check fallback rare prices if empty
                matched_fallback = None
                for fb_key, fb_val in FALLBACK_RARE_PRICES.items():
                    if fb_key in raw_name or f"{cfg['name']} | {skin_finish_name}" == fb_key:
                        matched_fallback = fb_val
                        break

                for w in wears_order:
                    raw_val = prices_dict.get(w)
                    parsed_vnd = parse_vnd(raw_val)

                    if not parsed_vnd and matched_fallback and w in matched_fallback:
                        parsed_vnd = matched_fallback[w]

                    if parsed_vnd and parsed_vnd > 0:
                        st_vnd = round(parsed_vnd * 1.28 / 500) * 500
                        prices_by_wear[w] = {
                            "wearName": WEAR_NAMES.get(w, w),
                            "priceVND": format_vnd(parsed_vnd),
                            "priceUSD": format_usd(parsed_vnd),
                            "priceVNDRaw": parsed_vnd,
                            "priceUSDRaw": round(parsed_vnd / USD_RATE),
                            "stPriceVND": format_vnd(st_vnd),
                            "stPriceUSD": format_usd(st_vnd),
                            "stPriceVNDRaw": st_vnd,
                            "stPriceUSDRaw": round(st_vnd / USD_RATE)
                        }

                # If still empty (e.g., Doppler/Fade variant), synthesize reasonable price
                if not prices_by_wear:
                    # Provide realistic estimate based on knife vanilla price
                    base_vnd = cfg['vanillaPrice'] * 2.2
                    for w in ["FN", "MW", "FT"]:
                        mult = 1.2 if w == "FN" else (1.0 if w == "MW" else 0.85)
                        parsed_vnd = round(base_vnd * mult / 500) * 500
                        st_vnd = round(parsed_vnd * 1.3 / 500) * 500
                        prices_by_wear[w] = {
                            "wearName": WEAR_NAMES.get(w, w),
                            "priceVND": format_vnd(parsed_vnd),
                            "priceUSD": format_usd(parsed_vnd),
                            "priceVNDRaw": parsed_vnd,
                            "priceUSDRaw": round(parsed_vnd / USD_RATE),
                            "stPriceVND": format_vnd(st_vnd),
                            "stPriceUSD": format_usd(st_vnd),
                            "stPriceVNDRaw": st_vnd,
                            "stPriceUSDRaw": round(st_vnd / USD_RATE)
                        }

            # Available wears
            avail_wears = list(prices_by_wear.keys())

            # Representative display price (Prefer FT, then MW, then FN, then first available)
            rep_wear = "FT" if "FT" in prices_by_wear else ("MW" if "MW" in prices_by_wear else ("FN" if "FN" in prices_by_wear else avail_wears[0]))
            rep_price = prices_by_wear[rep_wear]

            # Cases
            cases_list = []
            for c in s.get('crates', []):
                c_name = c.get('name', '')
                c_img = c.get('image', '')
                if c_name:
                    cases_list.append({
                        "id": c_name,
                        "name": c_name,
                        "imageSrc": c_img,
                        "image": c_img
                    })

            skin_tier = calc_tier(rep_price['priceVNDRaw'])

            processed_skins.append({
                "id": skin_id,
                "name": display_name,
                "fullName": full_name,
                "vnFullName": vn_full_name,
                "imageSrc": img_url,
                "image": img_url,
                "tier": skin_tier,
                "priceVND": rep_price['priceVND'],
                "priceUSD": rep_price['priceUSD'],
                "priceVNDRaw": rep_price['priceVNDRaw'],
                "priceUSDRaw": rep_price['priceUSDRaw'],
                "isVanilla": is_vanilla,
                "minFloat": 0.0,
                "maxFloat": 1.0,
                "availableWears": avail_wears,
                "pricesByWear": prices_by_wear,
                "cases": cases_list
            })

        final_knives.append({
            "id": cfg['id'],
            "folder": cfg['folder'],
            "name": cfg['name'],
            "vnName": cfg['vnName'],
            "tier": cfg['tier'],
            "accent": cfg['accent'],
            "weight": cfg['weight'],
            "vanillaImage": vanilla_img,
            "skinsCount": len(processed_skins),
            "skins": processed_skins
        })

    # Write knives_data.js
    js_content = "/**\n * CS2 KNIVES OFFICIAL DATA - Sourced from CS2 Database & Steam Community CDN\n"
    js_content += f" * Generated with {sum(k['skinsCount'] for k in final_knives)} knife skins across 20 weapon classes\n */\n"
    js_content += "window.CS2_KNIVES_DATA = " + json.dumps(final_knives, ensure_ascii=False, indent=2) + ";\n"

    with open('knives_data.js', 'w', encoding='utf-8') as f:
        f.write(js_content)

    print(f"\nSUCCESS! Generated knives_data.js with {len(final_knives)} knives and {sum(k['skinsCount'] for k in final_knives)} skins.")

if __name__ == '__main__':
    main()
