#!/usr/bin/env python3
"""
build_sfx.py — Synthesizes subtle documentary SFX (card pop, stamp thud, whoosh)
and a warm low-volume ambient music bed, then mixes them with narration.m4a -> mix.m4a.
"""

import json
import pathlib
import subprocess
import sys
import wave
import numpy as np

SR = 48000


def write_wav(path: pathlib.Path, samples: np.ndarray):
    s = np.clip(samples, -1.0, 1.0)
    pcm = (s * 32767).astype(np.int16)
    with wave.open(str(path), "wb") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(SR)
        wf.writeframes(pcm.tobytes())


def sfx_pop(dur=0.14):
    t = np.linspace(0, dur, int(SR * dur), False)
    freq = 220 * np.exp(-t * 18) + 90
    env = np.exp(-t * 28)
    return 0.35 * np.sin(2 * np.pi * freq * t) * env


def sfx_impact(dur=0.28):
    t = np.linspace(0, dur, int(SR * dur), False)
    thud = np.sin(2 * np.pi * (95 * np.exp(-t * 10) + 38) * t) * np.exp(-t * 12)
    noise = np.random.default_rng(7).standard_normal(len(t)) * np.exp(-t * 35) * 0.18
    return 0.55 * thud + noise


def sfx_whoosh(dur=0.35):
    t = np.linspace(0, dur, int(SR * dur), False)
    rng = np.random.default_rng(11)
    noise = rng.standard_normal(len(t))
    # Simple moving-average lowpass for soft air whoosh
    k = 24
    soft = np.convolve(noise, np.ones(k) / k, mode="same")
    env = np.sin(np.pi * t / dur) ** 2
    return 0.22 * soft * env


def ambient_bed(duration: float) -> np.ndarray:
    """Warm, unobtrusive documentary drone pad (C2 + G2 + D3)."""
    n = int(SR * duration)
    t = np.linspace(0, duration, n, False)
    pad = (
        0.45 * np.sin(2 * np.pi * 65.41 * t)
        + 0.30 * np.sin(2 * np.pi * 98.00 * t)
        + 0.20 * np.sin(2 * np.pi * 146.83 * t)
    )
    # Gentle breathing LFO
    lfo = 0.75 + 0.25 * np.sin(2 * np.pi * 0.12 * t)
    fade_in = np.minimum(1.0, t / 1.5)
    fade_out = np.minimum(1.0, (duration - t) / 2.0)
    return 0.065 * pad * lfo * fade_in * fade_out


def main():
    if len(sys.argv) < 3 or sys.argv[1] != "--project":
        sys.exit("Usage: python build_sfx.py --project <dir>")
    proj = pathlib.Path(sys.argv[2]).resolve()
    cues_path = proj / "sfx_cues.json"
    narration = proj / "audio" / "narration.m4a"
    out_mix = proj / "audio" / "mix.m4a"

    if not cues_path.exists() or not narration.exists():
        print("⚠️ Missing sfx_cues.json or narration.m4a; skipping SFX mix.")
        return

    data = json.loads(cues_path.read_text(encoding="utf-8"))
    dur = float(data.get("duration", 20.0)) + 0.5
    track = ambient_bed(dur)

    pops = sfx_pop()
    impacts = sfx_impact()
    whooshes = sfx_whoosh()

    for cue in data.get("cues", []):
        t0 = float(cue.get("t", 0.0))
        ctype = cue.get("type", "pop")
        gain = float(cue.get("gain", 0.6))
        idx = int(t0 * SR)
        if idx < 0 or idx >= len(track):
            continue
        clip = impacts if ctype == "impact" else whooshes if ctype in ("whoosh", "pan") else pops
        end = min(len(track), idx + len(clip))
        track[idx:end] += clip[: end - idx] * gain * 0.55

    sfx_wav = proj / "audio" / "sfx_bed.wav"
    write_wav(sfx_wav, track)

    # Mix narration (0dB) + sfx_bed (-2dB) -> mix.m4a
    cmd = [
        "ffmpeg", "-y", "-v", "error",
        "-i", str(narration),
        "-i", str(sfx_wav),
        "-filter_complex", "[0:a]volume=1.0[a0];[1:a]volume=0.85[a1];[a0][a1]amix=inputs=2:duration=first:dropout_transition=2[out]",
        "-map", "[out]", "-c:a", "aac", "-b:a", "192k",
        str(out_mix),
    ]
    subprocess.run(cmd, check=True)
    print(f"✅ Mixed narration + SFX + ambient bed -> {out_mix.name}", flush=True)


if __name__ == "__main__":
    main()
