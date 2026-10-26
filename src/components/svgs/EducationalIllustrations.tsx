import React from 'react';

export const StudentHeroIllustration: React.FC<{ className?: string }> = ({ className = 'w-full h-auto' }) => (
  <svg viewBox="0 0 600 340" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="g-bg" x1="0" y1="0" x2="600" y2="340" gradientUnits="userSpaceOnUse">
        <stop stopColor="#0284c7" stopOpacity="0.08" />
        <stop offset="1" stopColor="#0f172a" stopOpacity="0.02" />
      </linearGradient>
      <linearGradient id="g-book" x1="0" y1="0" x2="1" y2="1">
        <stop stopColor="#0284c7" />
        <stop offset="1" stopColor="#0369a1" />
      </linearGradient>
      <linearGradient id="g-card" x1="0" y1="0" x2="0" y2="1">
        <stop stopColor="#ffffff" />
        <stop offset="1" stopColor="#f1f5f9" />
      </linearGradient>
    </defs>
    <rect width="600" height="340" rx="16" fill="url(#g-bg)" />
    
    {/* Architectural grid lines */}
    <path d="M40 80 H560 M40 160 H560 M40 240 H560" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4 4" strokeOpacity="0.4" />
    <path d="M150 40 V300 M300 40 V300 M450 40 V300" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4 4" strokeOpacity="0.4" />

    {/* Islamic arch motif silhouette */}
    <path d="M300 50 C260 90 240 130 240 220 H360 C360 130 340 90 300 50 Z" fill="#0284c7" fillOpacity="0.06" stroke="#0284c7" strokeWidth="1.5" strokeOpacity="0.2" />

    {/* Center open book */}
    <g transform="translate(180, 140)">
      {/* Book base & pages */}
      <path d="M120 110 C80 100 30 115 0 120 V30 C30 25 80 15 120 25 C160 15 210 25 240 30 V120 C210 115 160 100 120 110 Z" fill="url(#g-card)" stroke="#94a3b8" strokeWidth="2" />
      <path d="M120 25 V110" stroke="#0284c7" strokeWidth="2" />
      
      {/* Text lines on left page */}
      <line x1="30" y1="45" x2="100" y2="45" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="30" y1="60" x2="95" y2="60" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
      <line x1="30" y1="75" x2="85" y2="75" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
      <line x1="30" y1="90" x2="90" y2="90" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />

      {/* Text lines on right page */}
      <line x1="140" y1="45" x2="210" y2="45" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="140" y1="60" x2="200" y2="60" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
      <line x1="140" y1="75" x2="205" y2="75" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
      <line x1="140" y1="90" x2="185" y2="90" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
    </g>

    {/* Floating badges & achievements */}
    <g transform="translate(80, 100)">
      <rect width="110" height="60" rx="8" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1.5" />
      <circle cx="28" cy="30" r="14" fill="#0284c7" fillOpacity="0.1" />
      <path d="M28 22 L32 34 L22 26 L34 26 L24 34 Z" fill="#0284c7" />
      <text x="50" y="27" fill="#0f172a" fontSize="11" fontWeight="bold">Syllabus</text>
      <text x="50" y="42" fill="#64748b" fontSize="10">Grades 6–9</text>
    </g>

    <g transform="translate(410, 100)">
      <rect width="110" height="60" rx="8" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1.5" />
      <circle cx="28" cy="30" r="14" fill="#10b981" fillOpacity="0.1" />
      <path d="M24 30 L27 33 L33 27" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <text x="50" y="27" fill="#0f172a" fontSize="11" fontWeight="bold">Quizzes</text>
      <text x="50" y="42" fill="#64748b" fontSize="10">Interactive</text>
    </g>

    {/* Bottom banner accent */}
    <rect x="220" y="270" width="160" height="30" rx="6" fill="#0f172a" />
    <text x="300" y="290" textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="600" letterSpacing="0.05em">MIND EDGE CURRICULUM</text>
  </svg>
);

export const TeacherWorkspaceIllustration: React.FC<{ className?: string }> = ({ className = 'w-full h-auto' }) => (
  <svg viewBox="0 0 600 340" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="g-t-bg" x1="0" y1="0" x2="600" y2="340" gradientUnits="userSpaceOnUse">
        <stop stopColor="#0f766e" stopOpacity="0.08" />
        <stop offset="1" stopColor="#0f172a" stopOpacity="0.02" />
      </linearGradient>
    </defs>
    <rect width="600" height="340" rx="16" fill="url(#g-t-bg)" />
    
    {/* Folder Master layout */}
    <g transform="translate(140, 70)">
      {/* Folder Tab */}
      <path d="M0 30 C0 25 4 20 10 20 H100 L120 40 H310 C316 40 320 45 320 50 V200 C320 206 316 210 310 210 H10 C4 210 0 206 0 200 Z" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
      {/* Grade tabs */}
      <rect x="20" y="60" width="60" height="24" rx="4" fill="#0f766e" />
      <text x="50" y="76" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">Grade 6</text>
      
      <rect x="90" y="60" width="60" height="24" rx="4" fill="#f1f5f9" stroke="#cbd5e1" />
      <text x="120" y="76" textAnchor="middle" fill="#475569" fontSize="10" fontWeight="bold">Grade 7</text>

      <rect x="160" y="60" width="60" height="24" rx="4" fill="#f1f5f9" stroke="#cbd5e1" />
      <text x="190" y="76" textAnchor="middle" fill="#475569" fontSize="10" fontWeight="bold">Grade 8</text>

      <rect x="230" y="60" width="60" height="24" rx="4" fill="#f1f5f9" stroke="#cbd5e1" />
      <text x="260" y="76" textAnchor="middle" fill="#475569" fontSize="10" fontWeight="bold">Grade 9</text>

      {/* Content lines */}
      <rect x="20" y="100" width="280" height="32" rx="4" fill="#f8fafc" stroke="#e2e8f0" />
      <circle cx="36" cy="116" r="6" fill="#0f766e" fillOpacity="0.2" />
      <text x="52" y="120" fill="#1e293b" fontSize="11" fontWeight="600">Syllabus Books (Max 2)</text>
      <text x="280" y="120" textAnchor="end" fill="#0f766e" fontSize="10" fontWeight="bold">Verified</text>

      <rect x="20" y="140" width="280" height="32" rx="4" fill="#f8fafc" stroke="#e2e8f0" />
      <circle cx="36" cy="156" r="6" fill="#0284c7" fillOpacity="0.2" />
      <text x="52" y="160" fill="#1e293b" fontSize="11" fontWeight="600">Model Papers & Answer Keys</text>
      <text x="280" y="160" textAnchor="end" fill="#0284c7" fontSize="10" fontWeight="bold">Active</text>
    </g>
  </svg>
);

export const SubjectIcon: React.FC<{ subject: 'Akhlaq' | 'Fiqh' | 'Seerah'; className?: string }> = ({ subject, className = 'w-6 h-6' }) => {
  if (subject === 'Akhlaq') {
    // Scales of Justice & Ethics
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 3v18" />
        <path d="M6 7l6-3 6 3" />
        <path d="M6 7l-3 7h6l-3-7z" />
        <path d="M18 7l-3 7h6l-3-7z" />
        <path d="M8 21h8" />
      </svg>
    );
  }
  if (subject === 'Fiqh') {
    // Scroll & Legal Tablet
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <line x1="10" y1="9" x2="8" y2="9" />
      </svg>
    );
  }
  // Seerah: Compass & Navigation through history
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  );
};
