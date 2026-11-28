'use client';

import React, { useState, useEffect } from 'react';
import {
  Film,
  Sparkles,
  Play,
  Tv,
  Smartphone,
  Youtube,
  CloudLightning,
  Settings,
  Plus,
  Trash2,
  ExternalLink,
  RefreshCw,
  CheckCircle2,
  Clock,
  AlertCircle,
  Wand2
} from 'lucide-react';

interface BeatLine {
  id: number;
  text: string;
  spoken: string;
  typed: string;
  stamp?: string;
}

const LOOKS = [
  { id: 'wall', name: 'Evidence Wall', desc: 'Dark cork, warm tones, true crime & history', color: 'from-amber-950 to-stone-900', border: 'border-amber-700/60' },
  { id: 'slate', name: 'Cool Slate', desc: 'Blue-grey board, politics & investigations', color: 'from-slate-900 to-cyan-950', border: 'border-cyan-700/60' },
  { id: 'charcoal', name: 'Pure Charcoal', desc: 'High-contrast neutral dark for vibrant visuals', color: 'from-stone-900 to-black', border: 'border-stone-700/60' },
  { id: 'paper', name: 'Paper Desk', desc: 'Warm parchment paper, education & arts', color: 'from-amber-100/10 to-stone-900', border: 'border-amber-600/60' },
  { id: 'studio', name: 'Clean Studio', desc: 'Minimalist studio card layout, explainers', color: 'from-zinc-800 to-zinc-950', border: 'border-zinc-500/60' },
  { id: 'blueprint', name: 'Blueprint', desc: 'Deep drafting grid, engineering & science', color: 'from-blue-950 to-indigo-950', border: 'border-blue-500/60' },
  { id: 'night', name: 'Neon Night', desc: 'Deep navy, high glow, tech & space trailers', color: 'from-indigo-950 to-purple-950', border: 'border-purple-600/60' }
];

const VOICES = [
  // Gemini Studio AI Voices (Mature, Deep, Expressive)
  { id: 'Charon', label: 'Gemini: Charon (Deep Mature Documentary)', provider: 'gemini', lang: 'Universal' },
  { id: 'Fenrir', label: 'Gemini: Fenrir (Commanding & Resonant)', provider: 'gemini', lang: 'Universal' },
  { id: 'Orus', label: 'Gemini: Orus (Steady & Authoritative)', provider: 'gemini', lang: 'Universal' },
  { id: 'Kore', label: 'Gemini: Kore (Clear Narrative)', provider: 'gemini', lang: 'Universal' },
  { id: 'Aoede', label: 'Gemini: Aoede (Sophisticated Storyteller)', provider: 'gemini', lang: 'Universal' },

  // Edge-TTS Voices
  { id: 'ur-PK-AsadNeural', label: 'Edge: Urdu - Asad (Classic Urdu)', provider: 'edge', lang: 'Urdu' },
  { id: 'ur-PK-UzmaNeural', label: 'Edge: Urdu - Uzma (Narrative)', provider: 'edge', lang: 'Urdu' },
  { id: 'ur-IN-SalmanNeural', label: 'Edge: Urdu - Salman (Expressive)', provider: 'edge', lang: 'Urdu' },
  { id: 'en-US-ChristopherNeural', label: 'Edge: English - Christopher (Documentary)', provider: 'edge', lang: 'English' },
  { id: 'en-US-JennyNeural', label: 'Edge: English - Jenny (Natural)', provider: 'edge', lang: 'English' },
  { id: 'en-US-GuyNeural', label: 'Edge: English - Guy (News Anchor)', provider: 'edge', lang: 'English' }
];

const PRESETS = {
  multan: {
    title: 'قدیم ملتان: اولیاء کا تاریخی شہر',
    look: 'wall',
    voice: 'ur-PK-AsadNeural',
    beats: [
      { id: 1, text: 'ملتان، دنیا کے قدیم ترین آباد شہروں میں سے ایک ہے۔', spoken: 'ملتان، دنیا کے قدیم ترین آباد شہروں میں سے ایک ہے۔', typed: 'قدیم ملتان', stamp: 'قدیم تاریخ' },
      { id: 2, text: 'پانچ ہزار سال پرانا قلعہ کہنہ، عظیم تاریخ کا گواہ ہے۔', spoken: 'پانچ ہزار سال پرانا قلعہ کہنہ، عظیم تاریخ کا گواہ ہے۔', typed: 'قلعہ کہنہ ملتان', stamp: '۵۰۰۰ سال' },
      { id: 3, text: 'تین سو چھبیس قبل مسیح میں، سکندرِ اعظم نے اس قلعے پر حملہ کیا۔', spoken: 'تین سو چھبیس قبل مسیح میں، سکندرِ اعظم نے اس قلعے پر حملہ کیا۔', typed: 'سکندرِ اعظم کا حملہ', stamp: '۳۲۶ ق م' },
      { id: 4, text: 'شاہ رکنِ عالم اور بہاؤالدین زکریا نے اسے مدینۃ الاولیاء بنا دیا۔', spoken: 'شاہ رکنِ عالم اور بہاؤالدین زکریا نے اسے مدینۃ الاولیاء بنا دیا۔', typed: 'مدینۃ الاولیاء', stamp: 'روحانی ورثہ' },
      { id: 5, text: 'یہ ہے ملتان، جہاں صدیاں آج بھی زندہ ہیں۔', spoken: 'یہ ہے ملتان، جہاں صدیاں آج بھی زندہ ہیں۔', typed: 'زندہ تاریخ', stamp: 'لازوال ملتان' }
    ]
  },
  explainer: {
    title: 'From Seed to Cup: The Story of Coffee',
    look: 'studio',
    voice: 'en-US-ChristopherNeural',
    beats: [
      { id: 1, text: 'Every morning cup of coffee begins as a cherry.', spoken: 'Every morning cup of coffee begins as a cherry.', typed: 'FROM SEED TO CUP', stamp: 'ORIGIN' },
      { id: 2, text: 'Grown across volcanic belts near the equator.', spoken: 'Grown across volcanic belts near the equator.', typed: 'HARVEST & BELT', stamp: 'ELEVATION' },
      { id: 3, text: 'Roasted at 200 degrees until the seed turns golden brown.', spoken: 'Roasted at two hundred degrees until the seed turns golden brown.', typed: 'ROASTING PROCESS', stamp: '200°C' },
      { id: 4, text: 'Months of cultivation, crafted for a few minutes in a cup.', spoken: 'Months of cultivation, crafted for a few minutes in a cup.', typed: 'THE FINAL BREW', stamp: 'PERFECTION' }
    ]
  }
};

export default function Home() {
  const [title, setTitle] = useState(PRESETS.multan.title);
  const [look, setLook] = useState('wall');
  const [voice, setVoice] = useState('ur-PK-AsadNeural');
  const [ttsProvider, setTtsProvider] = useState<'edge' | 'gemini'>('edge');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [resolution, setResolution] = useState<'720p' | '1080p'>('720p');
  const [uploadYoutube, setUploadYoutube] = useState(true);
  const [privacy, setPrivacy] = useState<'unlisted' | 'private' | 'public'>('unlisted');
  const [beats, setBeats] = useState<BeatLine[]>(PRESETS.multan.beats);

  // AI Story Generation State
  const [aiTopic, setAiTopic] = useState('');
  const [aiLanguage, setAiLanguage] = useState<'urdu' | 'english'>('urdu');
  const [aiDuration, setAiDuration] = useState<'short' | 'medium' | 'long' | 'deep' | 'feature'>('short');
  const [aiProvider, setAiProvider] = useState<'gemini' | 'groq'>('gemini');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Settings
  const [showSettings, setShowSettings] = useState(false);
  const [githubToken, setGithubToken] = useState('');
  const [githubRepo, setGithubRepo] = useState('ayubkhokhar7733/cinematic-video-engine');
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [groqApiKey, setGroqApiKey] = useState('');

  // Status & Runs
  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatchMessage, setDispatchMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [runs, setRuns] = useState<any[]>([]);
  const [isLoadingRuns, setIsLoadingRuns] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem('cve_github_token') || '';
    const savedRepo = localStorage.getItem('cve_github_repo') || 'ayubkhokhar7733/cinematic-video-engine';
    const savedGemini = localStorage.getItem('cve_gemini_api_key') || '';
    const savedGroq = localStorage.getItem('cve_groq_api_key') || '';
    setGithubToken(savedToken);
    setGithubRepo(savedRepo);
    setGeminiApiKey(savedGemini);
    setGroqApiKey(savedGroq);
  }, []);

  const saveSettings = () => {
    localStorage.setItem('cve_github_token', githubToken);
    localStorage.setItem('cve_github_repo', githubRepo);
    localStorage.setItem('cve_gemini_api_key', geminiApiKey);
    localStorage.setItem('cve_groq_api_key', groqApiKey);
    setShowSettings(false);
    fetchRuns();
  };

  const fetchRuns = async () => {
    if (!githubToken) return;
    setIsLoadingRuns(true);
    try {
      const res = await fetch(`/api/runs?token=${encodeURIComponent(githubToken)}&repo=${encodeURIComponent(githubRepo)}`);
      const data = await res.json();
      if (data.runs) setRuns(data.runs);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingRuns(false);
    }
  };

  useEffect(() => {
    if (githubToken) {
      fetchRuns();
      const interval = setInterval(fetchRuns, 15000);
      return () => clearInterval(interval);
    }
  }, [githubToken, githubRepo]);

  const handleGenerateStory = async () => {
    if (!aiTopic.trim()) return;
    setIsGeneratingAi(true);
    setAiError(null);

    try {
      const res = await fetch('/api/generate-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: aiTopic,
          language: aiLanguage,
          duration: aiDuration,
          provider: aiProvider,
          geminiApiKey: geminiApiKey,
          groqApiKey: groqApiKey
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setAiError(data.error || 'Failed to generate script');
      } else {
        if (data.title) setTitle(data.title);
        if (data.look) setLook(data.look);
        if (data.voice) {
          setVoice(data.voice);
          const found = VOICES.find(v => v.id === data.voice);
          if (found) setTtsProvider(found.provider as any);
        }
        if (Array.isArray(data.beats) && data.beats.length > 0) {
          setBeats(
            data.beats.map((b: any, i: number) => ({
              id: i + 1,
              text: b.text || '',
              spoken: b.text || '',
              typed: b.typed || `Beat ${i + 1}`,
              stamp: b.stamp || ''
            }))
          );
        }
      }
    } catch (err: any) {
      setAiError(err.message || 'Network error');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const applyPreset = (key: 'multan' | 'explainer') => {
    const p = PRESETS[key];
    setTitle(p.title);
    setLook(p.look);
    setVoice(p.voice);
    setBeats(p.beats);
  };

  const addBeat = () => {
    const newId = beats.length + 1;
    setBeats([...beats, { id: newId, text: '', spoken: '', typed: `Beat ${newId}`, stamp: '' }]);
  };

  const updateBeat = (index: number, field: keyof BeatLine, value: string) => {
    const updated = [...beats];
    updated[index] = { ...updated[index], [field]: value };
    if (field === 'text' && !updated[index].spoken) {
      updated[index].spoken = value;
    }
    setBeats(updated);
  };

  const removeBeat = (index: number) => {
    if (beats.length <= 1) return;
    const filtered = beats.filter((_, i) => i !== index).map((b, i) => ({ ...b, id: i + 1 }));
    setBeats(filtered);
  };

  const handleDispatch = async () => {
    setIsDispatching(true);
    setDispatchMessage(null);

    const scriptPayload = {
      title,
      look,
      takes: [
        {
          take: 'T01_main',
          lines: beats.map((b) => ({
            id: b.id,
            text: b.text || b.spoken,
            spoken: b.spoken || b.text,
            typed: b.typed || `Scene ${b.id}`,
            stamp: b.stamp || undefined
          }))
        }
      ]
    };

    try {
      const res = await fetch('/api/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          script_payload: scriptPayload,
          look,
          tts_provider: ttsProvider,
          voice,
          aspect_ratio: aspectRatio,
          resolution,
          upload_youtube: uploadYoutube,
          privacy,
          githubToken,
          githubRepo
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setDispatchMessage({ type: 'error', text: data.error || 'Failed to dispatch workflow' });
      } else {
        setDispatchMessage({ type: 'success', text: data.message });
        setTimeout(fetchRuns, 3000);
      }
    } catch (err: any) {
      setDispatchMessage({ type: 'error', text: err.message || 'Network error' });
    } finally {
      setIsDispatching(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <header className="border-b border-slate-800/80 bg-studio-900/60 backdrop-blur px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-500 text-white shadow-lg shadow-rose-500/20">
            <Film className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-lg tracking-tight">Cinematic Studio Cloud</h1>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <CloudLightning className="w-3 h-3" /> GitHub Compute
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 flex items-center gap-1">
                <Wand2 className="w-3 h-3" /> Groq AI Scripting
              </span>
            </div>
            <p className="text-xs text-slate-400">Automated Code-to-Video Engine & YouTube Uploader</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex gap-2 mr-2">
            <button
              onClick={() => applyPreset('multan')}
              className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 transition"
            >
              Preset: قدیم ملتان
            </button>
            <button
              onClick={() => applyPreset('explainer')}
              className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 transition"
            >
              Preset: Coffee Explainer
            </button>
          </div>

          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300"
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>
        </div>
      </header>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-base flex items-center gap-2">
                <Settings className="w-4 h-4 text-amber-400" /> Studio & AI API Settings
              </h3>
              <button onClick={() => setShowSettings(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Google Gemini API Key (High Quality Voice & Scripting)</label>
                <input
                  type="password"
                  value={geminiApiKey}
                  onChange={(e) => setGeminiApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 font-mono"
                />
                <p className="text-[11px] text-slate-500 mt-1">Get free from Google AI Studio. Powers Gemini 3.8 Flash TTS & AI scriptwriting.</p>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Groq API Key (Fast LLaMA 3.3 Scriptwriting)</label>
                <input
                  type="password"
                  value={groqApiKey}
                  onChange={(e) => setGroqApiKey(e.target.value)}
                  placeholder="gsk_..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 font-mono"
                />
                <p className="text-[11px] text-slate-500 mt-1">Alternative fast AI scriptwriter.</p>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">GitHub Repository</label>
                <input
                  type="text"
                  value={githubRepo}
                  onChange={(e) => setGithubRepo(e.target.value)}
                  placeholder="ayubkhokhar7733/cinematic-video-engine"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">GitHub Personal Access Token (PAT)</label>
                <input
                  type="password"
                  value={githubToken}
                  onChange={(e) => setGithubToken(e.target.value)}
                  placeholder="ghp_... with repo & workflow scope"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 font-mono"
                />
                <p className="text-[11px] text-slate-500 mt-1">Saved in your browser localStorage. Used to trigger GitHub Actions compute.</p>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  onClick={() => setShowSettings(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  onClick={saveSettings}
                  className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-500 shadow-md shadow-indigo-600/30"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Studio Body */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 max-w-[1700px] w-full mx-auto">
        {/* Left Column: Styles & Engine Controls */}
        <div className="lg:col-span-4 space-y-6">
          {/* Format & Aspect Ratio */}
          <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-5 space-y-4 shadow-xl">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Play className="w-3.5 h-3.5 text-amber-400" /> Format & Viewport
            </h2>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setAspectRatio('16:9')}
                className={`flex items-center gap-3 p-3 rounded-xl border text-left transition ${
                  aspectRatio === '16:9'
                    ? 'border-indigo-500 bg-indigo-500/10 text-white'
                    : 'border-slate-800 bg-slate-950/50 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Tv className="w-5 h-5 text-indigo-400" />
                <div>
                  <div className="font-semibold text-xs text-white">16:9 Landscape</div>
                  <div className="text-[10px] text-slate-400">YouTube Long-Form</div>
                </div>
              </button>

              <button
                onClick={() => setAspectRatio('9:16')}
                className={`flex items-center gap-3 p-3 rounded-xl border text-left transition ${
                  aspectRatio === '9:16'
                    ? 'border-rose-500 bg-rose-500/10 text-white'
                    : 'border-slate-800 bg-slate-950/50 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Smartphone className="w-5 h-5 text-rose-400" />
                <div>
                  <div className="font-semibold text-xs text-white">9:16 Vertical</div>
                  <div className="text-[10px] text-slate-400">Shorts / Reels</div>
                </div>
              </button>
            </div>

            <div className="flex gap-4 pt-2">
              <div className="flex-1">
                <label className="text-[11px] text-slate-400 block mb-1">Resolution</label>
                <select
                  value={resolution}
                  onChange={(e: any) => setResolution(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="720p">720p HD (Fast Cloud Render ~1-2 min)</option>
                  <option value="1080p">1080p Full HD (Production Quality)</option>
                </select>
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] text-slate-400">Voice Engine & Model</label>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${ttsProvider === 'gemini' ? 'bg-indigo-500/20 text-indigo-300' : 'bg-slate-800 text-slate-400'}`}>
                    {ttsProvider === 'gemini' ? 'Gemini 3.8' : 'Edge-TTS'}
                  </span>
                </div>
                <select
                  value={voice}
                  onChange={(e) => {
                    const selected = e.target.value;
                    setVoice(selected);
                    const found = VOICES.find(v => v.id === selected);
                    if (found) setTtsProvider(found.provider as any);
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <optgroup label="✨ Gemini Studio AI Voices (Mature Documentary)">
                    {VOICES.filter(v => v.provider === 'gemini').map((v) => (
                      <option key={v.id} value={v.id}>{v.label}</option>
                    ))}
                  </optgroup>
                  <optgroup label="🎙️ Classic Neural Voices (Urdu / English)">
                    {VOICES.filter(v => v.provider === 'edge').map((v) => (
                      <option key={v.id} value={v.id}>{v.label}</option>
                    ))}
                  </optgroup>
                </select>
              </div>
            </div>
          </div>

          {/* 7 Visual Styles */}
          <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-5 space-y-3 shadow-xl">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Cinematic Visual Look (7 Styles)
            </h2>

            <div className="space-y-2">
              {LOOKS.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setLook(item.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                    look === item.id
                      ? `${item.border} bg-gradient-to-r ${item.color} shadow-lg shadow-black/40`
                      : 'border-slate-800/80 bg-slate-950/40 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="font-semibold text-xs flex items-center gap-2">
                      {item.name}
                      {look === item.id && <span className="text-[10px] text-amber-400">● Active</span>}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{item.desc}</div>
                  </div>
                  <div className={`w-3.5 h-3.5 rounded-full border ${look === item.id ? 'border-white bg-white' : 'border-slate-700'}`} />
                </div>
              ))}
            </div>
          </div>

          {/* YouTube Upload Options */}
          <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-5 space-y-3 shadow-xl">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Youtube className="w-3.5 h-3.5 text-red-500" /> Direct YouTube Upload
            </h2>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div>
                <div className="text-xs font-medium">Upload Directly to YouTube</div>
                <div className="text-[10px] text-slate-400">Saves cloud storage, publishes directly</div>
              </div>
              <input
                type="checkbox"
                checked={uploadYoutube}
                onChange={(e) => setUploadYoutube(e.target.checked)}
                className="w-4 h-4 rounded text-red-500 focus:ring-red-500 focus:ring-offset-0 bg-slate-800 border-slate-700"
              />
            </div>

            {uploadYoutube && (
              <div className="pt-2">
                <label className="text-[11px] text-slate-400 block mb-1">Privacy Status</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['unlisted', 'private', 'public'] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPrivacy(p)}
                      className={`text-xs py-1.5 rounded-lg border capitalize transition ${
                        privacy === p
                          ? 'border-red-500 bg-red-500/10 text-white font-medium'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Middle Column: Script & Scene Storyboard */}
        <div className="lg:col-span-5 space-y-6">
          {/* AI Story Generator Bar */}
          <div className="bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-slate-900/80 border border-indigo-500/40 rounded-2xl p-5 space-y-3.5 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-2">
                <Wand2 className="w-4 h-4 text-indigo-400 animate-pulse" /> AI Documentary Director
              </h2>
              <div className="flex items-center gap-2">
                {/* AI Provider selector */}
                <div className="flex items-center gap-1 bg-slate-950/80 border border-slate-800 rounded-lg p-0.5 text-[11px]">
                  <button
                    onClick={() => setAiProvider('gemini')}
                    className={`px-2 py-0.5 rounded font-medium transition ${aiProvider === 'gemini' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                  >
                    ✨ Gemini 3.8
                  </button>
                  <button
                    onClick={() => setAiProvider('groq')}
                    className={`px-2 py-0.5 rounded font-medium transition ${aiProvider === 'groq' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                  >
                    ⚡ Groq
                  </button>
                </div>

                {/* Language selector */}
                <div className="flex items-center gap-1 bg-slate-950/80 border border-slate-800 rounded-lg p-0.5 text-[11px]">
                  <button
                    onClick={() => setAiLanguage('urdu')}
                    className={`px-2 py-0.5 rounded font-medium transition ${aiLanguage === 'urdu' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                  >
                    اردو (Urdu)
                  </button>
                  <button
                    onClick={() => setAiLanguage('english')}
                    className={`px-2 py-0.5 rounded font-medium transition ${aiLanguage === 'english' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                  >
                    English
                  </button>
                </div>

                {/* Video Length selector */}
                <select
                  value={aiDuration}
                  onChange={(e) => setAiDuration(e.target.value as any)}
                  className="bg-slate-950/80 border border-slate-800 rounded-lg px-2 py-1 text-[11px] text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="short">⚡ Short (~30s)</option>
                  <option value="medium">🎬 Medium (~2 min)</option>
                  <option value="long">📽️ Long (~5 min)</option>
                  <option value="deep">🎞️ Deep Dive (~8-10 min)</option>
                  <option value="feature">🎥 Feature (~15-20 min)</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={aiTopic}
                onChange={(e) => setAiTopic(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerateStory()}
                placeholder={aiLanguage === 'urdu' ? "موضوع درج کریں (مثال: موہنجوداڑو کا راز، سلطنت عثمانیہ، سقوطِ بغداد)..." : "Enter topic (e.g., Mystery of Mohenjo-Daro, Fall of Constantinople, Rise of Rome)..."}
                className="flex-1 bg-slate-950 border border-indigo-500/30 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400 shadow-inner"
              />
              <button
                onClick={handleGenerateStory}
                disabled={isGeneratingAi || !aiTopic.trim()}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 transition disabled:opacity-50 shrink-0"
              >
                {isGeneratingAi ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Writing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Generate Script</span>
                  </>
                )}
              </button>
            </div>

            {aiError && (
              <div className="text-[11px] text-rose-400 bg-rose-500/10 border border-rose-500/30 rounded-lg p-2 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{aiError}</span>
              </div>
            )}
          </div>

          <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Film className="w-3.5 h-3.5 text-amber-400" /> Storyboard & Script Lines
              </h2>
              <button
                onClick={addBeat}
                className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 hover:bg-indigo-600/50 transition"
              >
                <Plus className="w-3 h-3" /> Add Beat
              </button>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1 font-medium">Video Title / Main Headline</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter title (Urdu / English)..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm font-medium text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Beats List */}
            <div className="space-y-3 max-h-[560px] overflow-y-auto pr-1">
              {beats.map((beat, idx) => (
                <div key={beat.id} className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/90 space-y-2.5 relative group">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      Beat #{beat.id}
                    </span>
                    <button
                      onClick={() => removeBeat(idx)}
                      className="text-slate-500 hover:text-rose-400 text-xs p-1"
                      title="Delete beat"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">Spoken Narration Text</label>
                    <textarea
                      value={beat.text}
                      onChange={(e) => updateBeat(idx, 'text', e.target.value)}
                      rows={2}
                      placeholder="Line spoken by voiceover (automatically timed)..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-indigo-500 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-0.5">Card Display Title</label>
                      <input
                        type="text"
                        value={beat.typed}
                        onChange={(e) => updateBeat(idx, 'typed', e.target.value)}
                        placeholder="e.g. قلعہ کہنہ ملتان"
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-0.5">Ink Stamp (Optional)</label>
                      <input
                        type="text"
                        value={beat.stamp || ''}
                        onChange={(e) => updateBeat(idx, 'stamp', e.target.value)}
                        placeholder="e.g. تاریخی ورثہ"
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Launch Button */}
            <div className="pt-2">
              <button
                onClick={handleDispatch}
                disabled={isDispatching}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 hover:from-amber-400 hover:via-rose-400 hover:to-indigo-500 text-white font-semibold text-sm shadow-xl shadow-rose-600/20 flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                {isDispatching ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Dispatching to GitHub Cloud...</span>
                  </>
                ) : (
                  <>
                    <CloudLightning className="w-4 h-4" />
                    <span>Render Video on GitHub Cloud</span>
                  </>
                )}
              </button>

              {dispatchMessage && (
                <div className={`mt-3 p-3 rounded-xl text-xs flex items-center gap-2 ${
                  dispatchMessage.type === 'success'
                    ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                    : 'bg-rose-500/10 text-rose-300 border border-rose-500/30'
                }`}>
                  {dispatchMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                  <span>{dispatchMessage.text}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Cloud Runs & Status Monitor */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-amber-400" /> Cloud Execution History
              </h2>
              <button
                onClick={fetchRuns}
                className="text-slate-400 hover:text-white p-1"
                title="Refresh runs"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingRuns ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {!githubToken ? (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs space-y-2">
                <div className="font-semibold flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" /> Token Required
                </div>
                <p className="text-[11px] leading-relaxed text-amber-200/80">
                  Click <strong>Settings</strong> to set your GitHub Token. This allows the dashboard to dispatch workflow renders and display live progress.
                </p>
                <button
                  onClick={() => setShowSettings(true)}
                  className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 text-xs font-medium"
                >
                  Configure Token
                </button>
              </div>
            ) : runs.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-xs">
                No recent runs found. Dispatch your first render!
              </div>
            ) : (
              <div className="space-y-2.5">
                {runs.map((run) => (
                  <div key={run.id} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-white truncate max-w-[160px]">
                        {run.display_title || run.name}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        run.status === 'completed' && run.conclusion === 'success'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : run.status === 'in_progress'
                          ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30 animate-pulse'
                          : run.conclusion === 'failure'
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {run.status === 'completed' ? run.conclusion : run.status}
                      </span>
                    </div>

                    <div className="text-[10px] text-slate-500 flex items-center justify-between pt-1">
                      <span>{new Date(run.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <a
                        href={run.html_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                      >
                        Logs <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Help Card */}
          <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/20 text-xs space-y-2">
            <div className="font-semibold text-indigo-300 flex items-center gap-1.5">
              <CloudLightning className="w-3.5 h-3.5 text-indigo-400" /> Free Cloud Compute
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Every video renders inside GitHub Cloud runners using Skia + FFmpeg and uploads straight to YouTube via your API token, saving all local resources and GitHub storage.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
