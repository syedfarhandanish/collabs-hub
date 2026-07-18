'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface GlobalModalsProps {
  isLight: boolean;
  isCmdOpen: boolean;
  setIsCmdOpen: (val: boolean) => void;
  isPrivacyOpen: boolean;
  setIsPrivacyOpen: (val: boolean) => void;
  selectedEvent: any;
  setSelectedEvent: (val: any) => void;
}

export default function GlobalModals({ isLight, isCmdOpen, setIsCmdOpen, isPrivacyOpen, setIsPrivacyOpen, selectedEvent, setSelectedEvent }: GlobalModalsProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const searchLinks = [
    { name: 'Collabs Drop', url: 'https://drop.collabs.eu.org/', icon: 'fa-droplet', color: 'text-blue-500' },
    { name: 'Collabs Flow', url: 'https://flow.collabs.eu.org/', icon: 'fa-bolt', color: 'text-cyan-500' },
    { name: 'Collabs Mail', url: 'https://mail.collabs.eu.org/', icon: 'fa-envelope', color: 'text-indigo-500' },
    { name: 'Collabs eVote', url: 'https://evote.collabs.eu.org/', icon: 'fa-check-to-slot', color: 'text-teal-500' },
    { name: 'QR Lab', url: 'https://www.qrlab.eu.org', icon: 'fa-qrcode', color: 'text-slate-400' },
    { name: 'Collabs Docs', url: 'https://docs.collabs.eu.org/', icon: 'fa-book-open', color: 'text-purple-500' },
    { name: 'Collabs Scholar', url: 'https://scholar.collabs.eu.org/', icon: 'fa-graduation-cap', color: 'text-rose-500' },
  ].filter(link => link.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <>
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
                
                {/* Privacy content points simplified for brevity in view, acts same as yours */}
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

                <h3 className={`text-lg md:text-xl font-bold mt-6 md:mt-8 mb-3 md:mb-4 ${isLight ? 'text-slate-900' : 'text-white'}`}>Your Rights</h3>
                <ul className="list-disc pl-5 space-y-1.5 md:space-y-2">
                  <li>Right to access your data anytime</li>
                  <li>Right to correct inaccurate information</li>
                  <li>Right to request deletion upon leaving the community</li>
                  <li>Right to file a complaint via official support channels</li>
                </ul>
                
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

      {/* 3. DYNAMIC EVENT SUMMARY MODAL */}
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
                className={`absolute top-4 right-4 md:top-6 md:right-6 z-100 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all hover:rotate-90 backdrop-blur-md border shadow-lg ${
                  isLight ? 'bg-white/90 text-slate-800 border-slate-200 hover:bg-slate-100' : 'bg-black/60 text-white border-white/20 hover:bg-white/20'
                }`}
              >
                <i className="fa-solid fa-xmark text-base md:text-lg"></i>
              </button>

              <div className="w-full lg:w-2/5 flex flex-col relative shrink-0 h-auto min-h-[40vh] max-h-[50vh] lg:max-h-none lg:h-full overflow-y-auto border-b lg:border-b-0 lg:border-r border-white/10 bg-black custom-scrollbar scroll-smooth" style={{ WebkitOverflowScrolling: 'touch' }}>
                <div className="absolute inset-0 pointer-events-none">
                  <Image src={selectedEvent.image} alt={selectedEvent.title} fill className={`object-cover ${selectedEvent.id === 1 ? 'object-right' : 'object-center'}`} />
                  <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/60 to-black/10"></div>
                </div>
                
                <div className="relative z-10 min-h-24 md:min-h-32 lg:flex-1 shrink-0"></div>
                
                <div className="relative z-10 p-6 md:p-8 lg:p-10 flex flex-col gap-4 mt-auto">
                  <span className={`px-3 py-1 text-[10px] md:text-xs font-bold rounded-lg uppercase tracking-widest border w-fit backdrop-blur-md ${isLight ? 'bg-white/90 text-indigo-700 border-white/40 shadow-sm' : 'bg-black/60 text-cyan-400 border-white/20'}`}>
                    {selectedEvent.category}
                  </span>
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight drop-shadow-lg text-white">
                    {selectedEvent.title}
                  </h2>
                  <div className={`mt-2 md:mt-4 space-y-2 md:space-y-3 text-xs md:text-sm font-medium p-4 md:p-5 rounded-xl md:rounded-2xl backdrop-blur-md border ${isLight ? 'bg-white/90 border-white/50 text-slate-800 shadow-sm' : 'bg-black/50 border-white/10 text-slate-300'}`}>
                    <div className="flex items-start gap-3"><i className="fa-regular fa-calendar mt-0.5 opacity-70 w-4 text-center"></i><p>{selectedEvent.details.dateFull}</p></div>
                    <div className="flex items-start gap-3"><i className="fa-solid fa-video mt-0.5 opacity-70 w-4 text-center"></i><p>{selectedEvent.type}</p></div>
                    <div className="flex items-start gap-3"><i className="fa-solid fa-user-tie mt-0.5 opacity-70 w-4 text-center"></i><p>Hosted by {selectedEvent.details.hostedBy}</p></div>
                  </div>

                  <a href="/First Meeting - Collabs Launch - Summary.pdf" download className={`mt-2 md:mt-4 w-full py-3 px-4 rounded-xl md:rounded-2xl text-xs md:text-sm font-bold transition-all flex items-center justify-center gap-2 md:gap-3 backdrop-blur-md border shadow-sm ${isLight ? 'bg-white/90 border-white/50 text-indigo-700 hover:bg-indigo-50' : 'bg-black/50 border-white/20 text-cyan-400 hover:bg-white/10'}`}>
                    <i className="fa-solid fa-file-arrow-down text-base md:text-lg"></i> Download Official Summary
                  </a>
                </div>
              </div>

              <div className={`w-full lg:w-3/5 flex-1 overflow-y-auto p-6 md:p-10 lg:p-14 custom-scrollbar scroll-smooth ${isLight ? 'bg-white text-slate-700' : 'bg-[#0a0a0a] text-slate-300'}`} style={{ WebkitOverflowScrolling: 'touch' }}>
                <div className="max-w-2xl mx-auto space-y-8 md:space-y-12">
                  {selectedEvent.details.sections.map((section: any, index: number) => (
                    <div key={index} className="space-y-3 md:space-y-4">
                      <h3 className={`text-base md:text-lg font-bold tracking-widest uppercase flex items-center gap-3 md:gap-4 ${isLight ? 'text-indigo-600' : 'text-cyan-400'}`}>
                        {section.title}
                        <span className={`h-px flex-1 ${isLight ? 'bg-slate-200' : 'bg-white/10'}`}></span>
                      </h3>
                      <p className="text-sm md:text-base lg:text-lg leading-relaxed font-medium">{section.body}</p>
                    </div>
                  ))}
                  <div className={`pt-6 md:pt-8 border-t flex flex-col items-center text-center opacity-60 ${isLight ? 'border-slate-200' : 'border-white/10'}`}>
                    <Image src="/logo2.png" alt="Collabs Logo" width={28} height={28} className="mb-3 md:mb-4 opacity-50 grayscale md:w-8 md:h-8" />
                    <p className="text-[10px] md:text-xs font-bold tracking-widest uppercase">Collabs Internal Summary</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        @media (min-width: 768px) { .custom-scrollbar::-webkit-scrollbar { width: 6px; } }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: ${isLight ? '#cbd5e1' : '#333'}; border-radius: 10px; }
      `}} />
    </>
  );
}