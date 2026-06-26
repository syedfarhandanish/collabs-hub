'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface ChatModalProps {
  isLight: boolean;
}

// ==========================================
// CUSTOM AI AVATAR COMPONENT (DP)
// ==========================================
const AiAvatar = ({ size = 'lg', isLight }: { size?: 'lg' | 'sm', isLight: boolean }) => {
  const dim = size === 'lg' ? 'w-12 h-12' : 'w-8 h-8';
  const iconSize = size === 'lg' ? 'text-xl' : 'text-xs';
  const borderRadius = size === 'lg' ? 'rounded-2xl' : 'rounded-xl';
  const innerRadius = size === 'lg' ? 'rounded-[14px]' : 'rounded-[10px]';

  return (
    <div className={`relative flex items-center justify-center shrink-0 ${borderRadius} bg-linear-to-tr from-blue-500 via-indigo-500 to-purple-500 p-0.5 shadow-lg ${dim}`}>
      {/* Outer animated glow */}
      <div className={`absolute inset-0 ${borderRadius} bg-white/30 animate-pulse`} style={{ animationDuration: '2s' }}></div>
      
      {/* Inner Core */}
      <div className={`w-full h-full flex items-center justify-center z-10 ${innerRadius} ${isLight ? 'bg-white' : 'bg-[#0b0f19]'}`}>
        <i className={`fa-solid fa-robot text-transparent bg-clip-text bg-linear-to-r ${isLight ? 'from-blue-600 to-indigo-600' : 'from-cyan-400 to-blue-500'} ${iconSize}`}></i>
      </div>
    </div>
  );
};


export default function ChatModal({ isLight }: ChatModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: input.trim() };
    setInput('');
    setIsLoading(true);

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    const assistantMessageId = (Date.now() + 1).toString();
    setMessages((prev) => [...prev, { id: assistantMessageId, role: 'assistant', content: '' }]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!response.ok) throw new Error('HTTP Error');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          accumulatedText += chunk;
          setMessages((prev) =>
            prev.map((m) => m.id === assistantMessageId ? { ...m, content: accumulatedText } : m)
          );
        }
      }
    } catch (error: any) {
      setMessages((prev) =>
        prev.map((m) => m.id === assistantMessageId ? { ...m, content: `Error: Could not connect to Collabs AI.` } : m)
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* =========================================
          THE CREATIVE LAUNCHER (BOTTOM RIGHT)
          ========================================= */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0, rotate: -90 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0, opacity: 0, rotate: 90 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className={`fixed bottom-6 right-6 z-50 group flex items-center justify-center p-1 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.2)] transition-all overflow-hidden border ${
              isLight ? 'bg-white border-slate-200 hover:shadow-blue-500/20' : 'bg-[#0f172a] border-white/10 hover:shadow-cyan-500/20'
            }`}
          >
            <div className={`flex items-center justify-center h-14 rounded-full pl-2 pr-5 gap-3 transition-colors ${
              isLight ? 'group-hover:bg-slate-50' : 'group-hover:bg-white/5'
            }`}>
              <AiAvatar size="sm" isLight={isLight} />
              <span className={`font-bold text-sm tracking-wide ${isLight ? 'text-slate-800' : 'text-white'}`}>
                Ask AI
              </span>
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* =========================================
          FLOATING RIGHT-SIDE PANEL
          ========================================= */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop for Mobile Only */}
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-90"
            />

            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0, transition: { duration: 0.2 } }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              // CHANGED: top-24 pushes it below the Theme Toggle button
              className={`fixed top-24 bottom-4 right-4 md:top-24 md:bottom-6 md:right-6 w-[calc(100vw-32px)] md:w-105 z-100 flex flex-col rounded-[2.5rem] border shadow-[0_30px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden backdrop-blur-2xl ${
                isLight 
                  ? 'bg-white/90 border-slate-200/50 shadow-slate-400/30' 
                  : 'bg-[#050505]/80 border-white/10'
              }`}
            >
              {/* Decorative Glow */}
              {!isLight && <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>}

              {/* 1. HEADER WITH AVATAR */}
              <div className={`px-6 py-5 flex justify-between items-center z-10 border-b ${
                isLight ? 'border-slate-100 bg-white/50' : 'border-white/5 bg-white/2'
              }`}>
                <div className="flex items-center gap-4">
                  <AiAvatar size="lg" isLight={isLight} />
                  <div>
                    <h3 className={`font-extrabold text-base tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      Collabs AI
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                      <span className={`text-[10px] uppercase tracking-widest font-bold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                        Online & Ready
                      </span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setIsOpen(false)} 
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all hover:rotate-90 ${
                    isLight ? 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-900' : 'bg-white/10 text-slate-400 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  <i className="fa-solid fa-xmark text-lg"></i>
                </button>
              </div>

              {/* 2. CREATIVE MESSAGE BOX AREA */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide z-10">
                {messages.length === 0 && (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center h-full text-center px-4">
                    <AiAvatar size="lg" isLight={isLight} />
                    <h4 className={`font-bold text-xl mt-6 mb-2 ${isLight ? 'text-slate-800' : 'text-white'}`}>Welcome to Collabs</h4>
                    <p className={`text-sm leading-relaxed ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                      I am your personal intelligence node. Ask me about the ecosystem, features, or technical support.
                    </p>
                  </motion.div>
                )}
                
                {messages.map((m) => {
                  // CHANGED: Hide the actual empty message bubble while loading
                  if (m.role === 'assistant' && m.content === '') return null;

                  return (
                    <motion.div 
                      key={m.id} 
                      initial={{ opacity: 0, y: 20, scale: 0.95 }} 
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start gap-3'}`}
                    >
                      {m.role === 'assistant' && (
                        <div className="mt-auto shrink-0">
                          <AiAvatar size="sm" isLight={isLight} />
                        </div>
                      )}
                      
                      <div 
                        className={`max-w-[80%] px-5 py-4 rounded-3xl text-sm leading-relaxed whitespace-pre-wrap shadow-sm ${
                          m.role === 'user' 
                            ? `bg-linear-to-br ${isLight ? 'from-blue-600 to-indigo-600' : 'from-indigo-600 to-blue-500'} text-white rounded-br-sm shadow-blue-500/20` 
                            : `${isLight ? 'bg-white border border-slate-100 text-slate-700' : 'bg-white/5 border border-white/10 text-slate-200 backdrop-blur-md'} rounded-bl-sm`
                        }`}
                      >
                        {m.content}
                      </div>
                    </motion.div>
                  );
                })}
                
                {/* Typing Indicator */}
                {isLoading && messages[messages.length - 1]?.content === '' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start gap-3">
                    <div className="mt-auto shrink-0">
                      <AiAvatar size="sm" isLight={isLight} />
                    </div>
                    <div className={`px-5 py-5 rounded-3xl rounded-bl-sm flex gap-1.5 items-center border ${
                      isLight ? 'bg-white border-slate-100 shadow-sm' : 'bg-white/5 border-white/10 backdrop-blur-md'
                    }`}>
                      <span className={`w-2 h-2 rounded-full animate-bounce ${isLight ? 'bg-indigo-400' : 'bg-cyan-400'}`}></span>
                      <span className={`w-2 h-2 rounded-full animate-bounce ${isLight ? 'bg-indigo-400' : 'bg-cyan-400'}`} style={{ animationDelay: '0.15s' }}></span>
                      <span className={`w-2 h-2 rounded-full animate-bounce ${isLight ? 'bg-indigo-400' : 'bg-cyan-400'}`} style={{ animationDelay: '0.3s' }}></span>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* 3. INNOVATIVE INPUT FIELD */}
              <div className={`p-5 pt-2 z-10 ${isLight ? 'bg-white/50' : 'bg-[#050505]/50'}`}>
                <form onSubmit={onSubmit} className={`relative flex items-end p-2 rounded-3xl border transition-all duration-300 shadow-lg ${
                  isLight 
                    ? 'bg-white border-slate-200 focus-within:border-indigo-300 focus-within:shadow-indigo-500/10' 
                    : 'bg-[#111] border-white/10 focus-within:border-white/30 focus-within:bg-[#161616]'
                }`}>
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        onSubmit(e);
                      }
                    }}
                    placeholder="Type a message..."
                    rows={1}
                    className={`flex-1 max-h-32 min-h-11 bg-transparent pl-4 pr-3 py-3 text-sm focus:outline-none resize-none overflow-y-auto ${
                      isLight ? 'text-slate-900 placeholder-slate-400' : 'text-white placeholder-slate-500'
                    }`}
                  />
                  <div className="shrink-0 pl-2 pb-1 pr-1">
                    <button 
                      type="submit" 
                      disabled={isLoading || !input.trim()} 
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 disabled:opacity-40 disabled:scale-100 active:scale-95 ${
                        isLight 
                          ? 'bg-linear-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-indigo-500/20' 
                          : 'bg-white text-black hover:bg-slate-200 shadow-[0_0_15px_rgba(255,255,255,0.2)]'
                      }`}
                    >
                      <i className="fa-solid fa-paper-plane text-sm -ml-0.5"></i>
                    </button>
                  </div>
                </form>
                <div className="mt-3 flex justify-center">
                  <span className={`text-[10px] font-medium tracking-wide ${isLight ? 'text-slate-400' : 'text-slate-600'}`}>
                    Collabs AI can generate creative responses.
                  </span>
                </div>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{__html: `
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </>
  );
}