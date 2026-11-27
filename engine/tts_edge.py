import sys
import asyncio
import edge_tts
import pathlib
import subprocess

async def synthesize_with_retry(text: str, voice: str, out_path: pathlib.Path, max_retries: int = 3):
    mp3_tmp = out_path.with_suffix(".mp3")
    for attempt in range(max_retries):
        try:
            communicate = edge_tts.Communicate(text, voice)
            await communicate.save(str(mp3_tmp))
            if mp3_tmp.exists() and mp3_tmp.stat().st_size > 100:
                # Convert to 48kHz mono WAV using ffmpeg
                cmd = ["ffmpeg", "-y", "-v", "error", "-i", str(mp3_tmp), "-ar", "48000", "-ac", "1", str(out_path)]
                subprocess.run(cmd, check=True)
                if mp3_tmp.exists():
                    mp3_tmp.unlink()
                print(f"Generated {out_path} using {voice}")
                return
        except Exception as e:
            print(f"[Attempt {attempt + 1}] Edge TTS error: {e}")
            if attempt < max_retries - 1:
                await asyncio.sleep(1.5 * (attempt + 1))
            else:
                raise

async def main():
    if len(sys.argv) < 3:
        print("Usage: python tts_edge.py <txt_file> <out_wav> [voice]")
        sys.exit(1)
        
    txt_path = pathlib.Path(sys.argv[1])
    out_path = pathlib.Path(sys.argv[2])
    voice = sys.argv[3] if len(sys.argv) > 3 else "ur-PK-AsadNeural"
    
    raw_content = txt_path.read_text(encoding="utf-8").strip()
    paras = [p.strip() for p in raw_content.split("\n\n") if p.strip()]
    
    # In Edge TTS, ellipsis (" ... ") creates a natural, distinct ~1.0s pause between lines
    # without passing raw XML/SSML tags that get spoken aloud.
    clean_text = " ... ".join(paras) if len(paras) > 1 else raw_content
    await synthesize_with_retry(clean_text, voice, out_path)

if __name__ == "__main__":
    asyncio.run(main())
