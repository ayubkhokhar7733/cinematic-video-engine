#!/usr/bin/env python3
"""
tts_gemini.py — Text-to-Speech synthesizer powered by Google Gemini API.
Uses Gemini 3.8 Flash TTS for studio-grade, expressive, mature documentary narration.
Accepts: python tts_gemini.py <txt_file> <out_wav> [voice]
"""

import os
import sys
import json
import base64
import pathlib
import subprocess
import urllib.request
import urllib.error

# Mature, cinematic documentary voices in Gemini
GEMINI_VOICES = {
    "charon": "Charon",      # Deep, authoritative, grave historical narrator (default)
    "fenrir": "Fenrir",      # Commanding, resonant, cinematic
    "orus": "Orus",          # Steady, confident, journalistic
    "kore": "Kore",          # Warm, balanced, clear narrative
    "puck": "Puck",          # Energetic
    "aoede": "Aoede"         # Sophisticated, literary storytelling
}

def resolve_voice(voice_input: str) -> str:
    cleaned = (voice_input or "").lower().strip()
    for key, val in GEMINI_VOICES.items():
        if key in cleaned:
            return val
    # If passed something like 'Charon' or 'Fenrir'
    for val in GEMINI_VOICES.values():
        if val.lower() == cleaned:
            return val
    return "Charon"  # Default: deep authoritative documentary voice


def load_api_key() -> str:
    # 1. Environment variable
    key = os.environ.get("GEMINI_API_KEY", "").strip()
    if key:
        return key
    
    # 2. Check local .env files
    candidates = [
        pathlib.Path(".env"),
        pathlib.Path(__file__).resolve().parent.parent / ".env",
        pathlib.Path("d:/youtube-automation-flows/story-flow/.env")
    ]
    for env_file in candidates:
        if env_file.exists():
            for line in env_file.read_text(encoding="utf-8").splitlines():
                if line.startswith("GEMINI_API_KEY=") or line.startswith("GOOGLE_API_KEY="):
                    val = line.split("=", 1)[1].strip().strip('"').strip("'")
                    if val:
                        return val
    return ""


def synthesize_via_gemini_interactions(text: str, voice: str, api_key: str, tmp_audio: pathlib.Path) -> bool:
    """Call Gemini 3.8 Flash TTS via interactions endpoint."""
    url = f"https://generativelanguage.googleapis.com/v1beta/interactions?key={api_key}"
    payload = {
        "model": "gemini-3.8-flash-tts",
        "input": [{
            "type": "user_input",
            "content": [{
                "type": "text",
                "text": text,
                "annotations": [{
                    "type": "speech_metadata",
                    "style": "deep, authoritative, mature cinematic documentary narrator with measured pacing"
                }]
            }]
        }],
        "response_format": {"type": "audio"},
        "generation_config": {
            "speech_config": [
                {"voice": voice}
            ]
        }
    }

    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )

    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            # Extract audio data from steps
            for step in data.get("steps", []):
                for item in step.get("content", []):
                    if item.get("type") == "audio" and "data" in item:
                        audio_bytes = base64.b64decode(item["data"])
                        tmp_audio.write_bytes(audio_bytes)
                        return True
    except urllib.error.HTTPError as e:
        err_msg = e.read().decode("utf-8", errors="ignore")
        print(f"[Gemini TTS interactions] HTTP {e.code}: {err_msg[:300]}")
    except Exception as e:
        print(f"[Gemini TTS interactions] Error: {e}")
    return False


def synthesize_via_gemini_generate_content(text: str, voice: str, api_key: str, tmp_audio: pathlib.Path) -> bool:
    """Fallback: Call Gemini 2.5/3.8 generateContent with responseModalities=['AUDIO']."""
    models = ["gemini-2.5-flash", "gemini-2.5-flash-native-audio-preview", "gemini-3.8-flash"]
    for m in models:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{m}:generateContent?key={api_key}"
        payload = {
            "contents": [{
                "parts": [{"text": text}]
            }],
            "generationConfig": {
                "responseModalities": ["AUDIO"],
                "speechConfig": {
                    "voiceConfig": {
                        "prebuiltVoiceConfig": {
                            "voiceName": voice
                        }
                    }
                }
            }
        }

        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"}
        )

        try:
            with urllib.request.urlopen(req, timeout=60) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                candidates = data.get("candidates", [])
                if candidates:
                    parts = candidates[0].get("content", {}).get("parts", [])
                    for p in parts:
                        inline_data = p.get("inlineData", {})
                        if "data" in inline_data:
                            audio_bytes = base64.b64decode(inline_data["data"])
                            tmp_audio.write_bytes(audio_bytes)
                            return True
        except Exception as e:
            continue
    return False


def fallback_to_edge_tts(txt_path: pathlib.Path, out_path: pathlib.Path, voice: str):
    """Fallback seamlessly to Edge TTS if Gemini API key is missing or quota exceeded."""
    print("-> Falling back to Edge TTS voice engine...")
    edge_script = pathlib.Path(__file__).resolve().parent / "tts_edge.py"
    # Choose appropriate Edge fallback voice
    edge_voice = "ur-PK-AsadNeural" if any(ord(ch) > 127 for ch in txt_path.read_text(encoding="utf-8")) else "en-US-ChristopherNeural"
    subprocess.run([sys.executable, str(edge_script), str(txt_path), str(out_path), edge_voice], check=True)


def main():
    if len(sys.argv) < 3:
        print("Usage: python tts_gemini.py <txt_file> <out_wav> [voice]")
        sys.exit(1)

    txt_path = pathlib.Path(sys.argv[1])
    out_path = pathlib.Path(sys.argv[2])
    voice_arg = sys.argv[3] if len(sys.argv) > 3 else "Charon"
    target_voice = resolve_voice(voice_arg)

    raw_content = txt_path.read_text(encoding="utf-8").strip()
    paras = [p.strip() for p in raw_content.split("\n\n") if p.strip()]
    clean_text = " ... ".join(paras) if len(paras) > 1 else raw_content

    api_key = load_api_key()
    if not api_key:
        print("⚠️ GEMINI_API_KEY not found in environment or .env. Using Edge TTS fallback.")
        fallback_to_edge_tts(txt_path, out_path, target_voice)
        return

    tmp_raw = out_path.with_suffix(".tmp_gemini")
    print(f"🎙️ Synthesizing voice with Gemini TTS ({target_voice})...")

    success = synthesize_via_gemini_interactions(clean_text, target_voice, api_key, tmp_raw)
    if not success:
        print("-> Retrying with Gemini generateContent endpoint...")
        success = synthesize_via_gemini_generate_content(clean_text, target_voice, api_key, tmp_raw)

    if not success or not tmp_raw.exists() or tmp_raw.stat().st_size < 100:
        print("⚠️ Gemini TTS synthesis failed. Falling back to Edge TTS...")
        fallback_to_edge_tts(txt_path, out_path, target_voice)
        return

    # Convert generated audio to standard 48kHz mono WAV using ffmpeg
    try:
        cmd = ["ffmpeg", "-y", "-v", "error", "-i", str(tmp_raw), "-ar", "48000", "-ac", "1", str(out_path)]
        subprocess.run(cmd, check=True)
        if tmp_raw.exists():
            tmp_raw.unlink()
        print(f"✅ Generated {out_path} using Gemini Voice ({target_voice})")
    except Exception as e:
        print(f"Error during audio conversion: {e}")
        fallback_to_edge_tts(txt_path, out_path, target_voice)


if __name__ == "__main__":
    main()
