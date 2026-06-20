'use client';

import { useState } from 'react';
import Card from '@/components/Card';

export default function Home() {
  const [isOverdrive, setIsOverdrive] = useState(false);

  const triggerPowerUp = () => {
    if (isOverdrive) return;
    setIsOverdrive(true);
    setTimeout(() => setIsOverdrive(false), 1800);
  };

  const handleShare = async () => {
    const shareData = {
      title: 'Collabs | E-Learning Initiative',
      text: 'Check out Collabs: A student-led digital learning and innovation ecosystem bridging the educational divide.',
      url: typeof window !== 'undefined' ? window.location.href : ''
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        const btn = document.getElementById('shareBtn');
        if (btn) {
          const originalIcon = btn.innerHTML;
          btn.innerHTML = '<i className="fa-solid fa-check"></i>';
          btn.style.color = '#10B981';
          btn.style.borderColor = '#10B981';
          setTimeout(() => {
            btn.innerHTML = originalIcon;
            btn.style.color = '';
            btn.style.borderColor = '';
          }, 2000);
        }
        alert('Link copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  return (
    <div className={`min-height-wrapper w-full flex flex-col items-center ${isOverdrive ? 'body-overdrive' : ''}`}>
      <header>
        <img 
          src="/logo2.png" 
          alt="Collabs Logo" 
          className={`brand-logo ${isOverdrive ? 'logo-overdrive' : ''}`}
          onClick={triggerPowerUp}
          title="Initialize System"
        />
        <h1 className={isOverdrive ? 'title-overdrive' : ''}>Collabs</h1>
        <p>A 100% student-led digital learning and innovation ecosystem bridging the educational divide. Connect, learn, lead and build the future.</p>
      </header>

      <main className="diamond-layout">
        
        {/* ROW 1: Onboarding Links */}
        <Card 
          href="https://forms.gle/AikxCFxxiRoBKQXx6"
          icon="fa-id-card-clip"
          iconColor="#F59E0B"
          iconBg="rgba(245, 158, 11, 0.1)"
          iconBorder="rgba(245, 158, 11, 0.2)"
          title="Registration"
          description="Join the movement. Enter a unified network of peer mentorship, study groups, and collaborative development."
        />

        <div className="section-divider" aria-hidden="true"></div>

        {/* ROW 2: Core Platform Infrastructure Applications */}
        <Card 
          href="https://drop.collabs.eu.org/"
          icon="fa-layer-group"
          iconColor="#3B82F6"
          iconBg="rgba(59, 130, 246, 0.1)"
          iconBorder="rgba(59, 130, 246, 0.2)"
          title="Collabs Drop"
          description="The central digital square. A secure, high-performance platform where students share academic insights and collaborate using dynamic Drops."
        />

        <Card 
          href="https://mail.collabs.eu.org/"
          icon="fa-envelope"
          iconColor="#8B5CF6"
          iconBg="rgba(139, 92, 246, 0.1)"
          iconBorder="rgba(139, 92, 246, 0.2)"
          title="Collabs Mail"
          description="The custom-built email web application acting as the primary communication infrastructure for the ecosystem."
        />

        <Card 
          href="https://flow.collabs.eu.org/"
          icon="fa-bolt"
          iconColor="#F43F5E"
          iconBg="rgba(244, 63, 94, 0.1)"
          iconBorder="rgba(244, 63, 94, 0.2)"
          title="Collabs Flow"
          description="A sleek productivity dashboard. Stay locked in with a Pomodoro timer, interactive Kanban board, and Focus Stream Radio."
        />

        <Card 
          href="https://evote.collabs.eu.org/"
          icon="fa-check-to-slot"
          iconColor="#0D9488"
          iconBg="rgba(13, 148, 136, 0.1)"
          iconBorder="rgba(13, 148, 136, 0.2)"
          title="Collabs eVote"
          description="A highly secure, enterprise-grade digital election ecosystem featuring zero-trust cryptographic auditing and real-time analytics."
        />

        <div className="section-divider" aria-hidden="true"></div>

        {/* ROW 3: Educational Utilities */}
        <Card 
          href="https://gemini.google.com/gem/192jFdpoi0bHJhhHEnFx_UClCzhb7WMfW?usp=sharing"
          icon="fa-robot"
          iconColor="#06B6D4"
          iconBg="rgba(6, 182, 212, 0.1)"
          iconBorder="rgba(6, 182, 212, 0.2)"
          title="Live Chat AI"
          description="Interact with our intelligent knowledge base to get instant answers and resources regarding the Collabs platform."
        />

        <Card 
          href="https://www.qrlab.eu.org"
          icon="fa-qrcode"
          iconColor="#EC4899"
          iconBg="rgba(236, 72, 153, 0.1)"
          iconBorder="rgba(236, 72, 153, 0.2)"
          title="QR Lab"
          description="A powerful utility tool for students and developers to generate and manage custom QR codes instantly."
        />

        <Card 
          href="/eAttendance.exe"
          icon="fa-clipboard-user"
          iconColor="#10B981"
          iconBg="rgba(16, 185, 129, 0.1)"
          iconBorder="rgba(16, 185, 129, 0.2)"
          title="eAttendance"
          description="Download our custom desktop software for seamless attendance tracking and management."
          download={true}
        />

        {/* Social Framework Engines Navigation */}
        <div className="section-divider" aria-hidden="true"></div>
        <nav className="social-container" aria-label="Social Media Links">
          <button id="shareBtn" onClick={handleShare} className="social-btn share" title="Share Collabs" aria-label="Share this page">
            <i className="fa-solid fa-share-nodes" aria-hidden="true"></i>
          </button>
          <a href="https://wa.me/923393152023" target="_blank" rel="noopener noreferrer" className="social-btn whatsapp" title="WhatsApp" aria-label="Contact via WhatsApp">
            <i className="fa-brands fa-whatsapp" aria-hidden="true"></i>
          </a>
          <a href="https://www.instagram.com/akhsscollabs" target="_blank" rel="noopener noreferrer" className="social-btn instagram" title="Instagram" aria-label="Follow on Instagram">
            <i className="fa-brands fa-instagram" aria-hidden="true"></i>
          </a>
          <a href="https://www.tiktok.com/@akhsscollabs" target="_blank" rel="noopener noreferrer" className="social-btn tiktok" title="TikTok" aria-label="Follow on TikTok">
            <i className="fa-brands fa-tiktok" aria-hidden="true"></i>
          </a>
          <a href="https://www.youtube.com/@akhsscollabs" target="_blank" rel="noopener noreferrer" className="social-btn youtube" title="YouTube" aria-label="Subscribe on YouTube">
            <i className="fa-brands fa-youtube" aria-hidden="true"></i>
          </a>
        </nav>

      </main>

      {/* Persistent Animated Floating AI Widget Controller */}
      <a href="https://gemini.google.com/gem/192jFdpoi0bHJhhHEnFx_UClCzhb7WMfW?usp=sharing" target="_blank" rel="noopener noreferrer" className="ai-widget" aria-label="Open AI Assistant">
        <div className="ai-icon-container" aria-hidden="true">
          <i className="fa-solid fa-robot"></i>
          <div className="ai-status-dot"></div>
        </div>
        <div className="ai-text">Chat with AI</div>
      </a>
    </div>
  );
}