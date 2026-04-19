// Mock AI recommendation profile. Keyed by stream so the What-If simulator
// can swap the entire recommendation instantly.

export const STREAMS = ['Science', 'Commerce', 'Arts']

export const PROFILE = {
  Science: {
    confidence: 92,
    role: 'Data Scientist',
    tagline: 'Analytical thinker with a natural edge in STEM.',
    why: 'Your aptitude scores in logic and mathematics sit in the top 10%, and your interest heatmap leans strongly toward problem-solving, coding, and data. That combination maps almost directly to careers like Data Scientist and ML Engineer.',
    metrics: [
      { label: 'Academic Score', value: 86, tint: 'from-indigo-500 to-purple-500' },
      { label: 'Interest Match', value: 91, tint: 'from-fuchsia-500 to-pink-500' },
      { label: 'Aptitude Score', value: 94, tint: 'from-emerald-500 to-teal-500' },
      { label: 'Strengths Impact', value: 78, tint: 'from-amber-500 to-orange-500' },
    ],
    roadmap: [
      { title: 'Choose Science (PCM / PCB)', desc: 'Class 11–12 — lock in math + physics + CS basics.' },
      { title: 'Build coding + math fundamentals', desc: 'Python, DSA, linear algebra, probability.' },
      { title: 'Bachelor’s degree', desc: 'B.Tech CS / B.Sc. Data Science / Stats (3–4 yrs).' },
      { title: 'Internships & portfolio', desc: 'Kaggle, open-source, 2–3 real projects.' },
      { title: 'First role', desc: 'Junior Data Scientist / ML Engineer.' },
    ],
    skillsMissing: [
      'Data Structures',
      'Statistics',
      'Python (advanced)',
      'SQL',
      'Machine Learning',
      'Communication',
    ],
    weakAreas: [
      {
        subject: 'Chain rule (Calculus)',
        tip: 'Refresh with Calculus Essentials → Lesson 4 (8 min).',
      },
      {
        subject: 'Writing & Explanation',
        tip: 'Try the daily “Explain it in 3 sentences” exercise in AI Tutor.',
      },
      {
        subject: 'SQL joins',
        tip: 'Do 10 reps of the joins drill on the SQL Starter track.',
      },
    ],
  },

  Commerce: {
    confidence: 78,
    role: 'Financial Analyst',
    tagline: 'Sharp with numbers, comfortable with markets.',
    why: 'Your numeric aptitude is strong and your interest signals point toward economics and business. Finance careers reward exactly that mix — quantitative rigor plus real-world context.',
    metrics: [
      { label: 'Academic Score', value: 80, tint: 'from-indigo-500 to-purple-500' },
      { label: 'Interest Match', value: 74, tint: 'from-fuchsia-500 to-pink-500' },
      { label: 'Aptitude Score', value: 82, tint: 'from-emerald-500 to-teal-500' },
      { label: 'Strengths Impact', value: 72, tint: 'from-amber-500 to-orange-500' },
    ],
    roadmap: [
      { title: 'Choose Commerce', desc: 'Class 11–12 — Accounts, Economics, Business Studies, Math.' },
      { title: 'Build finance + analytics base', desc: 'Excel, accounting basics, stats.' },
      { title: 'Bachelor’s degree', desc: 'B.Com / BBA / BA Economics (3 yrs).' },
      { title: 'Certifications + internships', desc: 'CFA L1, equity research, banking internships.' },
      { title: 'First role', desc: 'Financial Analyst / Research Associate.' },
    ],
    skillsMissing: [
      'Excel (advanced)',
      'Accounting',
      'Financial Modeling',
      'Statistics',
      'Communication',
    ],
    weakAreas: [
      {
        subject: 'Accounting principles',
        tip: 'Do the 5-day accounting fundamentals track.',
      },
      {
        subject: 'Valuation models',
        tip: 'Practice building a 3-statement model end to end.',
      },
    ],
  },

  Arts: {
    confidence: 70,
    role: 'UX Designer',
    tagline: 'Curious, creative, strong with language and people.',
    why: 'Your interest signals cluster around design, writing, and psychology. Modern Arts graduates thrive in product and design roles — UX Design is a great fit given your visual + empathy leanings.',
    metrics: [
      { label: 'Academic Score', value: 75, tint: 'from-indigo-500 to-purple-500' },
      { label: 'Interest Match', value: 88, tint: 'from-fuchsia-500 to-pink-500' },
      { label: 'Aptitude Score', value: 70, tint: 'from-emerald-500 to-teal-500' },
      { label: 'Strengths Impact', value: 82, tint: 'from-amber-500 to-orange-500' },
    ],
    roadmap: [
      { title: 'Choose Arts / Humanities', desc: 'Class 11–12 — Psychology, English, Sociology.' },
      { title: 'Build design + research base', desc: 'Figma, visual design, user research.' },
      { title: 'Bachelor’s degree', desc: 'BA / B.Des (3–4 yrs).' },
      { title: 'Portfolio + internships', desc: '3–5 case studies, design community work.' },
      { title: 'First role', desc: 'Junior UX / Product Designer.' },
    ],
    skillsMissing: [
      'Figma',
      'User Research',
      'Wireframing',
      'Visual Hierarchy',
      'Writing',
    ],
    weakAreas: [
      {
        subject: 'Quantitative reasoning',
        tip: 'Light daily practice — 10 questions/day builds confidence fast.',
      },
      {
        subject: 'Portfolio storytelling',
        tip: 'Frame each case as Problem → Insight → Decision → Outcome.',
      },
    ],
  },
}
