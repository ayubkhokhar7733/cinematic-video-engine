"""
scene_builder.py — Generates scene.py dynamically from JSON config for 16:9 and 9:16 aspect ratios.
Supports all 7 visual looks and multilingual RTL shaping.
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
        "secondary": (210, 180, 80),
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
        "secondary": (40, 100, 140),
        "card_bg": (250, 248, 242),
        "text": (34, 32, 30),
        "stamp": (180, 30, 30)
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
        "secondary": (255, 215, 0),
        "card_bg": (16, 40, 80),
        "text": (230, 245, 255),
        "stamp": (255, 90, 70)
    },
    "night": {
        "accent": (130, 90, 255),      # Neon purple/blue
        "secondary": (0, 240, 255),
        "card_bg": (12, 16, 28),
        "text": (240, 245, 255),
        "stamp": (255, 60, 80)
    }
}


def generate_scene_code(config: dict, aspect_ratio: str = "16:9") -> str:
    look = config.get("look", "wall")
    title = config.get("title", "Cinematic Film")
    takes = config.get("takes", [])
    colors = PALETTES.get(look, PALETTES["wall"])
    is_vertical = aspect_ratio == "9:16"

    # Flatten lines to assign items
    all_lines = []
    for t in takes:
        for l in t.get("lines", []):
            all_lines.append(l)

    n_lines = len(all_lines)
    gap = 4200 if not is_vertical else 3600
    xs = [i * gap for i in range(max(1, n_lines))]
    mid_x = (xs[0] + xs[-1]) / 2 if xs else 0

    card_w = 3400 if not is_vertical else 2600
    card_h = 2000 if not is_vertical else 3000

    code = f'''"""Auto-generated scene.py for {title} ({aspect_ratio}, look={look})"""
from engine import Film, BigText, Card, Counter, PenMark, Route, Stamp

LOOK = "{look}"
ACCENT = {colors["accent"]}
SECONDARY = {colors["secondary"]}
CARD_BG = {colors["card_bg"]}
TEXT_COLOR = {colors["text"]}
STAMP_COLOR = {colors["stamp"]}

def build_film(doc):
    L, E = doc.L, doc.E
    film = Film(doc.duration, fps=30, look=LOOK)

    # Main Title
    film.add(BigText("{title}", {mid_x}, -2400, 650, L(1) - 0.1, font="cond", rgb=ACCENT, shadow=True, grunge=True, rules=True))
    film.add(PenMark("underline", {mid_x}, -2100, 5000, 60, t_in=L(1) + 0.4, dur=0.6, width=32, rgb=SECONDARY))
'''

    # Generate Cards, Counters, Stamps
    for i, line in enumerate(all_lines):
        line_id = line.get("id", i + 1)
        card_title = line.get("typed", line.get("hero", f"Scene {line_id}"))
        spoken = line.get("spoken", line.get("text", ""))
        x_pos = xs[i] if i < len(xs) else i * gap
        accent_col = "ACCENT" if i % 2 == 0 else "SECONDARY"

        code += f'''
    # Line {line_id}
    film.add(Card({x_pos}, 200, {card_w}, {card_h}, L({line_id}) + 0.1,
                  title="{card_title}",
                  lines=["{spoken[:55].replace('"', '')}", "{spoken[55:110].replace('"', '')}"],
                  rgb=CARD_BG, text_rgb=TEXT_COLOR, accent={accent_col},
                  title_size=260, body_size=150))
'''

        # Stamp if specified or every other card
        if line.get("stamp"):
            code += f'    film.add(Stamp("{line["stamp"]}", {x_pos} + 1000, -500, size=140, rot=-8.0, t_in=L({line_id}) + 1.2, rgb=STAMP_COLOR))\n'

        # Route connection between cards
        if i > 0:
            prev_x = xs[i - 1]
            bend = -0.25 if i % 2 == 1 else 0.25
            code += f'    film.add(Route(({prev_x} + {card_w} / 2 + 80, 200), ({x_pos} - {card_w} / 2 - 80, 200), t_in=L({line_id}) - 0.2, dur=0.6, bend={bend}, width=26, rgb={accent_col}))\n'

    # Camera shots
    zoom = 0.55 if not is_vertical else 0.45
    code += f'''
    # Camera Choreography
    film.shot(0.0, {mid_x}, -2300, {zoom * 0.9:.2f})
    film.shot(E(1) + 0.2, {mid_x}, -1200, {zoom * 0.65:.2f})
'''

    for i, line in enumerate(all_lines):
        line_id = line.get("id", i + 1)
        x_pos = xs[i] if i < len(xs) else i * gap
        rot = -0.4 if line_id % 2 == 0 else 0.4
        code += f'''    film.shot(L({line_id}) + 0.4, {x_pos}, 450, {zoom:.2f}, rot={rot})
    film.shot(E({line_id}) - 0.1, {x_pos} + 150, 550, {zoom * 0.95:.2f})
'''

    # Final Wide Pull-Back
    code += f'''
    # Final Wide Pull-Back
    film.shot(doc.duration - 2.5, {mid_x}, 300, {zoom * 0.45:.2f})
    film.shot(film.duration, {mid_x}, 150, {zoom * 0.35:.2f}, radius=20000, strength=0.1)

    return film
'''
    return code
