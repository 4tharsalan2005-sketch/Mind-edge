import React, { useState, useEffect } from 'react';
import { InstructionalMedium, GradeLevel, SyllabusBook, Paper, Quiz, QuizSubject } from '../types.ts';
import { fetchBooks, fetchPapers, fetchQuizzes } from '../services/api.ts';
import { DocumentModal } from './DocumentModal.tsx';
import { QuizEngine } from './QuizEngine.tsx';
import { SubjectIcon } from './svgs/EducationalIllustrations.tsx';
import { BookOpen, FileText, ChevronRight, Layers, ArrowLeft, Clock, Eye, AlertCircle, Sparkles } from 'lucide-react';

interface StudentPathwayProps {
  onBackToRoles: () => void;
}

export const StudentPathway: React.FC<StudentPathwayProps> = ({ onBackToRoles }) => {
  // Step 1: Medium | Step 2: Grade | Step 3: Dashboard
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [selectedMedium, setSelectedMedium] = useState<InstructionalMedium>('English');
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>(6);

  // Data state
  const [books, setBooks] = useState<SyllabusBook[]>([]);
  const [papers, setPapers] = useState<Paper[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Active resource sub-tab: 'model' | 'books' | 'past'
  const [resourceTab, setResourceTab] = useState<'model' | 'books' | 'past'>('books');
  // Past papers subcategory: 'intermediate' | 'final' | 'dharmachari'
  const [pastPaperCategory, setPastPaperCategory] = useState<'intermediate' | 'final' | 'dharmachari'>('intermediate');

  // Selected quiz subject filter: 'all' | 'Akhlaq' | 'Fiqh' | 'Seerah'
  const [quizSubjectFilter, setQuizSubjectFilter] = useState<'all' | QuizSubject>('all');

  // Modals & Quiz Runner
  const [activeModalItem, setActiveModalItem] = useState<SyllabusBook | Paper | null>(null);
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);

  // Load resources when step 3 is reached or grade/medium changes
  useEffect(() => {
    if (currentStep !== 3) return;

    let mounted = true;
    setIsLoading(true);

    Promise.all([
      fetchBooks(selectedGrade, selectedMedium),
      fetchPapers(selectedGrade, undefined, selectedMedium),
      fetchQuizzes(selectedGrade, undefined, selectedMedium)
    ])
      .then(([b, p, q]) => {
        if (!mounted) return;
        setBooks(b);
        setPapers(p);
        setQuizzes(q);
      })
      .catch((err) => {
        console.error('Error fetching student dashboard data:', err);
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [currentStep, selectedGrade, selectedMedium]);

  // Handler for selecting Medium (Step 1)
  const handleSelectMedium = (medium: InstructionalMedium) => {
    setSelectedMedium(medium);
    setCurrentStep(2);
  };

  // Handler for selecting Grade (Step 2)
  const handleSelectGrade = (grade: GradeLevel) => {
    setSelectedGrade(grade);
    setCurrentStep(3);
  };

  // If active quiz is running, render QuizEngine
  if (activeQuiz) {
    return <QuizEngine quiz={activeQuiz} onExit={() => setActiveQuiz(null)} />;
  }

  return (
    <div className="min-h-[calc(100vh-65px)] bg-slate-50/60 py-8 px-4 sm:px-6 lg:px-8">
      {/* STEP 1: SELECT MEDIUM */}
      {currentStep === 1 && (
        <div className="max-w-2xl mx-auto py-8">
          <button
            onClick={onBackToRoles}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-6 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Role Selection</span>
          </button>

          <div className="text-center mb-8">
            <span className="text-xs uppercase font-bold tracking-wider text-sky-600">Student Pathway · Step 1 of 2</span>
            <h1 className="text-3xl font-bold text-slate-900 mt-2 tracking-tight">Select Instructional Medium</h1>
            <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto">
              Please choose your language of instruction to align syllabus books, papers, and quizzes with your curriculum.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* Sinhala */}
            <button
              onClick={() => handleSelectMedium('Sinhala')}
              className="bg-white p-6 rounded-2xl border-2 border-amber-200/80 hover:border-amber-500 hover:shadow-xl hover:shadow-amber-500/10 transition-all text-left group cursor-pointer relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-400/10 to-yellow-300/5 rounded-bl-full pointer-events-none" />
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-white font-extrabold flex items-center justify-center text-lg mb-4 shadow-md shadow-amber-500/20">
                සිං
              </div>
              <h2 className="text-lg font-extrabold text-slate-900 group-hover:text-amber-600 transition-colors">
                Sinhala Medium
              </h2>
              <p className="text-xs text-slate-500 mt-1">සිංහල මාධ්‍ය අධ්‍යයන සම්පත්</p>
              <div className="mt-5 flex items-center text-xs font-bold text-amber-600 group-hover:translate-x-1 transition-transform">
                <span>Start Studying</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </button>

            {/* English */}
            <button
              onClick={() => handleSelectMedium('English')}
              className="bg-white p-6 rounded-2xl border-2 border-sky-200/80 hover:border-sky-500 hover:shadow-xl hover:shadow-sky-500/10 transition-all text-left group cursor-pointer relative overflow-hidden ring-2 ring-sky-500/10"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-sky-400/10 to-blue-300/5 rounded-bl-full pointer-events-none" />
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white font-extrabold flex items-center justify-center text-lg mb-4 shadow-md shadow-sky-500/20">
                EN
              </div>
              <h2 className="text-lg font-extrabold text-slate-900 group-hover:text-sky-600 transition-colors">
                English Medium
              </h2>
              <p className="text-xs text-slate-500 mt-1">National English Curriculum Standard</p>
              <div className="mt-5 flex items-center text-xs font-bold text-sky-600 group-hover:translate-x-1 transition-transform">
                <span>Start Studying</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </button>

            {/* Tamil */}
            <button
              onClick={() => handleSelectMedium('Tamil')}
              className="bg-white p-6 rounded-2xl border-2 border-emerald-200/80 hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-500/10 transition-all text-left group cursor-pointer relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-400/10 to-teal-300/5 rounded-bl-full pointer-events-none" />
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-white font-extrabold flex items-center justify-center text-lg mb-4 shadow-md shadow-emerald-500/20">
                த
              </div>
              <h2 className="text-lg font-extrabold text-slate-900 group-hover:text-emerald-600 transition-colors">
                Tamil Medium
              </h2>
              <p className="text-xs text-slate-500 mt-1">தமிழ் மொழி பாடத்திட்ட வளங்கள்</p>
              <div className="mt-5 flex items-center text-xs font-bold text-emerald-600 group-hover:translate-x-1 transition-transform">
                <span>Start Studying</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: SELECT GRADE */}
      {currentStep === 2 && (
        <div className="max-w-4xl mx-auto py-8">
          <button
            onClick={() => setCurrentStep(1)}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-6 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Change Medium ({selectedMedium})</span>
          </button>

          <div className="text-center mb-8">
            <span className="text-xs uppercase font-bold tracking-wider text-indigo-600">Student Pathway · Step 2 of 2</span>
            <h1 className="text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">Select Your Grade Level</h1>
            <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto">
              Instructional Medium: <strong className="text-slate-900">{selectedMedium}</strong>. Pick your school grade to jump directly into your interactive study portal.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {([
              { grade: 6, color: 'from-purple-500 to-indigo-600', border: 'hover:border-purple-500 hover:shadow-purple-500/10', title: 'Grade 6', subtitle: 'Foundation & Orientation', glow: 'bg-purple-500/10' },
              { grade: 7, color: 'from-sky-500 to-blue-600', border: 'hover:border-sky-500 hover:shadow-sky-500/10', title: 'Grade 7', subtitle: 'Jurisprudence & Ethics', glow: 'bg-sky-500/10' },
              { grade: 8, color: 'from-teal-500 to-emerald-600', border: 'hover:border-teal-500 hover:shadow-teal-500/10', title: 'Grade 8', subtitle: 'History & Critical Analysis', glow: 'bg-teal-500/10' },
              { grade: 9, color: 'from-amber-500 to-orange-500', border: 'hover:border-amber-500 hover:shadow-amber-500/10', title: 'Grade 9', subtitle: 'Board & National Benchmark', glow: 'bg-amber-500/10' },
            ] as const).map((item) => (
              <button
                key={item.grade}
                onClick={() => handleSelectGrade(item.grade as GradeLevel)}
                className={`bg-white p-6 rounded-3xl border-2 border-slate-200/80 ${item.border} hover:shadow-xl transition-all text-center group cursor-pointer flex flex-col justify-between h-64 relative overflow-hidden`}
              >
                <div className={`absolute -top-12 -right-12 w-28 h-28 rounded-full ${item.glow} pointer-events-none group-hover:scale-150 transition-transform duration-300`} />
                <div>
                  <div className={`w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr ${item.color} text-white font-extrabold text-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 duration-200`}>
                    {item.grade}
                  </div>
                  <h2 className="text-xl font-extrabold text-slate-900 mt-4 group-hover:text-slate-800 transition-colors">
                    {item.title}
                  </h2>
                  <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">
                    {item.subtitle}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-center text-xs font-bold text-slate-900 group-hover:translate-x-1 transition-transform">
                  <span>Open Books & Quizzes</span>
                  <ChevronRight className="w-4 h-4 ml-1 text-slate-500" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* STEP 3: THE STUDENT DASHBOARD */}
      {currentStep === 3 && (
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Dashboard Header & Quick Switcher */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="hover:text-slate-900 hover:underline cursor-pointer"
                >
                  Grade {selectedGrade}
                </button>
                <span aria-hidden="true">·</span>
                <button
                  onClick={() => setCurrentStep(1)}
                  className="hover:text-slate-900 hover:underline cursor-pointer"
                >
                  {selectedMedium} Medium
                </button>
                <span aria-hidden="true">·</span>
                <span>Academic Session 2025/2026</span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 mt-1 tracking-tight">
                Student Learning Dashboard
              </h1>
              <p className="text-xs text-slate-600 mt-0.5">
                Organized curriculum textbooks, past papers, and interactive practice tests.
              </p>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <button
                onClick={() => setCurrentStep(2)}
                className="flex-1 md:flex-none px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                Change Grade ({selectedGrade})
              </button>
              <button
                onClick={() => setCurrentStep(1)}
                className="flex-1 md:flex-none px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                Change Medium
              </button>
            </div>
          </div>

          {/* Teen Learner Momentum & Progress Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-gradient-to-r from-orange-50 to-amber-50/60 border border-orange-200/80 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-400 text-white flex items-center justify-center font-extrabold text-base shadow-sm shrink-0">
                🔥
              </div>
              <div className="text-xs">
                <span className="font-extrabold text-orange-950 block">3-Day Streak</span>
                <span className="text-orange-700/80 font-medium">Keep it going!</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-gradient-to-r from-sky-50 to-cyan-50/60 border border-sky-200/80 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-cyan-400 text-white flex items-center justify-center font-extrabold text-base shadow-sm shrink-0">
                ⚡
              </div>
              <div className="text-xs">
                <span className="font-extrabold text-sky-950 block">Daily Target</span>
                <span className="text-sky-700/80 font-medium">Practice & Review</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50/60 border border-emerald-200/80 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center font-extrabold text-base shadow-sm shrink-0">
                🎯
              </div>
              <div className="text-xs">
                <span className="font-extrabold text-emerald-950 block">Curriculum Status</span>
                <span className="text-emerald-700/80 font-medium">{books.length} Syllabus Texts</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-gradient-to-r from-purple-50 to-indigo-50/60 border border-purple-200/80 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-400 text-white flex items-center justify-center font-extrabold text-base shadow-sm shrink-0">
                🏆
              </div>
              <div className="text-xs">
                <span className="font-extrabold text-purple-950 block">Quiz Bank</span>
                <span className="text-purple-700/80 font-medium">{quizzes.length} Tests Ready</span>
              </div>
            </div>
          </div>

          {/* TWO PRIMARY COLUMNS LAYOUT */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* COLUMN 1: RESOURCES (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
                {/* Resources Header & Sub-Tabs */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-sky-600" />
                      <span>Academic Resources</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Curriculum textbooks and past paper examination archives
                    </p>
                  </div>

                  {/* Clean Segmented Resource Control (Zero-Pill compliant button group) */}
                  <div className="flex items-center p-1 bg-slate-100 rounded-lg text-xs font-medium">
                    <button
                      onClick={() => setResourceTab('books')}
                      className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                        resourceTab === 'books'
                          ? 'bg-white text-slate-900 shadow-xs font-semibold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Syllabus books
                    </button>
                    <button
                      onClick={() => setResourceTab('model')}
                      className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                        resourceTab === 'model'
                          ? 'bg-white text-slate-900 shadow-xs font-semibold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Model papers
                    </button>
                    <button
                      onClick={() => setResourceTab('past')}
                      className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                        resourceTab === 'past'
                          ? 'bg-white text-slate-900 shadow-xs font-semibold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Past papers
                    </button>
                  </div>
                </div>

                {/* TAB 1: SYLLABUS BOOKS */}
                {resourceTab === 'books' && (
                  <div className="mt-6 space-y-4">
                    <div className="flex items-center justify-between text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <span>Curriculum Status: Grade {selectedGrade}</span>
                      <span className="font-semibold text-slate-700">
                        {books.length} of 2 Official Books Registered (Strict Cap)
                      </span>
                    </div>

                    {isLoading ? (
                      <div className="py-12 text-center text-xs text-slate-400">Loading syllabus books...</div>
                    ) : books.length === 0 ? (
                      <div className="py-12 text-center text-xs text-slate-400">
                        No syllabus books uploaded for Grade {selectedGrade} in {selectedMedium} medium yet.
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {books.map((book) => (
                          <div
                            key={book.id}
                            className="p-5 rounded-xl border border-slate-200 hover:border-sky-300 transition-all bg-white hover:bg-slate-50/50"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <span className="text-xs text-sky-700 font-semibold block">
                                  Part {book.part} · {book.subject}
                                </span>
                                <h3 className="text-base font-bold text-slate-900 mt-1">{book.title}</h3>
                                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{book.summary}</p>
                              </div>
                              <span className="shrink-0 text-xs font-mono text-slate-400">{book.fileSize}</span>
                            </div>

                            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                              <span className="text-slate-400">{book.pages} Pages · {book.edition}</span>
                              <button
                                onClick={() => setActiveModalItem(book)}
                                className="flex items-center gap-1 font-semibold text-sky-600 hover:text-sky-800 transition-colors cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Preview Book</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 2: MODEL PAPERS */}
                {resourceTab === 'model' && (
                  <div className="mt-6 space-y-4">
                    <p className="text-xs text-slate-500">
                      Standardized model assessment papers designed to prepare Grade {selectedGrade} students for term examinations.
                    </p>

                    {isLoading ? (
                      <div className="py-12 text-center text-xs text-slate-400">Loading model papers...</div>
                    ) : (
                      <div className="space-y-3">
                        {papers
                          .filter((p) => p.category === 'model')
                          .map((paper) => (
                            <div
                              key={paper.id}
                              className="p-4 rounded-xl border border-slate-200 hover:border-sky-300 transition-all flex items-center justify-between bg-white"
                            >
                              <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-lg bg-teal-50 text-teal-700">
                                  <FileText className="w-5 h-5" />
                                </div>
                                <div>
                                  <h3 className="text-sm font-bold text-slate-900">{paper.title}</h3>
                                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                                    <span>{paper.term || 'General'}</span>
                                    <span aria-hidden="true">·</span>
                                    <span>{paper.year}</span>
                                    <span aria-hidden="true">·</span>
                                    <span>{paper.durationMinutes} Mins</span>
                                    <span aria-hidden="true">·</span>
                                    <span>{paper.totalMarks} Marks</span>
                                  </div>
                                </div>
                              </div>

                              <button
                                onClick={() => setActiveModalItem(paper)}
                                className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                              >
                                View Paper
                              </button>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 3: PAST PAPERS (Expands into Intermediate [Ready], Final [Coming soon], Dharmachari [Coming soon]) */}
                {resourceTab === 'past' && (
                  <div className="mt-6 space-y-5">
                    {/* Subcategory Segmented Switcher */}
                    <div className="flex items-center gap-2 border-b border-slate-200 pb-3 text-xs font-medium">
                      <button
                        onClick={() => setPastPaperCategory('intermediate')}
                        className={`pb-2 border-b-2 transition-colors cursor-pointer ${
                          pastPaperCategory === 'intermediate'
                            ? 'border-sky-600 text-sky-600 font-bold'
                            : 'border-transparent text-slate-500 hover:text-slate-900'
                        }`}
                      >
                        Intermediate (Ready)
                      </button>
                      <button
                        onClick={() => setPastPaperCategory('final')}
                        className={`pb-2 border-b-2 transition-colors cursor-pointer ${
                          pastPaperCategory === 'final'
                            ? 'border-sky-600 text-sky-600 font-bold'
                            : 'border-transparent text-slate-500 hover:text-slate-900'
                        }`}
                      >
                        Final (Coming soon)
                      </button>
                      <button
                        onClick={() => setPastPaperCategory('dharmachari')}
                        className={`pb-2 border-b-2 transition-colors cursor-pointer ${
                          pastPaperCategory === 'dharmachari'
                            ? 'border-sky-600 text-sky-600 font-bold'
                            : 'border-transparent text-slate-500 hover:text-slate-900'
                        }`}
                      >
                        Dharmachari (Coming soon)
                      </button>
                    </div>

                    {/* Subcategory 1: Intermediate (READY) */}
                    {pastPaperCategory === 'intermediate' && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs text-emerald-800 bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                          <span className="font-semibold">Intermediate Past Papers Active</span>
                          <span>Complete marking schemes included</span>
                        </div>

                        {papers
                          .filter((p) => p.category === 'past_intermediate')
                          .map((paper) => (
                            <div
                              key={paper.id}
                              className="p-4 rounded-xl border border-slate-200 hover:border-emerald-300 transition-all flex items-center justify-between bg-white"
                            >
                              <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-700">
                                  <FileText className="w-5 h-5" />
                                </div>
                                <div>
                                  <h3 className="text-sm font-bold text-slate-900">{paper.title}</h3>
                                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                                    <span>Year {paper.year}</span>
                                    <span aria-hidden="true">·</span>
                                    <span>{paper.fileSize}</span>
                                    <span aria-hidden="true">·</span>
                                    <span className="text-emerald-600 font-medium">Ready</span>
                                  </div>
                                </div>
                              </div>

                              <button
                                onClick={() => setActiveModalItem(paper)}
                                className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                              >
                                Access Paper
                              </button>
                            </div>
                          ))}
                      </div>
                    )}

                    {/* Subcategory 2: Final (COMING SOON) */}
                    {pastPaperCategory === 'final' && (
                      <div className="space-y-4">
                        <div className="p-5 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-3">
                          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-sm block">Final Past Papers Archives (Coming soon)</span>
                            <p className="mt-1 leading-relaxed text-amber-800">
                              The national final examination past paper repository for Grade {selectedGrade} is currently undergoing curriculum digitization and validation by the examination department.
                            </p>
                          </div>
                        </div>

                        {papers
                          .filter((p) => p.category === 'past_final')
                          .map((paper) => (
                            <div
                              key={paper.id}
                              className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between opacity-80"
                            >
                              <div>
                                <h3 className="text-sm font-semibold text-slate-700">{paper.title}</h3>
                                <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                                  <span>Annual Final Archive</span>
                                  <span aria-hidden="true">·</span>
                                  <span>Expected Q4 2026</span>
                                </div>
                              </div>
                              <span className="text-xs font-medium text-amber-700 bg-amber-100/60 px-2.5 py-1 rounded-md">
                                Coming soon
                              </span>
                            </div>
                          ))}
                      </div>
                    )}

                    {/* Subcategory 3: Dharmachari (COMING SOON) */}
                    {pastPaperCategory === 'dharmachari' && (
                      <div className="space-y-4">
                        <div className="p-5 bg-purple-50/70 border border-purple-200 rounded-xl text-xs text-purple-900 flex items-start gap-3">
                          <Sparkles className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-sm block">Dharmachari Ethics Series (Coming soon)</span>
                            <p className="mt-1 leading-relaxed text-purple-800">
                              Dharmachari moral philosophy and comparative ethics past evaluation rubrics are scheduled for integration. Preview curriculum frameworks will be released shortly.
                            </p>
                          </div>
                        </div>

                        {papers
                          .filter((p) => p.category === 'past_dharmachari')
                          .map((paper) => (
                            <div
                              key={paper.id}
                              className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between opacity-80"
                            >
                              <div>
                                <h3 className="text-sm font-semibold text-slate-700">{paper.title}</h3>
                                <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                                  <span>Comparative Moral Curriculum</span>
                                  <span aria-hidden="true">·</span>
                                  <span>Grade {selectedGrade}</span>
                                </div>
                              </div>
                              <span className="text-xs font-medium text-purple-700 bg-purple-100/60 px-2.5 py-1 rounded-md">
                                Coming soon
                              </span>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* COLUMN 2: PRACTICE QUIZZES (5 Cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
                {/* Header & Subject Filters */}
                <div className="pb-4 border-b border-slate-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <Layers className="w-5 h-5 text-sky-600" />
                      <span>Practice Quizzes</span>
                    </h2>
                    <span className="text-xs text-slate-500 font-mono">
                      {quizzes.length} Available
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Subject-specific quiz engines for Akhlaq, Fiqh, and Seerah
                  </p>

                  {/* Subject Filter Tabs */}
                  <div className="mt-4 flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg text-xs font-medium">
                    <button
                      onClick={() => setQuizSubjectFilter('all')}
                      className={`flex-1 py-1.5 rounded-md transition-colors cursor-pointer ${
                        quizSubjectFilter === 'all'
                          ? 'bg-white text-slate-900 shadow-xs font-bold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      All
                    </button>
                    {(['Akhlaq', 'Fiqh', 'Seerah'] as QuizSubject[]).map((subj) => (
                      <button
                        key={subj}
                        onClick={() => setQuizSubjectFilter(subj)}
                        className={`flex-1 py-1.5 rounded-md transition-colors cursor-pointer ${
                          quizSubjectFilter === subj
                            ? 'bg-white text-slate-900 shadow-xs font-bold'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {subj}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quizzes List */}
                <div className="mt-6 space-y-4">
                  {quizzes
                    .filter((q) => quizSubjectFilter === 'all' || q.subject === quizSubjectFilter)
                    .map((quiz) => {
                      const isAkhlaq = quiz.subject === 'Akhlaq';
                      const isFiqh = quiz.subject === 'Fiqh';
                      const isSeerah = quiz.subject === 'Seerah';

                      const theme = isAkhlaq
                        ? {
                            cardBorder: 'border-amber-200/80 hover:border-amber-400 hover:shadow-amber-500/10',
                            badge: 'bg-amber-50 text-amber-800 border-amber-200',
                            btn: 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-amber-500/20'
                          }
                        : isFiqh
                        ? {
                            cardBorder: 'border-cyan-200/80 hover:border-cyan-400 hover:shadow-cyan-500/10',
                            badge: 'bg-cyan-50 text-cyan-800 border-cyan-200',
                            btn: 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white shadow-cyan-500/20'
                          }
                        : {
                            cardBorder: 'border-emerald-200/80 hover:border-emerald-400 hover:shadow-emerald-500/10',
                            badge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
                            btn: 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-emerald-500/20'
                          };

                      return (
                        <div
                          key={quiz.id}
                          className={`p-5 rounded-2xl border-2 ${theme.cardBorder} hover:shadow-lg transition-all bg-white flex flex-col justify-between group`}
                        >
                          <div>
                            <div className="flex items-center justify-between">
                              <span className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg border ${theme.badge}`}>
                                <SubjectIcon subject={quiz.subject} className="w-3.5 h-3.5" />
                                <span>{quiz.subject}</span>
                              </span>
                              <span className="text-xs text-slate-500 font-mono flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-md">
                                <Clock className="w-3 h-3 text-slate-400" />
                                <span>{quiz.timeLimitMinutes}m</span>
                              </span>
                            </div>

                            <h3 className="text-sm font-extrabold text-slate-900 mt-3 group-hover:text-slate-800 transition-colors">
                              {quiz.title}
                            </h3>
                            <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                              {quiz.description}
                            </p>
                          </div>

                          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                            <span className="text-slate-400 font-medium">{quiz.questions.length} Questions</span>
                            <button
                              onClick={() => setActiveQuiz(quiz)}
                              className={`px-4 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1 shadow-sm ${theme.btn}`}
                            >
                              <span>Play Quiz</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Document Viewer Modal */}
      {activeModalItem && (
        <DocumentModal item={activeModalItem} onClose={() => setActiveModalItem(null)} />
      )}
    </div>
  );
};
