"""
scene_builder.py — Generates scene.py dynamically from JSON config for 16:9 and 9:16 aspect ratios.
Supports all 7 visual looks, tactile documentary pinboard animations, 3D cartoon artwork prints,
and multilingual RTL shaping.
"""

import json
from pathlib import Path

PALETTES = {
    "wall": {
        "accent": (212, 175, 55),      # Gold
        "secondary": (28, 163, 166),   # Turquoise / Blue
        "card_bg": (24, 20, 18),
        "text": (245, 235, 214),
        "stamp": (195, 45, 35)
    },
    "slate": {
        "accent": (70, 170, 220),      # Bright cyan
        "secondary": (210, 180, 80),   # Warm amber gold
        "card_bg": (15, 20, 26),
        "text": (230, 235, 240),
        "stamp": (210, 50, 45)
    },
    "charcoal": {
        "accent": (240, 190, 60),      # Warm gold
        "secondary": (190, 60, 60),
        "card_bg": (18, 18, 18),
        "text": (240, 240, 240),
        "stamp": (220, 60, 50)
    },
    "paper": {
        "accent": (160, 50, 40),       # Terracotta
        "secondary": (40, 100, 140),   # Prussian blue
        "card_bg": (250, 248, 242),    # Warm archival parchment
        "text": (34, 32, 30),          # Charcoal ink
        "stamp": (180, 30, 30)         # Red wax/rubber stamp
    },
    "studio": {
        "accent": (198, 92, 46),       # Clean orange
        "secondary": (46, 120, 198),
        "card_bg": (250, 248, 244),
        "text": (34, 32, 30),
        "stamp": (210, 40, 40)
    },
    "blueprint": {
        "accent": (100, 220, 255),     # Electric blue
        "secondary": (255, 215, 0),    # Cadmium gold
        "card_bg": (16, 40, 80),
        "text": (230, 245, 255),
        "stamp": (255, 90, 70)
    },
    "night": {
        "accent": (130, 90, 255),      # Neon purple
        "secondary": (0, 240, 255),    # Cyber cyan
        "card_bg": (12, 16, 28),
        "text": (240, 245, 255),
        "stamp": (255, 60, 80)
    }
}

DEFAULT_PHOTOS = ["multan_city", "multan_fort", "raja_veer", "baba_fazal"]


def generate_scene_code(config: dict, aspect_ratio: str = "16:9") -> str:
    look = config.get("look", "paper")
    title = config.get("title", "Cinematic Film")
    takes = config.get("takes", [])
    colors = PALETTES.get(look, PALETTES["paper"])
    is_vertical = aspect_ratio == "9:16"

    # Flatten lines to assign items
    all_lines = []
    for t in takes:
        for l in t.get("lines", []):
            all_lines.append(l)

    n_lines = len(all_lines)
    gap = 5800 if not is_vertical else 4200
    xs = [i * gap for i in range(max(1, n_lines))]
    mid_x = (xs[0] + xs[-1]) / 2 if xs else 0

    card_w = 2200 if not is_vertical else 2400
    card_h = 1800 if not is_vertical else 1600
    photo_w = 2100 if not is_vertical else 2200

    code = f'''"""Auto-generated scene.py for {title} ({aspect_ratio}, look={look})"""
from engine import Film, BigText, Card, Counter, PenMark, Route, Stamp, MapPin, Print

LOOK = "{look}"
ACCENT = {colors["accent"]}
SECONDARY = {colors["secondary"]}
CARD_BG = {colors["card_bg"]}
TEXT_COLOR = {colors["text"]}
STAMP_COLOR = {colors["stamp"]}

def build_film(doc):
    L, E = doc.L, doc.E
    film = Film(doc.duration, fps=30, look=LOOK)

    # Main Title — solid dark bar keeps text readable over any photo
    film.add(BigText("{title}", {mid_x}, -4000, 650, L(1) - 0.1, font="cond", rgb=ACCENT, shadow=True, grunge=True, rules=True,
              bar=(14, 12, 10), bar_h=0.95))
    film.add(PenMark("underline", {mid_x}, -3650, 5200, 60, t_in=L(1) + 0.4, dur=0.6, width=32, rgb=SECONDARY))
'''

    # Generate Hybrid: Cartoon Print + Evidence Card + Stamp + Route
    for i, line in enumerate(all_lines):
        line_id = line.get("id", i + 1)
        card_title = line.get("typed", line.get("hero", f"Scene {line_id}"))
        spoken = line.get("spoken", line.get("text", ""))
        x_pos = xs[i] if i < len(xs) else i * gap
        accent_col = "ACCENT" if i % 2 == 0 else "SECONDARY"
        rot_deg = -2.0 if line_id % 2 == 1 else 1.8
        photo_key = line.get("photo", DEFAULT_PHOTOS[i % len(DEFAULT_PHOTOS)])

        if not is_vertical:
            # 16:9 Landscape Layout: Cartoon Print on left, Card on right
            code += f'''
    # Line {line_id} - Cartoon Character Print + Evidence Card
    film.add(Print("{photo_key}", {x_pos - 1250}, 200, {photo_w}, rot={-rot_deg}, t_in=L({line_id}), border=0.04, pin=True))
    film.add(Card({x_pos + 1250}, 200, {card_w}, {card_h}, L({line_id}) + 0.15,
                  title="{card_title}",
                  lines=["{spoken[:55].replace('"', '')}", "{spoken[55:110].replace('"', '')}"],
                  rgb=CARD_BG, text_rgb=TEXT_COLOR, accent={accent_col},
                  rot={rot_deg}, title_size=230, body_size=135))
'''
        else:
            # 9:16 Vertical Layout: Cartoon Print on top, Card below
            code += f'''
    # Line {line_id} - Cartoon Character Print (Top) + Evidence Card (Bottom)
    film.add(Print("{photo_key}", {x_pos}, -700, {photo_w}, rot={-rot_deg}, t_in=L({line_id}), border=0.04, pin=True))
    film.add(Card({x_pos}, 1100, {card_w}, {card_h}, L({line_id}) + 0.15,
                  title="{card_title}",
                  lines=["{spoken[:55].replace('"', '')}", "{spoken[55:110].replace('"', '')}"],
                  rgb=CARD_BG, text_rgb=TEXT_COLOR, accent={accent_col},
                  rot={rot_deg}, title_size=210, body_size=125))
'''

        # Stamp if specified
        if line.get("stamp"):
            stamp_rot = -8.0 if line_id % 2 == 1 else 7.5
            stamp_x = x_pos + 2150 if not is_vertical else x_pos + 850
            stamp_y = -500 if not is_vertical else 400
            code += f'    film.add(Stamp("{line["stamp"]}", {stamp_x}, {stamp_y}, size=150, rot={stamp_rot}, t_in=L({line_id}) + 0.9, rgb=STAMP_COLOR))\n'

        # Route connection between stations
        if i > 0:
            prev_x = xs[i - 1]
            bend = -0.22 if i % 2 == 1 else 0.22
            from_pt = f"({prev_x} + 2350, 200)" if not is_vertical else f"({prev_x}, 1800)"
            to_pt = f"({x_pos} - 2350, 200)" if not is_vertical else f"({x_pos}, -1400)"
            code += f'    film.add(Route({from_pt}, {to_pt}, t_in=L({line_id}) - 0.2, dur=0.6, bend={bend}, width=28, rgb={accent_col}))\n'

    # Camera Choreography framing both cartoon illustration and card
    zoom = 0.50 if not is_vertical else 0.42
    code += f'''
    # Camera Choreography — title-only opener, then glide into the board
    film.shot(0.0, {mid_x}, -4000, {zoom * 0.72:.2f})    # tight title frame
    film.shot(0.6, {mid_x}, -4000, {zoom * 0.68:.2f})    # subtle push-in
    film.shot(E(1) - 0.3, {mid_x}, -400, {zoom * 0.60:.2f})  # glide down to cards
    film.shot(E(1) + 0.2, {mid_x}, 150, {zoom * 0.56:.2f})   # settle on board
'''

    for i, line in enumerate(all_lines):
        line_id = line.get("id", i + 1)
        x_pos = xs[i] if i < len(xs) else i * gap
        cam_rot = -0.30 if line_id % 2 == 0 else 0.30
        y_pos = 220 if not is_vertical else 200
        code += f'''    film.shot(L({line_id}) + 0.3, {x_pos}, {y_pos}, {zoom:.2f}, rot={cam_rot})
    film.shot(E({line_id}) - 0.1, {x_pos} + 80, {y_pos + 40}, {zoom * 0.96:.2f})
'''

    # Final Wide Pull-Back: reveals all cartoon prints & cards across the board
    code += f'''
    # Final Wide Pull-Back
    film.shot(doc.duration - 2.5, {mid_x}, 200, {zoom * 0.32:.2f})
    film.shot(film.duration, {mid_x}, 150, {zoom * 0.26:.2f}, radius=20000, strength=0.1)

    return film
'''
    return code
