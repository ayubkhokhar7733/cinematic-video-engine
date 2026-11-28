import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const topic = body.topic || 'قدیم تاریخ';
    const language = body.language || 'urdu'; // 'urdu' or 'english'
    const duration = body.duration || 'short'; // 'short' | 'medium' | 'long' | 'deep'
    const provider = body.provider || (body.geminiApiKey ? 'gemini' : 'groq');
    const geminiKey = body.geminiApiKey || process.env.GEMINI_API_KEY;
    const groqKey = body.groqApiKey || process.env.GROQ_API_KEY;

    const beatGuide: Record<string, string> = {
      short: '4 to 5 beats (~30 seconds total)',
      medium: '10 to 12 beats (~2 minutes total)',
      long: '20 to 25 beats (~5 minutes total)',
      deep: '32 to 40 beats (~8-10 minutes total)',
      feature: '60 to 75 beats (~15-20 minutes full documentary)',
    };
    const targetBeats = beatGuide[duration] || beatGuide.short;

    const systemPrompt = `You are an elite, award-winning historical documentary director and scriptwriter (like Vox, Johnny Harris, BBC History, and National Geographic).
Your job is to generate a dramatic, highly engaging multi-beat documentary script for a programmatic 2D cinematic camera engine.

RULES:
1. Generate ${targetBeats}.
2. Beat #1 MUST be an irresistible hook.
3. Middle beats explore historical escalation, dramatic facts, armies, rulers, or discoveries.
4. Final beat offers an emotional or philosophical closing thought.
5. In Urdu mode: Write eloquent, high-retention, evocative Urdu (اردو) with proper punctuation.
6. In English mode: Write punchy, journalistic, dramatic English.
7. Return ONLY valid JSON in this exact structure with NO markdown fences, no formatting backticks:
{
  "title": "Short punchy video headline",
  "look": "wall",
  "voice": "${language === 'urdu' ? 'ur-PK-AsadNeural' : 'Charon'}",
  "beats": [
    {
      "id": 1,
      "text": "Full voiceover narration line spoken by narrator (engaging, dramatic)",
      "typed": "Short 2-4 word card title",
      "stamp": "Short stamp text (optional or null)"
    }
  ]
}

Available visual looks: "wall" (history, crime), "slate" (investigation), "charcoal" (pure dark), "paper" (parchment), "studio" (modern explainers), "blueprint" (science/engineering), "night" (space/tech).`;

    const userPrompt = `Generate a captivating ${language} historical documentary script about: "${topic}".`;

    // 1. Gemini AI Provider (Google Gemini 3.8 Flash)
    if (provider === 'gemini') {
      if (!geminiKey) {
        return NextResponse.json({
          error: 'Gemini API Key is required! Set GEMINI_API_KEY in Settings or Vercel Environment Variables.'
        }, { status: 400 });
      }

      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${geminiKey}`;
      const geminiPayload = {
        contents: [
          { role: 'user', parts: [{ text: `${systemPrompt}\n\nTask: ${userPrompt}` }] }
        ],
        generationConfig: {
          temperature: 0.7,
          responseMimeType: 'application/json'
        }
      };

      const res = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(geminiPayload)
      });

      if (!res.ok) {
        const errText = await res.text();
        return NextResponse.json({ error: `Gemini API Error (${res.status}): ${errText}` }, { status: res.status });
      }

      const data = await res.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '{}';
      const cleanJson = rawText.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
      const parsed = JSON.parse(cleanJson);
      return NextResponse.json(parsed);
    }

    // 2. Groq AI Provider (LLaMA 3.3 70B / OSS 120B)
    if (!groqKey) {
      return NextResponse.json({
        error: 'Groq API Key is required! Set GROQ_API_KEY in Settings or switch provider to Gemini.'
      }, { status: 400 });
    }

    const groqPayload = {
      model: 'openai/gpt-oss-120b',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' }
    };

    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqKey}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Cinematic-Studio-Dashboard'
      },
      body: JSON.stringify(groqPayload)
    });

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json({ error: `Groq API Error (${res.status}): ${errText}` }, { status: res.status });
    }

    const data = await res.json();
    let content = data.choices[0].message.content.trim();
    if (content.startsWith('```')) {
      content = content.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    }

    const parsed = JSON.parse(content);
    return NextResponse.json(parsed);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to generate story' }, { status: 500 });
  }
}
