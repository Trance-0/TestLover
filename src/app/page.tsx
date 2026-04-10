"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import allQuestions from "@/data/questions.json";

type Question = {
  id: number;
  text: string;
  options: { label: string; text: string; dimension: string }[];
};

type Phase = "welcome" | "testing" | "loading" | "result" | "bonus-loading" | "bonus";

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function ProgressBar({
  progress,
  label,
  color = "primary",
}: {
  progress: number;
  label: string;
  color?: string;
}) {
  const bgClass =
    color === "green"
      ? "bg-emerald-500"
      : color === "amber"
        ? "bg-amber-500"
        : "";

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs font-medium text-gray-600">{label}</span>
        <span className="text-xs font-bold text-[var(--primary)]">
          {Math.round(progress)}%
        </span>
      </div>
      <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${bgClass || "progress-shimmer"}`}
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
    </div>
  );
}

function LoadingAnimation({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);
  const [progressValue, setProgressValue] = useState(0);

  const loadingTexts = useMemo(
    () => [
      "正在分析你的选择...",
      "解读人格维度中...",
      "匹配性格模型...",
      "生成专属报告...",
      "即将揭晓结果！",
    ],
    []
  );

  useEffect(() => {
    const totalDuration = 5000;
    const interval = 50;
    let elapsed = 0;
    const timer = setInterval(() => {
      elapsed += interval;
      const p = Math.min((elapsed / totalDuration) * 100, 100);
      setProgressValue(p);
      setStep(Math.min(Math.floor((elapsed / totalDuration) * 5), 4));
      if (elapsed >= totalDuration) {
        clearInterval(timer);
        setTimeout(onComplete, 300);
      }
    }, interval);
    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#7c3aed] via-[#6d28d9] to-[#4c1d95] flex flex-col items-center justify-center z-50 px-6">
      {/* Decorative circles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/5"
            style={{
              width: `${80 + i * 40}px`,
              height: `${80 + i * 40}px`,
              left: `${10 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
              animation: `float ${2 + i * 0.5}s ease-in-out infinite ${i * 0.3}s`,
            }}
          />
        ))}
      </div>

      {/* Brain icon */}
      <div className="relative mb-8">
        <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center">
          <div className="absolute w-32 h-32 rounded-full border-2 border-white/20 animate-pulse-ring" />
          <svg
            className="w-12 h-12 text-white animate-float"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
        </div>
      </div>

      {/* Loading text */}
      <p
        key={step}
        className="text-white text-xl font-bold mb-2 animate-fade-in-up"
      >
        {loadingTexts[step]}
      </p>
      <p className="text-white/60 text-sm mb-8">请稍候，AI 正在深度分析中</p>

      {/* Progress bar */}
      <div className="w-full max-w-xs">
        <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all duration-100 ease-linear"
            style={{ width: `${progressValue}%` }}
          />
        </div>
        <p className="text-white/80 text-center mt-3 text-sm font-mono">
          {Math.round(progressValue)}%
        </p>
      </div>

      {/* Spinning decoration */}
      <div className="absolute bottom-20">
        <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin-slow" />
      </div>
    </div>
  );
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m > 0) return `${m}分${s}秒`;
  return `${s}秒`;
}

function ResultPage({
  matchDegree,
  onRestart,
  answers,
  questions,
  elapsedSeconds,
}: {
  matchDegree: number;
  onRestart: () => void;
  answers: Record<number, string>;
  questions: Question[];
  elapsedSeconds: number;
}) {
  const [showContent, setShowContent] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const answeredCount = Object.keys(answers).length;

  // Build inference list from answered questions
  const inferences = questions
    .filter((q) => answers[q.id])
    .map((q) => {
      const chosen = q.options.find((o) => o.dimension === answers[q.id]);
      // Strip trailing punctuation from question stem for natural reading
      const stem = q.text.replace(/[：？，。、]+$/g, "").replace(/^你/g, "");
      return `你是一个在「${stem}」的时候会「${chosen?.text}」的人`;
    });

  const handleShare = () => {
    const text = `我刚完成了 MBTI 性格测试，人格匹配度 ${matchDegree.toFixed(1)}%！来测测你的吧 👉`;
    const url = `https://test.trance-0.com`;
    if (navigator.share) {
      navigator.share({ title: "MBTI 性格测试", text, url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${text} ${url}`).then(() => {
        alert("链接已复制到剪贴板！");
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f0ff] to-[#ede9fe] flex flex-col items-center px-5 py-10">
      {showContent && (
        <>
          {/* Header badge */}
          <div
            className="animate-fade-in-up mb-6"
            style={{ animationDelay: "0s" }}
          >
            <div className="bg-[var(--primary)] text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
              测试报告
            </div>
          </div>

          {/* Main result card */}
          <div
            className="animate-fade-in-up w-full max-w-sm bg-white rounded-3xl shadow-xl p-8 mb-6"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">🧠</div>
              <h2 className="text-2xl font-black text-[var(--primary)] mb-2">
                测试结果
              </h2>
              <div className="w-16 h-1 bg-[var(--primary)] mx-auto rounded-full" />
            </div>

            {/* Match degree display */}
            <div className="bg-[#f5f0ff] rounded-2xl p-5 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">人格匹配度</span>
                <span className="text-lg font-black text-[var(--primary)]">
                  {matchDegree.toFixed(1)}%
                </span>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] rounded-full transition-all duration-1000"
                  style={{ width: `${matchDegree}%` }}
                />
              </div>
            </div>

            {/* Report text */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-100">
              <p className="text-lg font-bold text-center text-gray-800 leading-relaxed">
                「 你是一个很爱做题的人。 」
              </p>
            </div>
          </div>

          {/* Stats: elapsed time + completed questions */}
          <div
            className="animate-fade-in-up w-full max-w-sm grid grid-cols-2 gap-3 mb-4"
            style={{ animationDelay: "0.4s" }}
          >
            <div className="bg-white rounded-2xl p-4 text-center shadow-md">
              <div className="text-2xl mb-1">⏱️</div>
              <div className="text-xs text-gray-500">消耗时间</div>
              <div className="text-lg font-black text-[var(--primary)]">
                {formatTime(elapsedSeconds)}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-4 text-center shadow-md">
              <div className="text-2xl mb-1">📝</div>
              <div className="text-xs text-gray-500">完成题目</div>
              <div className="text-lg font-black text-[var(--primary)]">
                {answeredCount}
              </div>
            </div>
          </div>

          {/* Detail dropdown */}
          <div
            className="animate-fade-in-up w-full max-w-sm mb-8"
            style={{ animationDelay: "0.5s" }}
          >
            <button
              onClick={() => setDetailOpen(!detailOpen)}
              className="w-full bg-white rounded-2xl p-4 shadow-md flex items-center justify-between text-sm font-medium text-gray-700 active:scale-[0.98] transition-transform"
            >
              <span>查看详细推论 ({inferences.length}条)</span>
              <svg
                className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${detailOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {detailOpen && (
              <div className="mt-2 bg-white rounded-2xl shadow-md p-4 max-h-80 overflow-y-auto space-y-2">
                {inferences.map((text, i) => (
                  <div
                    key={i}
                    className="text-sm text-gray-600 leading-relaxed py-2 border-b border-gray-100 last:border-0"
                  >
                    {text}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Share button */}
          <button
            onClick={handleShare}
            className="animate-fade-in-up w-full max-w-sm bg-white border-2 border-[var(--primary)] text-[var(--primary)] py-4 rounded-2xl font-bold text-lg shadow-md active:scale-95 transition-transform mb-3"
            style={{ animationDelay: "0.6s" }}
          >
            分享给好友
          </button>

          {/* Restart button */}
          <button
            onClick={onRestart}
            className="animate-fade-in-up w-full max-w-sm bg-[var(--primary)] text-white py-4 rounded-2xl font-bold text-lg shadow-lg active:scale-95 transition-transform"
            style={{ animationDelay: "0.7s" }}
          >
            再测一次
          </button>

          <p
            className="animate-fade-in-up text-xs text-gray-400 mt-4 text-center"
            style={{ animationDelay: "0.8s" }}
          >
            本测试仅供娱乐，结果不代表专业心理评估
          </p>
        </>
      )}
    </div>
  );
}

function Confetti() {
  const pieces = useMemo(() => {
    const colors = ["#7c3aed", "#a78bfa", "#f59e0b", "#10b981", "#ef4444", "#3b82f6", "#ec4899"];
    return Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 2,
      duration: 2 + Math.random() * 3,
      size: 6 + Math.random() * 8,
      shape: Math.random() > 0.5 ? "circle" : "rect",
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="confetti"
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: p.shape === "rect" ? `${p.size * 1.5}px` : `${p.size}px`,
            backgroundColor: p.color,
            borderRadius: p.shape === "circle" ? "50%" : "2px",
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

function BonusResultPage({
  matchDegree,
  onRestart,
  answers,
  questions,
  elapsedSeconds,
}: {
  matchDegree: number;
  onRestart: () => void;
  answers: Record<number, string>;
  questions: Question[];
  elapsedSeconds: number;
}) {
  const [showContent, setShowContent] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const answeredCount = Object.keys(answers).length;

  const inferences = questions
    .filter((q) => answers[q.id])
    .map((q) => {
      const chosen = q.options.find((o) => o.dimension === answers[q.id]);
      const stem = q.text.replace(/[：？，。、]+$/g, "").replace(/^你/g, "");
      return `你是一个在「${stem}」的时候会「${chosen?.text}」的人`;
    });

  const handleShare = () => {
    const text = `我完成了全部100道 MBTI 性格测试！人格匹配度 ${matchDegree.toFixed(1)}%！来试试你能做完吗 👉`;
    const url = `https://test.trance-0.com`;
    if (navigator.share) {
      navigator.share({ title: "MBTI 性格测试", text, url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${text} ${url}`).then(() => {
        alert("链接已复制到剪贴板！");
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f0ff] to-[#ede9fe] flex flex-col items-center px-5 py-10">
      <Confetti />
      {showContent && (
        <>
          {/* Header badge */}
          <div
            className="animate-fade-in-up mb-6"
            style={{ animationDelay: "0s" }}
          >
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
              隐藏成就解锁！
            </div>
          </div>

          {/* Main result card */}
          <div
            className="animate-fade-in-up w-full max-w-sm bg-white rounded-3xl shadow-xl p-8 mb-6"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">🏆</div>
              <h2 className="text-2xl font-black text-[var(--primary)] mb-2">
                满分成就
              </h2>
              <div className="w-16 h-1 bg-gradient-to-r from-amber-500 to-orange-500 mx-auto rounded-full" />
            </div>

            {/* Match degree display */}
            <div className="bg-[#f5f0ff] rounded-2xl p-5 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">人格匹配度</span>
                <span className="text-lg font-black text-[var(--primary)]">
                  {matchDegree.toFixed(1)}%
                </span>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] rounded-full transition-all duration-1000"
                  style={{ width: `${matchDegree}%` }}
                />
              </div>
            </div>

            {/* Report text */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-200">
              <p className="text-lg font-bold text-center text-gray-800 leading-relaxed">
                「 你是一个特别喜欢做题的人。 」
              </p>
            </div>
          </div>

          {/* Stats */}
          <div
            className="animate-fade-in-up w-full max-w-sm grid grid-cols-2 gap-3 mb-4"
            style={{ animationDelay: "0.4s" }}
          >
            <div className="bg-white rounded-2xl p-4 text-center shadow-md">
              <div className="text-2xl mb-1">⏱️</div>
              <div className="text-xs text-gray-500">消耗时间</div>
              <div className="text-lg font-black text-[var(--primary)]">
                {formatTime(elapsedSeconds)}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-4 text-center shadow-md">
              <div className="text-2xl mb-1">📝</div>
              <div className="text-xs text-gray-500">完成题目</div>
              <div className="text-lg font-black text-[var(--primary)]">
                {answeredCount}
              </div>
            </div>
          </div>

          {/* Detail dropdown */}
          <div
            className="animate-fade-in-up w-full max-w-sm mb-8"
            style={{ animationDelay: "0.5s" }}
          >
            <button
              onClick={() => setDetailOpen(!detailOpen)}
              className="w-full bg-white rounded-2xl p-4 shadow-md flex items-center justify-between text-sm font-medium text-gray-700 active:scale-[0.98] transition-transform"
            >
              <span>查看详细推论 ({inferences.length}条)</span>
              <svg
                className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${detailOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {detailOpen && (
              <div className="mt-2 bg-white rounded-2xl shadow-md p-4 max-h-80 overflow-y-auto space-y-2">
                {inferences.map((text, i) => (
                  <div
                    key={i}
                    className="text-sm text-gray-600 leading-relaxed py-2 border-b border-gray-100 last:border-0"
                  >
                    {text}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Share button */}
          <button
            onClick={handleShare}
            className="animate-fade-in-up w-full max-w-sm bg-white border-2 border-[var(--primary)] text-[var(--primary)] py-4 rounded-2xl font-bold text-lg shadow-md active:scale-95 transition-transform mb-3"
            style={{ animationDelay: "0.6s" }}
          >
            分享给好友
          </button>

          {/* Restart button */}
          <button
            onClick={onRestart}
            className="animate-fade-in-up w-full max-w-sm bg-[var(--primary)] text-white py-4 rounded-2xl font-bold text-lg shadow-lg active:scale-95 transition-transform"
            style={{ animationDelay: "0.7s" }}
          >
            再测一次
          </button>

          <p
            className="animate-fade-in-up text-xs text-gray-400 mt-4 text-center"
            style={{ animationDelay: "0.8s" }}
          >
            本测试仅供娱乐，结果不代表专业心理评估
          </p>
        </>
      )}
    </div>
  );
}

export default function Home() {
  const [phase, setPhase] = useState<Phase>("welcome");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [matchDegree, setMatchDegree] = useState(42);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [questionKey, setQuestionKey] = useState(0);
  const [startTime, setStartTime] = useState(0);

  const questions: Question[] = useMemo(
    () => shuffleArray(allQuestions as Question[]),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [questionKey]
  );

  const totalQuestions = 100;
  const unlockThreshold = 30;
  const answeredCount = Object.keys(answers).length;
  const canSubmit = answeredCount >= unlockThreshold;

  // Phase 1: progress out of 30; Phase 2: progress out of 100
  const displayTotal = canSubmit ? totalQuestions : unlockThreshold;
  const displayAnswered = canSubmit ? answeredCount : Math.min(answeredCount, unlockThreshold);
  const progress = (displayAnswered / displayTotal) * 100;
  const visibleQuestionCount = canSubmit ? totalQuestions : unlockThreshold;

  const handleStart = () => {
    setStartTime(Date.now());
    setPhase("testing");
  };

  const handleAnswer = useCallback(
    (questionId: number, dimension: string) => {
      const isNewAnswer = !answers[questionId];
      const newAnsweredCount = isNewAnswer ? answeredCount + 1 : answeredCount;

      setAnswers((prev) => ({ ...prev, [questionId]: dimension }));

      // Update match degree randomly
      const delta = (Math.random() - 0.45) * 8;
      setMatchDegree((prev) => {
        let next = prev + delta;
        if (next >= 97) next = 92 + Math.random() * 4;
        if (next < 15) next = 15 + Math.random() * 5;
        return next;
      });

      // All 100 answered — auto jump to bonus
      if (newAnsweredCount >= totalQuestions) {
        setTimeout(() => setPhase("bonus-loading"), 400);
        return;
      }

      // Move to next question after a short delay
      const unlocked = newAnsweredCount >= unlockThreshold;
      const maxIndex = unlocked ? totalQuestions - 1 : unlockThreshold - 1;
      setIsTransitioning(true);
      setTimeout(() => {
        if (currentIndex < maxIndex) {
          setCurrentIndex((prev) => prev + 1);
        }
        setIsTransitioning(false);
      }, 300);
    },
    [answers, currentIndex, answeredCount]
  );

  const handleSubmit = () => {
    setPhase("loading");
  };

  const [endTime, setEndTime] = useState(0);

  const handleLoadingComplete = useCallback(() => {
    setEndTime(Date.now());
    setPhase("result");
  }, []);

  const handleRestart = () => {
    setPhase("welcome");
    setCurrentIndex(0);
    setAnswers({});
    setMatchDegree(42);
    setQuestionKey((k) => k + 1);
  };

  // Welcome page
  if (phase === "welcome") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-gradient-to-br from-[#f5f0ff] via-[#ede9fe] to-[#ddd6fe]">
        <div className="animate-fade-in-up text-center">
          <div className="text-7xl mb-6">🔮</div>
          <h1 className="text-3xl font-black text-[var(--primary)] mb-3">
            最新最热 MBTI 性格测试
          </h1>
          <p className="text-gray-500 mb-2 text-sm">探索你的真实人格类型</p>
          <p className="text-gray-400 text-xs mb-10">
            30 道精选题目 · 约 5 分钟
          </p>

          <button
            onClick={handleStart}
            className="w-full max-w-xs bg-[var(--primary)] text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-purple-200 active:scale-95 transition-transform"
          >
            开始测试
          </button>

          <div className="mt-8 flex items-center gap-4 text-xs text-gray-400">
            <div className="flex items-center gap-1">
              <span>📋</span>
              <span>100 题库</span>
            </div>
            <div className="w-1 h-1 bg-gray-300 rounded-full" />
            <div className="flex items-center gap-1">
              <span>🎯</span>
              <span>随机抽取</span>
            </div>
            <div className="w-1 h-1 bg-gray-300 rounded-full" />
            <div className="flex items-center gap-1">
              <span>🧬</span>
              <span>4 维分析</span>
            </div>
          </div>

          <a
            href="https://github.com/Trance-0/TestLover"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 flex items-center gap-1.5 text-xs text-gray-400 hover:text-[var(--primary)] transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <span>喜欢的话给个 Star 吧</span>
          </a>
        </div>
      </div>
    );
  }

  // Loading animation
  if (phase === "loading") {
    return <LoadingAnimation onComplete={handleLoadingComplete} />;
  }

  // Bonus loading (100 questions done)
  if (phase === "bonus-loading") {
    return (
      <LoadingAnimation
        onComplete={() => {
          setEndTime(Date.now());
          setPhase("bonus");
        }}
      />
    );
  }

  // Result page
  if (phase === "result") {
    return (
      <ResultPage
        matchDegree={matchDegree}
        onRestart={handleRestart}
        answers={answers}
        questions={questions}
        elapsedSeconds={Math.round((endTime - startTime) / 1000)}
      />
    );
  }

  // Bonus result page (all 100 done)
  if (phase === "bonus") {
    return (
      <BonusResultPage
        matchDegree={matchDegree}
        onRestart={handleRestart}
        answers={answers}
        questions={questions}
        elapsedSeconds={Math.round((endTime - startTime) / 1000)}
      />
    );
  }

  // Testing page
  const currentQuestion = questions[currentIndex];

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f0ff]">
      {/* Sticky top bar */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md shadow-sm px-5 pt-4 pb-3 space-y-3">
        {/* Main progress */}
        <ProgressBar
          progress={progress}
          label={`答题进度 ${displayAnswered}/${displayTotal}`}
        />

        {/* Match degree bar + submit button - appears after 30 questions */}
        {canSubmit && (
          <div className="animate-slide-up">
            <ProgressBar
              progress={matchDegree}
              label="人格匹配度"
              color="green"
            />
            <button
              onClick={handleSubmit}
              className="w-full mt-3 bg-[var(--primary)] text-white py-3 rounded-xl font-bold text-base shadow-lg shadow-purple-200 active:scale-95 transition-transform"
            >
              查看测试结果 →
            </button>
          </div>
        )}
      </div>

      {/* Question card area */}
      <div className="flex-1 flex flex-col items-center px-5 pt-6 pb-10">
        {/* Prev + Question number + Next */}
        <div className="w-full max-w-sm flex items-center justify-between mb-4">
          <button
            onClick={() => {
              if (currentIndex > 0 && !isTransitioning) {
                setIsTransitioning(true);
                setTimeout(() => {
                  setCurrentIndex((prev) => prev - 1);
                  setIsTransitioning(false);
                }, 150);
              }
            }}
            disabled={currentIndex === 0 || isTransitioning}
            className="flex items-center gap-1 text-sm font-medium text-gray-600 disabled:text-gray-300 active:scale-95 transition-transform"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>上一题</span>
          </button>
          <span className="bg-[var(--primary)]/10 text-[var(--primary)] text-xs font-bold px-3 py-1 rounded-full">
            第 {currentIndex + 1} / {displayTotal} 题
          </span>
          <button
            onClick={() => {
              const maxIdx = (canSubmit ? totalQuestions : unlockThreshold) - 1;
              if (currentIndex < maxIdx && !isTransitioning) {
                setIsTransitioning(true);
                setTimeout(() => {
                  setCurrentIndex((prev) => prev + 1);
                  setIsTransitioning(false);
                }, 150);
              }
            }}
            disabled={
              currentIndex >=
                (canSubmit ? totalQuestions : unlockThreshold) - 1 ||
              isTransitioning
            }
            className="flex items-center gap-1 text-sm font-medium text-gray-600 disabled:text-gray-300 active:scale-95 transition-transform"
          >
            <span>下一题</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Question card */}
        <div
          key={currentQuestion.id}
          className={`w-full max-w-sm bg-white rounded-3xl shadow-lg p-6 transition-opacity duration-300 ${
            isTransitioning ? "opacity-0" : "opacity-100 animate-slide-up"
          }`}
        >
          <h2 className="text-lg font-bold text-gray-800 mb-6 leading-relaxed">
            {currentQuestion.text}
          </h2>

          <div className="space-y-3">
            {currentQuestion.options.map((option) => {
              const isSelected =
                answers[currentQuestion.id] === option.dimension;
              return (
                <button
                  key={option.label}
                  onClick={() =>
                    handleAnswer(currentQuestion.id, option.dimension)
                  }
                  className={`option-btn w-full text-left p-4 rounded-2xl border-2 transition-all ${
                    isSelected
                      ? "border-[var(--primary)] bg-[#f5f0ff] text-[var(--primary)]"
                      : "border-gray-200 bg-white text-gray-700 hover:border-[var(--primary-light)] hover:bg-[#faf8ff]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                        isSelected
                          ? "bg-[var(--primary)] text-white"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {option.label}
                    </span>
                    <span className="text-sm font-medium">{option.text}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation dots */}
        <div className="flex gap-1.5 mt-6 flex-wrap justify-center max-w-xs">
          {questions.slice(0, visibleQuestionCount).map((q, idx) => (
            <button
              key={q.id}
              onClick={() => {
                if (!isTransitioning) {
                  setIsTransitioning(true);
                  setTimeout(() => {
                    setCurrentIndex(idx);
                    setIsTransitioning(false);
                  }, 150);
                }
              }}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                idx === currentIndex
                  ? "bg-[var(--primary)] scale-125"
                  : answers[questions[idx].id]
                    ? "bg-[var(--primary-light)]"
                    : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
