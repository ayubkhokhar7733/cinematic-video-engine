import sys
import asyncio
import edge_tts
import pathlib
import subprocess

async def main():
    if len(sys.argv) < 3:
        print("Usage: python tts_edge.py <txt_file> <out_wav> [voice]")
        sys.exit(1)
        
    txt_path = pathlib.Path(sys.argv[1])
    out_path = pathlib.Path(sys.argv[2])
    voice = sys.argv[3] if len(sys.argv) > 3 else "ur-PK-AsadNeural"
    
    raw_content = txt_path.read_text(encoding="utf-8").strip()
    paras = [p.strip() for p in raw_content.split("\n\n") if p.strip()]
    
    # If multiple lines, separate them with SSML break to ensure distinct pauses for split_takes.py
    if len(paras) > 1:
        inner = "\n<break time='750ms'/>\n".join(paras)
        ssml = f"<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='ur-PK'><voice name='{voice}'>{inner}</voice></speak>"
        communicate = edge_tts.Communicate(ssml, voice)
    else:
        communicate = edge_tts.Communicate(raw_content, voice)
        
    mp3_tmp = out_path.with_suffix(".mp3")
    await communicate.save(str(mp3_tmp))
    
    # Convert to 48kHz mono WAV using ffmpeg
    cmd = ["ffmpeg", "-y", "-v", "error", "-i", str(mp3_tmp), "-ar", "48000", "-ac", "1", str(out_path)]
    subprocess.run(cmd, check=True)
    if mp3_tmp.exists():
        mp3_tmp.unlink()
    print(f"Generated {out_path} using {voice}")

if __name__ == "__main__":
    asyncio.run(main())
