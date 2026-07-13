'use client';

import { useRef, useCallback } from 'react';
import { motion, Variants } from 'framer-motion';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};
const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

export default function WorkspaceSection({ isLight }: { isLight: boolean }) {
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

  return (
    <section id="ecosystem" className="w-full pt-10 md:pt-16 pb-16 md:pb-24 flex flex-col items-center relative z-10">
      <style dangerouslySetInnerHTML={{__html: `
        .spotlight-card::before {
          content: ""; height: 100%; width: 100%; left: 0px; top: 0px; position: absolute;
          background: radial-gradient(800px circle at var(--mouse-x) var(--mouse-y), ${isLight ? 'rgba(99, 102, 241, 0.08)' : 'rgba(34, 211, 238, 0.08)'}, transparent 40%);
          z-index: 1; opacity: 0; transition: opacity 300ms ease; pointer-events: none;
        }
        .spotlight-card:hover::before { opacity: 1; }
        .spotlight-content { position: relative; z-index: 2; }
      `}} />

      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUp} className="text-center mb-12 md:mb-16 px-4">
        <h2 className={`text-3xl md:text-6xl font-bold mb-4 tracking-tight transition-colors duration-500 ${isLight ? 'text-slate-900' : 'text-white'}`}>Collabs Workspace</h2>
        <p className={`max-w-xl mx-auto font-medium text-base md:text-lg transition-colors duration-500 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Your centralized hub for community, productivity, and innovation.</p>
      </motion.div>

      <motion.div ref={gridRef} onMouseMove={handleMouseMove} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer} className="flex flex-col gap-8 md:gap-10 max-w-7xl mx-auto px-4 md:px-6 w-full">
        <div>
          <div className={`flex items-center gap-3 md:gap-4 mb-4 md:mb-6 ${isLight ? 'text-slate-800' : 'text-white'}`}>
            <div className={`w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center text-lg md:text-xl shadow-sm border transition-colors ${isLight ? 'bg-white border-slate-200 text-indigo-500' : 'bg-white/5 border-white/10 text-blue-400'}`}>
              <i className="fa-solid fa-layer-group"></i>
            </div>
            <h3 className="text-xl md:text-2xl font-bold tracking-tight">Core Platforms</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <motion.a href="https://drop.collabs.eu.org/" variants={fadeUp} whileHover={{ y: -4 }} className={`spotlight-card col-span-1 md:col-span-2 relative p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] transition-all duration-300 group overflow-hidden flex flex-col justify-end min-h-[250px] md:min-h-75 backdrop-blur-2xl transform-gpu ${isLight ? 'bg-white/70 border border-slate-200 shadow-lg hover:shadow-2xl hover:shadow-indigo-500/20 hover:border-indigo-200' : 'bg-[#0a0a0a]/70 border border-white/10 shadow-2xl hover:shadow-[0_0_40px_rgba(34,211,238,0.15)] hover:border-white/20'}`}>
              <div className={`absolute inset-0 bg-gradient-to-b pointer-events-none transition-opacity duration-500 ${isLight ? 'from-indigo-50/80 to-transparent opacity-0 group-hover:opacity-100' : 'from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100'}`}></div>
              <i className={`fa-solid fa-droplet text-5xl md:text-7xl mb-auto mt-2 md:mt-4 transition-all duration-500 spotlight-content group-hover:scale-105 origin-left ${isLight ? 'text-indigo-100 group-hover:text-indigo-500' : 'text-white/10 group-hover:text-blue-400'}`}></i>
              <div className="relative z-10 mt-6 md:mt-8 spotlight-content">
                <span className={`px-3 md:px-4 py-1 md:py-1.5 text-[10px] font-bold rounded-full uppercase tracking-widest mb-3 md:mb-4 inline-block border transition-colors ${isLight ? 'bg-indigo-50 text-indigo-600 border-indigo-200' : 'bg-cyan-950/40 text-cyan-400 border-cyan-800'}`}>Social Hub</span>
                <h3 className={`text-2xl md:text-3xl font-extrabold mb-2 tracking-tight transition-colors ${isLight ? 'text-slate-900' : 'text-white'}`}>Collabs Drop</h3>
                <p className={`text-xs md:text-sm leading-relaxed max-w-md font-medium transition-colors ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Every drop of knowledge creates an ocean of innovation. Share academic insights and build community.</p>
              </div>
            </motion.a>

            <motion.a href="https://flow.collabs.eu.org/" variants={fadeUp} whileHover={{ y: -4 }} className={`spotlight-card col-span-1 p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] transition-all duration-300 group flex flex-col items-start justify-between min-h-[200px] md:min-h-75 backdrop-blur-2xl transform-gpu ${isLight ? 'bg-white/70 border border-slate-200 shadow-lg hover:shadow-2xl hover:border-cyan-200 hover:shadow-cyan-500/20' : 'bg-[#0a0a0a]/70 border border-white/10 shadow-2xl hover:border-white/20'}`}>
              <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center text-xl md:text-2xl transition-all duration-300 spotlight-content border group-hover:-rotate-12 ${isLight ? 'bg-cyan-50 text-cyan-500 border-cyan-100 group-hover:bg-cyan-500 group-hover:text-white' : 'bg-white/5 text-white/50 border-white/10 group-hover:bg-cyan-500 group-hover:text-white'}`}>
                <i className="fa-solid fa-bolt"></i>
              </div>
              <div className="spotlight-content mt-4 md:mt-6">
                <h3 className={`text-xl md:text-2xl font-bold mb-1 md:mb-2 tracking-tight transition-colors ${isLight ? 'text-slate-900' : 'text-white'}`}>Flow</h3>
                <p className={`text-xs md:text-sm font-medium leading-relaxed transition-colors ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Productivity dashboard & focus timer.</p>
              </div>
            </motion.a>

            <motion.a href="https://mail.collabs.eu.org/" variants={fadeUp} whileHover={{ y: -4 }} className={`spotlight-card col-span-1 p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] transition-all duration-300 group flex flex-col items-start justify-between min-h-[200px] md:min-h-75 backdrop-blur-2xl transform-gpu ${isLight ? 'bg-white/70 border border-slate-200 shadow-lg hover:shadow-2xl hover:border-blue-200 hover:shadow-blue-500/20' : 'bg-[#0a0a0a]/70 border border-white/10 shadow-2xl hover:border-white/20'}`}>
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

        <div className="mt-6 md:mt-8">
          <div className={`flex items-center gap-3 md:gap-4 mb-4 md:mb-6 ${isLight ? 'text-slate-800' : 'text-white'}`}>
            <div className={`w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center text-lg md:text-xl shadow-sm border transition-colors ${isLight ? 'bg-white border-slate-200 text-teal-500' : 'bg-white/5 border-white/10 text-teal-400'}`}>
              <i className="fa-solid fa-server"></i>
            </div>
            <h3 className="text-xl md:text-2xl font-bold tracking-tight">Campus Infrastructure</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <motion.a href="https://evote.collabs.eu.org/" variants={fadeUp} whileHover={{ y: -4 }} className={`spotlight-card col-span-1 md:col-span-2 p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] transition-all duration-300 group flex items-center gap-6 md:gap-8 overflow-hidden relative backdrop-blur-2xl transform-gpu ${isLight ? 'bg-white/70 border border-slate-200 shadow-lg hover:shadow-2xl hover:border-teal-200 hover:shadow-teal-500/20' : 'bg-[#0a0a0a]/70 border border-white/10 shadow-2xl hover:border-white/20'}`}>
              <div className={`w-16 h-16 md:w-20 md:h-20 shrink-0 rounded-2xl md:rounded-3xl flex items-center justify-center text-2xl md:text-3xl transition-all duration-300 spotlight-content border group-hover:rotate-6 ${isLight ? 'bg-teal-50 text-teal-600 border-teal-100 group-hover:bg-teal-500 group-hover:text-white' : 'bg-white/5 text-white/50 border-white/10 group-hover:bg-teal-500 group-hover:text-white'}`}>
                <i className="fa-solid fa-check-to-slot"></i>
              </div>
              <div className="spotlight-content">
                <span className={`px-2 py-1 md:px-3 md:py-1 text-[10px] font-bold rounded-full uppercase tracking-widest mb-2 md:mb-3 inline-block border transition-colors ${isLight ? 'bg-teal-50 text-teal-600 border-teal-200' : 'bg-white/5 text-slate-300 border-white/10'}`}>Live</span>
                <h3 className={`text-xl md:text-2xl font-bold mb-1 md:mb-2 tracking-tight transition-colors ${isLight ? 'text-slate-900' : 'text-white'}`}>Collabs eVote</h3>
                <p className={`text-xs md:text-sm font-medium leading-relaxed transition-colors ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Zero-trust cryptographic digital election ecosystem.</p>
              </div>
            </motion.a>

            <motion.div variants={fadeUp} className="col-span-1 grid grid-rows-2 gap-4 md:gap-6">
              <motion.a href="/eAttendance.exe" download whileHover={{ x: 5 }} className={`spotlight-card p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] transition-all duration-300 flex items-center gap-4 md:gap-6 group overflow-hidden backdrop-blur-xl border transform-gpu ${isLight ? 'bg-white/80 border-slate-200 shadow-md hover:shadow-lg hover:border-emerald-200' : 'bg-[#0a0a0a]/80 border-white/10 shadow-xl hover:border-white/20 hover:bg-white/5'}`}>
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center text-lg md:text-xl transition-all duration-300 spotlight-content border ${isLight ? 'bg-emerald-50 text-emerald-500 border-emerald-100 group-hover:bg-emerald-500 group-hover:text-white' : 'bg-white/5 text-white/50 border-white/10 group-hover:bg-emerald-500 group-hover:text-white'}`}>
                  <i className="fa-solid fa-clipboard-user"></i>
                </div>
                <h3 className={`text-base md:text-lg font-bold spotlight-content transition-colors ${isLight ? 'text-slate-700 group-hover:text-emerald-600' : 'text-slate-300 group-hover:text-white'}`}>eAttendance</h3>
              </motion.a>

              <motion.a href="https://www.qrlab.eu.org" whileHover={{ x: 5 }} className={`spotlight-card p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] transition-all duration-300 flex items-center gap-4 md:gap-6 group overflow-hidden backdrop-blur-xl border transform-gpu ${isLight ? 'bg-white/80 border-slate-200 shadow-md hover:shadow-lg hover:border-slate-400' : 'bg-[#0a0a0a]/80 border-white/10 shadow-xl hover:border-white/20 hover:bg-white/5'}`}>
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center text-lg md:text-xl transition-all duration-300 spotlight-content border ${isLight ? 'bg-slate-50 text-slate-500 border-slate-200 group-hover:bg-slate-800 group-hover:text-white' : 'bg-white/5 text-white/50 border-white/10 group-hover:bg-slate-200 group-hover:text-black'}`}>
                  <i className="fa-solid fa-qrcode"></i>
                </div>
                <h3 className={`text-base md:text-lg font-bold spotlight-content transition-colors ${isLight ? 'text-slate-700 group-hover:text-slate-900' : 'text-slate-300 group-hover:text-white'}`}>QR Lab</h3>
              </motion.a>
            </motion.div>

            <motion.a href="https://docs.collabs.eu.org/" variants={fadeUp} whileHover={{ y: -4 }} className={`spotlight-card col-span-1 p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] transition-all duration-300 group flex flex-col items-start justify-between min-h-[200px] md:min-h-75 backdrop-blur-2xl transform-gpu ${isLight ? 'bg-white/70 border border-slate-200 shadow-lg hover:shadow-2xl hover:border-purple-200 hover:shadow-purple-500/20' : 'bg-[#0a0a0a]/70 border border-white/10 shadow-2xl hover:border-white/20'}`}>
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
  );
}