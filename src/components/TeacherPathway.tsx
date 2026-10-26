import React, { useState, useEffect } from 'react';
import { InstructionalMedium, GradeLevel, SyllabusBook, Paper, Quiz } from '../types.ts';
import { fetchBooks, fetchPapers, fetchQuizzes } from '../services/api.ts';
import { DocumentModal } from './DocumentModal.tsx';
import { QuizEngine } from './QuizEngine.tsx';
import { Folder, BookOpen, FileText, CheckCircle2, ArrowLeft, Presentation, ChevronRight, Layers, Eye } from 'lucide-react';

interface TeacherPathwayProps {
  onBackToRoles: () => void;
}

export const TeacherPathway: React.FC<TeacherPathwayProps> = ({ onBackToRoles }) => {
  // Step 1: Medium | Step 2: Master Folder Dashboard
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [selectedMedium, setSelectedMedium] = useState<InstructionalMedium>('English');
  const [activeGrade, setActiveGrade] = useState<GradeLevel>(6);

  // Loaded data for all grades
  const [allBooks, setAllBooks] = useState<SyllabusBook[]>([]);
  const [allPapers, setAllPapers] = useState<Paper[]>([]);
  const [allQuizzes, setAllQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Active modal or presentation
  const [activeModalItem, setActiveModalItem] = useState<SyllabusBook | Paper | null>(null);
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [presentationMode, setPresentationMode] = useState(false);

  useEffect(() => {
    if (currentStep !== 2) return;

    let mounted = true;
    setIsLoading(true);

    Promise.all([
      fetchBooks(undefined, selectedMedium),
      fetchPapers(undefined, undefined, selectedMedium),
      fetchQuizzes(undefined, undefined, selectedMedium)
    ])
      .then(([b, p, q]) => {
        if (!mounted) return;
        setAllBooks(b);
        setAllPapers(p);
        setAllQuizzes(q);
      })
      .catch((err) => {
        console.error('Error fetching teacher resources:', err);
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [currentStep, selectedMedium]);

  // Filtered resources for the active grade
  const gradeBooks = allBooks.filter((b) => Number(b.grade) === Number(activeGrade));
  const gradePapers = allPapers.filter((p) => Number(p.grade) === Number(activeGrade));
  const gradeQuizzes = allQuizzes.filter((q) => Number(q.grade) === Number(activeGrade));

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
            <span className="text-xs uppercase font-bold tracking-wider text-teal-600">Teacher Pathway · Step 1 of 2</span>
            <h1 className="text-3xl font-bold text-slate-900 mt-2 tracking-tight">Select Instructional Medium</h1>
            <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto">
              Choose the instructional medium you teach in to consolidate curriculum guides, syllabus books, and marking schemes across Grades 6 through 9.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={() => {
                setSelectedMedium('Sinhala');
                setCurrentStep(2);
              }}
              className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-teal-500 hover:shadow-md transition-all text-left group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 font-bold flex items-center justify-center text-sm mb-4">
                සිං
              </div>
              <h2 className="text-base font-bold text-slate-900 group-hover:text-teal-600 transition-colors">
                Sinhala Medium
              </h2>
              <p className="text-xs text-slate-500 mt-1">සිංහල මාධ්‍ය ගුරු සම්පත්</p>
              <div className="mt-4 flex items-center text-xs font-semibold text-teal-600 opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Enter Workspace</span>
                <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </button>

            <button
              onClick={() => {
                setSelectedMedium('English');
                setCurrentStep(2);
              }}
              className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-teal-500 hover:shadow-md transition-all text-left group cursor-pointer ring-2 ring-teal-500/10"
            >
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 font-bold flex items-center justify-center text-sm mb-4">
                EN
              </div>
              <h2 className="text-base font-bold text-slate-900 group-hover:text-teal-600 transition-colors">
                English Medium
              </h2>
              <p className="text-xs text-slate-500 mt-1">National English Curriculum</p>
              <div className="mt-4 flex items-center text-xs font-semibold text-teal-600 opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Enter Workspace</span>
                <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </button>

            <button
              onClick={() => {
                setSelectedMedium('Tamil');
                setCurrentStep(2);
              }}
              className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-teal-500 hover:shadow-md transition-all text-left group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 font-bold flex items-center justify-center text-sm mb-4">
                த
              </div>
              <h2 className="text-base font-bold text-slate-900 group-hover:text-teal-600 transition-colors">
                Tamil Medium
              </h2>
              <p className="text-xs text-slate-500 mt-1">ஆசிரியர் வளங்கள்</p>
              <div className="mt-4 flex items-center text-xs font-semibold text-teal-600 opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Enter Workspace</span>
                <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: RESOURCES BY GRADE DASHBOARD (MASTER FOLDER VIEW) */}
      {currentStep === 2 && (
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>Teacher Workspace</span>
                <span aria-hidden="true">·</span>
                <span>{selectedMedium} Medium</span>
                <span aria-hidden="true">·</span>
                <span>Master Folder Architecture</span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 mt-1 tracking-tight">
                Resources by Grade Dashboard
              </h1>
              <p className="text-xs text-slate-600 mt-0.5">
                Consolidated folder view containing all syllabus textbooks, model evaluations, marking schemes, and interactive quiz banks.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                Change Medium
              </button>
              <button
                onClick={() => setPresentationMode(!presentationMode)}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  presentationMode
                    ? 'bg-teal-600 text-white'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Presentation className="w-4 h-4" />
                <span>Classroom Projector Mode</span>
              </button>
            </div>
          </div>

          {/* MASTER FOLDER VIEW: BUTTONS FOR "GRADE 6", "GRADE 7", "GRADE 8", "GRADE 9" */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Folder className="w-5 h-5 text-teal-600" />
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Select Grade Master Folder
                </h2>
              </div>
              <span className="text-xs text-slate-500 font-mono">
                Active: Grade {activeGrade}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
              {([
                { grade: 6, color: 'text-purple-700', activeBg: 'bg-purple-50/80 border-purple-500 ring-2 ring-purple-500/20', dot: 'bg-purple-600' },
                { grade: 7, color: 'text-sky-700', activeBg: 'bg-sky-50/80 border-sky-500 ring-2 ring-sky-500/20', dot: 'bg-sky-600' },
                { grade: 8, color: 'text-teal-700', activeBg: 'bg-teal-50/80 border-teal-500 ring-2 ring-teal-500/20', dot: 'bg-teal-600' },
                { grade: 9, color: 'text-amber-700', activeBg: 'bg-amber-50/80 border-amber-500 ring-2 ring-amber-500/20', dot: 'bg-amber-600' }
              ] as const).map(({ grade, color, activeBg, dot }) => {
                const isActive = activeGrade === grade;
                const bookCount = allBooks.filter((b) => Number(b.grade) === Number(grade)).length;
                const paperCount = allPapers.filter((p) => Number(p.grade) === Number(grade)).length;
                const quizCount = allQuizzes.filter((q) => Number(q.grade) === Number(grade)).length;

                return (
                  <button
                    key={grade}
                    onClick={() => setActiveGrade(grade as GradeLevel)}
                    className={`p-5 rounded-2xl border-2 text-left transition-all cursor-pointer relative ${
                      isActive
                        ? activeBg
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-lg font-extrabold ${isActive ? color : 'text-slate-800'}`}>
                        Grade {grade}
                      </span>
                      <span className={`w-3 h-3 rounded-full ${isActive ? dot : 'bg-slate-300'}`} />
                    </div>

                    <div className="mt-4 space-y-1 text-xs text-slate-500">
                      <div className="flex justify-between">
                        <span>Syllabus:</span>
                        <span className="font-semibold text-slate-700">{bookCount}/2 Books</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Papers:</span>
                        <span className="font-semibold text-slate-700">{paperCount} Files</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Quiz Bank:</span>
                        <span className="font-semibold text-slate-700">{quizCount} Tests</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* CONSOLIDATED GRADE RESOURCES CONTAINER */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">
                Grade {activeGrade} Consolidated Repository
              </h3>
              <span className="text-xs text-slate-500">
                Instructional Medium: <strong>{selectedMedium}</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* SECTION 1: SYLLABUS BOOKS (CONSOLIDATED) */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-sky-600" />
                      <h4 className="text-sm font-bold text-slate-900">Syllabus Books</h4>
                    </div>
                    <span className="text-xs font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
                      {gradeBooks.length}/2 Cap
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 mt-2">
                    Official curriculum texts assigned for Grade {activeGrade}.
                  </p>

                  <div className="mt-4 space-y-3">
                    {gradeBooks.length === 0 ? (
                      <div className="text-xs text-slate-400 py-6 text-center">No syllabus books for Grade {activeGrade}.</div>
                    ) : (
                      gradeBooks.map((book) => (
                        <div key={book.id} className="p-3 rounded-lg border border-slate-200 bg-slate-50 text-xs">
                          <span className="font-semibold text-slate-800 block">{book.title}</span>
                          <span className="text-slate-400 block mt-0.5">{book.pages} pages · {book.edition}</span>
                          <button
                            onClick={() => setActiveModalItem(book)}
                            className="mt-2 text-sky-600 hover:text-sky-800 font-semibold flex items-center gap-1 cursor-pointer"
                          >
                            <Eye className="w-3 h-3" />
                            <span>Preview Book & Units</span>
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 mt-4 text-xs text-slate-400">
                  Strictly limited to 2 books per grade by curriculum policy.
                </div>
              </div>

              {/* SECTION 2: MODEL PAPERS & ANSWER KEYS */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-teal-600" />
                      <h4 className="text-sm font-bold text-slate-900">Model & Past Papers</h4>
                    </div>
                    <span className="text-xs font-mono text-slate-400">{gradePapers.length} Available</span>
                  </div>

                  <p className="text-xs text-slate-500 mt-2">
                    Evaluation materials, term test sheets, and marking rubrics.
                  </p>

                  <div className="mt-4 space-y-2.5 max-h-72 overflow-y-auto">
                    {gradePapers.length === 0 ? (
                      <div className="text-xs text-slate-400 py-6 text-center">No papers uploaded for this grade.</div>
                    ) : (
                      gradePapers.map((paper) => (
                        <div key={paper.id} className="p-3 rounded-lg border border-slate-200 bg-slate-50 text-xs flex items-center justify-between">
                          <div>
                            <span className="font-semibold text-slate-800 block truncate max-w-[180px]">{paper.title}</span>
                            <div className="flex items-center gap-2 text-slate-400 mt-0.5">
                              <span>{paper.year}</span>
                              <span aria-hidden="true">·</span>
                              <span className="capitalize">{paper.category.replace('_', ' ')}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => setActiveModalItem(paper)}
                            className="px-2.5 py-1 text-slate-700 bg-white border border-slate-200 rounded hover:bg-slate-100 transition-colors cursor-pointer text-xs font-medium"
                          >
                            Inspect
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 mt-4 text-xs text-teal-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Marking keys ready for teacher reference</span>
                </div>
              </div>

              {/* SECTION 3: QUIZ BANK & PROJECTOR MODE */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-purple-600" />
                      <h4 className="text-sm font-bold text-slate-900">Quiz Bank & Presentation</h4>
                    </div>
                    <span className="text-xs font-mono text-slate-400">{gradeQuizzes.length} Quizzes</span>
                  </div>

                  <p className="text-xs text-slate-500 mt-2">
                    Interactive question banks for Akhlaq, Fiqh, and Seerah.
                  </p>

                  <div className="mt-4 space-y-3">
                    {gradeQuizzes.length === 0 ? (
                      <div className="text-xs text-slate-400 py-6 text-center">No quizzes for Grade {activeGrade}.</div>
                    ) : (
                      gradeQuizzes.map((quiz) => (
                        <div key={quiz.id} className="p-3 rounded-lg border border-slate-200 bg-slate-50 text-xs flex items-center justify-between">
                          <div>
                            <span className="font-semibold text-slate-800 block truncate max-w-[170px]">{quiz.title}</span>
                            <span className="text-slate-400 block mt-0.5">{quiz.subject} · {quiz.questions.length} Questions</span>
                          </div>
                          <button
                            onClick={() => setActiveQuiz(quiz)}
                            className="px-2.5 py-1 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded transition-colors cursor-pointer"
                          >
                            Launch
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 mt-4">
                  <button
                    onClick={() => {
                      if (gradeQuizzes.length > 0) setActiveQuiz(gradeQuizzes[0]);
                    }}
                    disabled={gradeQuizzes.length === 0}
                    className="w-full py-2 px-3 text-xs font-semibold text-purple-900 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40"
                  >
                    <Presentation className="w-3.5 h-3.5" />
                    <span>Launch Classroom Quiz on Smartboard</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Document Modal */}
      {activeModalItem && (
        <DocumentModal item={activeModalItem} onClose={() => setActiveModalItem(null)} />
      )}
    </div>
  );
};
