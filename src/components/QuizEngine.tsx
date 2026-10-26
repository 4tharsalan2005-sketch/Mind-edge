import React, { useState, useEffect } from 'react';
import { Quiz, QuizQuestion } from '../types.ts';
import { SubjectIcon } from './svgs/EducationalIllustrations.tsx';
import { ArrowLeft, Clock, CheckCircle, XCircle, RotateCcw, Award, ChevronRight, HelpCircle } from 'lucide-react';

interface QuizEngineProps {
  quiz: Quiz;
  onExit: () => void;
}

export const QuizEngine: React.FC<QuizEngineProps> = ({ quiz, onExit }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [showExplanation, setShowExplanation] = useState<Record<number, boolean>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(quiz.timeLimitMinutes * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  // Timer countdown
  useEffect(() => {
    if (!isTimerRunning || isSubmitted) return;

    const interval = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsSubmitted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerRunning, isSubmitted]);

  const currentQ: QuizQuestion | undefined = quiz.questions[currentIndex];

  const handleSelectOption = (optionIndex: number) => {
    if (isSubmitted) return;
    setUserAnswers((prev) => ({
      ...prev,
      [currentIndex]: optionIndex
    }));
    // Reveal explanation right away in interactive practice mode
    setShowExplanation((prev) => ({
      ...prev,
      [currentIndex]: true
    }));
  };

  const calculateScore = () => {
    let correct = 0;
    quiz.questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctAnswerIndex) {
        correct++;
      }
    });
    return {
      correct,
      total: quiz.questions.length,
      percentage: Math.round((correct / quiz.questions.length) * 100)
    };
  };

  const scoreData = calculateScore();

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleReset = () => {
    setUserAnswers({});
    setShowExplanation({});
    setIsSubmitted(false);
    setCurrentIndex(0);
    setTimeLeftSeconds(quiz.timeLimitMinutes * 60);
    setIsTimerRunning(true);
  };

  const isHtmlSingleFile = quiz.format === 'html_single_file' || Boolean(quiz.htmlContent) || Boolean(quiz.fileUrl && quiz.fileUrl.endsWith('.html'));

  // If this is an uploaded single-file HTML quiz, render the specialized iframe player
  if (isHtmlSingleFile) {
    return (
      <div className="max-w-6xl mx-auto py-6 px-4 space-y-4">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <button
            onClick={onExit}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-purple-50 text-purple-800 border border-purple-200">
              Single-File HTML Quiz Module
            </span>
            {quiz.fileUrl && (
              <a
                href={quiz.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Open Full Window
              </a>
            )}
          </div>
        </div>

        {/* Title & Metadata */}
        <div className="flex items-start gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="p-3 bg-sky-50 text-sky-700 rounded-xl border border-sky-100">
            <SubjectIcon subject={quiz.subject} className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="font-semibold text-slate-800">{quiz.subject}</span>
              <span aria-hidden="true">·</span>
              <span>Grade {quiz.grade}</span>
              <span aria-hidden="true">·</span>
              <span>{quiz.medium} Medium</span>
              {quiz.fileName && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono text-slate-400">{quiz.fileName}</span>
                </>
              )}
            </div>
            <h1 className="text-xl font-bold text-slate-900 mt-1">{quiz.title}</h1>
            <p className="text-xs text-slate-600 mt-0.5">{quiz.description}</p>
          </div>
        </div>

        {/* Embedded HTML Quiz Player */}
        <div className="w-full h-[680px] bg-white rounded-2xl border-2 border-slate-200 shadow-lg overflow-hidden">
          <iframe
            src={quiz.fileUrl || undefined}
            srcDoc={quiz.htmlContent || undefined}
            title={quiz.title}
            className="w-full h-full border-0"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      {/* Top Navigation */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <button
          onClick={onExit}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Quiz</span>
        </button>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>Time Left: {formatTime(timeLeftSeconds)}</span>
          </div>
        </div>
      </div>

      {/* Quiz Title & Subject Header */}
      <div className="mt-6 flex items-start gap-4">
        <div className="p-3 bg-sky-50 text-sky-700 rounded-xl border border-sky-100">
          <SubjectIcon subject={quiz.subject} className="w-7 h-7" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Subject: {quiz.subject}</span>
            <span aria-hidden="true">·</span>
            <span>Grade {quiz.grade}</span>
            <span aria-hidden="true">·</span>
            <span>{quiz.medium} Medium</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-0.5">{quiz.title}</h1>
          <p className="text-xs text-slate-600 mt-1">{quiz.description}</p>
        </div>
      </div>

      {/* Main Content Area */}
      {!isSubmitted ? (
        <div className="mt-8 space-y-6">
          {/* Question Navigator Dots */}
          <div className="flex items-center gap-1.5 flex-wrap p-3 bg-white rounded-xl border border-slate-200">
            <span className="text-xs text-slate-400 mr-2 font-medium">Questions:</span>
            {quiz.questions.map((_, idx) => {
              const isAnswered = userAnswers[idx] !== undefined;
              const isCurrent = idx === currentIndex;
              return (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-sky-600 text-white shadow-xs scale-105'
                      : isAnswered
                      ? 'bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-300'
                      : 'bg-white text-slate-400 hover:bg-slate-50 border border-slate-200'
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          {/* Active Question Card */}
          {currentQ && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <div className="flex items-center justify-between text-xs text-slate-400 pb-3 border-b border-slate-100">
                <span className="font-semibold text-slate-700">Question {currentIndex + 1} of {quiz.questions.length}</span>
                <span>Select one best answer</span>
              </div>

              <h2 className="text-base font-semibold text-slate-900 mt-4 leading-relaxed">
                {currentQ.question}
              </h2>

              {/* Options */}
              <div className="mt-6 space-y-3">
                {currentQ.options.map((option, optIdx) => {
                  const isSelected = userAnswers[currentIndex] === optIdx;
                  const isCorrect = optIdx === currentQ.correctAnswerIndex;
                  const hasAnswered = userAnswers[currentIndex] !== undefined;

                  let optionStyle = 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50';

                  if (hasAnswered) {
                    if (isCorrect) {
                      optionStyle = 'bg-emerald-50 border-emerald-300 text-emerald-900 font-medium';
                    } else if (isSelected && !isCorrect) {
                      optionStyle = 'bg-rose-50 border-rose-300 text-rose-900 line-through opacity-80';
                    } else {
                      optionStyle = 'bg-slate-50 border-slate-200 text-slate-400';
                    }
                  } else if (isSelected) {
                    optionStyle = 'bg-sky-50 border-sky-500 text-sky-900 font-medium';
                  }

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(optIdx)}
                      className={`w-full text-left p-4 rounded-xl border text-sm transition-all flex items-center justify-between cursor-pointer ${optionStyle}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-600 text-xs font-bold flex items-center justify-center shrink-0">
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span>{option}</span>
                      </div>

                      {hasAnswered && isCorrect && (
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                      {hasAnswered && isSelected && !isCorrect && (
                        <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation Drawer */}
              {showExplanation[currentIndex] && (
                <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs animate-in fade-in duration-200">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800 mb-1">
                    <HelpCircle className="w-3.5 h-3.5 text-sky-600" />
                    <span>Curriculum Rationale & Explanation:</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">{currentQ.explanation}</p>
                </div>
              )}

              {/* Next/Prev Navigation */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  disabled={currentIndex === 0}
                  onClick={() => setCurrentIndex((prev) => prev - 1)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  Previous
                </button>

                {currentIndex < quiz.questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentIndex((prev) => prev + 1)}
                    className="flex items-center gap-1 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                  >
                    <span>Next Question</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={() => setIsSubmitted(true)}
                    className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors cursor-pointer"
                  >
                    Complete Quiz
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Results & Diagnostics Report */
        <div className="mt-8 space-y-6">
          <div className="bg-white rounded-3xl border-2 border-slate-200 p-8 text-center shadow-lg relative overflow-hidden">
            {/* Background ambient glow based on score */}
            <div className={`absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none ${
              scoreData.percentage >= 80 ? 'bg-emerald-400' : scoreData.percentage >= 60 ? 'bg-sky-400' : 'bg-amber-400'
            }`} />

            <div className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center mb-4 shadow-md ${
              scoreData.percentage >= 80
                ? 'bg-gradient-to-tr from-emerald-500 to-teal-400 text-white shadow-emerald-500/25'
                : scoreData.percentage >= 60
                ? 'bg-gradient-to-tr from-sky-500 to-indigo-500 text-white shadow-sky-500/25'
                : 'bg-gradient-to-tr from-amber-500 to-orange-400 text-white shadow-amber-500/25'
            }`}>
              <Award className="w-10 h-10" />
            </div>

            <div className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 bg-slate-100 text-slate-700">
              {scoreData.percentage >= 80
                ? '🏆 Mastery Unlocked'
                : scoreData.percentage >= 60
                ? '🌟 Strong Performance'
                : '⚡ Practice Booster'}
            </div>

            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {scoreData.percentage >= 80
                ? 'Outstanding Achievement!'
                : scoreData.percentage >= 60
                ? 'Great Work, Keep Pushing!'
                : 'Good Effort, Review & Level Up!'}
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              You tested your knowledge on {quiz.title}. Review the full curriculum commentary below to solidify concepts.
            </p>

            <div className="mt-6 flex justify-center items-baseline gap-2 font-mono">
              <span className={`text-5xl font-black ${
                scoreData.percentage >= 80 ? 'text-emerald-600' : scoreData.percentage >= 60 ? 'text-sky-600' : 'text-amber-600'
              }`}>
                {scoreData.percentage}%
              </span>
              <span className="text-sm font-semibold text-slate-500">
                ({scoreData.correct} of {scoreData.total} questions correct)
              </span>
            </div>

            <div className="mt-8 flex items-center justify-center gap-3">
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer shadow-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry Quiz</span>
              </button>
              <button
                onClick={onExit}
                className="px-5 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all cursor-pointer shadow-md"
              >
                Back to Dashboard
              </button>
            </div>
          </div>

          {/* Full Question Review */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Detailed Answer Review</h3>
            {quiz.questions.map((q, idx) => {
              const userAns = userAnswers[idx];
              const isCorrect = userAns === q.correctAnswerIndex;

              return (
                <div key={idx} className="bg-white rounded-xl border border-slate-200 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="text-xs text-slate-400 font-semibold block">Question {idx + 1}</span>
                      <p className="text-sm font-semibold text-slate-900 mt-1">{q.question}</p>
                    </div>
                    <div className="shrink-0">
                      {isCorrect ? (
                        <div className="flex items-center gap-1 text-emerald-600 text-xs font-semibold">
                          <CheckCircle className="w-4 h-4" />
                          <span>Correct</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-rose-600 text-xs font-semibold">
                          <XCircle className="w-4 h-4" />
                          <span>Incorrect</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 space-y-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-900 font-medium border border-emerald-100">
                      <span className="font-bold">Correct Answer:</span> {q.options[q.correctAnswerIndex]}
                    </div>
                    {userAns !== undefined && !isCorrect && (
                      <div className="p-2.5 rounded-lg bg-rose-50 text-rose-900 border border-rose-100">
                        <span className="font-bold">Your Selection:</span> {q.options[userAns]}
                      </div>
                    )}
                  </div>

                  <div className="mt-3 text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <span className="font-semibold text-slate-700">Explanation:</span> {q.explanation}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
