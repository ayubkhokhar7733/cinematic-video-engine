import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const token = body.githubToken || process.env.GITHUB_TOKEN;
    const repo = body.githubRepo || process.env.GITHUB_REPO || 'ayubkhokhar7733/cinematic-video-engine';

    if (!token) {
      return NextResponse.json({
        error: 'GitHub Token required! Provide a token in the Settings panel or set GITHUB_TOKEN in Vercel Environment Variables.'
      }, { status: 400 });
    }

    const payload = {
      ref: 'main',
      inputs: {
        title: body.title || 'Cinematic Film',
        script_payload: typeof body.script_payload === 'string' ? body.script_payload : JSON.stringify(body.script_payload),
        look: body.look || 'wall',
        tts_provider: body.tts_provider || 'edge',
        voice: body.voice || 'ur-PK-AsadNeural',
        aspect_ratio: body.aspect_ratio || '16:9',
        resolution: body.resolution || '720p',
        upload_youtube: Boolean(body.upload_youtube),
        privacy: body.privacy || 'unlisted'
      }
    };

    const res = await fetch(`https://api.github.com/repos/${repo}/actions/workflows/render_and_upload.yml/dispatches`, {
      method: 'POST',
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Cinematic-Studio-Dashboard'
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json({ error: `GitHub API error (${res.status}): ${errText}` }, { status: res.status });
    }

    return NextResponse.json({
      success: true,
      message: 'Workflow dispatched successfully! Video is now rendering on GitHub Cloud compute.'
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
