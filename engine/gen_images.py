#!/usr/bin/env python3
"""
gen_images.py — Generates topic-relevant cinematic illustrations for each beat in script.json.
Primary: Cloudflare Workers AI (@cf/black-forest-labs/flux-1-schnell) when CLOUDFLARE_ACCOUNT_ID & CLOUDFLARE_API_TOKEN are set.
Fallback: Pollinations.ai (free, zero-key, 15s timeout).
"""

import os
import json
import base64
import urllib.request
import urllib.parse
import pathlib


def generate_image_cloudflare(prompt: str, out_path: pathlib.Path) -> bool:
    """Generate an image via Cloudflare Workers AI Flux-1-Schnell."""
    account_id = os.environ.get("CLOUDFLARE_ACCOUNT_ID", "").strip()
    api_token = os.environ.get("CLOUDFLARE_API_TOKEN", "").strip()
    if not account_id or not api_token:
        return False

    url = f"https://api.cloudflare.com/client/v4/accounts/{account_id}/ai/run/@cf/black-forest-labs/flux-1-schnell"
    payload = json.dumps({"prompt": prompt}).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=payload,
        headers={
            "Authorization": f"Bearer {api_token}",
            "Content-Type": "application/json",
            "User-Agent": "Cinematic-Video-Engine/1.0",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=25) as resp:
            raw = resp.read()
            # Cloudflare returns either raw image bytes or JSON {"result": {"image": "<base64>"}}
            if raw[:4] in (b"\xff\xd8\xff\xe0", b"\xff\xd8\xff\xe1", b"\x89PNG"):
                out_path.write_bytes(raw)
                return True
            data = json.loads(raw.decode("utf-8"))
            b64 = data.get("result", {}).get("image")
            if b64:
                out_path.write_bytes(base64.b64decode(b64))
                return True
    except urllib.error.HTTPError as e:
        err_body = e.read().decode("utf-8", errors="ignore")[:300]
        print(f"  [Cloudflare AI] HTTP {e.code}: {err_body}", flush=True)
    except Exception as e:
        print(f"  [Cloudflare AI] Failed: {e}", flush=True)
    return False


def generate_image_pollinations(prompt: str, out_path: pathlib.Path, width: int = 1024, height: int = 768) -> bool:
    """Download a topic-relevant cinematic illustration from Pollinations.ai (15s timeout)."""
    encoded = urllib.parse.quote(prompt)
    url = f"https://image.pollinations.ai/prompt/{encoded}?width={width}&height={height}&nologo=true&seed={abs(hash(prompt)) % 100000}"
    req = urllib.request.Request(url, headers={"User-Agent": "Cinematic-Video-Engine/1.0"})
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = resp.read()
            if len(data) > 5000:
                out_path.write_bytes(data)
                return True
    except Exception as e:
        print(f"  [Pollinations] Failed for '{prompt[:40]}...': {e}", flush=True)
    return False


def generate_topic_images(config: dict, proj_dir: pathlib.Path) -> dict:
    """Generate fresh images for each beat if the topic is not Multan."""
    title = config.get("title", "")
    if "multan" in title.lower() or "ملتان" in title:
        print("-> Topic is Multan; using bundled Multan artwork.", flush=True)
        return config

    photos_dir = proj_dir / "assets" / "photos"
    photos_dir.mkdir(parents=True, exist_ok=True)
    photos_json_path = proj_dir / "photos.json"

    photos_meta = {"grade": "natural", "photos": []}
    if photos_json_path.exists():
        try:
            loaded = json.loads(photos_json_path.read_text(encoding="utf-8"))
            if isinstance(loaded, dict) and "photos" in loaded:
                photos_meta = loaded
        except Exception:
            pass

    existing_ids = {p.get("id") for p in photos_meta.get("photos", [])}

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

            print(f"🎨 Generating scene artwork for Beat #{line_id} ({photo_key})...", flush=True)
            ok = generate_image_cloudflare(prompt, out_file) or generate_image_pollinations(prompt, out_file)
            if ok:
                line["photo"] = photo_key
                if photo_key not in existing_ids:
                    photos_meta["photos"].append({"id": photo_key, "file": f"{photo_key}.jpg", "kind": "color"})
                    existing_ids.add(photo_key)
                print(f"  ✅ Saved {out_file.name}", flush=True)
            else:
                print(f"  ⚠️ Using fallback photo for Beat #{line_id}", flush=True)

    photos_json_path.write_text(json.dumps(photos_meta, indent=2), encoding="utf-8")
    return config
