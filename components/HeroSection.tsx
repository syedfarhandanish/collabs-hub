'use client';

import { motion, Variants } from 'framer-motion';
import Image from 'next/image';
import AnimatedCounter from '@/components/AnimatedCounter';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

export default function HeroSection({ isLight }: { isLight: boolean }) {
  return (
    <>
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
    </>
  );
}