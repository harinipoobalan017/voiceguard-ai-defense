// src/App.jsx
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import VideoBackground from './components/VideoBackground';
import Home from './pages/Home';
import LiveCheck from './pages/LiveCheck';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import Contact from './pages/Contact';
import SignIn from './pages/SignIn';
import { X, AlertTriangle, Play, Shield } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center flex flex-col items-center gap-3">
          <AlertTriangle className="text-amber-400" size={32} />
          <h3 className="text-base font-bold text-white">Component Reload Needed</h3>
          <p className="text-xs text-zinc-400 max-w-sm">A minor render issue occurred. Click below to reload the view.</p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="px-4 py-2 bg-indigo-600 rounded-lg text-xs font-semibold text-white hover:bg-indigo-500 cursor-pointer"
          >
            Reset View
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [modalOpen, setModalOpen] = useState(false);

  const handleNavSelect = (key) => {
    setActiveTab(key);
    if (key !== 'home') {
      setModalOpen(true);
    } else {
      setModalOpen(false);
    }
  };

  const getModalTitle = () => {
    switch (activeTab) {
      case 'live': return { badge: "PLAYGROUND & ENGINE PIPELINE", title: "VoiceGuard Live Inspection Playground" };
      case 'dashboard': return { badge: "EXECUTIVE DASHBOARD", title: "System Health & Audit Log History" };
      case 'about': return { badge: "TECHNICAL SPECIFICATION", title: "Architecture & Acoustic Detection Algorithms" };
      case 'contact': return { badge: "DEVELOPER ACCESS", title: "Enterprise API Integration & Contact" };
      case 'signin': return { badge: "SECURE ACCESS", title: "Carrier Portal Sign In" };
      default: return { badge: "SOLUTION-2 PLATFORM", title: "Voice Clone Detection & Privacy Architecture" };
    }
  };

  const modalMeta = getModalTitle();

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black text-white font-sans">
      {/* Video Background */}
      <VideoBackground />

      {/* Page Container */}
      <div className="relative z-10 flex flex-col items-center justify-between w-full h-screen p-4 md:p-7 overflow-hidden">
        {/* Header / Navbar */}
        <Navbar activeTab={activeTab} setActiveTab={handleNavSelect} />

        {/* Single Viewport Hero Center */}
        <main className="flex-1 flex flex-col items-center justify-center text-center max-w-[960px] w-full py-4 px-4 my-auto">
          {/* Real-time Badge */}
          <div className="anim inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#18181b]/70 border border-white/20 backdrop-blur-md mb-6 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
            <span className="w-2 h-2 rounded-full bg-[#10b981] shadow-[0_0_8px_#10b981] animate-pulse"></span>
            <span className="text-[10px] sm:text-[11.5px] font-semibold tracking-wider text-zinc-200 uppercase font-sans">
              REAL-TIME AI VOICE CLONE & FRAUD DEFENSE
            </span>
          </div>

          {/* Headline in dot matrix / pixel display font */}
          <h1 className="headline anim text-white text-2xl sm:text-4xl md:text-5xl lg:text-[58px] font-display font-bold tracking-tight mb-5 select-none leading-[1.18]" style={{ '--d': '0.08s' }}>
            <span className="block drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]">AI Voice Deepfake &</span>
            <span className="block drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]">Authentication Defense</span>
          </h1>

          {/* Subtitle Description */}
          <p className="subhead anim text-zinc-300 text-xs sm:text-sm md:text-[14.5px] max-w-[720px] font-normal leading-relaxed opacity-85 mb-8 px-2" style={{ '--d': '0.18s' }}>
            VoiceGuard protects financial institutions, bank support desks, wire transfer approvals, and customer authentication calls from synthetic voice clones using client-side O(n) signal processing, dual-layer AI scoring, and out-of-band callback verification.
          </p>

          {/* Action Buttons */}
          <div className="cta-wrap anim flex flex-wrap items-center justify-center gap-3 sm:gap-4" style={{ '--d': '0.28s' }}>
            <button
              onClick={() => handleNavSelect('live')}
              className="inline-flex items-center gap-2.5 bg-white text-black font-semibold text-xs sm:text-sm px-6 py-3 rounded-full shadow-[0_0_25px_rgba(255,255,255,0.35)] hover:scale-105 hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              <Play size={13} className="fill-black text-black" />
              <span>Test Live Detection</span>
            </button>
            <button
              onClick={() => handleNavSelect('about')}
              className="inline-flex items-center gap-2.5 bg-[#1f1f23]/80 hover:bg-[#2a2a30] text-[#e4e4e7] border border-white/15 font-medium text-xs sm:text-sm px-6 py-3 rounded-full backdrop-blur-md shadow-lg hover:scale-105 hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              <Shield size={14} className="text-zinc-300" />
              <span>How It Works</span>
            </button>
          </div>
        </main>
      </div>

      {/* React Page Modals System */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className={`w-full ${activeTab === 'signin' ? 'max-w-md' : 'max-w-[1120px]'} max-h-[92vh] bg-[#121319] border border-white/12 rounded-2xl shadow-2xl flex flex-col overflow-hidden`}>
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-white/8 flex items-center justify-between">
              <div>
                <span className="inline-block bg-white/8 border border-white/15 text-zinc-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-1">
                  {modalMeta.badge}
                </span>
                <h2 className="text-lg font-semibold text-white tracking-tight">{modalMeta.title}</h2>
              </div>
              <button
                onClick={() => { setModalOpen(false); setActiveTab('home'); }}
                className="w-8 h-8 rounded-full bg-white/5 border border-white/10 text-zinc-400 grid place-items-center hover:bg-white/15 hover:text-white transition-all cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Content Body */}
            <div className="flex-1 overflow-y-auto p-6">
              <ErrorBoundary>
                {activeTab === 'live' && <LiveCheck />}
                {activeTab === 'dashboard' && <Dashboard />}
                {activeTab === 'about' && <About />}
                {activeTab === 'contact' && <Contact />}
                {activeTab === 'signin' && <SignIn closeModal={() => { setModalOpen(false); setActiveTab('home'); }} />}
              </ErrorBoundary>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
