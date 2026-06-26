'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, Variants, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import AnimatedCounter from '@/components/AnimatedCounter';
import ChatModal from '@/components/ChatModal';

// =========================================
// CUSTOM CANVAS: Adaptive Collaboration Nodes
// =========================================
const NodeNetworkBackground = ({ isLight }: { isLight: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: { x: number; y: number; vx: number; vy: number; radius: number }[] = [];
    
    let mouse = { x: -1000, y: -1000 };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      const numberOfParticles = Math.floor((canvas.width * canvas.height) / 12000);
      for (let i = 0; i < numberOfParticles; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.8, 
          vy: (Math.random() - 0.5) * 0.8,
          radius: Math.random() * 1.5 + 1,
        });
      }
    };

    window.addEventListener('resize', resize);
    resize();

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const nodeColor = isLight ? 'rgba(99, 102, 241, 0.4)' : 'rgba(56, 189, 248, 0.5)';
      const lineBaseStr = isLight ? '99, 102, 241' : '147, 197, 253';
      
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

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(${lineBaseStr}, ${isLight ? 0.3 - distance / 400 : 0.15 - distance / 800})`; 
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }

        const dxMouse = p.x - mouse.x;
        const dyMouse = p.y - mouse.y;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
        if (distMouse < 150) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(${lineBaseStr}, ${isLight ? 0.6 : 0.4 - distMouse / 375})`; 
          ctx.lineWidth = 1.2;
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

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-70" />;
};


// =========================================
// MAIN PAGE COMPONENT
// =========================================
export default function Home() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const isLight = theme === 'light';
  
  const [isOverdrive, setIsOverdrive] = useState(false);
  const [isCmdOpen, setIsCmdOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // --- SPOTLIGHT EFFECTS ---
  const gridRef = useRef<HTMLDivElement>(null);
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!gridRef.current) return;
    const cards = gridRef.current.getElementsByClassName('spotlight-card');
    for (const card of Array.from(cards)) {
      const rect = (card as HTMLElement).getBoundingClientRect(),
            x = e.clientX - rect.left,
            y = e.clientY - rect.top;
      (card as HTMLElement).style.setProperty('--mouse-x', `${x}px`);
      (card as HTMLElement).style.setProperty('--mouse-y', `${y}px`);
    }
  };

  // --- CMD+K LISTENER ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsCmdOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsCmdOpen(false);
        setIsPrivacyOpen(false);
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
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const searchLinks = [
    { name: 'Collabs Drop', url: 'https://drop.collabs.eu.org/', icon: 'fa-droplet', color: 'text-blue-500' },
    { name: 'Collabs Flow', url: 'https://flow.collabs.eu.org/', icon: 'fa-bolt', color: 'text-cyan-500' },
    { name: 'Collabs Mail', url: 'https://mail.collabs.eu.org/', icon: 'fa-envelope', color: 'text-indigo-500' },
    { name: 'Collabs eVote', url: 'https://evote.collabs.eu.org/', icon: 'fa-check-to-slot', color: 'text-teal-500' },
    { name: 'QR Lab', url: 'https://www.qrlab.eu.org', icon: 'fa-qrcode', color: 'text-slate-400' },
  ].filter(link => link.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className={`min-h-screen w-full flex flex-col items-center transition-colors duration-700 ease-in-out relative overflow-hidden ${isLight ? 'bg-[#f0f4f8]' : 'bg-[#030712]'}`}>
      
      {/* VIBRANT LIGHT MODE MESH BACKGROUND */}
      {isLight && (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <motion.div 
            animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }} transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-linear-to-br from-blue-300/30 to-purple-300/30 blur-[120px]" 
          />
          <motion.div 
            animate={{ scale: [1, 1.3, 1], rotate: [0, -90, 0] }} transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[40%] right-[-10%] w-[50%] h-[50%] rounded-full bg-linear-to-tl from-cyan-300/30 to-teal-200/30 blur-[120px]" 
          />
          <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
        </div>
      )}

      {/* THEME TOGGLE BUTTON */}
      <motion.button 
        initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
        onClick={() => setTheme(isLight ? 'dark' : 'light')}
        className={`fixed top-6 right-6 z-50 w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 shadow-lg backdrop-blur-md ${isLight ? 'bg-white/80 border-white text-slate-800 hover:shadow-blue-500/20' : 'bg-white/5 border-white/10 text-white'}`}
      >
        <i className={`fa-solid ${isLight ? 'fa-moon text-indigo-600' : 'fa-sun text-yellow-400'} text-xl`}></i>
      </motion.button>

      {/* DYNAMIC SPOTLIGHT CSS */}
      <style dangerouslySetInnerHTML={{__html: `
        .spotlight-card::before {
          content: ""; height: 100%; width: 100%; left: 0px; top: 0px; position: absolute;
          background: radial-gradient(800px circle at var(--mouse-x) var(--mouse-y), ${isLight ? 'rgba(99, 102, 241, 0.12)' : 'rgba(255, 255, 255, 0.06)'}, transparent 40%);
          z-index: 1; opacity: 0; transition: opacity 500ms ease; pointer-events: none;
        }
        .spotlight-card:hover::before { opacity: 1; }
        .spotlight-content { position: relative; z-index: 2; }
      `}} />

      {/* BACKGROUND NODE NETWORK */}
      <NodeNetworkBackground isLight={isLight} />

      {/* COMMAND PALETTE MODAL */}
      <AnimatePresence>
        {isCmdOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className={`fixed inset-0 z-100 flex items-start justify-center pt-[15vh] px-4 backdrop-blur-xl ${isLight ? 'bg-slate-900/20' : 'bg-black/60'}`}
            onClick={() => setIsCmdOpen(false)}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: -20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className={`w-full max-w-xl border rounded-3xl shadow-2xl overflow-hidden ${isLight ? 'bg-white/90 backdrop-blur-lg border-white shadow-blue-900/10' : 'bg-[#0a0a0a] border-white/10'}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`flex items-center px-4 py-4 border-b ${isLight ? 'border-slate-100 bg-white/50' : 'border-white/5 bg-white/5'}`}>
                <i className="fa-solid fa-magnifying-glass text-slate-400 mr-3 text-lg"></i>
                <input 
                  type="text" autoFocus placeholder="Search the Collabs ecosystem..." 
                  className={`w-full bg-transparent outline-none font-medium text-lg placeholder:text-slate-400 transition-colors ${isLight ? 'text-slate-900' : 'text-white'}`}
                  value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                />
                <span className={`text-[10px] font-mono border px-2 py-1 rounded-md transition-colors ${isLight ? 'border-slate-200 text-slate-500 bg-white' : 'border-white/10 text-slate-400 bg-white/5'}`}>ESC</span>
              </div>
              <div className="p-3 max-h-[60vh] overflow-y-auto">
                {searchLinks.length > 0 ? (
                  searchLinks.map((link, idx) => (
                    <a key={idx} href={link.url} className={`flex items-center px-4 py-3 rounded-2xl transition-all group ${isLight ? 'hover:bg-blue-50' : 'hover:bg-white/5'}`}>
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 transition-colors ${isLight ? 'bg-white shadow-sm border border-slate-100' : 'bg-white/5 border border-white/5 group-hover:border-white/10'} ${link.color}`}>
                        <i className={`fa-solid ${link.icon} text-lg`}></i>
                      </div>
                      <span className={`font-semibold transition-colors ${isLight ? 'text-slate-800' : 'text-white'}`}>{link.name}</span>
                      <i className="fa-solid fa-arrow-turn-down -rotate-90 ml-auto text-slate-400 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1"></i>
                    </a>
                  ))
                ) : (
                  <div className="px-4 py-10 text-center text-slate-500 font-medium">No results found for "{searchQuery}"</div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* INDEPENDENT PRIVACY POLICY MODAL */}
      <AnimatePresence>
        {isPrivacyOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className={`fixed inset-0 z-200 flex items-center justify-center p-4 backdrop-blur-xl ${isLight ? 'bg-slate-900/30' : 'bg-black/70'}`}
            onClick={() => setIsPrivacyOpen(false)}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`w-full max-w-3xl border rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[85vh] ${isLight ? 'bg-white/95 backdrop-blur-xl border-white shadow-xl' : 'bg-[#0a0a0a] border-white/10'}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`flex items-center justify-between px-8 py-6 border-b ${isLight ? 'border-slate-100 bg-slate-50/50' : 'border-white/5 bg-white/5'}`}>
                <div>
                  <h2 className={`text-2xl font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>Privacy Policy</h2>
                  <p className={`text-sm mt-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Collabs Data Protection Guidelines</p>
                </div>
                <button onClick={() => setIsPrivacyOpen(false)} className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isLight ? 'bg-slate-100 text-slate-500 hover:bg-slate-200' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}>
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
              
              <div className={`p-8 overflow-y-auto flex-1 space-y-6 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                <p className="text-lg font-medium">Your privacy is sacred to us. This Privacy Policy explains exactly how we collect, use, store and protect your information in Collabs.</p>
                <p>We follow strict global data protection guidelines and Pakistan’s applicable laws. Nothing is shared with third parties without explicit consent or legal requirement.</p>

                <h3 className={`text-xl font-bold mt-8 mb-4 ${isLight ? 'text-slate-900' : 'text-white'}`}>Information We Collect</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Full name (only for internal verification)</li>
                  <li>Grade & campus</li>
                  <li>School ID number or Library ID number</li>
                  <li>Official email address (or parent email for younger students)</li>
                  <li>Phone number (only for emergency contact)</li>
                  <li>Uploaded KYS document (school ID photo – deleted after verification)</li>
                  <li>Academic activity data (attendance, assessment scores, posts)</li>
                  <li>Device/IP information for security monitoring</li>
                </ul>

                <h3 className={`text-xl font-bold mt-8 mb-4 ${isLight ? 'text-slate-900' : 'text-white'}`}>How We Use Your Information</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>To verify your active student or educator status</li>
                  <li>To assign and display your unique Collaber ID</li>
                  <li>To send important updates and session links</li>
                  <li>To match you with Subject Leads and mentors</li>
                  <li>To generate anonymous analytics (e.g., "80% of Grade 11 joined Physics")</li>
                  <li>To improve platform features based on usage patterns</li>
                </ul>

                <h3 className={`text-xl font-bold mt-8 mb-4 ${isLight ? 'text-slate-900' : 'text-white'}`}>Information We Never Show Publicly</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Real names are never visible — only Collaber IDs applied after our future concept development</li>
                  <li>Phone numbers are hidden from all members</li>
                  <li>KYS documents are deleted within 7 days of verification</li>
                  <li>No personal data appears in Collabs Media or public posts</li>
                </ul>

                <h3 className={`text-xl font-bold mt-8 mb-4 ${isLight ? 'text-slate-900' : 'text-white'}`}>Storage & Security</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>All data stored on highly secure, encrypted servers</li>
                  <li>Access restricted to Executive Directors and authorized platform administrators only</li>
                  <li>Regular internal security audits</li>
                  <li>Two-factor authentication required for all leadership accounts</li>
                </ul>

                <h3 className={`text-xl font-bold mt-8 mb-4 ${isLight ? 'text-slate-900' : 'text-white'}`}>Sharing & Disclosure</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Data shared only with authorized platform administrators or legal authorities when explicitly required for safety or compliance</li>
                  <li>Never sold, rented or shared with advertisers or external companies</li>
                  <li>Alumni mentors see only Collaber IDs/Names and grade level</li>
                </ul>

                <h3 className={`text-xl font-bold mt-8 mb-4 ${isLight ? 'text-slate-900' : 'text-white'}`}>Your Rights</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Right to access your data anytime</li>
                  <li>Right to correct inaccurate information</li>
                  <li>Right to request deletion upon leaving the community</li>
                  <li>Right to file a complaint via official support channels</li>
                </ul>

                <h3 className={`text-xl font-bold mt-8 mb-4 ${isLight ? 'text-slate-900' : 'text-white'}`}>Changes & Future Platform</h3>
                <p>When we move to our upgraded custom platform, this policy will be updated and every member notified 30 days in advance.</p>
                
                <div className={`mt-10 p-6 rounded-2xl border ${isLight ? 'bg-blue-50 border-blue-100 text-blue-900' : 'bg-white/5 border-white/10 text-white'}`}>
                  <p className="font-semibold italic mb-4">"I have read and accept the 30-point Privacy Policy of Collabs."</p>
                  <div className="text-sm opacity-80">
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

      {/* MAIN PAGE WRAPPER */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full flex flex-col items-center relative z-10">
        
        {/* =========================================
            1. EPIC HERO SECTION 
            ========================================= */}
        <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center px-4 text-center pb-20">
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: 20 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            transition={{ duration: 0.8, type: "spring" }} 
            className="relative z-10 w-28 md:w-36 mb-8 mt-12"
          >
            {/* Pulsing Background Glow */}
            <motion.div 
              animate={{ opacity: [0.4, 0.7, 0.4], scale: [1, 1.15, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className={`absolute inset-0 blur-3xl rounded-full transition-colors duration-500 ${isLight ? 'bg-indigo-400/50' : 'bg-blue-400/50 mix-blend-overlay'}`}
            />
            {/* Pulsing Logo Image */}
            <motion.div
              animate={{ scale: [1, 1.05, 1], filter: ["brightness(1)", "brightness(1.15)", "brightness(1)"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <Image src="/logo2.png" alt="Collabs Logo" width={144} height={144} className="brand-logo w-full h-auto relative z-10 drop-shadow-2xl" priority />
            </motion.div>
          </motion.div>

          <motion.h1 initial="hidden" animate="visible" variants={fadeUp} className="text-6xl md:text-8xl lg:text-9xl font-extrabold tracking-tighter mb-6 relative z-10">
            <span className={`transition-colors duration-500 ${isLight ? 'text-slate-900' : 'text-white'}`}>Bridging the</span>
            <br className="hidden md:block" />
            <span className={`bg-clip-text text-transparent transition-colors duration-500 ${isLight ? 'bg-linear-to-r from-indigo-600 via-blue-500 to-teal-400' : 'bg-linear-to-r from-blue-400 via-cyan-400 to-teal-300'}`}>
              {' '}Digital Divide.
            </span>
          </motion.h1>

          <motion.p initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.1 }} className={`text-lg md:text-2xl max-w-3xl mb-12 relative z-10 leading-relaxed font-light transition-colors duration-500 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            A 100% student-led ecosystem. We connect remote regions, foster peer mentorship, and incubate the technology of tomorrow.
          </motion.p>

          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.2 }} className="relative z-10">
            <motion.a 
              href="https://registration.collabs.eu.org/" target="_blank" rel="noopener noreferrer"
              whileHover={{ scale: 1.05, y: -5 }} whileTap={{ scale: 0.95 }}
              className={`px-10 py-5 rounded-full font-bold tracking-wide transition-all duration-300 inline-flex items-center gap-3 ${isLight ? 'bg-slate-900 text-white shadow-[0_15px_30px_rgba(15,23,42,0.2)] hover:bg-indigo-600 hover:shadow-[0_20px_40px_rgba(79,70,229,0.3)]' : 'bg-white text-slate-950 shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(255,255,255,0.4)]'}`}
            >
              Join the Network <i className="fa-solid fa-arrow-right"></i>
            </motion.a>
          </motion.div>
        </section>

        {/* =========================================
            2. THE CONTINUOUS FLOATING STATS PILL 
            ========================================= */}
        <motion.section 
          animate={{ y: ["0px", "-15px", "0px"] }} 
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="w-full relative z-20 mt-8 px-6"
        >
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer}
            className={`max-w-4xl mx-auto rounded-[40px] p-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-center divide-y md:divide-y-0 md:divide-x backdrop-blur-xl transition-all duration-500 ${isLight ? 'bg-white/80 border border-white shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] divide-slate-200' : 'bg-[#0a0a0a]/90 border border-white/10 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] divide-white/10'}`}
          >
            <motion.div variants={fadeUp} className="flex flex-col items-center pt-2 md:pt-0 group">
              <AnimatedCounter value={100} suffix="%" className={`text-4xl md:text-5xl font-extrabold mb-1 transition-all duration-500 group-hover:scale-110 ${isLight ? 'text-indigo-600' : 'text-blue-400'}`} />
              <span className={`text-[10px] uppercase tracking-[0.25em] font-bold transition-colors duration-500 ${isLight ? 'text-slate-500 group-hover:text-indigo-500' : 'text-slate-400 group-hover:text-blue-300'}`}>Student Led</span>
            </motion.div>
            <motion.div variants={fadeUp} className="flex flex-col items-center pt-6 md:pt-0 group">
              <AnimatedCounter value={24} suffix="/7" className={`text-4xl md:text-5xl font-extrabold mb-1 transition-all duration-500 group-hover:scale-110 ${isLight ? 'text-slate-900' : 'text-white'}`} />
              <span className={`text-[10px] uppercase tracking-[0.25em] font-bold transition-colors duration-500 ${isLight ? 'text-slate-500 group-hover:text-slate-800' : 'text-slate-400 group-hover:text-white'}`}>Secure Hub</span>
            </motion.div>
            <motion.div variants={fadeUp} className="flex flex-col items-center pt-6 md:pt-0 group">
              <AnimatedCounter value={1} suffix="st" className={`text-4xl md:text-5xl font-extrabold mb-1 transition-all duration-500 group-hover:scale-110 ${isLight ? 'text-teal-500' : 'text-cyan-400'}`} />
              <span className={`text-[10px] uppercase tracking-[0.25em] font-bold transition-colors duration-500 ${isLight ? 'text-slate-500 group-hover:text-teal-600' : 'text-slate-400 group-hover:text-cyan-300'}`}>In Innovation</span>
            </motion.div>
          </motion.div>
        </motion.section>

        {/* =========================================
            3. DYNAMIC BENTO-BOX DASHBOARD 
            ========================================= */}
        <section id="ecosystem" className="w-full pt-32 pb-24 flex flex-col items-center relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUp} className="text-center mb-16 px-4">
            <h2 className={`text-4xl md:text-6xl font-bold mb-4 tracking-tight transition-colors duration-500 ${isLight ? 'text-slate-900' : 'text-white'}`}>Collabs Workspace</h2>
            <p className={`max-w-xl mx-auto font-light text-lg transition-colors duration-500 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Your centralized hub for community, productivity, and innovation.</p>
          </motion.div>

          <motion.div 
            ref={gridRef} onMouseMove={handleMouseMove}
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer} 
            className="flex flex-col gap-10 max-w-7xl mx-auto px-6 w-full"
          >
            {/* GROUP 1: CORE PLATFORMS */}
            <div>
              <div className={`flex items-center gap-4 mb-6 ${isLight ? 'text-slate-800' : 'text-white'}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-sm ${isLight ? 'bg-white border border-slate-200 text-indigo-500' : 'bg-white/5 border border-white/10 text-blue-400'}`}>
                  <i className="fa-solid fa-layer-group"></i>
                </div>
                <h3 className="text-2xl font-bold tracking-tight">Core Platforms</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* DROP (Spans 2 cols) */}
                <motion.a 
                  href="https://drop.collabs.eu.org/" variants={fadeUp} whileHover={{ y: -8, scale: 1.01 }}
                  className={`spotlight-card col-span-1 md:col-span-2 relative p-8 rounded-[40px] transition-all duration-500 group overflow-hidden flex flex-col justify-end min-h-75 backdrop-blur-xl ${isLight ? 'bg-white/80 border border-white shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-10px_rgba(99,102,241,0.15)] hover:border-indigo-200' : 'bg-[#0a0a0a]/90 border border-white/10 hover:border-white/20 hover:bg-white/5 shadow-2xl'}`}
                >
                  <div className={`absolute inset-0 bg-linear-to-br pointer-events-none transition-opacity duration-700 ${isLight ? 'from-indigo-50/80 to-transparent opacity-0 group-hover:opacity-100' : 'from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100'}`}></div>
                  
                  {/* WATER DROP ICON FOR COLLABS DROP */}
                  <i className={`fa-solid fa-droplet text-7xl mb-auto mt-4 transition-all duration-500 spotlight-content group-hover:scale-110 origin-left ${isLight ? 'text-indigo-100 group-hover:text-indigo-500' : 'text-white/10 group-hover:text-blue-400'}`}></i>
                  
                  <div className="relative z-10 mt-8 spotlight-content">
                    <span className={`px-4 py-1.5 text-[10px] font-bold rounded-full uppercase tracking-widest mb-4 inline-block border transition-colors ${isLight ? 'bg-indigo-50 text-indigo-600 border-indigo-200' : 'bg-white/5 text-slate-300 border-white/10'}`}>Social Hub</span>
                    <h3 className={`text-3xl font-extrabold mb-2 tracking-tight transition-colors ${isLight ? 'text-slate-900' : 'text-white'}`}>Collabs Drop</h3>
                    <p className={`text-sm leading-relaxed max-w-md font-medium transition-colors ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Every drop of knowledge creates an ocean of innovation. Share academic insights and build community.</p>
                  </div>
                </motion.a>

                {/* FLOW */}
                <motion.a 
                  href="https://flow.collabs.eu.org/" variants={fadeUp} whileHover={{ y: -8, scale: 1.02 }}
                  className={`spotlight-card col-span-1 p-8 rounded-[40px] transition-all duration-500 group flex flex-col items-start justify-between min-h-75 backdrop-blur-xl ${isLight ? 'bg-white/80 border border-white shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] hover:border-cyan-200 hover:shadow-[0_20px_40px_-10px_rgba(6,182,212,0.15)]' : 'bg-[#0a0a0a]/90 border border-white/10 hover:border-white/20 hover:bg-white/5 shadow-2xl'}`}
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-all duration-500 spotlight-content border group-hover:-rotate-12 ${isLight ? 'bg-cyan-50 text-cyan-500 border-cyan-100 group-hover:bg-cyan-500 group-hover:text-white' : 'bg-white/5 text-white/50 border-white/10 group-hover:bg-cyan-500 group-hover:text-white'}`}>
                    <i className="fa-solid fa-bolt"></i>
                  </div>
                  <div className="spotlight-content mt-6">
                    <h3 className={`text-2xl font-bold mb-2 tracking-tight transition-colors ${isLight ? 'text-slate-900' : 'text-white'}`}>Flow</h3>
                    <p className={`text-sm font-medium leading-relaxed transition-colors ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Productivity dashboard & focus timer.</p>
                  </div>
                </motion.a>

                {/* MAIL */}
                <motion.a 
                  href="https://mail.collabs.eu.org/" variants={fadeUp} whileHover={{ y: -8, scale: 1.02 }}
                  className={`spotlight-card col-span-1 p-8 rounded-[40px] transition-all duration-500 group flex flex-col items-start justify-between min-h-75 backdrop-blur-xl ${isLight ? 'bg-white/80 border border-white shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] hover:border-blue-200 hover:shadow-[0_20px_40px_-10px_rgba(59,130,246,0.15)]' : 'bg-[#0a0a0a]/90 border border-white/10 hover:border-white/20 hover:bg-white/5 shadow-2xl'}`}
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-all duration-500 spotlight-content border group-hover:scale-110 ${isLight ? 'bg-blue-50 text-blue-500 border-blue-100 group-hover:bg-blue-500 group-hover:text-white' : 'bg-white/5 text-white/50 border-white/10 group-hover:bg-blue-500 group-hover:text-white'}`}>
                    <i className="fa-solid fa-envelope"></i>
                  </div>
                  <div className="spotlight-content mt-6">
                    <h3 className={`text-2xl font-bold mb-2 tracking-tight transition-colors ${isLight ? 'text-slate-900' : 'text-white'}`}>Mail</h3>
                    <p className={`text-sm font-medium leading-relaxed transition-colors ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Official internal communications.</p>
                  </div>
                </motion.a>
              </div>
            </div>

            {/* GROUP 2: CAMPUS INFRASTRUCTURE */}
            <div className="mt-8">
              <div className={`flex items-center gap-4 mb-6 ${isLight ? 'text-slate-800' : 'text-white'}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-sm ${isLight ? 'bg-white border border-slate-200 text-teal-500' : 'bg-white/5 border border-white/10 text-teal-400'}`}>
                  <i className="fa-solid fa-server"></i>
                </div>
                <h3 className="text-2xl font-bold tracking-tight">Campus Infrastructure</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* EVOTE */}
                <motion.a 
                  href="https://evote.collabs.eu.org/" variants={fadeUp} whileHover={{ y: -8, scale: 1.02 }}
                  className={`spotlight-card col-span-1 md:col-span-2 p-8 rounded-[40px] transition-all duration-500 group flex items-center gap-8 overflow-hidden relative backdrop-blur-xl ${isLight ? 'bg-white/80 border border-white shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] hover:border-teal-200 hover:shadow-[0_20px_40px_-10px_rgba(20,184,166,0.15)]' : 'bg-[#0a0a0a]/90 border border-white/10 hover:border-white/20 hover:bg-white/5 shadow-2xl'}`}
                >
                  <div className={`w-20 h-20 shrink-0 rounded-3xl flex items-center justify-center text-3xl transition-all duration-500 spotlight-content border group-hover:rotate-6 ${isLight ? 'bg-teal-50 text-teal-600 border-teal-100 group-hover:bg-teal-500 group-hover:text-white' : 'bg-white/5 text-white/50 border-white/10 group-hover:bg-teal-500 group-hover:text-white'}`}>
                    <i className="fa-solid fa-check-to-slot"></i>
                  </div>
                  <div className="spotlight-content">
                    <span className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-widest mb-3 inline-block border transition-colors ${isLight ? 'bg-teal-50 text-teal-600 border-teal-200' : 'bg-white/5 text-slate-300 border-white/10'}`}>Live</span>
                    <h3 className={`text-2xl font-bold mb-2 tracking-tight transition-colors ${isLight ? 'text-slate-900' : 'text-white'}`}>Collabs eVote</h3>
                    <p className={`text-sm font-medium leading-relaxed transition-colors ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Zero-trust cryptographic digital election ecosystem.</p>
                  </div>
                </motion.a>

                {/* UTILITIES (QR & Attendance) */}
                <motion.div variants={fadeUp} className="col-span-1 grid grid-rows-2 gap-6">
                  <motion.a href="/eAttendance.exe" download whileHover={{ x: 5 }} className={`spotlight-card p-6 rounded-4xl transition-all flex items-center gap-6 group overflow-hidden backdrop-blur-xl ${isLight ? 'bg-white/80 border border-white shadow-sm hover:border-emerald-300 hover:shadow-md' : 'bg-[#0a0a0a]/90 border border-white/10 hover:border-emerald-500/30 shadow-xl'}`}>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl transition-all duration-500 spotlight-content border ${isLight ? 'bg-emerald-50 text-emerald-500 border-emerald-100 group-hover:bg-emerald-500 group-hover:text-white' : 'bg-white/5 text-white/50 border-white/10 group-hover:bg-emerald-500 group-hover:text-white'}`}>
                      <i className="fa-solid fa-clipboard-user"></i>
                    </div>
                    <h3 className={`text-lg font-bold spotlight-content transition-colors ${isLight ? 'text-slate-700 group-hover:text-emerald-700' : 'text-slate-300 group-hover:text-white'}`}>eAttendance</h3>
                  </motion.a>

                  <motion.a href="https://www.qrlab.eu.org" whileHover={{ x: 5 }} className={`spotlight-card p-6 rounded-4xl transition-all flex items-center gap-6 group overflow-hidden backdrop-blur-xl ${isLight ? 'bg-white/80 border border-white shadow-sm hover:border-slate-300 hover:shadow-md' : 'bg-[#0a0a0a]/90 border border-white/10 hover:border-slate-500/30 shadow-xl'}`}>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl transition-all duration-500 spotlight-content border ${isLight ? 'bg-slate-100 text-slate-500 border-slate-200 group-hover:bg-slate-800 group-hover:text-white' : 'bg-white/5 text-white/50 border-white/10 group-hover:bg-slate-300 group-hover:text-black'}`}>
                      <i className="fa-solid fa-qrcode"></i>
                    </div>
                    <h3 className={`text-lg font-bold spotlight-content transition-colors ${isLight ? 'text-slate-700 group-hover:text-slate-900' : 'text-slate-300 group-hover:text-white'}`}>QR Lab</h3>
                  </motion.a>
                </motion.div>
              </div>
            </div>

          </motion.div>
        </section>

        {/* =========================================
            4. EPIC FOOTER CARD
            ========================================= */}
        <section className="w-full px-4 pb-12 relative z-10 mt-10">
          <motion.footer 
            initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
            className={`max-w-7xl mx-auto rounded-[48px] p-10 md:p-16 relative overflow-hidden transition-all duration-700 backdrop-blur-2xl ${isLight ? 'bg-white/90 border border-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)]' : 'bg-[#050505]/95 border border-white/10 shadow-2xl'}`}
          >
            <div className={`absolute top-0 right-0 w-125 h-125 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none transition-colors duration-700 ${isLight ? 'bg-indigo-200/50' : 'bg-blue-600/20'}`}></div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16 relative z-10">
              <div className="md:col-span-2">
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center p-1 border shadow-sm ${isLight ? 'bg-white border-slate-100' : 'bg-white border-transparent'}`}>
                    <Image src="/logo2.png" alt="Collabs Logo" width={40} height={40} className="w-full h-full object-contain" />
                  </div>
                  <span className={`text-3xl font-extrabold tracking-tight transition-colors ${isLight ? 'text-slate-900' : 'text-white'}`}>Collabs</span>
                </div>
                <p className={`text-base leading-relaxed max-w-md mb-8 font-medium transition-colors ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  A 100% student-led digital learning and innovation ecosystem bridging the geographical and educational divide across Pakistan.
                </p>
                <button id="shareBtn" onClick={handleShare} className={`flex items-center gap-3 text-sm font-bold border px-6 py-3 rounded-full w-fit transition-all hover:scale-105 active:scale-95 ${isLight ? 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200 shadow-sm' : 'bg-white/10 hover:bg-white/20 text-white border-white/20'}`}>
                  <i className="fa-solid fa-share-nodes"></i> Share Collabs Network
                </button>
              </div>

              <div>
                <h4 className={`text-sm font-bold mb-6 tracking-widest uppercase transition-colors ${isLight ? 'text-slate-900' : 'text-white'}`}>Ecosystem</h4>
                <ul className={`space-y-4 font-medium transition-colors ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  <li><a href="https://drop.collabs.eu.org/" className={`transition-colors flex items-center gap-3 ${isLight ? 'hover:text-indigo-600' : 'hover:text-white'}`}><div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div> Drop</a></li>
                  <li><a href="https://mail.collabs.eu.org/" className={`transition-colors flex items-center gap-3 ${isLight ? 'hover:text-blue-600' : 'hover:text-white'}`}><div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> Mail</a></li>
                  <li><a href="https://flow.collabs.eu.org/" className={`transition-colors flex items-center gap-3 ${isLight ? 'hover:text-cyan-600' : 'hover:text-white'}`}><div className="w-1.5 h-1.5 rounded-full bg-cyan-500"></div> Flow</a></li>
                  <li><a href="https://evote.collabs.eu.org/" className={`transition-colors flex items-center gap-3 ${isLight ? 'hover:text-teal-600' : 'hover:text-white'}`}><div className="w-1.5 h-1.5 rounded-full bg-teal-500"></div> eVote</a></li>
                </ul>
              </div>

              <div>
                <h4 className={`text-sm font-bold mb-6 tracking-widest uppercase transition-colors ${isLight ? 'text-slate-900' : 'text-white'}`}>Connect</h4>
                <div className="flex gap-3 mb-8">
                  <a href="https://wa.me/923393152023" className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all hover:scale-110 hover:border-transparent hover:text-white hover:bg-[#10B981] ${isLight ? 'bg-white border-slate-200 text-slate-500 shadow-sm' : 'bg-white/5 border-white/10 text-slate-300'}`}><i className="fa-brands fa-whatsapp text-lg"></i></a>
                  <a href="https://www.instagram.com/akhsscollabs" className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all hover:scale-110 hover:border-transparent hover:text-white hover:bg-[#E1306C] ${isLight ? 'bg-white border-slate-200 text-slate-500 shadow-sm' : 'bg-white/5 border-white/10 text-slate-300'}`}><i className="fa-brands fa-instagram text-lg"></i></a>
                  <a href="https://www.youtube.com/@akhsscollabs" className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all hover:scale-110 hover:border-transparent hover:text-white hover:bg-[#EF4444] ${isLight ? 'bg-white border-slate-200 text-slate-500 shadow-sm' : 'bg-white/5 border-white/10 text-slate-300'}`}><i className="fa-brands fa-youtube text-lg"></i></a>
                </div>
                <a href="https://registration.collabs.eu.org/" target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-500 hover:text-indigo-600 font-bold transition-colors flex items-center gap-2 group">
                  Join the Network <i className="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
                </a>
              </div>
            </div>

            <div className={`border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4 relative z-10 transition-colors ${isLight ? 'border-slate-200' : 'border-white/10'}`}>
              <p className={`text-sm font-medium transition-colors ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>
                &copy; {new Date().getFullYear()} Collabs Developers Community.
              </p>
              <div className={`flex gap-8 text-sm font-medium transition-colors ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>
                <a href="http://drive.google.com/drive/folders/15QejNR1Y4qfbr9FpE58o5drtKBcGkyg8?usp=sharing" target="_blank" rel="noopener noreferrer" className={`transition-colors ${isLight ? 'hover:text-slate-900' : 'hover:text-white'}`}>Documentation</a>
                <button onClick={() => setIsPrivacyOpen(true)} className={`transition-colors text-left ${isLight ? 'hover:text-slate-900' : 'hover:text-white'}`}>Privacy Policy</button>
              </div>
            </div>
          </motion.footer>
        </section>

        <ChatModal isLight={isLight} />
      </motion.div>
    </div>
  );
}