'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, Variants, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import AnimatedCounter from '@/components/AnimatedCounter';
import ChatModal from '@/components/ChatModal';

// ============================================================================
// PERFORMANCE-OPTIMIZED CUSTOM CANVAS: Dynamic Living Network
// ============================================================================
const NodeNetworkBackground = ({ isLight }: { isLight: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let particles: { x: number; y: number; vx: number; vy: number; radius: number }[] = [];
    
    let mouse = { x: -1000, y: -1000 };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      // Scale particle density based on screen size for lag-free 60fps performance
      const densityDivisor = window.innerWidth < 768 ? 14000 : 9500;
      const numberOfParticles = Math.floor((canvas.width * canvas.height) / densityDivisor); 
      for (let i = 0; i < numberOfParticles; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5, 
          vy: (Math.random() - 0.5) * 0.5,
          radius: Math.random() * 1.8 + 0.6,
        });
      }
    };

    window.addEventListener('resize', resize, { passive: true });
    resize();

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const nodeColor = isLight ? 'rgba(99, 102, 241, 0.35)' : 'rgba(56, 189, 248, 0.4)';
      const lineBaseStr = isLight ? '99, 102, 241' : '147, 197, 253';
      
      const maxDistSq = 140 * 140;
      const mouseDistSq = 180 * 180;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = nodeColor;
        ctx.fill();

        // Optimized O(N^2) loop avoiding heavy Math.sqrt unless within range
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < maxDistSq) {
            const distance = Math.sqrt(distSq);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(${lineBaseStr}, ${isLight ? 0.16 - distance / 900 : 0.22 - distance / 650})`; 
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }

        const dxMouse = p.x - mouse.x;
        const dyMouse = p.y - mouse.y;
        const distMouseSq = dxMouse * dxMouse + dyMouse * dyMouse;
        if (distMouseSq < mouseDistSq) {
          const distMouse = Math.sqrt(distMouseSq);
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(${lineBaseStr}, ${isLight ? 0.35 - distMouse / 550 : 0.45 - distMouse / 400})`; 
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isLight]);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-100 will-change-transform" />;
};


// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================
export default function Home() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const isLight = theme === 'light';
  
  const [isCmdOpen, setIsCmdOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // --- THROTTLED SPOTLIGHT EFFECTS ---
  const gridRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number | null>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!gridRef.current) return;
    if (rafId.current) cancelAnimationFrame(rafId.current);

    rafId.current = requestAnimationFrame(() => {
      if (!gridRef.current) return;
      const cards = gridRef.current.getElementsByClassName('spotlight-card');
      for (const card of Array.from(cards)) {
        const rect = (card as HTMLElement).getBoundingClientRect(),
              x = e.clientX - rect.left,
              y = e.clientY - rect.top;
        (card as HTMLElement).style.setProperty('--mouse-x', `${x}px`);
        (card as HTMLElement).style.setProperty('--mouse-y', `${y}px`);
      }
    });
  }, []);

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

  const handleShare = async () => {
    const shareData = {
      title: 'Collabs Hub',
      text: 'Explore the Collabs digital learning and innovation ecosystem.',
      url: typeof window !== 'undefined' ? window.location.href : ''
    };
    try {
      if (navigator.share) await navigator.share(shareData);
      else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    } catch (err) { console.error('Error sharing:', err); }
  };

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  };

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };

  const searchLinks = [
    { name: 'Collabs Drop', url: 'https://drop.collabs.eu.org/', icon: 'fa-droplet', color: 'text-blue-500' },
    { name: 'Collabs Flow', url: 'https://flow.collabs.eu.org/', icon: 'fa-bolt', color: 'text-cyan-500' },
    { name: 'Collabs Mail', url: 'https://mail.collabs.eu.org/', icon: 'fa-envelope', color: 'text-indigo-500' },
    { name: 'Collabs eVote', url: 'https://evote.collabs.eu.org/', icon: 'fa-check-to-slot', color: 'text-teal-500' },
    { name: 'QR Lab', url: 'https://www.qrlab.eu.org', icon: 'fa-qrcode', color: 'text-slate-400' },
    { name: 'Collabs Docs', url: 'https://docs.collabs.eu.org/', icon: 'fa-book-open', color: 'text-purple-500' },
  ].filter(link => link.name.toLowerCase().includes(searchQuery.toLowerCase()));

  // =========================================
  // SCALABLE EVENTS & MILESTONES DATA ARRAY
  // =========================================
  const eventsList = [
    {
      id: 1,
      title: "Inaugural Launch Session",
      category: "Core Team Meeting",
      type: "Hybrid (Online + Physical Meeting)",
      date: "27",
      month: "Jun",
      year: "2026",
      description: "The inaugural launch session aimed to officially activate the Collabs Core Team, introduce the vision and long-term direction of the platform, and discuss early priorities before public launch.",
      image: "/kickoff-meeting.jpeg",
      participantsText: "27 Members",
      details: {
        dateFull: "Saturday, 27 June 2026 · 9:05 PM – 10:50 PM",
        hostedBy: "Ehan Ali & Amna Sahar",
        attendees: "27 members — Founder, Director, Collaboration Directors, Field Managers, Subject Leads, Club Leads, Coordinators, Ambassadors, Media & Content team",
        sections: [
          {
            title: "1. SESSION OVERVIEW",
            body: "The inaugural launch session of Collabs convened on the evening of Saturday, 27 June 2026, running from 9:05 PM to 10:50 PM. It brought together the full core team for the first time in a structured virtual plus physical setting, marking the transition of Collabs from a vision and structural framework into an active, operational community with every appointed role represented on the call. The meeting was facilitated by Ehan Ali and Amna and structured across three primary phases: the founder's address, an open member review and a closing discussion on execution priorities."
          },
          {
            title: "2. FOUNDER'S ADDRESS",
            body: "The session formally opened with an address from Syed Farhan Danish, Founder of Collabs. Farhan outlined the core vision driving the platform; to build a student-led digital community that bridges geographical and socioeconomic gaps between School students across Pakistan, with an initial focus on Chitral & Gilgit Baltistan. He emphasized that the real measure of the launch would not be the session itself, but what the team does in the weeks immediately following it."
          },
          {
            title: "3. OPEN MEMBER REVIEW",
            body: "Representatives from across the team were invited to share their perspectives, questions and initial thoughts on their respective roles. The review surfaced a consistent theme: enthusiasm for the platform's mission paired with a clear desire for structural clarity before execution begins. Insights and observations raised during the review included the importance of clear communication channels and understanding what the first visible milestone for students would look like once the platform goes live."
          },
          {
            title: "4. PLANS & PROPOSALS",
            body: "The most substantive proposal raised was the idea of hosting virtual events with a Model United Nations (MUN) cited as a flagship example. The proposal was met with unanimous agreement from the team on one condition: all events should be planned and executed only after a working operational framework is in place. Establishing an operational framework remains the immediate organizational priority."
          },
          {
            title: "5. ITEMS NOT ADDRESSED & PENDING DECISIONS",
            body: "The timeline for the Collabs website going live was not addressed and will be placed on the agenda for the next team meeting. Additionally, the communication platform remained under consideration between Google Chat and WhatsApp. (Note: Google Chats was finalized after a complete survey from the team)."
          },
          {
            title: "6. CONCLUSION",
            body: "The inaugural launch session achieved its core objective: bringing the full 27-member core team together, establishing a shared understanding of the platform’s vision and opening structured dialogue across all roles and departments. The foundation laid today positions Collabs to move into active operation with clarity, coordination and purpose."
          }
        ]
      }
    }
  ];

  return (
    <>
      <div className={`min-h-screen w-full flex flex-col items-center transition-colors duration-500 ease-out relative overflow-hidden scroll-smooth ${isLight ? 'bg-[#f8fafc]' : 'bg-[#020617]'}`}>
        
        {/* VIBRANT GPU-ACCELERATED BACKGROUND BLURS */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden flex justify-center items-center">
          <motion.div 
            style={{ willChange: 'transform' }}
            animate={{ scale: [1, 1.1, 1], rotate: [0, 45, 0] }} transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            className={`absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full blur-[140px] transition-colors duration-1000 transform-gpu ${isLight ? 'bg-blue-300/40' : 'bg-indigo-900/40'}`} 
          />
          <motion.div 
            style={{ willChange: 'transform' }}
            animate={{ scale: [1, 1.2, 1], rotate: [0, -45, 0] }} transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
            className={`absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full blur-[140px] transition-colors duration-1000 transform-gpu ${isLight ? 'bg-cyan-200/50' : 'bg-cyan-900/30'}`} 
          />
          {isLight && <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>}
        </div>

        {/* THEME TOGGLE BUTTON */}
        <motion.button 
          initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
          onClick={() => setTheme(isLight ? 'dark' : 'light')}
          className={`fixed top-4 right-4 md:top-6 md:right-6 z-50 w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 shadow-lg backdrop-blur-md ${isLight ? 'bg-white/80 border-slate-200 text-slate-800 hover:shadow-indigo-500/20' : 'bg-white/5 border-white/10 text-white hover:shadow-cyan-500/20'}`}
        >
          <i className={`fa-solid ${isLight ? 'fa-moon text-indigo-600' : 'fa-sun text-yellow-400'} text-xl`}></i>
        </motion.button>

        {/* DYNAMIC SPOTLIGHT CSS */}
        <style dangerouslySetInnerHTML={{__html: `
          .spotlight-card::before {
            content: ""; height: 100%; width: 100%; left: 0px; top: 0px; position: absolute;
            background: radial-gradient(800px circle at var(--mouse-x) var(--mouse-y), ${isLight ? 'rgba(99, 102, 241, 0.08)' : 'rgba(34, 211, 238, 0.08)'}, transparent 40%);
            z-index: 1; opacity: 0; transition: opacity 300ms ease; pointer-events: none;
          }
          .spotlight-card:hover::before { opacity: 1; }
          .spotlight-content { position: relative; z-index: 2; }
        `}} />

        {/* BACKGROUND NODE NETWORK */}
        <NodeNetworkBackground isLight={isLight} />

        {/* MAIN PAGE WRAPPER */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full flex flex-col items-center relative z-10 overflow-x-hidden">
          
          {/* =========================================
              1. EPIC HERO SECTION 
              ========================================= */}
          <section className="relative w-full min-h-[85vh] pb-12 flex flex-col items-center justify-center px-4 text-center mt-8 md:mt-0">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.7, type: "spring", damping: 20 }} 
              className="relative z-10 w-24 md:w-36 mb-6 md:mb-8 mt-12"
            >
              <motion.div animate={{ opacity: [0.4, 0.7, 0.4], scale: [1, 1.15, 1] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} className={`absolute inset-0 blur-3xl rounded-full transition-colors duration-500 transform-gpu ${isLight ? 'bg-indigo-400/50' : 'bg-cyan-400/40 mix-blend-overlay'}`} />
              <motion.div animate={{ scale: [1, 1.05, 1], filter: ["brightness(1)", "brightness(1.15)", "brightness(1)"] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
                <Image src="/logo2.png" alt="Collabs Logo" width={144} height={144} className="brand-logo w-full h-auto relative z-10 drop-shadow-2xl" priority />
              </motion.div>
            </motion.div>

            <motion.h1 initial="hidden" animate="visible" variants={fadeUp} className="text-5xl md:text-8xl lg:text-9xl font-extrabold tracking-tighter mb-4 md:mb-6 relative z-10 leading-tight">
              <span className={`transition-colors duration-500 ${isLight ? 'text-slate-900' : 'text-white'}`}>Bridging the</span>
              <br className="hidden md:block" />
              <br className="block md:hidden" />
              {' '}
              <span 
                className={`inline-block bg-clip-text text-transparent ${isLight ? 'bg-linear-to-r from-indigo-600 via-blue-500 to-teal-400' : 'bg-linear-to-r from-blue-400 via-cyan-400 to-teal-300'}`}
                style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
              >
                Digital Divide.
              </span>
            </motion.h1>

            <motion.p initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.1 }} className={`text-base md:text-2xl max-w-3xl mb-10 md:mb-12 relative z-10 leading-relaxed font-medium transition-colors duration-500 px-4 ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
              A 100% student-led ecosystem. We connect remote regions, foster peer mentorship, and incubate the technology of tomorrow.
            </motion.p>

            <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.2 }} className="relative z-10">
              <motion.a 
                href="https://registration.collabs.eu.org/" target="_blank" rel="noopener noreferrer"
                whileHover={{ scale: 1.05, y: -4 }} whileTap={{ scale: 0.96 }}
                className={`px-8 py-4 md:px-10 md:py-5 rounded-full font-bold tracking-wide transition-all duration-300 inline-flex items-center gap-3 text-sm md:text-base transform-gpu ${isLight ? 'bg-slate-900 text-white shadow-[0_15px_30px_rgba(15,23,42,0.2)] hover:bg-indigo-600 hover:shadow-[0_20px_40px_rgba(79,70,229,0.3)]' : 'bg-white text-slate-950 shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(255,255,255,0.4)]'}`}
              >
                Join the Network <i className="fa-solid fa-arrow-right"></i>
              </motion.a>
            </motion.div>
          </section>

          {/* =========================================
              2. THE CONTINUOUS FLOATING STATS PILL 
              ========================================= */}
          <motion.section style={{ willChange: 'transform' }} animate={{ y: ["0px", "-12px", "0px"] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} className="w-full relative z-20 mt-10 md:mt-24 px-4 md:px-6 mb-16 transform-gpu">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer} className={`max-w-4xl mx-auto rounded-4xl md:rounded-[40px] p-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-center divide-y md:divide-y-0 md:divide-x backdrop-blur-2xl transition-all duration-500 ${isLight ? 'bg-white/80 border border-white shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] divide-slate-200 hover:shadow-indigo-500/10' : 'bg-[#0a0a0a]/80 border border-white/10 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] divide-white/10 hover:border-white/20'}`}>
              <motion.div variants={fadeUp} className="flex flex-col items-center pt-2 md:pt-0 group">
                <AnimatedCounter value={100} suffix="%" className={`text-4xl md:text-5xl font-extrabold mb-1 transition-all duration-500 group-hover:scale-105 ${isLight ? 'text-indigo-600' : 'text-blue-400'}`} />
                <span className={`text-[10px] uppercase tracking-[0.25em] font-bold transition-colors duration-500 ${isLight ? 'text-slate-500 group-hover:text-indigo-500' : 'text-slate-400 group-hover:text-blue-300'}`}>Student Led</span>
              </motion.div>
              <motion.div variants={fadeUp} className="flex flex-col items-center pt-6 md:pt-0 group">
                <AnimatedCounter value={24} suffix="/7" className={`text-4xl md:text-5xl font-extrabold mb-1 transition-all duration-500 group-hover:scale-105 ${isLight ? 'text-slate-900' : 'text-white'}`} />
                <span className={`text-[10px] uppercase tracking-[0.25em] font-bold transition-colors duration-500 ${isLight ? 'text-slate-500 group-hover:text-slate-800' : 'text-slate-400 group-hover:text-white'}`}>Secure Hub</span>
              </motion.div>
              <motion.div variants={fadeUp} className="flex flex-col items-center pt-6 md:pt-0 group">
                <AnimatedCounter value={1} suffix="st" className={`text-4xl md:text-5xl font-extrabold mb-1 transition-all duration-500 group-hover:scale-105 ${isLight ? 'text-teal-500' : 'text-cyan-400'}`} />
                <span className={`text-[10px] uppercase tracking-[0.25em] font-bold transition-colors duration-500 ${isLight ? 'text-slate-500 group-hover:text-teal-600' : 'text-slate-400 group-hover:text-cyan-300'}`}>In Innovation</span>
              </motion.div>
            </motion.div>
          </motion.section>

          {/* =========================================
              3. DYNAMIC BENTO-BOX DASHBOARD 
              ========================================= */}
          <section id="ecosystem" className="w-full pt-10 md:pt-16 pb-16 md:pb-24 flex flex-col items-center relative z-10">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUp} className="text-center mb-12 md:mb-16 px-4">
              <h2 className={`text-3xl md:text-6xl font-bold mb-4 tracking-tight transition-colors duration-500 ${isLight ? 'text-slate-900' : 'text-white'}`}>Collabs Workspace</h2>
              <p className={`max-w-xl mx-auto font-medium text-base md:text-lg transition-colors duration-500 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Your centralized hub for community, productivity, and innovation.</p>
            </motion.div>

            <motion.div ref={gridRef} onMouseMove={handleMouseMove} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer} className="flex flex-col gap-8 md:gap-10 max-w-7xl mx-auto px-4 md:px-6 w-full">
              {/* GROUP 1: CORE PLATFORMS */}
              <div>
                <div className={`flex items-center gap-3 md:gap-4 mb-4 md:mb-6 ${isLight ? 'text-slate-800' : 'text-white'}`}>
                  <div className={`w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center text-lg md:text-xl shadow-sm border transition-colors ${isLight ? 'bg-white border-slate-200 text-indigo-500' : 'bg-white/5 border-white/10 text-blue-400'}`}>
                    <i className="fa-solid fa-layer-group"></i>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold tracking-tight">Core Platforms</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                  <motion.a href="https://drop.collabs.eu.org/" variants={fadeUp} whileHover={{ y: -4 }} className={`spotlight-card col-span-1 md:col-span-2 relative p-6 md:p-8 rounded-4xl md:rounded-[2.5rem] transition-all duration-300 group overflow-hidden flex flex-col justify-end min-h-62.5 md:min-h-75 backdrop-blur-2xl transform-gpu ${isLight ? 'bg-white/70 border border-slate-200 shadow-lg hover:shadow-2xl hover:shadow-indigo-500/20 hover:border-indigo-200' : 'bg-[#0a0a0a]/70 border border-white/10 shadow-2xl hover:shadow-[0_0_40px_rgba(34,211,238,0.15)] hover:border-white/20'}`}>
                    <div className={`absolute inset-0 bg-linear-to-b pointer-events-none transition-opacity duration-500 ${isLight ? 'from-indigo-50/80 to-transparent opacity-0 group-hover:opacity-100' : 'from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100'}`}></div>
                    <i className={`fa-solid fa-droplet text-5xl md:text-7xl mb-auto mt-2 md:mt-4 transition-all duration-500 spotlight-content group-hover:scale-105 origin-left ${isLight ? 'text-indigo-100 group-hover:text-indigo-500' : 'text-white/10 group-hover:text-blue-400'}`}></i>
                    <div className="relative z-10 mt-6 md:mt-8 spotlight-content">
                      <span className={`px-3 md:px-4 py-1 md:py-1.5 text-[10px] font-bold rounded-full uppercase tracking-widest mb-3 md:mb-4 inline-block border transition-colors ${isLight ? 'bg-indigo-50 text-indigo-600 border-indigo-200' : 'bg-cyan-950/40 text-cyan-400 border-cyan-800'}`}>Social Hub</span>
                      <h3 className={`text-2xl md:text-3xl font-extrabold mb-2 tracking-tight transition-colors ${isLight ? 'text-slate-900' : 'text-white'}`}>Collabs Drop</h3>
                      <p className={`text-xs md:text-sm leading-relaxed max-w-md font-medium transition-colors ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Every drop of knowledge creates an ocean of innovation. Share academic insights and build community.</p>
                    </div>
                  </motion.a>

                  <motion.a href="https://flow.collabs.eu.org/" variants={fadeUp} whileHover={{ y: -4 }} className={`spotlight-card col-span-1 p-6 md:p-8 rounded-4xl md:rounded-[2.5rem] transition-all duration-300 group flex flex-col items-start justify-between min-h-50 md:min-h-75 backdrop-blur-2xl transform-gpu ${isLight ? 'bg-white/70 border border-slate-200 shadow-lg hover:shadow-2xl hover:border-cyan-200 hover:shadow-cyan-500/20' : 'bg-[#0a0a0a]/70 border border-white/10 shadow-2xl hover:border-white/20'}`}>
                    <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center text-xl md:text-2xl transition-all duration-300 spotlight-content border group-hover:-rotate-12 ${isLight ? 'bg-cyan-50 text-cyan-500 border-cyan-100 group-hover:bg-cyan-500 group-hover:text-white' : 'bg-white/5 text-white/50 border-white/10 group-hover:bg-cyan-500 group-hover:text-white'}`}>
                      <i className="fa-solid fa-bolt"></i>
                    </div>
                    <div className="spotlight-content mt-4 md:mt-6">
                      <h3 className={`text-xl md:text-2xl font-bold mb-1 md:mb-2 tracking-tight transition-colors ${isLight ? 'text-slate-900' : 'text-white'}`}>Flow</h3>
                      <p className={`text-xs md:text-sm font-medium leading-relaxed transition-colors ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Productivity dashboard & focus timer.</p>
                    </div>
                  </motion.a>

                  <motion.a href="https://mail.collabs.eu.org/" variants={fadeUp} whileHover={{ y: -4 }} className={`spotlight-card col-span-1 p-6 md:p-8 rounded-4xl md:rounded-[2.5rem] transition-all duration-300 group flex flex-col items-start justify-between min-h-50 md:min-h-75 backdrop-blur-2xl transform-gpu ${isLight ? 'bg-white/70 border border-slate-200 shadow-lg hover:shadow-2xl hover:border-blue-200 hover:shadow-blue-500/20' : 'bg-[#0a0a0a]/70 border border-white/10 shadow-2xl hover:border-white/20'}`}>
                    <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center text-xl md:text-2xl transition-all duration-300 spotlight-content border group-hover:scale-110 ${isLight ? 'bg-blue-50 text-blue-500 border-blue-100 group-hover:bg-blue-600 group-hover:text-white' : 'bg-white/5 text-white/50 border-white/10 group-hover:bg-blue-500 group-hover:text-white'}`}>
                      <i className="fa-solid fa-envelope"></i>
                    </div>
                    <div className="spotlight-content mt-4 md:mt-6">
                      <h3 className={`text-xl md:text-2xl font-bold mb-1 md:mb-2 tracking-tight transition-colors ${isLight ? 'text-slate-900' : 'text-white'}`}>Mail</h3>
                      <p className={`text-xs md:text-sm font-medium leading-relaxed transition-colors ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Official internal communications.</p>
                    </div>
                  </motion.a>
                </div>
              </div>

              {/* GROUP 2: CAMPUS INFRASTRUCTURE & DOCS */}
              <div className="mt-6 md:mt-8">
                <div className={`flex items-center gap-3 md:gap-4 mb-4 md:mb-6 ${isLight ? 'text-slate-800' : 'text-white'}`}>
                  <div className={`w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center text-lg md:text-xl shadow-sm border transition-colors ${isLight ? 'bg-white border-slate-200 text-teal-500' : 'bg-white/5 border-white/10 text-teal-400'}`}>
                    <i className="fa-solid fa-server"></i>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold tracking-tight">Campus Infrastructure</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                  
                  {/* eVote - Takes up 2 columns on medium & large screens */}
                  <motion.a href="https://evote.collabs.eu.org/" variants={fadeUp} whileHover={{ y: -4 }} className={`spotlight-card col-span-1 md:col-span-2 p-6 md:p-8 rounded-4xl md:rounded-[2.5rem] transition-all duration-300 group flex items-center gap-6 md:gap-8 overflow-hidden relative backdrop-blur-2xl transform-gpu ${isLight ? 'bg-white/70 border border-slate-200 shadow-lg hover:shadow-2xl hover:border-teal-200 hover:shadow-teal-500/20' : 'bg-[#0a0a0a]/70 border border-white/10 shadow-2xl hover:border-white/20'}`}>
                    <div className={`w-16 h-16 md:w-20 md:h-20 shrink-0 rounded-2xl md:rounded-3xl flex items-center justify-center text-2xl md:text-3xl transition-all duration-300 spotlight-content border group-hover:rotate-6 ${isLight ? 'bg-teal-50 text-teal-600 border-teal-100 group-hover:bg-teal-500 group-hover:text-white' : 'bg-white/5 text-white/50 border-white/10 group-hover:bg-teal-500 group-hover:text-white'}`}>
                      <i className="fa-solid fa-check-to-slot"></i>
                    </div>
                    <div className="spotlight-content">
                      <span className={`px-2 py-1 md:px-3 md:py-1 text-[10px] font-bold rounded-full uppercase tracking-widest mb-2 md:mb-3 inline-block border transition-colors ${isLight ? 'bg-teal-50 text-teal-600 border-teal-200' : 'bg-white/5 text-slate-300 border-white/10'}`}>Live</span>
                      <h3 className={`text-xl md:text-2xl font-bold mb-1 md:mb-2 tracking-tight transition-colors ${isLight ? 'text-slate-900' : 'text-white'}`}>Collabs eVote</h3>
                      <p className={`text-xs md:text-sm font-medium leading-relaxed transition-colors ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Zero-trust cryptographic digital election ecosystem.</p>
                    </div>
                  </motion.a>

                  {/* Utilities Stack (eAttendance & QR Lab) - Takes up 1 column */}
                  <motion.div variants={fadeUp} className="col-span-1 grid grid-rows-2 gap-4 md:gap-6">
                    <motion.a href="/eAttendance.exe" download whileHover={{ x: 5 }} className={`spotlight-card p-5 md:p-6 rounded-3xl md:rounded-4xl transition-all duration-300 flex items-center gap-4 md:gap-6 group overflow-hidden backdrop-blur-xl border transform-gpu ${isLight ? 'bg-white/80 border-slate-200 shadow-md hover:shadow-lg hover:border-emerald-200' : 'bg-[#0a0a0a]/80 border-white/10 shadow-xl hover:border-white/20 hover:bg-white/5'}`}>
                      <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center text-lg md:text-xl transition-all duration-300 spotlight-content border ${isLight ? 'bg-emerald-50 text-emerald-500 border-emerald-100 group-hover:bg-emerald-500 group-hover:text-white' : 'bg-white/5 text-white/50 border-white/10 group-hover:bg-emerald-500 group-hover:text-white'}`}>
                        <i className="fa-solid fa-clipboard-user"></i>
                      </div>
                      <h3 className={`text-base md:text-lg font-bold spotlight-content transition-colors ${isLight ? 'text-slate-700 group-hover:text-emerald-600' : 'text-slate-300 group-hover:text-white'}`}>eAttendance</h3>
                    </motion.a>

                    <motion.a href="https://www.qrlab.eu.org" whileHover={{ x: 5 }} className={`spotlight-card p-5 md:p-6 rounded-3xl md:rounded-4xl transition-all duration-300 flex items-center gap-4 md:gap-6 group overflow-hidden backdrop-blur-xl border transform-gpu ${isLight ? 'bg-white/80 border-slate-200 shadow-md hover:shadow-lg hover:border-slate-400' : 'bg-[#0a0a0a]/80 border-white/10 shadow-xl hover:border-white/20 hover:bg-white/5'}`}>
                      <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center text-lg md:text-xl transition-all duration-300 spotlight-content border ${isLight ? 'bg-slate-50 text-slate-500 border-slate-200 group-hover:bg-slate-800 group-hover:text-white' : 'bg-white/5 text-white/50 border-white/10 group-hover:bg-slate-200 group-hover:text-black'}`}>
                        <i className="fa-solid fa-qrcode"></i>
                      </div>
                      <h3 className={`text-base md:text-lg font-bold spotlight-content transition-colors ${isLight ? 'text-slate-700 group-hover:text-slate-900' : 'text-slate-300 group-hover:text-white'}`}>QR Lab</h3>
                    </motion.a>
                  </motion.div>

                  {/* Documentations Card - Takes up 1 column */}
                  <motion.a href="https://docs.collabs.eu.org/" variants={fadeUp} whileHover={{ y: -4 }} className={`spotlight-card col-span-1 p-6 md:p-8 rounded-4xl md:rounded-[2.5rem] transition-all duration-300 group flex flex-col items-start justify-between min-h-50 md:min-h-75 backdrop-blur-2xl transform-gpu ${isLight ? 'bg-white/70 border border-slate-200 shadow-lg hover:shadow-2xl hover:border-purple-200 hover:shadow-purple-500/20' : 'bg-[#0a0a0a]/70 border border-white/10 shadow-2xl hover:border-white/20'}`}>
                    <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center text-xl md:text-2xl transition-all duration-300 spotlight-content border group-hover:scale-110 ${isLight ? 'bg-purple-50 text-purple-500 border-purple-100 group-hover:bg-purple-500 group-hover:text-white' : 'bg-white/5 text-white/50 border-white/10 group-hover:bg-purple-500 group-hover:text-white'}`}>
                      <i className="fa-solid fa-book-open"></i>
                    </div>
                    <div className="spotlight-content mt-4 md:mt-6">
                      <h3 className={`text-xl md:text-2xl font-bold mb-1 md:mb-2 tracking-tight transition-colors ${isLight ? 'text-slate-900' : 'text-white'}`}>Collabs Docs</h3>
                      <p className={`text-xs md:text-sm font-medium leading-relaxed transition-colors ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Official documentation, open-source resources & guides.</p>
                    </div>
                  </motion.a>

                </div>
              </div>
            </motion.div>
          </section>

          {/* =========================================
              MILESTONES & EVENTS SECTION 
              ========================================= */}
          <section className="w-full pt-10 pb-16 md:pb-20 px-4 md:px-6 flex flex-col items-center relative z-10">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUp} className="text-center mb-10 md:mb-12 px-4">
              <h2 className={`text-3xl md:text-5xl font-bold mb-3 md:mb-4 tracking-tight transition-colors duration-500 ${isLight ? 'text-slate-900' : 'text-white'}`}>Journey & Milestones</h2>
              <p className={`max-w-xl mx-auto font-medium text-base md:text-lg transition-colors duration-500 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Celebrating our steps towards a connected digital future.</p>
            </motion.div>

            <div className="max-w-7xl w-full mx-auto grid grid-cols-1 gap-8 md:gap-12">
              {eventsList.map((event) => (
                <motion.div 
                  key={event.id}
                  initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                  className={`group relative rounded-4xl md:rounded-[2.5rem] overflow-hidden border shadow-2xl transition-all duration-300 md:hover:-translate-y-2 flex flex-col lg:flex-row transform-gpu ${
                    isLight 
                      ? 'bg-white/90 backdrop-blur-xl border-slate-200 shadow-slate-300/50 hover:shadow-indigo-500/20' 
                      : 'bg-[#0a0a0a]/90 backdrop-blur-xl border-white/10 shadow-black/80 hover:shadow-[0_0_40px_rgba(34,211,238,0.15)] hover:border-white/20'
                  }`}
                >
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ${isLight ? 'bg-linear-to-tr from-indigo-50 to-transparent' : 'bg-linear-to-tr from-cyan-950/30 to-transparent'}`}></div>

                  {/* Event Card Image Section */}
                  <div className="w-full lg:w-5/12 relative min-h-62.5 md:min-h-75 overflow-hidden shrink-0 bg-[#0a0a0a]">
                    <Image src={event.image} alt={event.title} fill className="object-cover transition-transform duration-700 md:group-hover:scale-105" />
                    
                    {/* Subtle dark cinematic top fade to ensure text readability */}
                    <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/20 to-transparent opacity-90"></div>
                    
                    {/* Floating High-Contrast Date Badge */}
                    <div className={`absolute top-4 left-4 md:top-6 md:left-6 backdrop-blur-md px-4 py-2 md:px-5 md:py-3 rounded-2xl shadow-xl flex flex-col items-center leading-none border transition-colors duration-300 ${isLight ? 'bg-white/95 border-white/50 text-slate-900' : 'bg-black/60 border-white/20 text-white'}`}>
                      <span className="text-xl md:text-2xl font-black">{event.date}</span>
                      <span className="text-[10px] font-bold uppercase tracking-widest mt-1">{event.month}</span>
                    </div>
                  </div>

                  {/* Event Card Content Section */}
                  <div className="w-full lg:w-7/12 p-6 md:p-8 lg:p-12 flex flex-col justify-center relative z-10">
                    <div className="flex items-center gap-3 mb-4 md:mb-5">
                      <span className={`px-3 py-1 text-[10px] font-bold rounded-md uppercase tracking-widest border transition-colors ${
                        isLight ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-cyan-950/40 text-cyan-400 border-cyan-800'
                      }`}>
                        {event.category}
                      </span>
                    </div>
                    
                    <h3 className={`text-2xl md:text-3xl lg:text-4xl font-extrabold mb-3 md:mb-5 tracking-tight transition-colors ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      {event.title}
                    </h3>
                    
                    <p className={`text-sm md:text-base leading-relaxed font-medium mb-6 md:mb-10 transition-colors ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                      {event.description}
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-4 mt-auto">
                      <div className="flex items-center gap-4">
                        <div className="flex -space-x-3">
                          <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full border-2 flex items-center justify-center ${isLight ? 'border-white bg-blue-100 text-blue-500' : 'border-[#0a0a0a] bg-blue-900/50 text-blue-300'}`}><i className="fa-solid fa-user text-[10px] md:text-xs"></i></div>
                          <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full border-2 flex items-center justify-center ${isLight ? 'border-white bg-indigo-100 text-indigo-500' : 'border-[#0a0a0a] bg-indigo-900/50 text-indigo-300'}`}><i className="fa-solid fa-code text-[10px] md:text-xs"></i></div>
                          <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full border-2 flex items-center justify-center ${isLight ? 'border-white bg-cyan-100 text-cyan-500' : 'border-[#0a0a0a] bg-cyan-900/50 text-cyan-300'}`}><i className="fa-solid fa-lightbulb text-[10px] md:text-xs"></i></div>
                        </div>
                        <span className={`text-xs md:text-sm font-bold transition-colors ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{event.participantsText}</span>
                      </div>

                      <button 
                        onClick={() => setSelectedEvent(event)}
                        className={`px-5 md:px-6 py-2.5 rounded-full text-xs md:text-sm font-bold transition-all flex items-center gap-2 border w-full md:w-auto justify-center ${
                          isLight 
                            ? 'bg-slate-900 text-white border-slate-900 hover:bg-indigo-600 hover:border-indigo-600 hover:shadow-lg hover:shadow-indigo-500/30' 
                            : 'bg-white text-black border-white hover:bg-cyan-400 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)]'
                        }`}
                      >
                        Read Summary <i className="fa-solid fa-arrow-right"></i>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* =========================================
              4. EPIC FOOTER CARD
              ========================================= */}
          <section className="w-full px-4 pb-10 md:pb-12 relative z-10 mt-6 md:mt-10">
            <motion.footer 
              initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
              className={`max-w-7xl mx-auto rounded-[2.5rem] md:rounded-[48px] p-8 md:p-10 lg:p-16 relative overflow-hidden transition-all duration-500 backdrop-blur-2xl border ${isLight ? 'bg-white/90 border-slate-200 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)]' : 'bg-[#050505]/95 border-white/10 shadow-2xl'}`}
            >
              <div className={`absolute top-0 right-0 w-75 h-75 md:w-125 md:h-125 rounded-full blur-[100px] md:blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none transition-colors duration-700 ${isLight ? 'bg-indigo-200/50' : 'bg-blue-600/20'}`}></div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 mb-12 md:mb-16 relative z-10">
                <div className="md:col-span-2">
                  <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center p-1 border shadow-sm ${isLight ? 'bg-white border-slate-100' : 'bg-white border-transparent'}`}>
                      <Image src="/logo2.png" alt="Collabs Logo" width={40} height={40} className="w-full h-full object-contain" />
                    </div>
                    <span className={`text-2xl md:text-3xl font-extrabold tracking-tight transition-colors ${isLight ? 'text-slate-900' : 'text-white'}`}>Collabs</span>
                  </div>
                  <p className={`text-sm md:text-base leading-relaxed max-w-md mb-6 md:mb-8 font-medium transition-colors ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    A 100% student-led digital learning and innovation ecosystem bridging the geographical and educational divide across Pakistan.
                  </p>
                  <button id="shareBtn" onClick={handleShare} className={`flex items-center gap-3 text-xs md:text-sm font-bold border px-5 py-2.5 md:px-6 md:py-3 rounded-full w-fit transition-all hover:scale-105 active:scale-95 ${isLight ? 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200 shadow-sm' : 'bg-white/10 hover:bg-white/20 text-white border-white/20'}`}>
                    <i className="fa-solid fa-share-nodes"></i> Share Collabs Network
                  </button>
                </div>

                <div>
                  <h4 className={`text-xs md:text-sm font-bold mb-4 md:mb-6 tracking-widest uppercase transition-colors ${isLight ? 'text-slate-900' : 'text-white'}`}>Ecosystem</h4>
                  <ul className={`space-y-3 md:space-y-4 text-sm md:text-base font-medium transition-colors ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    <li><a href="https://drop.collabs.eu.org/" className={`transition-colors flex items-center gap-3 ${isLight ? 'hover:text-indigo-600' : 'hover:text-white'}`}><div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div> Drop</a></li>
                    <li><a href="https://mail.collabs.eu.org/" className={`transition-colors flex items-center gap-3 ${isLight ? 'hover:text-blue-600' : 'hover:text-white'}`}><div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> Mail</a></li>
                    <li><a href="https://flow.collabs.eu.org/" className={`transition-colors flex items-center gap-3 ${isLight ? 'hover:text-cyan-600' : 'hover:text-white'}`}><div className="w-1.5 h-1.5 rounded-full bg-cyan-500"></div> Flow</a></li>
                    <li><a href="https://evote.collabs.eu.org/" className={`transition-colors flex items-center gap-3 ${isLight ? 'hover:text-teal-600' : 'hover:text-white'}`}><div className="w-1.5 h-1.5 rounded-full bg-teal-500"></div> eVote</a></li>
                  </ul>
                </div>

                <div>
                  <h4 className={`text-xs md:text-sm font-bold mb-4 md:mb-6 tracking-widest uppercase transition-colors ${isLight ? 'text-slate-900' : 'text-white'}`}>Connect</h4>
                  <div className="flex gap-3 mb-6 md:mb-8">
                    <a href="https://wa.me/923393152023" className={`w-10 h-10 md:w-12 md:h-12 rounded-full border flex items-center justify-center transition-all hover:scale-110 hover:border-transparent hover:text-white hover:bg-[#10B981] ${isLight ? 'bg-white border-slate-200 text-slate-500 shadow-sm' : 'bg-white/5 border-white/10 text-slate-300'}`}><i className="fa-brands fa-whatsapp text-base md:text-lg"></i></a>
                    <a href="https://www.instagram.com/akhsscollabs" className={`w-10 h-10 md:w-12 md:h-12 rounded-full border flex items-center justify-center transition-all hover:scale-110 hover:border-transparent hover:text-white hover:bg-[#E1306C] ${isLight ? 'bg-white border-slate-200 text-slate-500 shadow-sm' : 'bg-white/5 border-white/10 text-slate-300'}`}><i className="fa-brands fa-instagram text-base md:text-lg"></i></a>
                    <a href="https://www.youtube.com/@akhsscollabs" className={`w-10 h-10 md:w-12 md:h-12 rounded-full border flex items-center justify-center transition-all hover:scale-110 hover:border-transparent hover:text-white hover:bg-[#EF4444] ${isLight ? 'bg-white border-slate-200 text-slate-500 shadow-sm' : 'bg-white/5 border-white/10 text-slate-300'}`}><i className="fa-brands fa-youtube text-base md:text-lg"></i></a>
                  </div>
                  <a href="https://registration.collabs.eu.org/" target="_blank" rel="noopener noreferrer" className="text-xs md:text-sm text-indigo-500 hover:text-indigo-600 font-bold transition-colors flex items-center gap-2 group">
                    Join the Network <i className="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
                  </a>
                </div>
              </div>

              <div className={`border-t pt-6 md:pt-8 flex flex-col md:flex-row justify-between items-center gap-4 relative z-10 transition-colors ${isLight ? 'border-slate-200' : 'border-white/10'}`}>
                <p className={`text-xs md:text-sm font-medium transition-colors text-center md:text-left ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>
                  &copy; {new Date().getFullYear()} Collabs Developers Community.
                </p>
                <div className={`flex flex-wrap justify-center gap-4 md:gap-8 text-xs md:text-sm font-medium transition-colors ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>
                  <a href="https://docs.collabs.eu.org/" target="_blank" rel="noopener noreferrer" className={`transition-colors ${isLight ? 'hover:text-slate-900' : 'hover:text-white'}`}>Documentation</a>
                  <button onClick={() => setIsPrivacyOpen(true)} className={`transition-colors text-left ${isLight ? 'hover:text-slate-900' : 'hover:text-white'}`}>Privacy Policy</button>
                </div>
              </div>
            </motion.footer>
          </section>

          <ChatModal isLight={isLight} />
        </motion.div>

      </div> {/* <-- THIS CLOSES THE MAIN WRAPPER CONTAINER */}

      {/* ========================================================================= 
          MODALS MOVED OUTSIDE MAIN WRAPPER TO GUARANTEE THEY RENDER ON TOP 
          ========================================================================= */}
      
      {/* 1. COMMAND PALETTE MODAL */}
      <AnimatePresence>
        {isCmdOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
            className={`fixed inset-0 z-9999 flex items-start justify-center pt-[10vh] md:pt-[15vh] px-4 backdrop-blur-xl ${isLight ? 'bg-slate-900/20' : 'bg-black/60'}`}
            onClick={() => setIsCmdOpen(false)}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.96, y: -10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: -10 }} transition={{ duration: 0.2, ease: "easeOut" }}
              className={`w-full max-w-xl border rounded-3xl shadow-2xl overflow-hidden transform-gpu ${isLight ? 'bg-white/95 backdrop-blur-lg border-slate-200 shadow-indigo-900/10' : 'bg-[#0a0a0a]/95 backdrop-blur-lg border-white/10 shadow-black'}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`flex items-center px-4 py-4 border-b ${isLight ? 'border-slate-100 bg-slate-50/50' : 'border-white/5 bg-white/5'}`}>
                <i className="fa-solid fa-magnifying-glass text-slate-400 mr-3 text-lg"></i>
                <input 
                  type="text" autoFocus placeholder="Search ecosystem..." 
                  className={`w-full bg-transparent outline-none font-medium text-base md:text-lg placeholder:text-slate-400 transition-colors ${isLight ? 'text-slate-900' : 'text-white'}`}
                  value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                />
                <span className={`text-[10px] font-mono border px-2 py-1 rounded-md transition-colors hidden md:block ${isLight ? 'border-slate-200 text-slate-500 bg-white' : 'border-white/10 text-slate-400 bg-white/5'}`}>ESC</span>
                <button onClick={() => setIsCmdOpen(false)} className="md:hidden ml-2 text-slate-500"><i className="fa-solid fa-xmark"></i></button>
              </div>
              <div className="p-2 md:p-3 max-h-[50vh] md:max-h-[60vh] overflow-y-auto scroll-smooth">
                {searchLinks.length > 0 ? (
                  searchLinks.map((link, idx) => (
                    <a key={idx} href={link.url} className={`flex items-center px-3 md:px-4 py-3 rounded-2xl transition-all group ${isLight ? 'hover:bg-indigo-50' : 'hover:bg-white/5'}`}>
                      <div className={`w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center mr-3 md:mr-4 transition-colors border shrink-0 ${isLight ? 'bg-white shadow-sm border-slate-100' : 'bg-[#111] border-white/10 group-hover:border-white/20'} ${link.color}`}>
                        <i className={`fa-solid ${link.icon} text-base md:text-lg`}></i>
                      </div>
                      <span className={`font-semibold text-sm md:text-base transition-colors ${isLight ? 'text-slate-800' : 'text-white'}`}>{link.name}</span>
                      <i className="fa-solid fa-arrow-turn-down -rotate-90 ml-auto text-slate-400 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1"></i>
                    </a>
                  ))
                ) : (
                  <div className="px-4 py-10 text-center text-slate-500 font-medium text-sm md:text-base">No results found for "{searchQuery}"</div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. INDEPENDENT PRIVACY POLICY MODAL */}
      <AnimatePresence>
        {isPrivacyOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
            className={`fixed inset-0 z-9999 flex items-center justify-center p-4 backdrop-blur-xl ${isLight ? 'bg-slate-900/30' : 'bg-black/80'}`}
            onClick={() => setIsPrivacyOpen(false)}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.96, y: 15 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 15 }} transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className={`w-full max-w-3xl border rounded-4xl md:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[85vh] transform-gpu ${isLight ? 'bg-white/95 backdrop-blur-xl border-slate-200' : 'bg-[#0a0a0a]/95 backdrop-blur-xl border-white/10'}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`flex items-center justify-between px-6 md:px-8 py-5 md:py-6 border-b shrink-0 ${isLight ? 'border-slate-100 bg-slate-50/50' : 'border-white/5 bg-[#111]/50'}`}>
                <div>
                  <h2 className={`text-xl md:text-2xl font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>Privacy Policy</h2>
                  <p className={`text-xs md:text-sm mt-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Collabs Data Protection Guidelines</p>
                </div>
                <button onClick={() => setIsPrivacyOpen(false)} className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-colors ${isLight ? 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-900' : 'bg-white/10 text-slate-400 hover:bg-white/20 hover:text-white'}`}>
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
              
              <div className={`p-6 md:p-8 overflow-y-auto flex-1 space-y-5 md:space-y-6 text-sm md:text-base custom-scrollbar scroll-smooth ${isLight ? 'text-slate-700' : 'text-slate-300'}`} style={{ WebkitOverflowScrolling: 'touch' }}>
                <p className="text-base md:text-lg font-medium">Your privacy is sacred to us. This Privacy Policy explains exactly how we collect, use, store and protect your information in Collabs.</p>
                <p>We follow strict global data protection guidelines and Pakistan’s applicable laws. Nothing is shared with third parties without explicit consent or legal requirement.</p>

                <h3 className={`text-lg md:text-xl font-bold mt-6 md:mt-8 mb-3 md:mb-4 ${isLight ? 'text-slate-900' : 'text-white'}`}>Information We Collect</h3>
                <ul className="list-disc pl-5 space-y-1.5 md:space-y-2">
                  <li>Full name (only for internal verification)</li>
                  <li>Grade & campus</li>
                  <li>School ID number or Library ID number</li>
                  <li>Official email address (or parent email for younger students)</li>
                  <li>Phone number (only for emergency contact)</li>
                  <li>Uploaded KYS document (school ID photo – deleted after verification)</li>
                  <li>Academic activity data (attendance, assessment scores, posts)</li>
                  <li>Device/IP information for security monitoring</li>
                </ul>

                <h3 className={`text-lg md:text-xl font-bold mt-6 md:mt-8 mb-3 md:mb-4 ${isLight ? 'text-slate-900' : 'text-white'}`}>How We Use Your Information</h3>
                <ul className="list-disc pl-5 space-y-1.5 md:space-y-2">
                  <li>To verify your active student or educator status</li>
                  <li>To assign and display your unique Collaber ID</li>
                  <li>To send important updates and session links</li>
                  <li>To match you with Subject Leads and mentors</li>
                  <li>To generate anonymous analytics (e.g., "80% of Grade 11 joined Physics")</li>
                  <li>To improve platform features based on usage patterns</li>
                </ul>

                <h3 className={`text-lg md:text-xl font-bold mt-6 md:mt-8 mb-3 md:mb-4 ${isLight ? 'text-slate-900' : 'text-white'}`}>Information We Never Show Publicly</h3>
                <ul className="list-disc pl-5 space-y-1.5 md:space-y-2">
                  <li>Real names are never visible — only Collaber IDs applied after our future concept development</li>
                  <li>Phone numbers are hidden from all members</li>
                  <li>KYS documents are deleted within 7 days of verification</li>
                  <li>No personal data appears in Collabs Media or public posts</li>
                </ul>

                <h3 className={`text-lg md:text-xl font-bold mt-6 md:mt-8 mb-3 md:mb-4 ${isLight ? 'text-slate-900' : 'text-white'}`}>Storage & Security</h3>
                <ul className="list-disc pl-5 space-y-1.5 md:space-y-2">
                  <li>All data stored on highly secure, encrypted servers</li>
                  <li>Access restricted to Executive Directors and authorized platform administrators only</li>
                  <li>Regular internal security audits</li>
                  <li>Two-factor authentication required for all leadership accounts</li>
                </ul>

                <h3 className={`text-lg md:text-xl font-bold mt-6 md:mt-8 mb-3 md:mb-4 ${isLight ? 'text-slate-900' : 'text-white'}`}>Sharing & Disclosure</h3>
                <ul className="list-disc pl-5 space-y-1.5 md:space-y-2">
                  <li>Data shared only with authorized platform administrators or legal authorities when explicitly required for safety or compliance</li>
                  <li>Never sold, rented or shared with advertisers or external companies</li>
                  <li>Alumni mentors see only Collaber IDs/Names and grade level</li>
                </ul>

                <h3 className={`text-lg md:text-xl font-bold mt-6 md:mt-8 mb-3 md:mb-4 ${isLight ? 'text-slate-900' : 'text-white'}`}>Your Rights</h3>
                <ul className="list-disc pl-5 space-y-1.5 md:space-y-2">
                  <li>Right to access your data anytime</li>
                  <li>Right to correct inaccurate information</li>
                  <li>Right to request deletion upon leaving the community</li>
                  <li>Right to file a complaint via official support channels</li>
                </ul>

                <h3 className={`text-lg md:text-xl font-bold mt-6 md:mt-8 mb-3 md:mb-4 ${isLight ? 'text-slate-900' : 'text-white'}`}>Changes & Future Platform</h3>
                <p>When we move to our upgraded custom platform, this policy will be updated and every member notified 30 days in advance.</p>
                
                <div className={`mt-8 md:mt-10 p-5 md:p-6 rounded-2xl border ${isLight ? 'bg-indigo-50 border-indigo-100 text-indigo-900' : 'bg-white/5 border-white/10 text-white'}`}>
                  <p className="font-semibold italic mb-4">"I have read and accept the 30-point Privacy Policy of Collabs."</p>
                  <div className="text-xs md:text-sm opacity-80">
                    <p>Endorsed & Approved by:</p>
                    <p className="font-bold">Executive Team</p>
                    <p>Collabs Ecosystem</p>
                    <p className="mt-2">Dated: March 2, 2026</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. DYNAMIC EVENT SUMMARY MODAL (FULLY RESPONSIVE EDITORIAL LAYOUT) */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
            className={`fixed inset-0 z-9999 flex items-center justify-center p-0 md:p-6 lg:p-8 backdrop-blur-xl ${isLight ? 'bg-slate-900/40 md:bg-slate-900/60' : 'bg-black/90 md:bg-black/80'}`}
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.96, y: 15 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 15 }} transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className={`w-full h-full md:h-auto max-w-6xl md:max-h-[90vh] flex flex-col lg:flex-row overflow-hidden md:rounded-4xl lg:rounded-[2.5rem] shadow-2xl relative transform-gpu ${isLight ? 'bg-white border-slate-200 md:border' : 'bg-[#0a0a0a] border-white/10 md:border'}`}
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedEvent(null)} 
                className={`absolute top-4 right-4 md:top-6 md:right-6 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all hover:rotate-90 backdrop-blur-md border shadow-lg ${
                  isLight ? 'bg-white/90 text-slate-800 border-slate-200 hover:bg-slate-100' : 'bg-black/60 text-white border-white/20 hover:bg-white/20'
                }`}
              >
                <i className="fa-solid fa-xmark text-base md:text-lg"></i>
              </button>

              {/* LEFT COLUMN: Cinematic Sticky Image & Meta (Responsive Flex Layout) */}
              <div className="w-full lg:w-2/5 flex flex-col relative shrink-0 h-auto min-h-[40vh] max-h-[50vh] lg:max-h-none lg:h-full overflow-y-auto border-b lg:border-b-0 lg:border-r border-white/10 bg-black custom-scrollbar scroll-smooth" style={{ WebkitOverflowScrolling: 'touch' }}>
                
                <div className="absolute inset-0 pointer-events-none">
                  <Image 
                    src={selectedEvent.image} 
                    alt={selectedEvent.title} 
                    fill 
                    className={`object-cover ${selectedEvent.id === 1 ? 'object-right' : 'object-center'}`} 
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/60 to-black/10"></div>
                </div>
                
                {/* Flexible spacer to push content down gently without clipping */}
                <div className="relative z-10 min-h-24 md:min-h-32 lg:flex-1 shrink-0"></div>
                
                <div className="relative z-10 p-6 md:p-8 lg:p-10 flex flex-col gap-4 mt-auto">
                  <span className={`px-3 py-1 text-[10px] md:text-xs font-bold rounded-lg uppercase tracking-widest border w-fit backdrop-blur-md ${
                    isLight ? 'bg-white/90 text-indigo-700 border-white/40 shadow-sm' : 'bg-black/60 text-cyan-400 border-white/20'
                  }`}>
                    {selectedEvent.category}
                  </span>
                  
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight drop-shadow-lg text-white">
                    {selectedEvent.title}
                  </h2>
                  
                  <div className={`mt-2 md:mt-4 space-y-2 md:space-y-3 text-xs md:text-sm font-medium p-4 md:p-5 rounded-xl md:rounded-2xl backdrop-blur-md border ${isLight ? 'bg-white/90 border-white/50 text-slate-800 shadow-sm' : 'bg-black/50 border-white/10 text-slate-300'}`}>
                    <div className="flex items-start gap-3">
                      <i className="fa-regular fa-calendar mt-0.5 opacity-70 w-4 text-center"></i>
                      <p>{selectedEvent.details.dateFull}</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <i className="fa-solid fa-video mt-0.5 opacity-70 w-4 text-center"></i>
                      <p>{selectedEvent.type}</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <i className="fa-solid fa-user-tie mt-0.5 opacity-70 w-4 text-center"></i>
                      <p>Hosted by {selectedEvent.details.hostedBy}</p>
                    </div>
                    <div className="flex items-start gap-3 pt-3 border-t border-current/10">
                      <i className="fa-solid fa-users mt-0.5 opacity-70 w-4 text-center"></i>
                      <p>{selectedEvent.details.attendees}</p>
                    </div>
                  </div>

                  {/* Sidebar Download Document Button */}
                  <a 
                    href="/First Meeting - Collabs Launch - Summary.pdf" 
                    download 
                    className={`mt-2 md:mt-4 w-full py-3 px-4 rounded-xl md:rounded-2xl text-xs md:text-sm font-bold transition-all flex items-center justify-center gap-2 md:gap-3 backdrop-blur-md border shadow-sm ${
                      isLight 
                        ? 'bg-white/90 border-white/50 text-indigo-700 hover:bg-indigo-50' 
                        : 'bg-black/50 border-white/20 text-cyan-400 hover:bg-white/10'
                    }`}
                  >
                    <i className="fa-solid fa-file-arrow-down text-base md:text-lg"></i>
                    Download Official Summary
                  </a>
                </div>
              </div>

              {/* RIGHT COLUMN: Scrollable Editorial Content */}
              <div className={`w-full lg:w-3/5 flex-1 overflow-y-auto p-6 md:p-10 lg:p-14 custom-scrollbar scroll-smooth ${isLight ? 'bg-white text-slate-700' : 'bg-[#0a0a0a] text-slate-300'}`} style={{ WebkitOverflowScrolling: 'touch' }}>
                <div className="max-w-2xl mx-auto space-y-8 md:space-y-12">
                  
                  {/* Map through the summary sections dynamically */}
                  {selectedEvent.details.sections.map((section: any, index: number) => (
                    <div key={index} className="space-y-3 md:space-y-4">
                      <h3 className={`text-base md:text-lg font-bold tracking-widest uppercase flex items-center gap-3 md:gap-4 ${isLight ? 'text-indigo-600' : 'text-cyan-400'}`}>
                        {section.title}
                        <span className={`h-px flex-1 ${isLight ? 'bg-slate-200' : 'bg-white/10'}`}></span>
                      </h3>
                      <p className="text-sm md:text-base lg:text-lg leading-relaxed font-medium">
                        {section.body}
                      </p>
                    </div>
                  ))}

                  <div className={`pt-6 md:pt-8 border-t flex flex-col items-center text-center opacity-60 ${isLight ? 'border-slate-200' : 'border-white/10'}`}>
                    <Image src="/logo2.png" alt="Collabs Logo" width={28} height={28} className="mb-3 md:mb-4 opacity-50 grayscale md:w-8 md:h-8" />
                    <p className="text-[10px] md:text-xs font-bold tracking-widest uppercase">Collabs Internal Summary</p>
                    <p className="text-[10px] md:text-xs mt-1">End of Report</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Scrollbar Styles for Modals */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        @media (min-width: 768px) { .custom-scrollbar::-webkit-scrollbar { width: 6px; } }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: ${isLight ? '#cbd5e1' : '#333'}; border-radius: 10px; }
      `}} />

    </>
  );
}