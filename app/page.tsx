'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Import our new cleanly separated component parts
import BackgroundEffects from '@/components/BackgroundEffects';
import HeroSection from '@/components/HeroSection';
import WorkspaceSection from '@/components/WorkspaceSection';
import EventsSection from '@/components/EventsSection';
import FooterSection from '@/components/FooterSection';
import GlobalModals from '@/components/GlobalModals';
import ChatModal from '@/components/ChatModal';

export default function Home() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const isLight = theme === 'light';
  
  const [isCmdOpen, setIsCmdOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  // --- CMD+K & ESCAPE LISTENER ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsCmdOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsCmdOpen(false);
        setIsPrivacyOpen(false);
        setSelectedEvent(null);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <div className={`min-h-screen w-full flex flex-col items-center transition-colors duration-500 ease-out relative overflow-hidden scroll-smooth ${isLight ? 'bg-[#f8fafc]' : 'bg-[#020617]'}`}>
        
        {/* FILE 1: CANVAS & BACKGROUNDS */}
        <BackgroundEffects isLight={isLight} />

        {/* FLOATING THEME TOGGLE BUTTON */}
        <motion.button 
          initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
          onClick={() => setTheme(isLight ? 'dark' : 'light')}
          className={`fixed top-4 right-4 md:top-6 md:right-6 z-50 w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 shadow-lg backdrop-blur-md ${isLight ? 'bg-white/80 border-slate-200 text-slate-800 hover:shadow-indigo-500/20' : 'bg-white/5 border-white/10 text-white hover:shadow-cyan-500/20'}`}
        >
          <i className={`fa-solid ${isLight ? 'fa-moon text-indigo-600' : 'fa-sun text-yellow-400'} text-xl`}></i>
        </motion.button>

        {/* MAIN PAGE WRAPPER */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full flex flex-col items-center relative z-10 overflow-x-hidden">
          
          {/* FILE 2: HERO & STATS */}
          <HeroSection isLight={isLight} />

          {/* FILE 3: BENTO WORKSPACE */}
          <WorkspaceSection isLight={isLight} />

          {/* FILE 4: EVENTS TIMELINE */}
          <EventsSection isLight={isLight} setSelectedEvent={setSelectedEvent} />

          {/* FILE 5: FOOTER */}
          <FooterSection isLight={isLight} setIsPrivacyOpen={setIsPrivacyOpen} />

          {/* CHAT WIDGET */}
          <ChatModal isLight={isLight} />

        </motion.div>
      </div> 
      
      {/* FILE 6: ALL POPUP MODALS (Rendered outside the hidden overflow) */}
      <GlobalModals 
        isLight={isLight} 
        isCmdOpen={isCmdOpen} 
        setIsCmdOpen={setIsCmdOpen} 
        isPrivacyOpen={isPrivacyOpen} 
        setIsPrivacyOpen={setIsPrivacyOpen} 
        selectedEvent={selectedEvent} 
        setSelectedEvent={setSelectedEvent} 
      />
    </>
  );
}