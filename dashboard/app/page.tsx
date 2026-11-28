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
  Clock,
  Layers,
  Sliders,
  ChevronDown,
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
  { id: 'Charon', label: 'Charon — Mature Documentary (Gemini 3.8)', provider: 'gemini', lang: 'Universal' },
  { id: 'Fenrir', label: 'Fenrir — Commanding & Deep (Gemini 3.8)', provider: 'gemini', lang: 'Universal' },
  { id: 'Orus', label: 'Orus — Steady & Authoritative (Gemini 3.8)', provider: 'gemini', lang: 'Universal' },
  { id: 'Kore', label: 'Kore — Clear Narrative (Gemini 3.8)', provider: 'gemini', lang: 'Universal' },
  { id: 'Aoede', label: 'Aoede — Sophisticated Storyteller (Gemini 3.8)', provider: 'gemini', lang: 'Universal' },
  { id: 'ur-PK-AsadNeural', label: 'Asad — Classic Urdu (Neural)', provider: 'edge', lang: 'Urdu' },
  { id: 'ur-PK-UzmaNeural', label: 'Uzma — Narrative Urdu (Neural)', provider: 'edge', lang: 'Urdu' },
  { id: 'ur-IN-SalmanNeural', label: 'Salman — Expressive Urdu (Neural)', provider: 'edge', lang: 'Urdu' },
  { id: 'en-US-ChristopherNeural', label: 'Christopher — Documentary (Neural)', provider: 'edge', lang: 'English' },
  { id: 'en-US-JennyNeural', label: 'Jenny — Natural Narrative (Neural)', provider: 'edge', lang: 'English' },
  { id: 'en-US-GuyNeural', label: 'Guy — News Anchor (Neural)', provider: 'edge', lang: 'English' }
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

  // Script Generator State
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

      setDispatchMessage({ type: 'success', text: 'Render job queued. Compilation in progress.' });
      setTimeout(fetchRuns, 2000);
    } catch (err: any) {
      setDispatchMessage({ type: 'error', text: err.message || 'Dispatch failed' });
    } finally {
      setIsDispatching(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-neutral-900 font-sans">
      
      {/* Utility Toolbar */}
      <header className="border-b border-neutral-200 bg-neutral-50 px-6 py-2.5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-neutral-900 rounded text-white flex items-center justify-center font-bold text-[10px]">
              C
            </div>
            <span className="font-semibold text-sm tracking-tight text-neutral-900">Cinematic Studio</span>
          </div>

          <div className="h-4 w-px bg-neutral-300" />

          {/* Quick Preset Selector */}
          <div className="flex items-center gap-2">
            <span className="text-neutral-500 font-medium">Preset:</span>
            <button
              onClick={() => applyPreset('multan')}
              className="px-2 py-1 rounded bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-100 font-medium"
            >
              قدیم ملتان
            </button>
            <button
              onClick={() => applyPreset('explainer')}
              className="px-2 py-1 rounded bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-100 font-medium"
            >
              Coffee Explainer
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowSettings(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-100 font-medium"
          >
            <Settings className="w-3.5 h-3.5 text-neutral-500" />
            <span>Credentials</span>
          </button>
        </div>
      </header>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-neutral-300 rounded max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <h3 className="font-semibold text-sm text-neutral-900">Production Settings</h3>
              <button
                onClick={() => setShowSettings(false)}
                className="text-neutral-400 hover:text-neutral-700 text-base"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-700 mb-1 font-medium">Gemini API Key</label>
                <input
                  type="password"
                  value={geminiApiKey}
                  onChange={(e) => setGeminiApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full bg-neutral-50 border border-neutral-300 rounded px-3 py-1.5 text-neutral-900 font-mono focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div>
                <label className="block text-neutral-700 mb-1 font-medium">Alternative Script Key (LLaMA 3.3)</label>
                <input
                  type="password"
                  value={groqApiKey}
                  onChange={(e) => setGroqApiKey(e.target.value)}
                  placeholder="gsk_..."
                  className="w-full bg-neutral-50 border border-neutral-300 rounded px-3 py-1.5 text-neutral-900 font-mono focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div>
                <label className="block text-neutral-700 mb-1 font-medium">Repository</label>
                <input
                  type="text"
                  value={githubRepo}
                  onChange={(e) => setGithubRepo(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-300 rounded px-3 py-1.5 text-neutral-900 font-mono focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div>
                <label className="block text-neutral-700 mb-1 font-medium">Access Token</label>
                <input
                  type="password"
                  value={githubToken}
                  onChange={(e) => setGithubToken(e.target.value)}
                  placeholder="ghp_..."
                  className="w-full bg-neutral-50 border border-neutral-300 rounded px-3 py-1.5 text-neutral-900 font-mono focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-neutral-200">
                <button
                  onClick={() => setShowSettings(false)}
                  className="px-3 py-1.5 rounded border border-neutral-300 text-neutral-700 hover:bg-neutral-100 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={saveSettings}
                  className="px-4 py-1.5 rounded bg-neutral-900 text-white font-medium hover:bg-neutral-800"
                >
                  Save Credentials
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Workspace (Direct Dividers, No Nested Box Padding) */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-neutral-200">
        
        {/* Left Column: Properties & Look (4 Cols) */}
        <section className="lg:col-span-4 p-6 space-y-6">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-4">
              Format & Output Specs
            </h2>

            {/* Segmented Aspect Ratio Control */}
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-neutral-700 block mb-1.5">Aspect Ratio</label>
                <div className="grid grid-cols-2 p-1 bg-neutral-100 rounded border border-neutral-200 gap-1 text-xs">
                  <button
                    onClick={() => setAspectRatio('16:9')}
                    className={`py-1.5 rounded font-medium transition ${
                      aspectRatio === '16:9'
                        ? 'bg-white text-neutral-900 shadow-sm'
                        : 'text-neutral-600 hover:text-neutral-900'
                    }`}
                  >
                    16:9 (Landscape)
                  </button>
                  <button
                    onClick={() => setAspectRatio('9:16')}
                    className={`py-1.5 rounded font-medium transition ${
                      aspectRatio === '9:16'
                        ? 'bg-white text-neutral-900 shadow-sm'
                        : 'text-neutral-600 hover:text-neutral-900'
                    }`}
                  >
                    9:16 (Vertical)
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-neutral-700 block mb-1">Resolution</label>
                  <select
                    value={resolution}
                    onChange={(e: any) => setResolution(e.target.value)}
                    className="w-full bg-white border border-neutral-300 rounded px-2.5 py-1.5 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
                  >
                    <option value="1080p">1080p (Full HD)</option>
                    <option value="720p">720p (HD Fast)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-neutral-700 block mb-1">Publish Destination</label>
                  <select
                    value={uploadYoutube ? privacy : 'none'}
                    onChange={(e) => {
                      if (e.target.value === 'none') {
                        setUploadYoutube(false);
                      } else {
                        setUploadYoutube(true);
                        setPrivacy(e.target.value as any);
                      }
                    }}
                    className="w-full bg-white border border-neutral-300 rounded px-2.5 py-1.5 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
                  >
                    <option value="unlisted">YouTube (Unlisted)</option>
                    <option value="private">YouTube (Private)</option>
                    <option value="public">YouTube (Public)</option>
                    <option value="none">Local / Render Only</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-neutral-200">
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-3">
              Voice Talent
            </h2>
            <select
              value={voice}
              onChange={(e) => {
                const selected = e.target.value;
                setVoice(selected);
                const found = VOICES.find(v => v.id === selected);
                if (found) setTtsProvider(found.provider as any);
              }}
              className="w-full bg-white border border-neutral-300 rounded px-2.5 py-2 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
            >
              <optgroup label="Gemini 3.8 Studio Voices">
                {VOICES.filter(v => v.provider === 'gemini').map((v) => (
                  <option key={v.id} value={v.id}>{v.label}</option>
                ))}
              </optgroup>
              <optgroup label="Neural Spoken Voices">
                {VOICES.filter(v => v.provider === 'edge').map((v) => (
                  <option key={v.id} value={v.id}>{v.label}</option>
                ))}
              </optgroup>
            </select>
          </div>

          <div className="pt-2 border-t border-neutral-200">
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-3">
              Visual Board Style
            </h2>
            <div className="space-y-1">
              {LOOKS.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setLook(item.id)}
                  className={`p-2.5 rounded cursor-pointer transition flex items-center justify-between text-xs ${
                    look === item.id
                      ? 'bg-neutral-100 text-neutral-900 font-semibold'
                      : 'text-neutral-600 hover:bg-neutral-50'
                  }`}
                >
                  <div>
                    <div>{item.name}</div>
                    <div className="text-[11px] text-neutral-500 font-normal">{item.desc}</div>
                  </div>
                  {look === item.id && (
                    <div className="w-2 h-2 rounded-full bg-neutral-900 shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Center Column: Script & Storyboard Editor (5 Cols) */}
        <section className="lg:col-span-5 p-6 space-y-6">
          
          {/* Script Generation Input */}
          <div className="space-y-3 pb-6 border-b border-neutral-200">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                Script Director
              </label>

              <div className="flex items-center gap-2">
                <select
                  value={aiLanguage}
                  onChange={(e) => setAiLanguage(e.target.value as any)}
                  className="bg-neutral-100 border border-neutral-200 rounded px-2 py-1 text-xs text-neutral-800 font-medium"
                >
                  <option value="english">English</option>
                  <option value="urdu">اردو (Urdu)</option>
                </select>

                <select
                  value={aiDuration}
                  onChange={(e) => setAiDuration(e.target.value as any)}
                  className="bg-neutral-100 border border-neutral-200 rounded px-2 py-1 text-xs text-neutral-800 font-medium"
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
                placeholder={aiLanguage === 'urdu' ? "موضوع درج کریں (مثال: موہنجوداڑو، سقوطِ بغداد)..." : "Topic (e.g. Göbekli Tepe 12,000 Year Mystery)..."}
                className="flex-1 bg-white border border-neutral-300 rounded px-3 py-1.5 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
              />
              <button
                onClick={handleGenerateStory}
                disabled={isGeneratingAi || !aiTopic.trim()}
                className="px-3.5 py-1.5 rounded bg-neutral-900 text-white font-medium text-xs hover:bg-neutral-800 disabled:opacity-50 transition"
              >
                {isGeneratingAi ? 'Writing...' : 'Generate Script'}
              </button>
            </div>

            {aiError && (
              <div className="text-xs text-red-600 bg-red-50 p-2 rounded border border-red-200">
                {aiError}
              </div>
            )}
          </div>

          {/* Storyboard Beats Editor */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 block mb-1">
                  Video Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-base font-semibold text-neutral-900 border-b border-neutral-200 focus:border-neutral-900 focus:outline-none w-full bg-transparent py-0.5"
                />
              </div>

              <button
                onClick={addBeat}
                className="flex items-center gap-1 text-xs px-2.5 py-1 rounded border border-neutral-300 text-neutral-700 hover:bg-neutral-50 font-medium"
              >
                <Plus className="w-3 h-3" /> Add Beat
              </button>
            </div>

            {/* Beats Sequence List */}
            <div className="space-y-4 max-h-[550px] overflow-y-auto pr-2 divide-y divide-neutral-100">
              {beats.map((beat, idx) => (
                <div key={beat.id} className="pt-3 first:pt-0 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-neutral-400 font-medium">#{String(beat.id).padStart(2, '0')}</span>
                    <button
                      onClick={() => removeBeat(idx)}
                      className="text-neutral-400 hover:text-red-600"
                      title="Remove beat"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div>
                    <textarea
                      value={beat.text}
                      onChange={(e) => updateBeat(idx, 'text', e.target.value)}
                      rows={2}
                      placeholder="Narration..."
                      className="w-full bg-neutral-50 border border-neutral-200 rounded p-2 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900 resize-none font-sans"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <input
                      type="text"
                      value={beat.typed}
                      onChange={(e) => updateBeat(idx, 'typed', e.target.value)}
                      placeholder="Card Title"
                      className="w-full bg-white border border-neutral-200 rounded px-2 py-1 text-neutral-800 focus:outline-none focus:border-neutral-900"
                    />
                    <input
                      type="text"
                      value={beat.stamp || ''}
                      onChange={(e) => updateBeat(idx, 'stamp', e.target.value)}
                      placeholder="Stamp Badge (Optional)"
                      className="w-full bg-white border border-neutral-200 rounded px-2 py-1 text-neutral-800 focus:outline-none focus:border-neutral-900"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Render Button */}
            <div className="pt-4 border-t border-neutral-200">
              <button
                onClick={handleDispatch}
                disabled={isDispatching}
                className="w-full py-2.5 rounded bg-neutral-900 hover:bg-neutral-800 text-white font-medium text-xs transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isDispatching ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Queueing Render...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Render & Publish Video</span>
                  </>
                )}
              </button>

              {dispatchMessage && (
                <div className={`mt-2 p-2 rounded text-xs ${
                  dispatchMessage.type === 'success'
                    ? 'bg-neutral-100 text-neutral-800 border border-neutral-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  {dispatchMessage.text}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Right Column: Execution History (3 Cols) */}
        <section className="lg:col-span-3 p-6 space-y-4 bg-neutral-50/50">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              Recent Activity
            </h2>
            <button
              onClick={fetchRuns}
              className="text-neutral-400 hover:text-neutral-700 p-1"
              title="Refresh"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingRuns ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {!githubToken ? (
            <div className="text-xs text-neutral-500 leading-relaxed">
              Token not configured. Add credentials in Settings to sync history.
            </div>
          ) : runs.length === 0 ? (
            <div className="text-xs text-neutral-400">
              No recent jobs found.
            </div>
          ) : (
            <div className="space-y-2">
              {runs.map((run) => (
                <div key={run.id} className="p-2.5 rounded border border-neutral-200 bg-white space-y-1 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-neutral-900 truncate">
                      {run.display_title || run.name}
                    </span>
                    <span className={`text-[10px] font-mono px-1 rounded ${
                      run.status === 'completed' && run.conclusion === 'success'
                        ? 'bg-neutral-100 text-neutral-700 font-semibold'
                        : run.status === 'in_progress'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-red-50 text-red-700'
                    }`}>
                      {run.status === 'completed' ? run.conclusion : run.status}
                    </span>
                  </div>

                  <div className="text-[10px] text-neutral-400 flex items-center justify-between">
                    <span>{new Date(run.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <span className="font-mono text-neutral-400">#{run.id.toString().slice(-4)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </main>
    </div>
  );
}
