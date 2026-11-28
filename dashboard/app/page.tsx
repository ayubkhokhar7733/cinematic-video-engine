'use client';

import React, { useState, useEffect } from 'react';
import {
  Film,
  Sparkles,
  Play,
  Tv,
  Smartphone,
  Youtube,
  Settings,
  Plus,
  Trash2,
  RefreshCw,
  CheckCircle2,
  Clock,
  AlertCircle,
  Wand2,
  Layers,
  Sliders,
  Check
} from 'lucide-react';

interface BeatLine {
  id: number;
  text: string;
  spoken: string;
  typed: string;
  stamp?: string;
}

const LOOKS = [
  { id: 'wall', name: 'Evidence Wall', desc: 'Warm corkboard texture, documentary & history' },
  { id: 'slate', name: 'Cool Slate', desc: 'Steel blue-grey board, investigative & geopolitical' },
  { id: 'charcoal', name: 'Pure Charcoal', desc: 'High-contrast neutral backdrop for artwork' },
  { id: 'paper', name: 'Paper Desk', desc: 'Warm parchment paper, ancient civilizations & literature' },
  { id: 'studio', name: 'Clean Studio', desc: 'Minimalist studio card layout, technical explainers' },
  { id: 'blueprint', name: 'Blueprint', desc: 'Technical drafting grid, ancient engineering & science' },
  { id: 'night', name: 'Deep Space', desc: 'Subtle astronomical theme, astrophysics & mysteries' }
];

const VOICES = [
  { id: 'Charon', label: 'Gemini: Charon (Deep Mature Documentary)', provider: 'gemini', lang: 'Universal' },
  { id: 'Fenrir', label: 'Gemini: Fenrir (Commanding & Resonant)', provider: 'gemini', lang: 'Universal' },
  { id: 'Orus', label: 'Gemini: Orus (Steady & Authoritative)', provider: 'gemini', lang: 'Universal' },
  { id: 'Kore', label: 'Gemini: Kore (Clear Narrative)', provider: 'gemini', lang: 'Universal' },
  { id: 'Aoede', label: 'Gemini: Aoede (Sophisticated Storyteller)', provider: 'gemini', lang: 'Universal' },
  { id: 'ur-PK-AsadNeural', label: 'Neural: Urdu - Asad (Classic Urdu)', provider: 'edge', lang: 'Urdu' },
  { id: 'ur-PK-UzmaNeural', label: 'Neural: Urdu - Uzma (Narrative)', provider: 'edge', lang: 'Urdu' },
  { id: 'ur-IN-SalmanNeural', label: 'Neural: Urdu - Salman (Expressive)', provider: 'edge', lang: 'Urdu' },
  { id: 'en-US-ChristopherNeural', label: 'Neural: English - Christopher (Documentary)', provider: 'edge', lang: 'English' },
  { id: 'en-US-JennyNeural', label: 'Neural: English - Jenny (Natural)', provider: 'edge', lang: 'English' },
  { id: 'en-US-GuyNeural', label: 'Neural: English - Guy (News Anchor)', provider: 'edge', lang: 'English' }
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
  const [resolution, setResolution] = useState<'720p' | '1080p'>('1080p');
  const [uploadYoutube, setUploadYoutube] = useState(true);
  const [privacy, setPrivacy] = useState<'unlisted' | 'private' | 'public'>('unlisted');
  const [beats, setBeats] = useState<BeatLine[]>(PRESETS.multan.beats);

  // AI Story Generation State
  const [aiTopic, setAiTopic] = useState('');
  const [aiLanguage, setAiLanguage] = useState<'urdu' | 'english'>('english');
  const [aiDuration, setAiDuration] = useState<'short' | 'medium' | 'long' | 'deep' | 'feature'>('medium');
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
          geminiApiKey,
          groqApiKey
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate script');
      }

      if (data.title) setTitle(data.title);
      if (data.beats && Array.isArray(data.beats)) {
        setBeats(data.beats);
      }
      if (aiLanguage === 'urdu') {
        setVoice('ur-PK-AsadNeural');
        setTtsProvider('edge');
      } else {
        setVoice('Charon');
        setTtsProvider('gemini');
      }
    } catch (err: any) {
      setAiError(err.message || 'An error occurred during story generation');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const addBeat = () => {
    const nextId = beats.length > 0 ? Math.max(...beats.map(b => b.id)) + 1 : 1;
    setBeats([...beats, { id: nextId, text: '', spoken: '', typed: '', stamp: '' }]);
  };

  const removeBeat = (index: number) => {
    if (beats.length <= 1) return;
    setBeats(beats.filter((_, i) => i !== index));
  };

  const updateBeat = (index: number, field: keyof BeatLine, val: string) => {
    const updated = [...beats];
    updated[index] = { ...updated[index], [field]: val };
    if (field === 'text' && !updated[index].spoken) {
      updated[index].spoken = val;
    }
    setBeats(updated);
  };

  const applyPreset = (key: keyof typeof PRESETS) => {
    const p = PRESETS[key];
    setTitle(p.title);
    setLook(p.look);
    setVoice(p.voice);
    const found = VOICES.find(v => v.id === p.voice);
    if (found) setTtsProvider(found.provider as any);
    setBeats(p.beats);
  };

  const handleDispatch = async () => {
    setIsDispatching(true);
    setDispatchMessage(null);

    const payload = {
      title,
      aspect_ratio: aspectRatio,
      resolution,
      look,
      voice,
      tts_provider: ttsProvider,
      upload_youtube: uploadYoutube,
      privacy_status: privacy,
      beats: beats.map(b => ({
        id: b.id,
        text: b.text,
        spoken: b.spoken || b.text,
        typed: b.typed || b.text.slice(0, 20),
        stamp: b.stamp || ''
      }))
    };

    try {
      const res = await fetch('/api/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: githubToken,
          repo: githubRepo,
          payload
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to dispatch render job');
      }

      setDispatchMessage({ type: 'success', text: 'Render job queued successfully. Studio cluster is processing.' });
      setTimeout(fetchRuns, 2000);
    } catch (err: any) {
      setDispatchMessage({ type: 'error', text: err.message || 'Dispatch failed' });
    } finally {
      setIsDispatching(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Top Professional Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center font-semibold text-sm shadow-sm">
              <Film className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-base text-slate-900 tracking-tight">Studio Cloud</span>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Cluster Online
                </span>
              </div>
              <p className="text-xs text-slate-500">Documentary & Narrative Video Production Suite</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
              <button
                onClick={() => applyPreset('multan')}
                className="px-3 py-1 rounded-md text-slate-600 hover:text-slate-900 hover:bg-white transition"
              >
                Preset: قدیم ملتان
              </button>
              <button
                onClick={() => applyPreset('explainer')}
                className="px-3 py-1 rounded-md text-slate-600 hover:text-slate-900 hover:bg-white transition"
              >
                Preset: Coffee Explainer
              </button>
            </div>

            <button
              onClick={() => setShowSettings(true)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition"
              title="Settings & Credentials"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-semibold text-sm text-slate-900 flex items-center gap-2">
                <Settings className="w-4 h-4 text-slate-600" /> Production Credentials
              </h3>
              <button
                onClick={() => setShowSettings(false)}
                className="text-slate-400 hover:text-slate-600 text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 mb-1 font-medium">Gemini API Key</label>
                <input
                  type="password"
                  value={geminiApiKey}
                  onChange={(e) => setGeminiApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-400 font-mono"
                />
                <p className="text-[11px] text-slate-500 mt-1">Powers Gemini 3.8 Flash voiceover & script generation.</p>
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-medium">Alternative Script Key (LLaMA 3.3)</label>
                <input
                  type="password"
                  value={groqApiKey}
                  onChange={(e) => setGroqApiKey(e.target.value)}
                  placeholder="gsk_..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-medium">Target Production Repository</label>
                <input
                  type="text"
                  value={githubRepo}
                  onChange={(e) => setGithubRepo(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-medium">Access Token</label>
                <input
                  type="password"
                  value={githubToken}
                  onChange={(e) => setGithubToken(e.target.value)}
                  placeholder="ghp_..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-400 font-mono"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  onClick={() => setShowSettings(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={saveSettings}
                  className="px-4 py-1.5 rounded-lg bg-slate-900 text-white font-medium hover:bg-slate-800"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Studio Body */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Configuration Controls */}
        <section className="lg:col-span-4 space-y-5">
          
          {/* Format & Viewport */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <h2 className="text-xs font-semibold text-slate-900 flex items-center gap-1.5 uppercase tracking-wide">
              <Sliders className="w-3.5 h-3.5 text-slate-500" /> Format & Audio
            </h2>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => setAspectRatio('16:9')}
                className={`flex items-center gap-2.5 p-3 rounded-lg border text-left transition ${
                  aspectRatio === '16:9'
                    ? 'border-slate-900 bg-slate-900 text-white'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                }`}
              >
                <Tv className={`w-4 h-4 ${aspectRatio === '16:9' ? 'text-white' : 'text-slate-500'}`} />
                <div>
                  <div className="font-semibold text-xs leading-none">16:9 Landscape</div>
                  <div className={`text-[10px] mt-1 ${aspectRatio === '16:9' ? 'text-slate-300' : 'text-slate-400'}`}>Standard YouTube</div>
                </div>
              </button>

              <button
                onClick={() => setAspectRatio('9:16')}
                className={`flex items-center gap-2.5 p-3 rounded-lg border text-left transition ${
                  aspectRatio === '9:16'
                    ? 'border-slate-900 bg-slate-900 text-white'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                }`}
              >
                <Smartphone className={`w-4 h-4 ${aspectRatio === '9:16' ? 'text-white' : 'text-slate-500'}`} />
                <div>
                  <div className="font-semibold text-xs leading-none">9:16 Vertical</div>
                  <div className={`text-[10px] mt-1 ${aspectRatio === '9:16' ? 'text-slate-300' : 'text-slate-400'}`}>Shorts / Reels</div>
                </div>
              </button>
            </div>

            <div className="space-y-3 pt-1">
              <div>
                <label className="text-[11px] font-medium text-slate-600 block mb-1">Resolution</label>
                <select
                  value={resolution}
                  onChange={(e: any) => setResolution(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-slate-400 font-medium"
                >
                  <option value="1080p">1080p Full HD (Production Master)</option>
                  <option value="720p">720p HD (Quick Render)</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-medium text-slate-600">Voiceover Talent & Engine</label>
                  <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                    {ttsProvider === 'gemini' ? 'Gemini 3.8 Pro' : 'Neural Speech'}
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
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-slate-400"
                >
                  <optgroup label="Studio Voiceover (Documentary & Narration)">
                    {VOICES.filter(v => v.provider === 'gemini').map((v) => (
                      <option key={v.id} value={v.id}>{v.label}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Neural Spoken (Multilingual)">
                    {VOICES.filter(v => v.provider === 'edge').map((v) => (
                      <option key={v.id} value={v.id}>{v.label}</option>
                    ))}
                  </optgroup>
                </select>
              </div>
            </div>
          </div>

          {/* Visual Presentation Styles */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
            <h2 className="text-xs font-semibold text-slate-900 flex items-center gap-1.5 uppercase tracking-wide">
              <Layers className="w-3.5 h-3.5 text-slate-500" /> Visual Theme ({LOOKS.length} Presets)
            </h2>

            <div className="space-y-1.5 max-h-[290px] overflow-y-auto pr-1">
              {LOOKS.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setLook(item.id)}
                  className={`p-2.5 rounded-lg border cursor-pointer transition flex items-center justify-between ${
                    look === item.id
                      ? 'border-slate-900 bg-slate-900 text-white'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div>
                    <div className="font-semibold text-xs leading-none">
                      {item.name}
                    </div>
                    <div className={`text-[11px] mt-1 ${look === item.id ? 'text-slate-300' : 'text-slate-500'}`}>
                      {item.desc}
                    </div>
                  </div>
                  {look === item.id && (
                    <div className="w-5 h-5 rounded-full bg-white text-slate-900 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Direct Publishing Controls */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
            <h2 className="text-xs font-semibold text-slate-900 flex items-center gap-1.5 uppercase tracking-wide">
              <Youtube className="w-3.5 h-3.5 text-red-600" /> Publishing Destination
            </h2>

            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div>
                <div className="text-xs font-semibold text-slate-900">Publish Directly to YouTube</div>
                <div className="text-[11px] text-slate-500">Auto-uploads upon render completion</div>
              </div>
              <input
                type="checkbox"
                checked={uploadYoutube}
                onChange={(e) => setUploadYoutube(e.target.checked)}
                className="w-4 h-4 rounded text-slate-900 focus:ring-0 cursor-pointer"
              />
            </div>

            {uploadYoutube && (
              <div>
                <label className="text-[11px] font-medium text-slate-600 block mb-1">Privacy Tier</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['unlisted', 'private', 'public'] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPrivacy(p)}
                      className={`text-xs py-1.5 rounded-lg border capitalize transition font-medium ${
                        privacy === p
                          ? 'border-slate-900 bg-slate-900 text-white'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Middle Column: Script Generation & Storyboard */}
        <section className="lg:col-span-5 space-y-5">
          
          {/* AI Director Bar */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3.5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h2 className="text-xs font-semibold text-slate-900 flex items-center gap-1.5 uppercase tracking-wide">
                <Wand2 className="w-3.5 h-3.5 text-slate-700" /> Script Director
              </h2>
              
              <div className="flex items-center gap-2">
                {/* Language selector */}
                <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
                  <button
                    onClick={() => setAiLanguage('english')}
                    className={`px-2.5 py-1 rounded-md font-medium transition ${aiLanguage === 'english' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => setAiLanguage('urdu')}
                    className={`px-2.5 py-1 rounded-md font-medium transition ${aiLanguage === 'urdu' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    اردو
                  </button>
                </div>

                {/* Duration selector */}
                <select
                  value={aiDuration}
                  onChange={(e) => setAiDuration(e.target.value as any)}
                  className="bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-700 focus:outline-none focus:border-slate-400 font-medium"
                >
                  <option value="short">Teaser (~1 min)</option>
                  <option value="medium">Standard (~3-4 min)</option>
                  <option value="long">Deep Dive (~6-8 min)</option>
                  <option value="deep">Extended (~10-12 min)</option>
                  <option value="feature">Full Feature (~15-20 min)</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={aiTopic}
                onChange={(e) => setAiTopic(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerateStory()}
                placeholder={aiLanguage === 'urdu' ? "موضوع درج کریں (مثال: موہنجوداڑو کا راز، سلطنت عثمانیہ، سقوطِ بغداد)..." : "Enter topic (e.g. Göbekli Tepe 12,000 Year Mystery, Ancient Acoustics, Antikythera)..."}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
              />
              <button
                onClick={handleGenerateStory}
                disabled={isGeneratingAi || !aiTopic.trim()}
                className="px-4 py-2 rounded-lg bg-slate-900 text-white font-medium text-xs hover:bg-slate-800 disabled:opacity-50 transition flex items-center gap-1.5 shrink-0"
              >
                {isGeneratingAi ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Authoring...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Generate Storyboard</span>
                  </>
                )}
              </button>
            </div>

            {aiError && (
              <div className="text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-lg p-2.5 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{aiError}</span>
              </div>
            )}
          </div>

          {/* Storyboard List */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-semibold text-slate-900 flex items-center gap-1.5 uppercase tracking-wide">
                <Film className="w-3.5 h-3.5 text-slate-500" /> Storyboard Sequence ({beats.length} Beats)
              </h2>
              <button
                onClick={addBeat}
                className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium transition"
              >
                <Plus className="w-3 h-3" /> Add Beat
              </button>
            </div>

            <div>
              <label className="text-[11px] font-medium text-slate-600 block mb-1">Production Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Video Title..."
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-400"
              />
            </div>

            {/* Beats Container */}
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {beats.map((beat, idx) => (
                <div key={beat.id} className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-slate-600">
                      Beat #{beat.id}
                    </span>
                    <button
                      onClick={() => removeBeat(idx)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                      title="Delete beat"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div>
                    <label className="text-[10px] font-medium text-slate-500 block mb-0.5">Spoken Narration</label>
                    <textarea
                      value={beat.text}
                      onChange={(e) => updateBeat(idx, 'text', e.target.value)}
                      rows={2}
                      placeholder="Spoken narration for this frame..."
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-400 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-medium text-slate-500 block mb-0.5">Card Heading</label>
                      <input
                        type="text"
                        value={beat.typed}
                        onChange={(e) => updateBeat(idx, 'typed', e.target.value)}
                        placeholder="On-screen title"
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-400"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-medium text-slate-500 block mb-0.5">Stamp Badge</label>
                      <input
                        type="text"
                        value={beat.stamp || ''}
                        onChange={(e) => updateBeat(idx, 'stamp', e.target.value)}
                        placeholder="e.g. 12,000 BCE"
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-400"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Render Button */}
            <div className="pt-2">
              <button
                onClick={handleDispatch}
                disabled={isDispatching}
                className="w-full py-3 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs tracking-wide uppercase transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isDispatching ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Queueing Production...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" />
                    <span>Render & Publish Production</span>
                  </>
                )}
              </button>

              {dispatchMessage && (
                <div className={`mt-3 p-3 rounded-lg text-xs flex items-center gap-2 ${
                  dispatchMessage.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}>
                  {dispatchMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" /> : <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />}
                  <span>{dispatchMessage.text}</span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Right Column: Status & Production History */}
        <section className="lg:col-span-3 space-y-5">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-semibold text-slate-900 flex items-center gap-1.5 uppercase tracking-wide">
                <Clock className="w-3.5 h-3.5 text-slate-500" /> Production History
              </h2>
              <button
                onClick={fetchRuns}
                className="text-slate-400 hover:text-slate-700 p-1"
                title="Refresh history"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingRuns ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {!githubToken ? (
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-2">
                <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-slate-500" /> Authorization Required
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Configure your access credentials in Settings to sync live production jobs.
                </p>
                <button
                  onClick={() => setShowSettings(true)}
                  className="px-3 py-1 rounded-md bg-slate-900 text-white text-xs font-medium"
                >
                  Configure Settings
                </button>
              </div>
            ) : runs.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                No recent production runs found.
              </div>
            ) : (
              <div className="space-y-2">
                {runs.map((run) => (
                  <div key={run.id} className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-xs text-slate-900 truncate">
                        {run.display_title || run.name}
                      </span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium shrink-0 ${
                        run.status === 'completed' && run.conclusion === 'success'
                          ? 'bg-emerald-100 text-emerald-800'
                          : run.status === 'in_progress'
                          ? 'bg-amber-100 text-amber-800'
                          : run.conclusion === 'failure'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-slate-200 text-slate-700'
                      }`}>
                        {run.status === 'completed' ? run.conclusion : run.status}
                      </span>
                    </div>

                    <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1">
                      <span>{new Date(run.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <span className="font-mono text-slate-500">Job #{run.id.toString().slice(-4)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-xs space-y-1.5 text-slate-600">
            <div className="font-semibold text-slate-900">Enterprise Cloud Rendering</div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Videos render on dedicated high-performance hardware, compiling typography, 60 FPS motion animations, and audio mix before streaming to YouTube.
            </p>
          </div>
        </section>

      </main>
    </div>
  );
}
