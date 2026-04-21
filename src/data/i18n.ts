export type Lang = "zh" | "en" | "ja";

export const LANG_NAMES: Record<Lang, string> = {
  zh: "中文",
  en: "English",
  ja: "日本語",
};

type Strings = {
  siteTitle: string;
  welcomeSubtitle: string;
  welcomeDescription: string;
  startButton: string;
  languageLabel: string;
  featureBank: string;
  featureRandom: string;
  featureDims: string;
  starRepo: string;
  progressLabel: (answered: number, total: number) => string;
  matchLabel: string;
  submitButton: string;
  prevQuestion: string;
  nextQuestion: string;
  questionBadge: (current: number, total: number) => string;
  loadingTexts: string[];
  loadingSubtitle: string;
  reportBadge: string;
  reportTitle: string;
  matchDegree: string;
  conclusion: string;
  bonusBadge: string;
  bonusTitle: string;
  bonusConclusion: string;
  timeSpent: string;
  completedQuestions: string;
  viewInferences: (count: number) => string;
  inferenceTemplate: (stem: string, choice: string) => string;
  shareButton: string;
  shareText: (match: string) => string;
  shareTextBonus: (match: string) => string;
  shareCopied: string;
  restartButton: string;
  disclaimer: string;
  formatTime: (seconds: number) => string;
};

export const UI: Record<Lang, Strings> = {
  zh: {
    siteTitle: "最新最热 MBTI 性格测试",
    welcomeSubtitle: "探索你的真实人格类型",
    welcomeDescription: "100 道精选题目 · 约 5-10 分钟",
    startButton: "开始测试",
    languageLabel: "语言",
    featureBank: "100 题库",
    featureRandom: "随机抽取",
    featureDims: "4 维分析",
    starRepo: "喜欢的话给个 Star 吧",
    progressLabel: (a, t) => `答题进度 ${a}/${t}`,
    matchLabel: "人格匹配度",
    submitButton: "查看测试结果 →",
    prevQuestion: "上一题",
    nextQuestion: "下一题",
    questionBadge: (c, t) => `第 ${c} / ${t} 题`,
    loadingTexts: [
      "正在分析你的选择...",
      "解读人格维度中...",
      "匹配性格模型...",
      "生成专属报告...",
      "即将揭晓结果！",
    ],
    loadingSubtitle: "请稍候，AI 正在深度分析中",
    reportBadge: "测试报告",
    reportTitle: "测试结果",
    matchDegree: "人格匹配度",
    conclusion: "你是一个很爱做题的人。",
    bonusBadge: "隐藏成就解锁！",
    bonusTitle: "满分成就",
    bonusConclusion: "你是一个特别喜欢做题的人。",
    timeSpent: "消耗时间",
    completedQuestions: "完成题目",
    viewInferences: (n) => `查看详细推论 (${n}条)`,
    inferenceTemplate: (stem, choice) => `你是一个在「${stem}」的时候会「${choice}」的人`,
    shareButton: "分享给好友",
    shareText: (m) => `我刚完成了 MBTI 性格测试，人格匹配度 ${m}%！来测测你的吧 👉`,
    shareTextBonus: (m) => `我完成了全部100道 MBTI 性格测试！人格匹配度 ${m}%！来试试你能做完吗 👉`,
    shareCopied: "链接已复制到剪贴板！",
    restartButton: "再测一次",
    disclaimer: "本测试仅供娱乐，结果不代表专业心理评估",
    formatTime: (s) => {
      const m = Math.floor(s / 60);
      const sec = s % 60;
      return m > 0 ? `${m}分${sec}秒` : `${sec}秒`;
    },
  },
  en: {
    siteTitle: "Trendy MBTI Test",
    welcomeSubtitle: "Discover your real personality type",
    welcomeDescription: "100 curated questions · ~5-10 min",
    startButton: "Start Test",
    languageLabel: "Language",
    featureBank: "100 questions",
    featureRandom: "Randomized",
    featureDims: "4 dimensions",
    starRepo: "Star the repo if you like it",
    progressLabel: (a, t) => `Progress ${a}/${t}`,
    matchLabel: "Personality match",
    submitButton: "See Results →",
    prevQuestion: "Prev",
    nextQuestion: "Next",
    questionBadge: (c, t) => `Question ${c} / ${t}`,
    loadingTexts: [
      "Analyzing your choices...",
      "Decoding personality dimensions...",
      "Matching personality models...",
      "Generating your report...",
      "Results incoming!",
    ],
    loadingSubtitle: "Hang tight, AI is doing deep analysis",
    reportBadge: "Report",
    reportTitle: "Your Result",
    matchDegree: "Personality match",
    conclusion: "You are someone who really loves taking tests.",
    bonusBadge: "Hidden achievement unlocked!",
    bonusTitle: "Perfect Completion",
    bonusConclusion: "You are someone who absolutely lives for taking tests.",
    timeSpent: "Time spent",
    completedQuestions: "Completed",
    viewInferences: (n) => `View detailed inferences (${n})`,
    inferenceTemplate: (stem, choice) => `When it comes to "${stem}", you are someone who would "${choice}"`,
    shareButton: "Share with friends",
    shareText: (m) => `Just finished the MBTI test — ${m}% personality match! Try it yourself 👉`,
    shareTextBonus: (m) => `I completed all 100 MBTI questions — ${m}% match! Bet you can't finish it 👉`,
    shareCopied: "Link copied to clipboard!",
    restartButton: "Retake Test",
    disclaimer: "For entertainment only. Not a professional assessment.",
    formatTime: (s) => {
      const m = Math.floor(s / 60);
      const sec = s % 60;
      return m > 0 ? `${m}m ${sec}s` : `${sec}s`;
    },
  },
  ja: {
    siteTitle: "最新MBTI性格診断",
    welcomeSubtitle: "本当のあなたを見つけよう",
    welcomeDescription: "厳選100問 · 約5-10分",
    startButton: "テスト開始",
    languageLabel: "言語",
    featureBank: "100問",
    featureRandom: "ランダム出題",
    featureDims: "4軸分析",
    starRepo: "気に入ったらStarお願いします",
    progressLabel: (a, t) => `進捗 ${a}/${t}`,
    matchLabel: "人格マッチ度",
    submitButton: "結果を見る →",
    prevQuestion: "前の問題",
    nextQuestion: "次の問題",
    questionBadge: (c, t) => `第 ${c} / ${t} 問`,
    loadingTexts: [
      "あなたの選択を分析中...",
      "人格軸を解読中...",
      "性格モデルをマッチング...",
      "専用レポートを生成中...",
      "もうすぐ結果が出ます！",
    ],
    loadingSubtitle: "AIが深層分析中、少々お待ちを",
    reportBadge: "診断レポート",
    reportTitle: "診断結果",
    matchDegree: "人格マッチ度",
    conclusion: "あなたはテストが大好きな人です。",
    bonusBadge: "隠し実績解除！",
    bonusTitle: "完全制覇",
    bonusConclusion: "あなたはテストに生きる人です。",
    timeSpent: "所要時間",
    completedQuestions: "完了問題数",
    viewInferences: (n) => `詳細な推論を見る (${n}件)`,
    inferenceTemplate: (stem, choice) => `あなたは「${stem}」の時に「${choice}」する人です`,
    shareButton: "友達にシェア",
    shareText: (m) => `MBTI診断やった、人格マッチ度${m}%！あなたもやってみて 👉`,
    shareTextBonus: (m) => `MBTI診断100問全制覇！人格マッチ度${m}%！最後までやれる？ 👉`,
    shareCopied: "リンクをクリップボードにコピーしました！",
    restartButton: "もう一度",
    disclaimer: "本診断はエンターテイメント目的、専門的評価ではありません",
    formatTime: (s) => {
      const m = Math.floor(s / 60);
      const sec = s % 60;
      return m > 0 ? `${m}分${sec}秒` : `${sec}秒`;
    },
  },
};
