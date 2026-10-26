import React from 'react';
import { UserRole } from '../types.ts';

interface NavbarProps {
  currentRole: UserRole | null;
  onSelectRole: (role: UserRole | null) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentRole, onSelectRole }) => {
  return (
    <header className="flex items-center justify-between gap-8 px-6 py-4 bg-white border-b border-slate-200 sticky top-0 z-40">
      {/* Zone 1: Single text element wordmark */}
      <button
        onClick={() => onSelectRole(null)}
        className="text-xl font-extrabold tracking-tight text-slate-900 whitespace-nowrap shrink-0 hover:text-sky-600 transition-colors cursor-pointer"
      >
        Mind Edge
      </button>

      {/* Zone 2: 4–5 clean single-line text navigation links */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
        <button
          onClick={() => onSelectRole(null)}
          className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            currentRole === null ? 'text-slate-900 font-semibold' : ''
          }`}
        >
          Role Portal
        </button>

        <button
          onClick={() => onSelectRole('student')}
          className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            currentRole === 'student' ? 'text-sky-600 font-semibold' : ''
          }`}
        >
          Student Pathway
        </button>

        <button
          onClick={() => onSelectRole('teacher')}
          className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            currentRole === 'teacher' ? 'text-teal-600 font-semibold' : ''
          }`}
        >
          Teacher Workspace
        </button>

        <button
          onClick={() => onSelectRole('admin')}
          className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            currentRole === 'admin' ? 'text-indigo-600 font-semibold' : ''
          }`}
        >
          Admin Controller
        </button>
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center gap-3 shrink-0">
        {currentRole === 'admin' ? (
          <button
            onClick={() => onSelectRole(null)}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Exit Admin
          </button>
        ) : (
          <button
            onClick={() => onSelectRole('admin')}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Admin Panel
          </button>
        )}
      </div>
    </header>
  );
};
