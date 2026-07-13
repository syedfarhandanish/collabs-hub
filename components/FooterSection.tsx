'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function FooterSection({ isLight, setIsPrivacyOpen }: { isLight: boolean, setIsPrivacyOpen: (val: boolean) => void }) {
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

  return (
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
            <button onClick={handleShare} className={`flex items-center gap-3 text-xs md:text-sm font-bold border px-5 py-2.5 md:px-6 md:py-3 rounded-full w-fit transition-all hover:scale-105 active:scale-95 ${isLight ? 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200 shadow-sm' : 'bg-white/10 hover:bg-white/20 text-white border-white/20'}`}>
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
  );
}