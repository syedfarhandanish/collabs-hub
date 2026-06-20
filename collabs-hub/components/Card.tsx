import React from 'react';

interface CardProps {
  href: string;
  icon: string;
  iconColor: string;
  iconBg: string;
  iconBorder: string;
  title: string;
  description: string;
  download?: boolean;
}

export default function Card({ href, icon, iconColor, iconBg, iconBorder, title, description, download }: CardProps) {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      className="card" 
      aria-label={`Access ${title}`}
      download={download ? href.split('/').pop() : undefined}
    >
      <div 
        className="card-icon" 
        aria-hidden="true"
        style={{ color: iconColor, background: iconBg, borderColor: iconBorder }}
      >
        <i className={`fa-solid ${icon}`}></i>
      </div>
      <h2>{title}</h2>
      <p>{description}</p>
    </a>
  );
}