import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token') || process.env.GITHUB_TOKEN;
    const repo = searchParams.get('repo') || process.env.GITHUB_REPO || 'ayubkhokhar7733/cinematic-video-engine';

    if (!token) {
      return NextResponse.json({ runs: [], warning: 'No GitHub token provided' });
    }

    const res = await fetch(`https://api.github.com/repos/${repo}/actions/runs?per_page=8`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `Bearer ${token}`,
        'User-Agent': 'Cinematic-Studio-Dashboard'
      },
      next: { revalidate: 5 }
    });

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json({ error: `GitHub API error: ${errText}` }, { status: res.status });
    }

    const data = await res.json();
    const runs = (data.workflow_runs || []).map((r: any) => ({
      id: r.id,
      name: r.name,
      status: r.status,
      conclusion: r.conclusion,
      created_at: r.created_at,
      html_url: r.html_url,
      display_title: r.display_title || r.name
    }));

    return NextResponse.json({ runs });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
