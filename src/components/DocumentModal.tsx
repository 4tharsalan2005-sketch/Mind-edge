import React, { useState } from 'react';
import { X, Download, Printer, BookOpen, FileText, CheckCircle2 } from 'lucide-react';
import { SyllabusBook, Paper } from '../types.ts';

interface DocumentModalProps {
  item: SyllabusBook | Paper | null;
  onClose: () => void;
}

export const DocumentModal: React.FC<DocumentModalProps> = ({ item, onClose }) => {
  const [activeTab, setActiveTab] = useState<'content' | 'chapters' | 'info'>('content');
  const [downloadNotif, setDownloadNotif] = useState(false);

  if (!item) return null;

  const isBook = 'chapters' in item;
  const book = isBook ? (item as SyllabusBook) : null;
  const paper = !isBook ? (item as Paper) : null;
  const hasUploadedPdf = Boolean(item.fileUrl && (item.fileType === 'pdf' || item.fileUrl.endsWith('.pdf') || item.fileUrl.startsWith('/uploads')));

  const handleDownload = () => {
    if (item.fileUrl && item.fileUrl !== '#') {
      const a = document.createElement('a');
      a.href = item.fileUrl;
      a.download = item.fileName || `${item.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
    setDownloadNotif(true);
    setTimeout(() => setDownloadNotif(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-4xl max-h-[92vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isBook ? 'bg-sky-100 text-sky-700' : 'bg-teal-100 text-teal-700'}`}>
              {isBook ? <BookOpen className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 leading-tight">
                {item.title}
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                <span>Grade {item.grade}</span>
                <span aria-hidden="true">·</span>
                <span>{item.medium} Medium</span>
                <span aria-hidden="true">·</span>
                <span>{item.fileSize}</span>
                {hasUploadedPdf && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded text-[11px]">PDF Document</span>
                  </>
                )}
                {paper?.term && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="font-medium text-slate-700">{paper.term}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
            <button
              onClick={() => window.print()}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Download notification banner */}
        {downloadNotif && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-2 flex items-center gap-2 text-xs text-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Document download initiated successfully for offline educational study.</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="px-6 border-b border-slate-200 flex gap-4 text-xs font-medium">
          {hasUploadedPdf && (
            <button
              onClick={() => setActiveTab('content')}
              className={`py-3 border-b-2 transition-colors cursor-pointer ${
                activeTab === 'content'
                  ? 'border-sky-600 text-sky-600 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              PDF Viewer
            </button>
          )}
          <button
            onClick={() => setActiveTab('chapters')}
            className={`py-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'chapters'
                ? 'border-sky-600 text-sky-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            {isBook ? `Curriculum Units (${book?.chapters?.length || 0})` : 'Specimen & Instructions'}
          </button>
          <button
            onClick={() => setActiveTab('info')}
            className={`py-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'info'
                ? 'border-sky-600 text-sky-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Metadata & File Details
          </button>
        </div>

        {/* Body content */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
          {activeTab === 'content' && (
            hasUploadedPdf && item.fileUrl ? (
              <div className="w-full h-[580px] bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
                <iframe
                  src={item.fileUrl}
                  title={item.title}
                  className="w-full h-full border-0"
                />
              </div>
            ) : (
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-xs border border-slate-200 min-h-[460px]">
              {/* Document Header Representation */}
              <div className="text-center pb-6 border-b border-slate-100">
                <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                  Democratic Socialist Republic of Sri Lanka · Ministry of Education
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-2">{item.title}</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Grade {item.grade} · Instructional Medium: {item.medium} · Subject: {item.subject}
                </p>
              </div>

              {/* Document Body Sample */}
              <div className="mt-6 space-y-4 text-sm text-slate-700 leading-relaxed">
                {isBook ? (
                  <>
                    <h4 className="font-semibold text-slate-900 text-base">Curriculum Overview & Educational Intent</h4>
                    <p>{book?.summary}</p>
                    
                    <h4 className="font-semibold text-slate-900 text-base pt-3">Key Learning Outcomes</h4>
                    <ul className="list-disc pl-5 space-y-1.5 text-slate-600 text-xs">
                      <li>Understand core tenets with rational proofs and classical textual evidence.</li>
                      <li>Demonstrate moral discipline, truthfulness, and community empathy in daily interactions.</li>
                      <li>Acquire foundational competency in jurisprudence regulations (Taharah, Salah, Fasting).</li>
                      <li>Analyze historical milestones and prophetic leadership models for peaceful coexistence.</li>
                    </ul>

                    <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600">
                      <span className="font-semibold text-slate-800">Curriculum Note:</span> This textbook represents the officially accredited curriculum resource for Grade {book?.grade}. To protect academic pacing, standard syllabus structures allocate exactly 2 official core textbooks per grade level.
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between items-center bg-slate-100 p-3 rounded-lg text-xs font-semibold text-slate-700">
                      <span>Time Allowed: {paper?.durationMinutes} Minutes</span>
                      <span>Total Marks: {paper?.totalMarks}</span>
                    </div>

                    <h4 className="font-semibold text-slate-900 text-sm mt-4">General Instructions to Candidates:</h4>
                    <ol className="list-decimal pl-5 space-y-1 text-xs text-slate-600">
                      <li>Answer all questions in Part I (Multiple Choice & Short Structured).</li>
                      <li>In Part II, select and answer four questions from the given options.</li>
                      <li>Ensure neat handwriting and cross-reference answers with your index number.</li>
                    </ol>

                    <div className="mt-6 pt-4 border-t border-slate-200">
                      <h5 className="font-semibold text-slate-900 text-xs mb-3">PART I - Specimen Questions Preview:</h5>
                      <div className="space-y-3">
                        <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-700 border border-slate-100">
                          <p className="font-medium">1. State two primary characteristics that distinguished the character of Prophet Muhammad (PBUH) in pre-Islamic Makkah.</p>
                          <p className="text-slate-400 mt-1 italic pl-3">— Expected marking criteria: Al-Amin (Trustworthy) and As-Sadiq (Truthful).</p>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-700 border border-slate-100">
                          <p className="font-medium">2. Explain the fundamental difference between Fard and Sunnah acts during ablution (Wudu).</p>
                          <p className="text-slate-400 mt-1 italic pl-3">— Expected marking criteria: Fard acts are compulsory where omission invalidates; Sunnah acts are highly rewarding prophetic traditions.</p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )
        )}

          {activeTab === 'chapters' && book && (
            <div className="max-w-2xl mx-auto space-y-3">
              <h3 className="text-sm font-bold text-slate-900">Table of Contents & Unit Directory</h3>
              <div className="space-y-2">
                {book.chapters.map((chapter, idx) => (
                  <div key={idx} className="p-3 bg-white rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-800">{chapter}</span>
                    <span className="text-slate-400 font-mono">Unit {idx + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'info' && (
            <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl border border-slate-200 text-xs space-y-3">
              <h3 className="font-bold text-slate-900 text-sm mb-4">Official Publication Record</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-400 block">Identifier:</span>
                  <span className="font-mono text-slate-800">{item.id}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Grade Target:</span>
                  <span className="font-semibold text-slate-800">Grade {item.grade}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Instructional Medium:</span>
                  <span className="text-slate-800">{item.medium}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">File Size:</span>
                  <span className="text-slate-800 font-mono">{item.fileSize}</span>
                </div>
                {isBook && (
                  <>
                    <div>
                      <span className="text-slate-400 block">Author / Publishing Body:</span>
                      <span className="text-slate-800">{book?.author}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Edition:</span>
                      <span className="text-slate-800">{book?.edition}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Volume Part:</span>
                      <span className="text-slate-800 font-semibold">Part {book?.part} (Hard Cap: Max 2 Parts)</span>
                    </div>
                  </>
                )}
                {paper && (
                  <>
                    <div>
                      <span className="text-slate-400 block">Paper Category:</span>
                      <span className="text-slate-800 font-medium capitalize">{paper.category.replace('_', ' ')}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Examination Year:</span>
                      <span className="text-slate-800 font-mono">{paper.year}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>Mind Edge Academic Platform · Standardized National Secondary Curriculum</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
};
