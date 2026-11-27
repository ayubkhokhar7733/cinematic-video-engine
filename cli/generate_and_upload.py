#!/usr/bin/env python3
"""
cli/generate_and_upload.py — End-to-end cinematic video generator and YouTube uploader.
Runs locally or within GitHub Actions CI.
"""

import os
import sys
import json
import argparse
import pathlib
import subprocess
import shutil

ENGINE_DIR = pathlib.Path(__file__).resolve().parent.parent / "engine"
CORE_DIR = pathlib.Path(__file__).resolve().parent.parent / "core"
sys.path.insert(0, str(ENGINE_DIR))
sys.path.insert(0, str(CORE_DIR))

from scene_builder import generate_scene_code

RESOLUTIONS = {
    "16:9": {
        "720p": "1280x720",
        "1080p": "1920x1080",
        "4k": "3840x2160"
    },
    "9:16": {
        "720p": "720x1280",
        "1080p": "1080x1920",
        "4k": "2160x3840"
    }
}


def run_cmd(cmd, desc=""):
    print(f"\n[RUNNING] {desc or 'command'}: {' '.join(str(x) for x in cmd)}")
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode != 0:
        print(f"[ERROR] Stderr: {res.stderr[-1500:]}")
        sys.exit(f"Step failed: {desc}")
    if res.stdout.strip():
        print(res.stdout[-1000:].strip())
    return res.stdout


def main():
    parser = argparse.ArgumentParser(description="Generate cinematic video and optionally upload to YouTube")
    parser.add_argument("--config", required=True, help="JSON configuration string or path to .json file")
    parser.add_argument("--project-dir", default="build_project", help="Working build directory")
    parser.add_argument("--tts-provider", choices=["edge", "gemini"], default="edge", help="TTS voice engine provider")
    parser.add_argument("--voice", default="ur-PK-AsadNeural", help="Voice model or name")
    parser.add_argument("--aspect-ratio", choices=["16:9", "9:16"], default="16:9", help="Video aspect ratio")
    parser.add_argument("--resolution", choices=["720p", "1080p", "4k"], default="720p", help="Render resolution")
    parser.add_argument("--upload-youtube", action="store_true", help="Upload rendered video directly to YouTube")
    parser.add_argument("--privacy", choices=["unlisted", "private", "public"], default="unlisted", help="YouTube privacy")
    args = parser.parse_args()

    # Parse config
    if os.path.exists(args.config):
        with open(args.config, "r", encoding="utf-8") as f:
            config = json.load(f)
    else:
        config = json.loads(args.config)

    proj = pathlib.Path(args.project_dir).resolve()
    proj.mkdir(parents=True, exist_ok=True)
    for sub in ("assets/photos", "assets/prep", "audio/takes", "fonts", "out"):
        (proj / sub).mkdir(parents=True, exist_ok=True)

    # Copy fonts
    engine_fonts = ENGINE_DIR / "fonts"
    if engine_fonts.exists():
        for font_file in engine_fonts.glob("*.ttf"):
            shutil.copy2(font_file, proj / "fonts" / font_file.name)

    # Copy photos & photos.json if available
    root_assets = pathlib.Path(__file__).resolve().parent.parent / "assets"
    if (root_assets / "photos").exists():
        for pfile in (root_assets / "photos").glob("*.*"):
            shutil.copy2(pfile, proj / "assets" / "photos" / pfile.name)
    if (root_assets / "photos.json").exists():
        shutil.copy2(root_assets / "photos.json", proj / "photos.json")

    # 1. Write script.json
    script_path = proj / "script.json"
    script_path.write_text(json.dumps(config, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"-> Script written to {script_path}")

    # 2. Build scene.py dynamically
    scene_code = generate_scene_code(config, aspect_ratio=args.aspect_ratio)
    scene_path = proj / "scene.py"
    scene_path.write_text(scene_code, encoding="utf-8")
    print(f"-> Generated scene code in {scene_path}")

    # 3. Prep textures & assets
    python_exe = sys.executable
    run_cmd([python_exe, str(ENGINE_DIR / "prep_assets.py"), "--project", str(proj)], desc="Prep Assets")

    # 4. Synthesize voice takes via selected TTS engine
    tts_script = ENGINE_DIR / "tts_gemini.py" if args.tts_provider == "gemini" else ENGINE_DIR / "tts_edge.py"
    cmd_tts = f'"{python_exe}" "{tts_script}" {{txt}} {{out}} "{args.voice}"'
    run_cmd([python_exe, str(ENGINE_DIR / "tts_say.py"), "--project", str(proj), "--cmd", cmd_tts], desc=f"Voice Takes Synthesis ({args.tts_provider.upper()})")

    # 5. Split takes into timed lines
    run_cmd([python_exe, str(ENGINE_DIR / "split_takes.py"), "--project", str(proj)], desc="Split Takes")

    # 6. Build narration & global timing
    run_cmd([python_exe, str(ENGINE_DIR / "build_narration.py"), "--project", str(proj)], desc="Assemble Narration")

    # 7. Render Video with Skia
    render_size = RESOLUTIONS[args.aspect_ratio][args.resolution]
    out_mp4 = proj / "out" / "final.mp4"
    audio_track = proj / "audio" / "narration.m4a"

    run_cmd([
        python_exe, str(ENGINE_DIR / "render.py"),
        "--project", str(proj),
        "--size", render_size,
        "--out", str(out_mp4),
        "--audio", str(audio_track)
    ], desc=f"Render Video ({render_size})")

    print(f"\n✅ Video successfully rendered at: {out_mp4} ({render_size})")

    # 8. Upload to YouTube if requested
    if args.upload_youtube:
        print("\n🚀 Uploading video directly to YouTube...")
        from youtube_uploader import upload_video

        title = config.get("title", "Cinematic Video")
        if args.aspect_ratio == "9:16":
            title += " #Shorts"

        description = f"{title}\n\nAutomated Cinematic Video generated via Cinematic Video Engine."
        tags = config.get("tags", ["documentary", "history", "cinematic", "shorts"])

        upload_res = upload_video(
            video_path=str(out_mp4),
            title=title,
            description=description,
            tags=tags,
            privacy_status=args.privacy,
            category="Education" if "history" in title.lower() or "قدیم" in title else "Entertainment"
        )

        video_id = upload_res.get("id")
        video_url = f"https://youtu.be/{video_id}" if video_id else "Upload Completed"
        print(f"\n🎉 YouTube Upload Success!")
        print(f"📺 Watch URL: {video_url}")

        result_payload = {
            "status": "success",
            "video_id": video_id,
            "youtube_url": video_url,
            "video_path": str(out_mp4),
            "resolution": render_size,
            "aspect_ratio": args.aspect_ratio
        }
        (proj / "out" / "upload_result.json").write_text(json.dumps(result_payload, indent=2))

    return 0


if __name__ == "__main__":
    main()
