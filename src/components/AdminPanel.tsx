import React, { useState, useEffect } from 'react';
import { GradeLevel, InstructionalMedium, QuizSubject, SyllabusBook, Paper, Quiz, PaperCategory, DatabaseStats } from '../types.ts';
import { fetchStats, fetchBooks, createBook, deleteBook, fetchPapers, createPaper, deletePaper, fetchQuizzes, createQuiz, deleteQuiz, resetDatabase, uploadFile } from '../services/api.ts';
import { ShieldCheck, BookOpen, FileText, Layers, AlertTriangle, Plus, Trash2, CheckCircle2, RotateCcw, ArrowLeft, Terminal, LogOut, UserCheck, UploadCloud, FileCode, Eye, Check, X } from 'lucide-react';
import { AdminLogin } from './AdminLogin.tsx';

interface AdminPanelProps {
  onBack: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onBack }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return Boolean(localStorage.getItem('mindedge_admin_token'));
  });
  const [currentUser, setCurrentUser] = useState<{ username: string; displayName: string } | null>(() => {
    try {
      const raw = localStorage.getItem('mindedge_admin_user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [activeTab, setActiveTab] = useState<'books' | 'papers' | 'quizzes' | 'system'>('books');

  // Stats & Resources
  const [stats, setStats] = useState<DatabaseStats | null>(null);
  const [books, setBooks] = useState<SyllabusBook[]>([]);
  const [papers, setPapers] = useState<Paper[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingFile, setIsUploadingFile] = useState(false);

  // Status & Feedback alerts
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [lastSqlQuery, setLastSqlQuery] = useState<string | null>(null);

  // --- BOOK FORM STATE & UPLOADED PDF ---
  const [bookGrade, setBookGrade] = useState<GradeLevel>(6);
  const [bookTitle, setBookTitle] = useState('');
  const [bookMedium, setBookMedium] = useState<InstructionalMedium>('English');
  const [bookSubject, setBookSubject] = useState('Islamic Studies');
  const [bookAuthor, setBookAuthor] = useState('Department of Educational Publications');
  const [bookPages, setBookPages] = useState('160');
  const [bookPdfFile, setBookPdfFile] = useState<File | null>(null);

  // --- PAPER FORM STATE & UPLOADED PDF ---
  const [paperGrade, setPaperGrade] = useState<GradeLevel>(6);
  const [paperCategory, setPaperCategory] = useState<PaperCategory>('model');
  const [paperMedium, setPaperMedium] = useState<InstructionalMedium>('English');
  const [paperSubject, setPaperSubject] = useState('Islamic Studies');
  const [paperTitle, setPaperTitle] = useState('');
  const [paperYear, setPaperYear] = useState('2025');
  const [paperTerm, setPaperTerm] = useState<'Term 1' | 'Term 2' | 'Term 3' | 'Mid-Year' | 'Annual'>('Term 1');
  const [paperDuration, setPaperDuration] = useState('90');
  const [paperTotalMarks, setPaperTotalMarks] = useState('100');
  const [paperPdfFile, setPaperPdfFile] = useState<File | null>(null);

  // --- QUIZ FORM STATE & UPLOADED HTML FILE ---
  const [quizCreationMode, setQuizCreationMode] = useState<'html_file' | 'builder'>('html_file');
  const [quizGrade, setQuizGrade] = useState<GradeLevel>(6);
  const [quizSubject, setQuizSubject] = useState<QuizSubject>('Akhlaq');
  const [quizMedium, setQuizMedium] = useState<InstructionalMedium>('English');
  const [quizTitle, setQuizTitle] = useState('');
  const [quizDesc, setQuizDesc] = useState('');
  const [quizHtmlFile, setQuizHtmlFile] = useState<File | null>(null);
  const [quizHtmlPreviewModal, setQuizHtmlPreviewModal] = useState<{ title: string; html: string; fileUrl?: string } | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<Array<{
    id: string;
    question: string;
    options: string[];
    correctAnswerIndex: number;
    explanation: string;
  }>>([
    {
      id: 'q-builder-1',
      question: 'What is the Islamic virtue associated with keeping covenants and fulfilling trusts?',
      options: ['Amanah', 'Kibr', 'Hasad', 'Riya'],
      correctAnswerIndex: 0,
      explanation: 'Amanah entails fulfilling all trusts and covenants with honesty.'
    }
  ]);

  const loadAll = async () => {
    setIsLoading(true);
    try {
      const [s, b, p, q] = await Promise.all([
        fetchStats(),
        fetchBooks(),
        fetchPapers(),
        fetchQuizzes()
      ]);
      setStats(s);
      setBooks(b);
      setPapers(p);
      setQuizzes(q);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const clearAlerts = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  // Submit Book with validation constraint
  const handleUploadBook = async (e: React.FormEvent) => {
    e.preventDefault();
    clearAlerts();

    if (!bookTitle.trim()) {
      setErrorMessage('Please enter a valid book title.');
      return;
    }

    setLastSqlQuery(`SELECT COUNT(*) FROM books WHERE grade = ${bookGrade};`);

    try {
      setIsUploadingFile(true);
      let fileUrl: string | undefined = undefined;
      let fileName: string | undefined = undefined;
      let fileSize: string | undefined = undefined;

      if (bookPdfFile) {
        const uploadRes = await uploadFile(bookPdfFile, 'books');
        fileUrl = uploadRes.fileUrl;
        fileName = uploadRes.fileName;
        fileSize = uploadRes.fileSize;
      }

      const newBook = await createBook({
        grade: bookGrade,
        title: bookTitle,
        medium: bookMedium,
        subject: bookSubject,
        author: bookAuthor,
        pages: Number(bookPages) || 160,
        fileUrl,
        fileName,
        fileSize: fileSize || `${bookPages} pages`,
        fileType: fileUrl ? 'pdf' : 'standard',
        chapters: [
          'Unit 1: Foundational Framework',
          'Unit 2: Applied Practices & Real-world Case Studies',
          'Unit 3: Ethical Evaluation & Review'
        ]
      });

      setSuccessMessage(`Success: Book "${newBook.title}" (Part ${newBook.part}) uploaded for Grade ${newBook.grade}.`);
      setBookTitle('');
      setBookPdfFile(null);
      await loadAll();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to upload book';
      setErrorMessage(msg);
    } finally {
      setIsUploadingFile(false);
    }
  };

  // Interactive Test Constraint Trigger
  const handleRunConstraintTest = async (gradeToTest: GradeLevel) => {
    clearAlerts();
    setLastSqlQuery(`SELECT COUNT(*) FROM books WHERE grade = ${gradeToTest};`);

    try {
      await createBook({
        grade: gradeToTest,
        title: `Test Excess Book (Violation Attempt) - Grade ${gradeToTest}`,
        medium: 'English',
        subject: 'Islamic Studies',
        author: 'Automated Test Runner',
        pages: 120
      });
      // If it unexpectedly succeeds
      setSuccessMessage(`Warning: Book inserted. Check current capacity.`);
      await loadAll();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Request failed';
      setErrorMessage(msg);
    }
  };

  // Delete Book
  const handleDeleteBook = async (id: string, title: string, grade: GradeLevel) => {
    if (!window.confirm(`Delete syllabus book "${title}" for Grade ${grade}? This will free up a slot.`)) return;
    clearAlerts();
    try {
      const res = await deleteBook(id);
      setSuccessMessage(res.message);
      await loadAll();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete book';
      setErrorMessage(msg);
    }
  };

  // Submit Paper (Unlimited)
  const handleUploadPaper = async (e: React.FormEvent) => {
    e.preventDefault();
    clearAlerts();

    if (!paperTitle.trim()) {
      setErrorMessage('Please provide a paper title.');
      return;
    }

    try {
      setIsUploadingFile(true);
      let fileUrl: string | undefined = undefined;
      let fileName: string | undefined = undefined;
      let fileSize: string | undefined = undefined;

      if (paperPdfFile) {
        const uploadRes = await uploadFile(paperPdfFile, 'papers');
        fileUrl = uploadRes.fileUrl;
        fileName = uploadRes.fileName;
        fileSize = uploadRes.fileSize;
      }

      const paper = await createPaper({
        grade: paperGrade,
        category: paperCategory,
        medium: paperMedium,
        subject: paperSubject,
        title: paperTitle,
        year: Number(paperYear),
        term: paperTerm,
        durationMinutes: Number(paperDuration),
        totalMarks: Number(paperTotalMarks),
        status: 'ready',
        fileUrl,
        fileName,
        fileSize: fileSize || '2.5 MB',
        fileType: fileUrl ? 'pdf' : 'standard'
      });

      setSuccessMessage(`Paper "${paper.title}" uploaded successfully. Unlimited uploads active.`);
      setPaperTitle('');
      setPaperPdfFile(null);
      await loadAll();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to upload paper';
      setErrorMessage(msg);
    } finally {
      setIsUploadingFile(false);
    }
  };

  // Delete Paper
  const handleDeletePaper = async (id: string) => {
    clearAlerts();
    try {
      await deletePaper(id);
      setSuccessMessage('Paper deleted successfully.');
      await loadAll();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete paper';
      setErrorMessage(msg);
    }
  };

  // Submit Quiz (Unlimited)
  const handleCreateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    clearAlerts();

    if (!quizTitle.trim()) {
      setErrorMessage('Please provide a quiz title.');
      return;
    }

    try {
      setIsUploadingFile(true);

      if (quizCreationMode === 'html_file') {
        if (!quizHtmlFile) {
          setErrorMessage('Please select an HTML single-file quiz (.html) to upload.');
          setIsUploadingFile(false);
          return;
        }

        const uploadRes = await uploadFile(quizHtmlFile, 'quizzes');

        const newQuiz = await createQuiz({
          grade: quizGrade,
          subject: quizSubject,
          medium: quizMedium,
          title: quizTitle,
          description: quizDesc || `Standalone interactive HTML quiz (${uploadRes.fileName}) for Grade ${quizGrade}.`,
          timeLimitMinutes: 15,
          format: 'html_single_file',
          htmlContent: uploadRes.rawText,
          fileUrl: uploadRes.fileUrl,
          fileName: uploadRes.fileName,
          questions: [
            {
              id: `q-html-${Date.now()}`,
              question: `Interactive Single-File HTML Assessment: ${quizTitle}`,
              options: ['Completed in Embedded Player'],
              correctAnswerIndex: 0,
              explanation: 'Self-contained HTML quiz engine.'
            }
          ]
        });

        setSuccessMessage(`HTML Single-File Quiz "${newQuiz.title}" uploaded & deployed successfully!`);
        setQuizTitle('');
        setQuizDesc('');
        setQuizHtmlFile(null);
      } else {
        const newQuiz = await createQuiz({
          grade: quizGrade,
          subject: quizSubject,
          medium: quizMedium,
          title: quizTitle,
          description: quizDesc || `${quizSubject} practice examination for Grade ${quizGrade}.`,
          timeLimitMinutes: 15,
          format: 'interactive',
          questions: quizQuestions
        });

        setSuccessMessage(`Quiz "${newQuiz.title}" created successfully with ${newQuiz.questions.length} questions.`);
        setQuizTitle('');
        setQuizDesc('');
      }

      await loadAll();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create quiz';
      setErrorMessage(msg);
    } finally {
      setIsUploadingFile(false);
    }
  };

  // Add question field in quiz builder
  const handleAddQuestionSlot = () => {
    setQuizQuestions((prev) => [
      ...prev,
      {
        id: `q-builder-${Date.now()}-${prev.length + 1}`,
        question: '',
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correctAnswerIndex: 0,
        explanation: ''
      }
    ]);
  };

  // Delete Quiz
  const handleDeleteQuiz = async (id: string) => {
    clearAlerts();
    try {
      await deleteQuiz(id);
      setSuccessMessage('Quiz deleted successfully.');
      await loadAll();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete quiz';
      setErrorMessage(msg);
    }
  };

  // Reset database back to seed
  const handleResetDatabase = async () => {
    if (!window.confirm('Reset the database to initial curriculum seed data? This will restore standard books, model papers, and quizzes.')) return;
    clearAlerts();
    try {
      const res = await resetDatabase();
      setSuccessMessage(res.message);
      await loadAll();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to reset database';
      setErrorMessage(msg);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('mindedge_admin_token');
    localStorage.removeItem('mindedge_admin_user');
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  if (!isAuthenticated) {
    return (
      <AdminLogin
        onSuccess={(user) => {
          setIsAuthenticated(true);
          setCurrentUser(user);
        }}
        onBack={onBack}
      />
    );
  }

  return (
    <div className="min-h-[calc(100vh-65px)] bg-slate-50/60 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Role Portal</span>
            </button>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-indigo-600" />
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Admin Content & Database Controller
              </h1>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-600 mt-1">
              <span className="flex items-center gap-1 text-indigo-700 font-semibold bg-indigo-50 px-2 py-0.5 rounded">
                <UserCheck className="w-3.5 h-3.5" />
                <span>{currentUser?.displayName || 'Administrator'} ({currentUser?.username || 'admin'})</span>
              </span>
              <span aria-hidden="true">·</span>
              <span>Enforce curriculum constraints, upload unlimited practice papers & quizzes.</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleResetDatabase}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Seed Data</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              title="Sign out of admin session"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Global Feedback Banners */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 flex items-start gap-3 animate-in fade-in duration-200">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold text-sm block">Database Constraint Notice</span>
              <p className="mt-1 leading-relaxed">{errorMessage}</p>
              {lastSqlQuery && (
                <div className="mt-2 p-2 bg-rose-100/60 rounded text-rose-800 font-mono text-xs flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Executed: {lastSqlQuery}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {successMessage && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-3 animate-in fade-in duration-200">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold text-sm block">Operation Succeeded</span>
              <p className="mt-1 leading-relaxed">{successMessage}</p>
            </div>
          </div>
        )}

        {/* Grade Quotas & Capacity Overview (The 2-Book Rule Visualizer) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Syllabus Books Capacity Status (Hard Cap: Max 2 Books Per Grade)
            </h2>
            <span className="text-xs text-slate-400 font-mono">
              Enforced via: SELECT COUNT(*) FROM books WHERE grade = X
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
            {([6, 7, 8, 9] as GradeLevel[]).map((grade) => {
              const currentCount = stats?.booksByGrade[grade] ?? books.filter((b) => Number(b.grade) === Number(grade)).length;
              const isFull = currentCount >= 2;

              return (
                <div
                  key={grade}
                  className={`p-4 rounded-xl border text-xs transition-all ${
                    isFull
                      ? 'bg-amber-50/70 border-amber-300'
                      : 'bg-emerald-50/70 border-emerald-300'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-slate-900">Grade {grade}</span>
                    <span className={isFull ? 'text-amber-800' : 'text-emerald-800'}>
                      {currentCount} / 2 Slots
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-slate-200 h-2 rounded-full mt-2.5 overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        isFull ? 'bg-amber-500 w-full' : currentCount === 1 ? 'bg-emerald-500 w-1/2' : 'w-0'
                      }`}
                    />
                  </div>

                  <div className="mt-3 flex items-center justify-between text-slate-600">
                    <span>{isFull ? 'At Hard Cap' : '1 Slot Available'}</span>
                    <button
                      onClick={() => handleRunConstraintTest(grade)}
                      className="text-indigo-600 hover:text-indigo-800 font-semibold underline cursor-pointer"
                      title="Test backend validation query"
                    >
                      Test INSERT
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl max-w-md text-xs font-semibold">
          <button
            onClick={() => setActiveTab('books')}
            className={`flex-1 py-2 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'books'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Syllabus Books (Max 2)</span>
          </button>
          <button
            onClick={() => setActiveTab('papers')}
            className={`flex-1 py-2 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'papers'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Papers (Unlimited)</span>
          </button>
          <button
            onClick={() => setActiveTab('quizzes')}
            className={`flex-1 py-2 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'quizzes'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Quizzes (Unlimited)</span>
          </button>
        </div>

        {/* TAB 1: SYLLABUS BOOKS MANAGEMENT */}
        {activeTab === 'books' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Upload Form (5 cols) */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Plus className="w-4 h-4 text-sky-600" />
                <span>Upload Syllabus Book</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Backend strictly verifies that SELECT COUNT(*) FROM books WHERE grade = X is &lt; 2 before saving.
              </p>

              <form onSubmit={handleUploadBook} className="mt-4 space-y-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Target Grade Level</label>
                  <select
                    value={bookGrade}
                    onChange={(e) => setBookGrade(Number(e.target.value) as GradeLevel)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-sky-500"
                  >
                    <option value={6}>Grade 6 {books.filter(b => b.grade === 6).length >= 2 ? '(FULL - 2/2)' : '(1/2 Available)'}</option>
                    <option value={7}>Grade 7 {books.filter(b => b.grade === 7).length >= 2 ? '(FULL - 2/2)' : '(Available)'}</option>
                    <option value={8}>Grade 8 {books.filter(b => b.grade === 8).length >= 2 ? '(FULL - 2/2)' : '(1/2 Available)'}</option>
                    <option value={9}>Grade 9 {books.filter(b => b.grade === 9).length >= 2 ? '(FULL - 2/2)' : '(Available)'}</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Instructional Medium</label>
                  <select
                    value={bookMedium}
                    onChange={(e) => setBookMedium(e.target.value as InstructionalMedium)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-sky-500"
                  >
                    <option value="English">English</option>
                    <option value="Sinhala">Sinhala</option>
                    <option value="Tamil">Tamil</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Book Title</label>
                  <input
                    type="text"
                    value={bookTitle}
                    onChange={(e) => setBookTitle(e.target.value)}
                    placeholder="e.g., Islamic Studies - Grade 6 (Advanced Companion)"
                    className="w-full p-2.5 rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-sky-500"
                    required
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Subject</label>
                  <input
                    type="text"
                    value={bookSubject}
                    onChange={(e) => setBookSubject(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-sky-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Author / Publisher</label>
                    <input
                      type="text"
                      value={bookAuthor}
                      onChange={(e) => setBookAuthor(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-sky-500"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Page Count</label>
                    <input
                      type="number"
                      value={bookPages}
                      onChange={(e) => setBookPages(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-sky-500"
                    />
                  </div>
                </div>

                {/* PDF File Upload Field */}
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Textbook PDF File <span className="font-normal text-slate-400">(.pdf - optional or live upload)</span>
                  </label>
                  <div className="border-2 border-dashed border-slate-200 hover:border-sky-400 rounded-xl p-3 text-center bg-slate-50/50 transition-colors">
                    {bookPdfFile ? (
                      <div className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-sky-200 text-xs">
                        <div className="flex items-center gap-2 truncate">
                          <FileText className="w-4 h-4 text-sky-600 shrink-0" />
                          <span className="font-medium text-slate-800 truncate">{bookPdfFile.name}</span>
                          <span className="text-[10px] text-slate-400 shrink-0">({(bookPdfFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setBookPdfFile(null)}
                          className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="cursor-pointer block py-2.5">
                        <UploadCloud className="w-7 h-7 text-slate-400 mx-auto mb-1" />
                        <span className="text-sky-600 font-semibold text-xs hover:underline">Choose PDF textbook</span>
                        <span className="text-slate-400 text-[11px] block mt-0.5">National syllabus PDF up to 50MB</span>
                        <input
                          type="file"
                          accept=".pdf,application/pdf"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) setBookPdfFile(file);
                          }}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isUploadingFile}
                  className="w-full py-2.5 px-4 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 rounded-lg transition-colors cursor-pointer shadow-xs mt-2"
                >
                  {isUploadingFile ? 'Uploading & Enforcing Limit...' : 'Upload Book (Execute Insert with Constraint)'}
                </button>
              </form>
            </div>

            {/* Existing Books Directory (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900">Current Syllabus Books Directory</h3>
                <span className="text-xs text-slate-500 font-mono">{books.length} Total</span>
              </div>

              <div className="mt-4 space-y-3">
                {books.map((book) => (
                  <div
                    key={book.id}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-start justify-between gap-4 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sky-700">Grade {book.grade} · Part {book.part}</span>
                        <span aria-hidden="true" className="text-slate-300">·</span>
                        <span className="text-slate-500">{book.medium}</span>
                        {book.fileUrl && (
                          <span className="inline-flex items-center gap-1 bg-sky-100 text-sky-800 px-2 py-0.5 rounded text-[10px] font-bold">
                            <FileText className="w-3 h-3" />
                            PDF
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm mt-0.5">{book.title}</h4>
                      <p className="text-slate-500 mt-1">{book.author} · {book.pages} pages</p>
                      {book.fileUrl && (
                        <div className="mt-2">
                          <a
                            href={book.fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-600 hover:text-sky-800 hover:underline"
                          >
                            <Eye className="w-3 h-3" />
                            View PDF Textbook
                          </a>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => handleDeleteBook(book.id, book.title, book.grade)}
                      className="p-2 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete book to free up a slot"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PAPERS MANAGEMENT (UNLIMITED) */}
        {activeTab === 'papers' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Paper Form (5 cols) */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Plus className="w-4 h-4 text-teal-600" />
                <span>Upload Paper (Unlimited)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Upload infinite Model Papers and Past Papers across all grades and categories.
              </p>

              <form onSubmit={handleUploadPaper} className="mt-4 space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Grade Level</label>
                    <select
                      value={paperGrade}
                      onChange={(e) => setPaperGrade(Number(e.target.value) as GradeLevel)}
                      className="w-full p-2.5 rounded-lg border border-slate-200 bg-white text-slate-900"
                    >
                      <option value={6}>Grade 6</option>
                      <option value={7}>Grade 7</option>
                      <option value={8}>Grade 8</option>
                      <option value={9}>Grade 9</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Category</label>
                    <select
                      value={paperCategory}
                      onChange={(e) => setPaperCategory(e.target.value as PaperCategory)}
                      className="w-full p-2.5 rounded-lg border border-slate-200 bg-white text-slate-900"
                    >
                      <option value="model">Model Paper</option>
                      <option value="past_intermediate">Past Paper (Intermediate)</option>
                      <option value="past_final">Past Paper (Final)</option>
                      <option value="past_dharmachari">Past Paper (Dharmachari)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Paper Title</label>
                  <input
                    type="text"
                    value={paperTitle}
                    onChange={(e) => setPaperTitle(e.target.value)}
                    placeholder="e.g., Grade 8 Second Term Benchmark Examination Paper"
                    className="w-full p-2.5 rounded-lg border border-slate-200 bg-white text-slate-900"
                    required
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Year</label>
                    <input
                      type="number"
                      value={paperYear}
                      onChange={(e) => setPaperYear(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-slate-200 bg-white text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Duration (min)</label>
                    <input
                      type="number"
                      value={paperDuration}
                      onChange={(e) => setPaperDuration(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-slate-200 bg-white text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Total Marks</label>
                    <input
                      type="number"
                      value={paperTotalMarks}
                      onChange={(e) => setPaperTotalMarks(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-slate-200 bg-white text-slate-900"
                    />
                  </div>
                </div>

                {/* PDF File Upload Field for Paper */}
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Exam / Model Paper PDF <span className="font-normal text-slate-400">(.pdf - upload national paper)</span>
                  </label>
                  <div className="border-2 border-dashed border-slate-200 hover:border-teal-400 rounded-xl p-3 text-center bg-slate-50/50 transition-colors">
                    {paperPdfFile ? (
                      <div className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-teal-200 text-xs">
                        <div className="flex items-center gap-2 truncate">
                          <FileText className="w-4 h-4 text-teal-600 shrink-0" />
                          <span className="font-medium text-slate-800 truncate">{paperPdfFile.name}</span>
                          <span className="text-[10px] text-slate-400 shrink-0">({(paperPdfFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setPaperPdfFile(null)}
                          className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="cursor-pointer block py-2.5">
                        <UploadCloud className="w-7 h-7 text-slate-400 mx-auto mb-1" />
                        <span className="text-teal-600 font-semibold text-xs hover:underline">Choose PDF document</span>
                        <span className="text-slate-400 text-[11px] block mt-0.5">National curriculum papers (.pdf) up to 50MB</span>
                        <input
                          type="file"
                          accept=".pdf,application/pdf"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) setPaperPdfFile(file);
                          }}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isUploadingFile}
                  className="w-full py-2.5 px-4 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 disabled:opacity-50 rounded-lg transition-colors cursor-pointer shadow-xs mt-2"
                >
                  {isUploadingFile ? 'Uploading PDF Document...' : 'Publish Paper (Unlimited)'}
                </button>
              </form>
            </div>

            {/* Papers List (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900">Published Papers Archives</h3>
                <span className="text-xs text-slate-500 font-mono">{papers.length} Papers</span>
              </div>

              <div className="mt-4 space-y-3 max-h-[500px] overflow-y-auto">
                {papers.map((p) => (
                  <div
                    key={p.id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{p.title}</span>
                        {p.fileUrl && (
                          <span className="inline-flex items-center gap-1 bg-teal-100 text-teal-800 px-2 py-0.5 rounded text-[10px] font-bold">
                            <FileText className="w-3 h-3" />
                            PDF
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-slate-500 mt-1">
                        <span>Grade {p.grade}</span>
                        <span aria-hidden="true">·</span>
                        <span className="capitalize">{p.category.replace('_', ' ')}</span>
                        <span aria-hidden="true">·</span>
                        <span>{p.year}</span>
                        {p.fileSize && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="font-mono text-slate-400">{p.fileSize}</span>
                          </>
                        )}
                      </div>
                      {p.fileUrl && (
                        <div className="mt-2">
                          <a
                            href={p.fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-600 hover:text-teal-800 hover:underline"
                          >
                            <Eye className="w-3 h-3" />
                            View PDF Paper
                          </a>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeletePaper(p.id)}
                      className="p-2 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: QUIZZES MANAGEMENT (UNLIMITED) */}
        {activeTab === 'quizzes' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Quiz Builder / HTML Uploader (6 cols) */}
            <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Plus className="w-4 h-4 text-purple-600" />
                  <span>Upload & Create Quizzes (Unlimited)</span>
                </h3>
              </div>

              {/* Mode Switcher */}
              <div className="flex p-1 bg-slate-100 rounded-xl mb-4 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setQuizCreationMode('html_file')}
                  className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    quizCreationMode === 'html_file'
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5" />
                  <span>Single-File HTML Quiz (.html)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setQuizCreationMode('builder')}
                  className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    quizCreationMode === 'builder'
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Question Builder</span>
                </button>
              </div>

              <form onSubmit={handleCreateQuiz} className="space-y-4 text-xs">
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Grade Level</label>
                    <select
                      value={quizGrade}
                      onChange={(e) => setQuizGrade(Number(e.target.value) as GradeLevel)}
                      className="w-full p-2.5 rounded-lg border border-slate-200 bg-white text-slate-900"
                    >
                      <option value={6}>Grade 6</option>
                      <option value={7}>Grade 7</option>
                      <option value={8}>Grade 8</option>
                      <option value={9}>Grade 9</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Subject</label>
                    <select
                      value={quizSubject}
                      onChange={(e) => setQuizSubject(e.target.value as QuizSubject)}
                      className="w-full p-2.5 rounded-lg border border-slate-200 bg-white text-slate-900"
                    >
                      <option value="Akhlaq">Akhlaq (Ethics)</option>
                      <option value="Fiqh">Fiqh (Jurisprudence)</option>
                      <option value="Seerah">Seerah (History)</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Medium</label>
                    <select
                      value={quizMedium}
                      onChange={(e) => setQuizMedium(e.target.value as InstructionalMedium)}
                      className="w-full p-2.5 rounded-lg border border-slate-200 bg-white text-slate-900"
                    >
                      <option value="English">English</option>
                      <option value="Sinhala">Sinhala</option>
                      <option value="Tamil">Tamil</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Quiz Title</label>
                  <input
                    type="text"
                    value={quizTitle}
                    onChange={(e) => setQuizTitle(e.target.value)}
                    placeholder="e.g., Akhlaq Chapter 3: Trustworthiness & Honesty Interactive Assessment"
                    className="w-full p-2.5 rounded-lg border border-slate-200 bg-white text-slate-900"
                    required
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Description</label>
                  <input
                    type="text"
                    value={quizDesc}
                    onChange={(e) => setQuizDesc(e.target.value)}
                    placeholder="Brief objective summary for students"
                    className="w-full p-2.5 rounded-lg border border-slate-200 bg-white text-slate-900"
                  />
                </div>

                {/* HTML Single-File Upload Mode */}
                {quizCreationMode === 'html_file' && (
                  <div className="space-y-3 pt-2 border-t border-slate-100">
                    <label className="font-semibold text-slate-700 block">
                      Single-File HTML Quiz <span className="font-normal text-purple-600">(.html, .htm)</span>
                    </label>

                    <div className="border-2 border-dashed border-purple-200 hover:border-purple-400 rounded-xl p-4 text-center bg-purple-50/30 transition-colors">
                      {quizHtmlFile ? (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-purple-200 text-xs">
                            <div className="flex items-center gap-2 truncate">
                              <FileCode className="w-5 h-5 text-purple-600 shrink-0" />
                              <div className="text-left truncate">
                                <span className="font-bold text-slate-900 block truncate">{quizHtmlFile.name}</span>
                                <span className="text-[11px] text-slate-400">{(quizHtmlFile.size / 1024).toFixed(1)} KB · HTML Interactive Engine</span>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => setQuizHtmlFile(null)}
                              className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="flex items-center gap-2 justify-center">
                            <button
                              type="button"
                              onClick={() => {
                                const reader = new FileReader();
                                reader.onload = (ev) => {
                                  const text = ev.target?.result as string;
                                  setQuizHtmlPreviewModal({
                                    title: quizTitle || quizHtmlFile.name,
                                    html: text
                                  });
                                };
                                reader.readAsText(quizHtmlFile);
                              }}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-purple-700 bg-white border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Test / Preview HTML Quiz</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <label className="cursor-pointer block py-4">
                          <FileCode className="w-8 h-8 text-purple-500 mx-auto mb-1.5" />
                          <span className="text-purple-700 font-bold text-xs hover:underline">Select Single-File HTML Quiz</span>
                          <span className="text-slate-500 text-[11px] block mt-1">
                            Self-contained .html files containing all questions, CSS &amp; JavaScript
                          </span>
                          <input
                            type="file"
                            accept=".html,.htm,text/html"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setQuizHtmlFile(file);
                                if (!quizTitle) {
                                  const clean = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
                                  setQuizTitle(clean);
                                }
                              }
                            }}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  </div>
                )}

                {/* Question Slots in Builder Mode */}
                {quizCreationMode === 'builder' && (
                  <div className="space-y-4 pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">Questions ({quizQuestions.length})</span>
                      <button
                        type="button"
                        onClick={handleAddQuestionSlot}
                        className="text-purple-600 hover:text-purple-800 font-semibold cursor-pointer"
                      >
                        + Add Question
                      </button>
                    </div>

                    {quizQuestions.map((q, qIdx) => (
                      <div key={qIdx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                        <span className="font-semibold text-slate-700 block">Question {qIdx + 1}:</span>
                        <input
                          type="text"
                          value={q.question}
                          onChange={(e) => {
                            const updated = [...quizQuestions];
                            updated[qIdx].question = e.target.value;
                            setQuizQuestions(updated);
                          }}
                          placeholder="Enter the question text"
                          className="w-full p-2 rounded border border-slate-200 bg-white text-slate-900"
                          required
                        />

                        <div className="grid grid-cols-2 gap-2 pt-1">
                          {q.options.map((opt, optIdx) => (
                            <div key={optIdx} className="flex items-center gap-1.5">
                              <input
                                type="radio"
                                name={`correct-${qIdx}`}
                                checked={q.correctAnswerIndex === optIdx}
                                onChange={() => {
                                  const updated = [...quizQuestions];
                                  updated[qIdx].correctAnswerIndex = optIdx;
                                  setQuizQuestions(updated);
                                }}
                                className="cursor-pointer"
                              />
                              <input
                                type="text"
                                value={opt}
                                onChange={(e) => {
                                  const updated = [...quizQuestions];
                                  updated[qIdx].options[optIdx] = e.target.value;
                                  setQuizQuestions(updated);
                                }}
                                className="w-full p-1.5 text-xs rounded border border-slate-200 bg-white"
                              />
                            </div>
                          ))}
                        </div>

                        <input
                          type="text"
                          value={q.explanation}
                          onChange={(e) => {
                            const updated = [...quizQuestions];
                            updated[qIdx].explanation = e.target.value;
                            setQuizQuestions(updated);
                          }}
                          placeholder="Curriculum explanation for correct option"
                          className="w-full p-2 text-xs rounded border border-slate-200 bg-white text-slate-700"
                        />
                      </div>
                    ))}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isUploadingFile}
                  className="w-full py-2.5 px-4 text-xs font-bold text-white bg-purple-700 hover:bg-purple-800 disabled:opacity-50 rounded-lg transition-colors cursor-pointer shadow-xs mt-2"
                >
                  {isUploadingFile ? 'Uploading & Deploying Quiz...' : quizCreationMode === 'html_file' ? 'Upload Single-File HTML Quiz' : 'Save Quiz Engine (Unlimited)'}
                </button>
              </form>
            </div>

            {/* Quizzes List (6 cols) */}
            <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900">Current Quiz Engines</h3>
                <span className="text-xs text-slate-500 font-mono">{quizzes.length} Total</span>
              </div>

              <div className="mt-4 space-y-3 max-h-[500px] overflow-y-auto">
                {quizzes.map((q) => {
                  const isHtml = q.format === 'html_single_file' || Boolean(q.htmlContent) || Boolean(q.fileUrl && q.fileUrl.endsWith('.html'));
                  return (
                    <div
                      key={q.id}
                      className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex items-start justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-slate-900">{q.title}</span>
                          {isHtml ? (
                            <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-800 px-2 py-0.5 rounded text-[10px] font-bold">
                              <FileCode className="w-3 h-3" />
                              HTML Single-File
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded text-[10px] font-bold">
                              <Layers className="w-3 h-3" />
                              Interactive Engine
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-slate-500 mt-1">
                          <span className="font-medium text-purple-700">{q.subject}</span>
                          <span aria-hidden="true">·</span>
                          <span>Grade {q.grade}</span>
                          <span aria-hidden="true">·</span>
                          <span>{q.medium}</span>
                          {q.fileName && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="font-mono text-slate-400">{q.fileName}</span>
                            </>
                          )}
                        </div>

                        {/* Interactive Preview Button */}
                        <div className="mt-2.5 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setQuizHtmlPreviewModal({
                                title: q.title,
                                html: q.htmlContent || '',
                                fileUrl: q.fileUrl
                              });
                            }}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-700 hover:text-purple-900 hover:underline cursor-pointer"
                          >
                            <Eye className="w-3 h-3" />
                            <span>Preview Engine</span>
                          </button>
                          {q.fileUrl && (
                            <a
                              href={q.fileUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[11px] text-slate-400 hover:text-slate-600 hover:underline"
                            >
                              (Raw file link)
                            </a>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteQuiz(q.id)}
                        className="p-2 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* HTML Quiz In-Admin Preview Modal */}
        {quizHtmlPreviewModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-4xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-2">
                  <FileCode className="w-5 h-5 text-purple-600" />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{quizHtmlPreviewModal.title}</h4>
                    <span className="text-[11px] text-slate-500">Live HTML Sandbox Test Preview</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {quizHtmlPreviewModal.fileUrl && (
                    <a
                      href={quizHtmlPreviewModal.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100"
                    >
                      Open Full Tab
                    </a>
                  )}
                  <button
                    onClick={() => setQuizHtmlPreviewModal(null)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="flex-1 bg-white p-2">
                <iframe
                  src={quizHtmlPreviewModal.fileUrl || undefined}
                  srcDoc={quizHtmlPreviewModal.html || undefined}
                  title="Quiz Preview"
                  className="w-full h-[540px] border-0 rounded-lg"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                />
              </div>
              <div className="p-3 bg-slate-50 border-t border-slate-200 text-right">
                <button
                  onClick={() => setQuizHtmlPreviewModal(null)}
                  className="px-4 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg cursor-pointer"
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
