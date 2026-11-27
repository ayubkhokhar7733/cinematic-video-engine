#!/usr/bin/env python3
"""
gen_images.py — Generates topic-relevant cinematic illustrations for each beat in script.json.
Uses Pollinations.ai (free, zero-key) or Gemini Image Generation if GEMINI_API_KEY is available.
"""

import os
import json
import urllib.request
import urllib.parse
import pathlib


def generate_image_pollinations(prompt: str, out_path: pathlib.Path, width: int = 1024, height: int = 768) -> bool:
    """Download a topic-relevant cinematic illustration from Pollinations.ai."""
    encoded = urllib.parse.quote(prompt)
    url = f"https://image.pollinations.ai/prompt/{encoded}?width={width}&height={height}&nologo=true&seed={abs(hash(prompt)) % 100000}"
    req = urllib.request.Request(url, headers={"User-Agent": "Cinematic-Video-Engine/1.0"})
    try:
        with urllib.request.urlopen(req, timeout=45) as resp:
            data = resp.read()
            if len(data) > 5000:
                out_path.write_bytes(data)
                return True
    except Exception as e:
        print(f"  [Pollinations] Failed for '{prompt[:40]}...': {e}")
    return False


def generate_topic_images(config: dict, proj_dir: pathlib.Path) -> dict:
    """Generate fresh images for each beat if the topic is not Multan."""
    title = config.get("title", "")
    if "multan" in title.lower() or "ملتان" in title:
        print("-> Topic is Multan; using bundled Multan artwork.")
        return config

    photos_dir = proj_dir / "assets" / "photos"
    photos_dir.mkdir(parents=True, exist_ok=True)
    photos_json_path = proj_dir / "photos.json"

    photos_meta = {}
    if photos_json_path.exists():
        try:
            photos_meta = json.loads(photos_json_path.read_text(encoding="utf-8"))
        except Exception:
            photos_meta = {}

    for take in config.get("takes", []):
        for idx, line in enumerate(take.get("lines", [])):
            line_id = line.get("id", idx + 1)
            beat_title = line.get("typed", "")
            spoken = line.get("spoken", line.get("text", ""))
            photo_key = f"beat_{line_id}"
            out_file = photos_dir / f"{photo_key}.jpg"

            prompt = (
                f"Cinematic historical documentary illustration for '{title}', "
                f"scene: {beat_title} - {spoken[:120]}. "
                f"Rich dramatic lighting, painterly 3D storybook realism, no text, no watermark."
            )

            print(f"🎨 Generating scene artwork for Beat #{line_id} ({photo_key})...")
            ok = generate_image_pollinations(prompt, out_file)
            if ok:
                line["photo"] = photo_key
                photos_meta[photo_key] = {"kind": "color", "grade": "natural"}
                print(f"  ✅ Saved {out_file.name}")
            else:
                print(f"  ⚠️ Using fallback photo for Beat #{line_id}")

    photos_json_path.write_text(json.dumps(photos_meta, indent=2), encoding="utf-8")
    return config
