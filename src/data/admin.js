// Dummy admin-side data. Used to seed AdminContext.

export const EDUCATION_LEVELS = [
  'High School',
  'Undergraduate',
  'Postgraduate',
  'Working Professional',
]

export const DOC_CATEGORIES = [
  'School',
  'Graduation',
  'Post Graduation',
  'Certifications',
]

export const DIFFICULTIES = ['Easy', 'Medium', 'Hard']

export const SEED_USERS = [
  {
    id: 'au-1',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@student.edu',
    education: 'Undergraduate',
    status: 'active',
    joinedAt: '2025-01-14T09:12:00Z',
    lastActive: '2026-04-18T11:02:00Z',
    documents: 6,
  },
  {
    id: 'au-2',
    name: 'Meera Iyer',
    email: 'meera.iyer@student.edu',
    education: 'High School',
    status: 'active',
    joinedAt: '2025-02-01T10:40:00Z',
    lastActive: '2026-04-17T19:22:00Z',
    documents: 3,
  },
  {
    id: 'au-3',
    name: 'Kabir Singh',
    email: 'kabir@acme.com',
    education: 'Postgraduate',
    status: 'inactive',
    joinedAt: '2024-11-10T08:00:00Z',
    lastActive: '2026-02-05T14:40:00Z',
    documents: 9,
  },
  {
    id: 'au-4',
    name: 'Priya Nair',
    email: 'priya.nair@example.com',
    education: 'Working Professional',
    status: 'active',
    joinedAt: '2025-06-22T15:30:00Z',
    lastActive: '2026-04-19T01:02:00Z',
    documents: 11,
  },
  {
    id: 'au-5',
    name: 'Rohan Verma',
    email: 'rohan.v@college.edu',
    education: 'Undergraduate',
    status: 'active',
    joinedAt: '2025-08-05T12:15:00Z',
    lastActive: '2026-04-18T20:10:00Z',
    documents: 4,
  },
  {
    id: 'au-6',
    name: 'Zoya Khan',
    email: 'zoya.k@mail.com',
    education: 'High School',
    status: 'active',
    joinedAt: '2026-01-30T09:00:00Z',
    lastActive: '2026-04-15T08:44:00Z',
    documents: 2,
  },
  {
    id: 'au-7',
    name: 'Devansh Rao',
    email: 'devansh@student.edu',
    education: 'Undergraduate',
    status: 'inactive',
    joinedAt: '2024-09-11T09:00:00Z',
    lastActive: '2025-12-18T19:20:00Z',
    documents: 1,
  },
  {
    id: 'au-8',
    name: 'Sana Pillai',
    email: 'sana.pillai@student.edu',
    education: 'Postgraduate',
    status: 'active',
    joinedAt: '2025-05-12T10:00:00Z',
    lastActive: '2026-04-19T00:05:00Z',
    documents: 8,
  },
]

export const SEED_DOCUMENTS = [
  { id: 'ad-1', name: '10th Marksheet.pdf', userId: 'au-1', category: 'School', size: 820_000, uploadedAt: '2025-01-20T10:00:00Z', mime: 'application/pdf' },
  { id: 'ad-2', name: '12th Marksheet.pdf', userId: 'au-1', category: 'School', size: 910_000, uploadedAt: '2025-01-20T10:05:00Z', mime: 'application/pdf' },
  { id: 'ad-3', name: 'Sem 1 Result.pdf', userId: 'au-1', category: 'Graduation', size: 450_000, uploadedAt: '2025-06-12T09:00:00Z', mime: 'application/pdf' },
  { id: 'ad-4', name: 'Coursera Python.pdf', userId: 'au-2', category: 'Certifications', size: 320_000, uploadedAt: '2025-03-14T11:00:00Z', mime: 'application/pdf' },
  { id: 'ad-5', name: 'Degree Certificate.pdf', userId: 'au-3', category: 'Graduation', size: 1_150_000, uploadedAt: '2025-02-10T12:00:00Z', mime: 'application/pdf' },
  { id: 'ad-6', name: 'MBA Transcripts.pdf', userId: 'au-3', category: 'Post Graduation', size: 980_000, uploadedAt: '2025-04-15T10:30:00Z', mime: 'application/pdf' },
  { id: 'ad-7', name: 'AWS Cloud Practitioner.png', userId: 'au-4', category: 'Certifications', size: 280_000, uploadedAt: '2025-07-18T15:00:00Z', mime: 'image/png' },
  { id: 'ad-8', name: 'Google UX Design.pdf', userId: 'au-4', category: 'Certifications', size: 410_000, uploadedAt: '2025-08-01T09:20:00Z', mime: 'application/pdf' },
  { id: 'ad-9', name: '12th Marksheet.jpg', userId: 'au-5', category: 'School', size: 620_000, uploadedAt: '2025-08-10T11:00:00Z', mime: 'image/jpeg' },
  { id: 'ad-10', name: 'NPTEL ML Certificate.pdf', userId: 'au-5', category: 'Certifications', size: 340_000, uploadedAt: '2025-09-22T14:00:00Z', mime: 'application/pdf' },
  { id: 'ad-11', name: '10th Report Card.pdf', userId: 'au-6', category: 'School', size: 540_000, uploadedAt: '2026-02-02T09:00:00Z', mime: 'application/pdf' },
  { id: 'ad-12', name: 'Design Portfolio.pdf', userId: 'au-8', category: 'Post Graduation', size: 1_450_000, uploadedAt: '2025-11-14T10:00:00Z', mime: 'application/pdf' },
]

export const SEED_JOBS = [
  {
    id: 'aj-1',
    title: 'Data Scientist',
    education: 'Postgraduate',
    skills: ['Python', 'Statistics', 'ML', 'SQL'],
    stream: 'Science',
    openings: 42,
  },
  {
    id: 'aj-2',
    title: 'Frontend Engineer',
    education: 'Undergraduate',
    skills: ['React', 'TypeScript', 'CSS', 'Accessibility'],
    stream: 'Science',
    openings: 58,
  },
  {
    id: 'aj-3',
    title: 'Financial Analyst',
    education: 'Undergraduate',
    skills: ['Excel', 'Valuation', 'Accounting', 'SQL'],
    stream: 'Commerce',
    openings: 31,
  },
  {
    id: 'aj-4',
    title: 'UX Designer',
    education: 'Undergraduate',
    skills: ['Figma', 'User Research', 'Prototyping'],
    stream: 'Arts',
    openings: 24,
  },
  {
    id: 'aj-5',
    title: 'Product Manager',
    education: 'Postgraduate',
    skills: ['Strategy', 'Analytics', 'Communication'],
    stream: 'Commerce',
    openings: 19,
  },
  {
    id: 'aj-6',
    title: 'Content Strategist',
    education: 'Undergraduate',
    skills: ['Writing', 'SEO', 'Editorial'],
    stream: 'Arts',
    openings: 12,
  },
]

export const SEED_QUIZ = [
  {
    id: 'aq-1',
    question: 'Which data structure uses FIFO ordering?',
    options: ['Stack', 'Queue', 'Tree', 'Graph'],
    correctIndex: 1,
    difficulty: 'Easy',
    topic: 'Data Structures',
  },
  {
    id: 'aq-2',
    question: 'What does HTML stand for?',
    options: [
      'Hyper Text Markup Language',
      'Hyperlink Markup Language',
      'Home Tool Markup Language',
      'None of these',
    ],
    correctIndex: 0,
    difficulty: 'Easy',
    topic: 'Web',
  },
  {
    id: 'aq-3',
    question: 'Derivative of sin(x) is?',
    options: ['cos(x)', '-cos(x)', 'tan(x)', '-sin(x)'],
    correctIndex: 0,
    difficulty: 'Medium',
    topic: 'Calculus',
  },
  {
    id: 'aq-4',
    question: 'In accounting, a liability is…',
    options: [
      'Something the company owns',
      'Something the company owes',
      'Revenue earned',
      'Equity held by owners',
    ],
    correctIndex: 1,
    difficulty: 'Easy',
    topic: 'Finance',
  },
  {
    id: 'aq-5',
    question: 'Time complexity of binary search?',
    options: ['O(n)', 'O(n log n)', 'O(log n)', 'O(1)'],
    correctIndex: 2,
    difficulty: 'Medium',
    topic: 'Algorithms',
  },
  {
    id: 'aq-6',
    question: 'Which gas do plants absorb for photosynthesis?',
    options: ['Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Hydrogen'],
    correctIndex: 1,
    difficulty: 'Easy',
    topic: 'Biology',
  },
  {
    id: 'aq-7',
    question: 'A pointer in C stores…',
    options: ['A value', 'An address', 'A function', 'A type'],
    correctIndex: 1,
    difficulty: 'Hard',
    topic: 'Programming',
  },
]

export const SEED_ACTIVITY = [
  { id: 'ac-1', who: 'Priya Nair', action: 'uploaded AWS Cloud Practitioner certificate', at: '2026-04-19T00:58:00Z' },
  { id: 'ac-2', who: 'Aarav Sharma', action: 'completed Algebra Foundations lesson 3', at: '2026-04-18T22:14:00Z' },
  { id: 'ac-3', who: 'Sana Pillai', action: 'scored 86% on Algorithms Quiz', at: '2026-04-18T20:02:00Z' },
  { id: 'ac-4', who: 'Meera Iyer', action: 'switched recommended stream to Science', at: '2026-04-18T18:40:00Z' },
  { id: 'ac-5', who: 'Rohan Verma', action: 'enrolled in Calculus Essentials', at: '2026-04-18T16:11:00Z' },
  { id: 'ac-6', who: 'Zoya Khan', action: 'uploaded 10th Report Card', at: '2026-04-18T12:33:00Z' },
]

export const DEFAULT_AI_WEIGHTS = {
  academic: 35,
  interest: 25,
  aptitude: 25,
  strength: 15,
}

// ---- AI Providers & Task Routing ----

export const AI_PROVIDERS_CATALOG = [
  {
    id: 'groq',
    name: 'Groq',
    tagline: 'Ultra-low latency Llama + Mixtral',
    keyLabel: 'GROQ_API_KEY',
    keyUrl: 'https://console.groq.com/keys',
    needsBaseUrl: false,
    models: [
      'llama-3.1-70b-versatile',
      'llama-3.1-8b-instant',
      'mixtral-8x7b-32768',
      'gemma2-9b-it',
    ],
  },
  {
    id: 'google',
    name: 'Google Gemini / Gemma',
    tagline: 'Gemini 1.5 Pro and open Gemma models',
    keyLabel: 'GOOGLE_API_KEY',
    keyUrl: 'https://aistudio.google.com/app/apikey',
    needsBaseUrl: false,
    models: ['gemini-1.5-pro', 'gemini-1.5-flash', 'gemma-2-27b-it', 'gemma-2-9b-it'],
  },
  {
    id: 'openai',
    name: 'OpenAI',
    tagline: 'GPT-4o family',
    keyLabel: 'OPENAI_API_KEY',
    keyUrl: 'https://platform.openai.com/api-keys',
    needsBaseUrl: false,
    models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo'],
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    tagline: 'Claude 3.5 Sonnet, Haiku, Opus',
    keyLabel: 'ANTHROPIC_API_KEY',
    keyUrl: 'https://console.anthropic.com/settings/keys',
    needsBaseUrl: false,
    models: ['claude-3-5-sonnet', 'claude-3-5-haiku', 'claude-3-opus'],
  },
  {
    id: 'ollama',
    name: 'Ollama (self-hosted)',
    tagline: 'Run Llama / Gemma locally',
    keyLabel: null,
    keyUrl: 'https://ollama.com/download',
    needsBaseUrl: true,
    defaultBaseUrl: 'http://localhost:11434',
    models: ['llama3.1:8b', 'llama3.1:70b', 'gemma2:9b', 'mistral:7b'],
  },
]

export const DEFAULT_PROVIDERS = {
  groq: {
    enabled: true,
    apiKey: '',
    baseUrl: '',
    status: 'connected',
    updatedAt: '2026-04-18T10:00:00Z',
  },
  google: { enabled: true, apiKey: '', baseUrl: '', status: 'connected', updatedAt: '2026-04-18T10:02:00Z' },
  openai: { enabled: false, apiKey: '', baseUrl: '', status: 'disabled' },
  anthropic: { enabled: false, apiKey: '', baseUrl: '', status: 'disabled' },
  ollama: { enabled: false, apiKey: '', baseUrl: 'http://localhost:11434', status: 'disabled' },
}

export const AI_TASKS = [
  {
    id: 'recommendation',
    label: 'Career recommendation',
    description: 'Picks stream + role and confidence from academic + interest signals.',
  },
  {
    id: 'adaptive_quiz',
    label: 'Adaptive quiz generation',
    description: 'Generates unique questions per student tuned to their current skill band.',
  },
  {
    id: 'tutor',
    label: 'AI tutor chat',
    description: 'Powers the /app/tutor conversation.',
  },
  {
    id: 'document_extraction',
    label: 'Academic vault extraction',
    description: 'Parses uploaded marksheets, certificates and transcripts into structured data.',
  },
  {
    id: 'study_plan',
    label: 'Study plan generation',
    description: 'Builds a personalized 7-day study plan per student.',
  },
  {
    id: 'weakness',
    label: 'Weakness analysis',
    description: 'Detects weak subjects / topics from quiz + academic data.',
  },
]

export const DEFAULT_TASK_ROUTING = {
  recommendation: { provider: 'groq', model: 'llama-3.1-70b-versatile', temperature: 0.3, maxTokens: 1024, enabled: true },
  adaptive_quiz: { provider: 'google', model: 'gemini-1.5-flash', temperature: 0.7, maxTokens: 768, enabled: true },
  tutor: { provider: 'groq', model: 'llama-3.1-70b-versatile', temperature: 0.6, maxTokens: 1536, enabled: true },
  document_extraction: { provider: 'google', model: 'gemini-1.5-pro', temperature: 0.1, maxTokens: 2048, enabled: true },
  study_plan: { provider: 'groq', model: 'llama-3.1-8b-instant', temperature: 0.5, maxTokens: 1024, enabled: true },
  weakness: { provider: 'groq', model: 'gemma2-9b-it', temperature: 0.2, maxTokens: 512, enabled: true },
}

export const SEED_REVIEW_QUEUE = [
  {
    id: 'rv-1',
    kind: 'question',
    status: 'pending',
    model: 'gemini-1.5-flash',
    provider: 'google',
    createdAt: '2026-04-19T01:40:00Z',
    payload: {
      question: 'Which sorting algorithm has an average time complexity of O(n log n) and is stable?',
      options: ['Quick Sort', 'Merge Sort', 'Heap Sort', 'Selection Sort'],
      correctIndex: 1,
      difficulty: 'Medium',
      topic: 'Algorithms',
    },
  },
  {
    id: 'rv-2',
    kind: 'question',
    status: 'pending',
    model: 'gemini-1.5-flash',
    provider: 'google',
    createdAt: '2026-04-19T01:48:00Z',
    payload: {
      question: 'In microeconomics, a good with an income elasticity of demand greater than 1 is classified as…',
      options: ['Inferior', 'Necessity', 'Luxury', 'Giffen'],
      correctIndex: 2,
      difficulty: 'Hard',
      topic: 'Economics',
    },
  },
  {
    id: 'rv-3',
    kind: 'recommendation',
    status: 'pending',
    model: 'llama-3.1-70b-versatile',
    provider: 'groq',
    createdAt: '2026-04-19T02:05:00Z',
    payload: {
      studentName: 'Aarav Sharma',
      stream: 'Science',
      role: 'Data Scientist',
      confidence: 87,
      rationale:
        'Strong math + programming scores, active in analytics certifications, weak English writing not blocking for this role.',
    },
  },
  {
    id: 'rv-4',
    kind: 'question',
    status: 'pending',
    model: 'gemma2-9b-it',
    provider: 'groq',
    createdAt: '2026-04-19T02:10:00Z',
    payload: {
      question: 'A projectile is launched at 30° with speed 20 m/s. Its horizontal range is closest to (g=10 m/s²)?',
      options: ['17 m', '24 m', '35 m', '40 m'],
      correctIndex: 2,
      difficulty: 'Medium',
      topic: 'Physics',
    },
  },
  {
    id: 'rv-5',
    kind: 'recommendation',
    status: 'pending',
    model: 'llama-3.1-70b-versatile',
    provider: 'groq',
    createdAt: '2026-04-19T02:15:00Z',
    payload: {
      studentName: 'Priya Nair',
      stream: 'Arts',
      role: 'UX Designer',
      confidence: 82,
      rationale:
        'Portfolio uploads + high interest-match for design thinking; aptitude shows visual reasoning strength.',
    },
  },
]

// Question bank for adaptive quiz (richer than the admin-managed quiz).
export const ADAPTIVE_BANK = [
  { id: 'ab-1', topic: 'Data Structures', difficulty: 1, question: 'Which data structure uses FIFO ordering?', options: ['Stack', 'Queue', 'Tree', 'Graph'], correctIndex: 1 },
  { id: 'ab-2', topic: 'Data Structures', difficulty: 2, question: 'Average lookup time in a balanced BST with n nodes?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'], correctIndex: 1 },
  { id: 'ab-3', topic: 'Data Structures', difficulty: 3, question: 'Amortized insert in a dynamic array (doubling strategy)?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'], correctIndex: 0 },
  { id: 'ab-4', topic: 'Algorithms', difficulty: 1, question: 'Binary search requires the array to be…', options: ['Sorted', 'Hashed', 'Indexed', 'Unique'], correctIndex: 0 },
  { id: 'ab-5', topic: 'Algorithms', difficulty: 2, question: 'Average complexity of quicksort?', options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'], correctIndex: 1 },
  { id: 'ab-6', topic: 'Algorithms', difficulty: 3, question: 'Which is NOT a greedy algorithm?', options: ['Dijkstra', 'Prim', 'Kruskal', 'Bellman-Ford'], correctIndex: 3 },
  { id: 'ab-7', topic: 'Mathematics', difficulty: 1, question: 'd/dx of sin(x) is…', options: ['cos(x)', '-cos(x)', 'sin(x)', '-sin(x)'], correctIndex: 0 },
  { id: 'ab-8', topic: 'Mathematics', difficulty: 2, question: '∫ 1/x dx equals…', options: ['x ln x', 'ln|x| + C', '1/(x²) + C', 'e^x + C'], correctIndex: 1 },
  { id: 'ab-9', topic: 'Mathematics', difficulty: 3, question: 'A 3x3 matrix has det = 0. It is…', options: ['Invertible', 'Orthogonal', 'Singular', 'Symmetric'], correctIndex: 2 },
  { id: 'ab-10', topic: 'Physics', difficulty: 1, question: 'SI unit of force?', options: ['Joule', 'Newton', 'Watt', 'Pascal'], correctIndex: 1 },
  { id: 'ab-11', topic: 'Physics', difficulty: 2, question: 'Kinetic energy formula?', options: ['mv', '½mv²', 'mgh', 'mc²'], correctIndex: 1 },
  { id: 'ab-12', topic: 'Physics', difficulty: 3, question: 'A photon has momentum…', options: ['h/λ', 'λ/h', 'hν', 'mc'], correctIndex: 0 },
  { id: 'ab-13', topic: 'Economics', difficulty: 1, question: 'GDP stands for…', options: ['Gross Domestic Product', 'General Demand Price', 'Global Debt Pool', 'Gross Dynamic Product'], correctIndex: 0 },
  { id: 'ab-14', topic: 'Economics', difficulty: 2, question: 'A monopoly is characterized by…', options: ['Many sellers', 'One seller', 'Perfect info', 'Free entry'], correctIndex: 1 },
  { id: 'ab-15', topic: 'Economics', difficulty: 3, question: 'In perfect competition, long-run profit is…', options: ['Positive', 'Zero', 'Negative', 'Undefined'], correctIndex: 1 },
]

export const ANALYTICS = {
  streams: [
    { label: 'Science', value: 48 },
    { label: 'Commerce', value: 32 },
    { label: 'Arts', value: 20 },
  ],
  popularCourses: [
    { label: 'Algebra Foundations', value: 184 },
    { label: 'Calculus Essentials', value: 142 },
    { label: 'Biology: Cells', value: 118 },
    { label: 'Python for Beginners', value: 96 },
    { label: 'Intro to Economics', value: 72 },
  ],
  weakTrend: [
    { label: 'Jan', value: 62 },
    { label: 'Feb', value: 58 },
    { label: 'Mar', value: 55 },
    { label: 'Apr', value: 61 },
    { label: 'May', value: 49 },
    { label: 'Jun', value: 44 },
  ],
  activeUsers7d: [
    { label: 'Mon', value: 420 },
    { label: 'Tue', value: 510 },
    { label: 'Wed', value: 478 },
    { label: 'Thu', value: 612 },
    { label: 'Fri', value: 598 },
    { label: 'Sat', value: 402 },
    { label: 'Sun', value: 388 },
  ],
}
