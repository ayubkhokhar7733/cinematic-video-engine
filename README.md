# 🎬 Cinematic Video Engine & Cloud Studio

> **Automated Code-to-Video Engine powered by Skia, FFmpeg, Edge-TTS, and GitHub Actions Cloud Compute with direct YouTube Data API upload.**

---

## 🌟 Key Architecture & Capabilities

1. **GitHub Actions Cloud Compute**:
   - Zero local machine load. Every video is rendered on high-performance Ubuntu GitHub runners with multi-threaded Skia and FFmpeg.
2. **Direct YouTube Upload**:
   - Videos are published directly to your YouTube channel (as `unlisted`, `private`, or `public`) using the official YouTube Data API v3.
   - **Zero wasted GitHub storage:** video files are uploaded straight to YouTube. (If upload credentials are not set, files are saved with a strict 1-day ephemeral retention).
3. **Dual Viewport Formats**:
   - **16:9 Landscape:** Full standard YouTube documentaries and explainers.
   - **9:16 Portrait:** Optimized for YouTube Shorts, Instagram Reels, and TikTok.
4. **All 7 Visual Styles**:
   - `wall` (Evidence Corkboard)
   - `slate` (Cool Gray Investigation)
   - `charcoal` (Neutral Pure Dark)
   - `paper` (Warm Parchment Desk)
   - `studio` (Clean Modern Cards)
   - `blueprint` (Technical Drafting Grid)
   - `night` (High Glow Neon Trailers)
5. **Native Multilingual & Urdu Typography**:
   - Pre-configured with Google `Noto Nastaliq Urdu` and `Noto Sans Arabic` fonts.
   - Integrated `arabic-reshaper` and `python-bidi` for real-time cursive ligatures and right-to-left layout.
6. **Modern Web Control Dashboard (Vercel-Ready)**:
   - Next.js 14 App Router + Tailwind CSS.
   - Storyboard line editor, visual look picker, voice selector, format toggle, and one-click cloud dispatch.

---

## 📁 Repository Layout

```tree
cinematic-video-engine/
├── .github/
│   └── workflows/
│       └── render_and_upload.yml       # GitHub Actions workflow (cloud render + YouTube upload)
├── cli/
│   └── generate_and_upload.py          # Unified CLI entry point
├── core/
│   └── youtube_uploader.py             # Headless YouTube Data API v3 client
├── dashboard/                          # Next.js web control studio (deployable to Vercel)
│   ├── app/
│   │   ├── api/
│   │   │   ├── dispatch/route.ts       # Triggers GitHub Actions via GitHub API
│   │   │   └── runs/route.ts           # Fetches live run statuses
│   │   ├── page.tsx                    # Full interactive studio UI
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── package.json
│   └── vercel.json
├── engine/
│   ├── engine.py                       # Skia rendering engine (patched for Urdu & all looks)
│   ├── scene_builder.py                # Generates dynamic 16:9 and 9:16 scenes from JSON
│   ├── tts_edge.py                     # Microsoft Neural Edge-TTS with SSML pause breaks
│   ├── split_takes.py                  # Audio silence detector & timing sync
│   ├── build_narration.py              # Master timeline builder & loudness normalizer
│   ├── prep_assets.py                  # Generates procedural board textures
│   ├── render.py                       # Multi-worker parallel video renderer
│   └── fonts/                          # Noto Nastaliq Urdu & Noto Sans Arabic fonts
└── requirements.txt                    # Python dependencies
```

---

## 🚀 Setting Up GitHub Actions & Secrets

To allow GitHub Actions to render and upload directly to your YouTube channel:

1. In your GitHub repository, go to **Settings > Secrets and variables > Actions**.
2. Add the following secrets:
   * `YOUTUBE_CLIENT_ID` — Your Google Cloud OAuth 2.0 Client ID.
   * `YOUTUBE_CLIENT_SECRET` — Your Google Cloud OAuth 2.0 Client Secret.
   * `YOUTUBE_REFRESH_TOKEN` — Your OAuth 2.0 Refresh Token with YouTube upload permissions.

*(If you don't add YouTube secrets, the workflow still renders the video successfully and attaches it as a temporary 1-day download artifact).*

---

## 💻 Deploying the Dashboard on Vercel

1. Push this repository to GitHub (`ayubkhokhar7733/cinematic-video-engine`).
2. Go to [Vercel](https://vercel.com) and click **Add New > Project**.
3. Import `cinematic-video-engine` and set the **Root Directory** to `dashboard`.
4. (Optional) In Vercel Environment Variables, you can preset:
   * `GITHUB_TOKEN`: A GitHub Personal Access Token (classic or fine-grained) with `repo` and `workflow` scopes.
   * `GITHUB_REPO`: `ayubkhokhar7733/cinematic-video-engine`
5. Click **Deploy**!
*(You can also simply open the deployed dashboard, click **Settings**, and paste your GitHub token into the browser interface).*

---

## 🛠 Local Execution (Optional)

If you ever wish to test or render locally without using GitHub Actions:

```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Run generation (example 16:9 Urdu documentary)
python cli/generate_and_upload.py \
  --config multan-history/script.json \
  --project-dir local_build \
  --voice ur-PK-AsadNeural \
  --aspect-ratio 16:9 \
  --resolution 720p

# 3. Output will be generated at local_build/out/final.mp4
```
