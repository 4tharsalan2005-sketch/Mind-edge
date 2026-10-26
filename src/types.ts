export type UserRole = 'student' | 'teacher' | 'admin';

export type InstructionalMedium = 'Sinhala' | 'English' | 'Tamil';

export type GradeLevel = 6 | 7 | 8 | 9;

export type QuizSubject = 'Akhlaq' | 'Fiqh' | 'Seerah';

export type PaperCategory = 'model' | 'past_intermediate' | 'past_final' | 'past_dharmachari';

export interface SyllabusBook {
  id: string;
  grade: GradeLevel;
  medium: InstructionalMedium;
  subject: string;
  title: string;
  part: number; // Part 1 or Part 2 (since strictly 2 per grade)
  author: string;
  edition: string;
  pages: number;
  fileSize: string;
  downloadUrl?: string;
  fileUrl?: string;
  fileName?: string;
  fileType?: 'pdf' | 'standard';
  summary: string;
  chapters: string[];
  createdAt: string;
}

export interface Paper {
  id: string;
  grade: GradeLevel;
  medium: InstructionalMedium;
  category: PaperCategory;
  subject: string;
  title: string;
  year: number;
  term?: 'Term 1' | 'Term 2' | 'Term 3' | 'Mid-Year' | 'Annual';
  durationMinutes: number;
  totalMarks: number;
  fileSize: string;
  status: 'ready' | 'coming_soon';
  downloadUrl?: string;
  fileUrl?: string;
  fileName?: string;
  fileType?: 'pdf' | 'standard';
  answerKeyUrl?: string;
  createdAt: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  grade: GradeLevel;
  medium: InstructionalMedium;
  subject: QuizSubject;
  title: string;
  description: string;
  timeLimitMinutes: number;
  format?: 'interactive' | 'html_single_file';
  htmlContent?: string;
  fileUrl?: string;
  fileName?: string;
  questions: QuizQuestion[];
  createdAt: string;
}

export interface DatabaseStats {
  booksByGrade: Record<GradeLevel, number>;
  totalBooks: number;
  totalPapers: number;
  totalQuizzes: number;
}
