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
