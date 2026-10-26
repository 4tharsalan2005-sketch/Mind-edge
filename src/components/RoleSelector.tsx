import React from 'react';
import { UserRole } from '../types.ts';
import { StudentHeroIllustration, TeacherWorkspaceIllustration } from './svgs/EducationalIllustrations.tsx';
import { GraduationCap, Briefcase, ChevronRight, ShieldCheck } from 'lucide-react';

interface RoleSelectorProps {
  onSelectRole: (role: UserRole) => void;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({ onSelectRole }) => {
  return (
    <div className="min-h-[calc(100vh-65px)] bg-slate-50/70 flex flex-col justify-between">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Editorial Heading (No code comments or mechanical prefixes) */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase font-bold tracking-wider text-sky-600 block mb-2">
            National Secondary Curriculum Gateway
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight" style={{ textWrap: 'balance' }}>
            Choose your role
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
            Mind Edge is a structured educational platform organizing syllabus books, model papers, past paper archives, and interactive practice tests for Grades 6 through 9.
          </p>
        </div>

        {/* The Two Primary Role Pathways */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          
          {/* Pathway 1: Student */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md hover:border-sky-300 transition-all flex flex-col justify-between group">
            <div>
              <div className="p-6 bg-slate-100/40 border-b border-slate-100 flex items-center justify-center">
                <StudentHeroIllustration className="w-full max-h-48 rounded-lg" />
              </div>

              <div className="p-6">
                <div className="flex items-center gap-2.5 text-sky-600 font-bold text-xs uppercase tracking-wider">
                  <GraduationCap className="w-4 h-4" />
                  <span>Student Pathway</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 mt-2 group-hover:text-sky-600 transition-colors">
                  I am a Student
                </h2>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Select your instructional medium (Sinhala, English, Tamil) and grade (6 to 9) to explore accredited syllabus books, term model papers, past papers, and practice quizzes.
                </p>

                <div className="mt-5 space-y-2 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                    <span>Syllabus Books (Parts 1 & 2)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                    <span>Past Papers: Intermediate, Final & Dharmachari</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                    <span>Interactive Quizzes: Akhlaq, Fiqh, Seerah</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 pt-0">
              <button
                onClick={() => onSelectRole('student')}
                className="w-full py-3 px-4 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer group-hover:bg-sky-700"
              >
                <span>Continue as Student</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Pathway 2: Teacher */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md hover:border-teal-300 transition-all flex flex-col justify-between group">
            <div>
              <div className="p-6 bg-slate-100/40 border-b border-slate-100 flex items-center justify-center">
                <TeacherWorkspaceIllustration className="w-full max-h-48 rounded-lg" />
              </div>

              <div className="p-6">
                <div className="flex items-center gap-2.5 text-teal-700 font-bold text-xs uppercase tracking-wider">
                  <Briefcase className="w-4 h-4" />
                  <span>Teacher Workspace</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 mt-2 group-hover:text-teal-700 transition-colors">
                  I am a Teacher
                </h2>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Select your teaching medium and access consolidated resources across Grades 6 through 9 in a master folder view with marking schemes and classroom projector presentation mode.
                </p>

                <div className="mt-5 space-y-2 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-600" />
                    <span>Master Folder Dashboard (Grades 6, 7, 8, 9)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-600" />
                    <span>Curriculum Guides & Answer Rubrics</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-600" />
                    <span>Smartboard Classroom Quiz Presentation</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 pt-0">
              <button
                onClick={() => onSelectRole('teacher')}
                className="w-full py-3 px-4 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer group-hover:bg-teal-800"
              >
                <span>Continue as Teacher</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        {/* Admin Access Callout */}
        <div className="mt-12 text-center">
          <button
            onClick={() => onSelectRole('admin')}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors py-2.5 px-4 rounded-xl border border-slate-200/80 bg-white hover:border-indigo-300 shadow-2xs hover:shadow-xs cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            <span>Administrator Sign-In (Protected with Username & Password)</span>
          </button>
        </div>
      </main>

      {/* Quiet Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 px-6 text-center text-xs text-slate-400">
        Mind Edge Educational Platform · Designed for Secondary Curriculum Development
      </footer>
    </div>
  );
};
