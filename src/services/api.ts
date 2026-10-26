import { SyllabusBook, Paper, Quiz, DatabaseStats, GradeLevel, InstructionalMedium } from '../types.ts';

export async function fetchStats(): Promise<DatabaseStats> {
  const res = await fetch('/api/stats');
  if (!res.ok) throw new Error('Failed to load database stats');
  return res.json();
}

export async function adminLogin(username: string, password: string): Promise<{ success: boolean; token: string; user: { username: string; displayName: string; role: string } }> {
  const res = await fetch('/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Authentication failed');
  return data;
}

export async function uploadFile(
  file: File,
  category: 'books' | 'papers' | 'quizzes'
): Promise<{ fileUrl: string; fileName: string; fileSize: string; fileType: 'pdf' | 'html'; rawText?: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    const isHtml = file.name.endsWith('.html') || file.name.endsWith('.htm') || file.type.includes('html');

    if (isHtml) {
      // Read as text to preserve full HTML code
      reader.onload = async () => {
        try {
          const rawText = reader.result as string;
          const res = await fetch('/api/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              fileData: rawText,
              fileName: file.name,
              fileCategory: category,
              fileType: 'html'
            })
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || 'Failed to upload HTML quiz');
          resolve({ ...data, rawText });
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read HTML file'));
      reader.readAsText(file);
    } else {
      // Read as Data URL (Base64) for PDF documents
      reader.onload = async () => {
        try {
          const base64Data = reader.result as string;
          const res = await fetch('/api/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              fileData: base64Data,
              fileName: file.name,
              fileCategory: category,
              fileType: 'pdf'
            })
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || 'Failed to upload PDF document');
          resolve(data);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read PDF file'));
      reader.readAsDataURL(file);
    }
  });
}

export async function fetchBooks(grade?: GradeLevel, medium?: InstructionalMedium): Promise<SyllabusBook[]> {
  const params = new URLSearchParams();
  if (grade) params.set('grade', String(grade));
  if (medium) params.set('medium', medium);
  const res = await fetch(`/api/books?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch books');
  return res.json();
}

export async function createBook(bookData: Partial<SyllabusBook>): Promise<SyllabusBook> {
  const res = await fetch('/api/books', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookData),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to upload syllabus book');
  }
  return data;
}

export async function deleteBook(id: string): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`/api/books/${id}`, { method: 'DELETE' });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to delete book');
  return data;
}

export async function fetchPapers(grade?: GradeLevel, category?: string, medium?: InstructionalMedium): Promise<Paper[]> {
  const params = new URLSearchParams();
  if (grade) params.set('grade', String(grade));
  if (category) params.set('category', category);
  if (medium) params.set('medium', medium);
  const res = await fetch(`/api/papers?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch papers');
  return res.json();
}

export async function createPaper(paperData: Partial<Paper>): Promise<Paper> {
  const res = await fetch('/api/papers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(paperData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to upload paper');
  return data;
}

export async function deletePaper(id: string): Promise<{ success: boolean }> {
  const res = await fetch(`/api/papers/${id}`, { method: 'DELETE' });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to delete paper');
  return data;
}

export async function fetchQuizzes(grade?: GradeLevel, subject?: string, medium?: InstructionalMedium): Promise<Quiz[]> {
  const params = new URLSearchParams();
  if (grade) params.set('grade', String(grade));
  if (subject) params.set('subject', subject);
  if (medium) params.set('medium', medium);
  const res = await fetch(`/api/quizzes?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch quizzes');
  return res.json();
}

export async function fetchQuizById(id: string): Promise<Quiz> {
  const res = await fetch(`/api/quizzes/${id}`);
  if (!res.ok) throw new Error('Failed to load quiz');
  return res.json();
}

export async function createQuiz(quizData: Partial<Quiz>): Promise<Quiz> {
  const res = await fetch('/api/quizzes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(quizData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to create quiz');
  return data;
}

export async function deleteQuiz(id: string): Promise<{ success: boolean }> {
  const res = await fetch(`/api/quizzes/${id}`, { method: 'DELETE' });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to delete quiz');
  return data;
}

export async function resetDatabase(): Promise<{ success: boolean; message: string; stats: DatabaseStats }> {
  const res = await fetch('/api/reset-db', { method: 'POST' });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to reset database');
  return data;
}
