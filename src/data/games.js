// Game banks per subject. Each subject is tagged with the streams it belongs to,
// so the games / leaderboard can filter by the student's signup stream.

export const SUBJECTS = [
  {
    id: 'physics',
    name: 'Physics',
    streams: ['Science'],
    gradient: 'from-sky-400 to-indigo-400',
    description: 'Mechanics, optics, electromagnetism — short knowledge boosters.',
  },
  {
    id: 'chemistry',
    name: 'Chemistry',
    streams: ['Science'],
    gradient: 'from-mint-400 to-sky-400',
    description: 'Atomic structure, bonding, and reactions.',
  },
  {
    id: 'biology',
    name: 'Biology',
    streams: ['Science'],
    gradient: 'from-mint-400 to-emerald-400',
    description: 'Cells, genetics, and human systems.',
  },
  {
    id: 'mathematics',
    name: 'Mathematics',
    streams: ['Science', 'Commerce'],
    gradient: 'from-indigo-400 to-purple-400',
    description: 'Algebra, calculus, probability fundamentals.',
  },
  {
    id: 'accounts',
    name: 'Accounts',
    streams: ['Commerce'],
    gradient: 'from-peach-400 to-peach-300',
    description: 'Journal, ledger, and financial statements.',
  },
  {
    id: 'economics',
    name: 'Economics',
    streams: ['Commerce', 'Arts'],
    gradient: 'from-peach-400 to-mint-400',
    description: 'Micro & macro fundamentals, trade, GDP.',
  },
  {
    id: 'history',
    name: 'History',
    streams: ['Arts'],
    gradient: 'from-purple-400 to-peach-400',
    description: 'World & Indian history milestones.',
  },
  {
    id: 'english',
    name: 'English',
    streams: ['Science', 'Commerce', 'Arts'],
    gradient: 'from-sky-400 to-purple-400',
    description: 'Grammar, comprehension, vocabulary boosters.',
  },
]

// Question shape:
//   mcq:   { id, type: 'mcq', q, options: [a,b,c,d], answer: <index> }
//   blank: { id, type: 'blank', q (with ___), answer: 'string', alts?: [string] }

export const QUESTION_BANK = {
  physics: [
    { id: 'p1', type: 'mcq', q: 'SI unit of electric current is', options: ['Volt', 'Ampere', 'Ohm', 'Watt'], answer: 1 },
    { id: 'p2', type: 'mcq', q: 'Speed of light in vacuum (approx.)', options: ['3×10^5 m/s', '3×10^6 m/s', '3×10^8 m/s', '3×10^10 m/s'], answer: 2 },
    { id: 'p3', type: 'blank', q: 'Newton\u2019s second law: F = m × ___', answer: 'a', alts: ['acceleration'] },
    { id: 'p4', type: 'mcq', q: 'Which is a vector quantity?', options: ['Mass', 'Speed', 'Velocity', 'Time'], answer: 2 },
    { id: 'p5', type: 'blank', q: 'Energy of a photon: E = h × ___', answer: 'f', alts: ['frequency', 'ν'] },
    { id: 'p6', type: 'mcq', q: 'Lens used to correct myopia is', options: ['Convex', 'Concave', 'Cylindrical', 'Bifocal'], answer: 1 },
    { id: 'p7', type: 'mcq', q: 'Unit of magnetic flux is', options: ['Tesla', 'Weber', 'Henry', 'Coulomb'], answer: 1 },
    { id: 'p8', type: 'blank', q: 'Ohm\u2019s law: V = I × ___', answer: 'R', alts: ['resistance'] },
  ],
  chemistry: [
    { id: 'c1', type: 'mcq', q: 'pH of a neutral solution at 25°C is', options: ['0', '7', '10', '14'], answer: 1 },
    { id: 'c2', type: 'mcq', q: 'Atomic number of Carbon', options: ['4', '6', '8', '12'], answer: 1 },
    { id: 'c3', type: 'blank', q: 'Chemical formula of water is ___', answer: 'H2O', alts: ['h2o'] },
    { id: 'c4', type: 'mcq', q: 'Which gas is most abundant in the atmosphere?', options: ['Oxygen', 'Nitrogen', 'Argon', 'Carbon dioxide'], answer: 1 },
    { id: 'c5', type: 'blank', q: 'NaCl is commonly known as ___ salt', answer: 'common', alts: ['table'] },
    { id: 'c6', type: 'mcq', q: 'Avogadro\u2019s number is approximately', options: ['6.02×10^21', '6.02×10^23', '6.02×10^25', '3.14×10^23'], answer: 1 },
    { id: 'c7', type: 'mcq', q: 'Acid + Base ⇒', options: ['Salt + Water', 'Salt only', 'Water only', 'Gas'], answer: 0 },
    { id: 'c8', type: 'blank', q: 'Symbol of Sodium is ___', answer: 'Na', alts: ['na'] },
  ],
  biology: [
    { id: 'b1', type: 'mcq', q: 'The powerhouse of the cell is', options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Lysosome'], answer: 1 },
    { id: 'b2', type: 'mcq', q: 'Humans normally have how many chromosomes?', options: ['23', '44', '46', '48'], answer: 2 },
    { id: 'b3', type: 'blank', q: 'Process by which plants make food: ___', answer: 'photosynthesis' },
    { id: 'b4', type: 'mcq', q: 'Universal blood donor type is', options: ['A', 'B', 'AB', 'O'], answer: 3 },
    { id: 'b5', type: 'blank', q: 'DNA stands for Deoxyribonucleic ___', answer: 'acid' },
    { id: 'b6', type: 'mcq', q: 'Which organ filters blood?', options: ['Liver', 'Kidney', 'Lung', 'Heart'], answer: 1 },
    { id: 'b7', type: 'mcq', q: 'Insulin is produced by', options: ['Liver', 'Pancreas', 'Stomach', 'Spleen'], answer: 1 },
    { id: 'b8', type: 'blank', q: 'Smallest unit of life is the ___', answer: 'cell' },
  ],
  mathematics: [
    { id: 'm1', type: 'mcq', q: 'Value of π (to 2 decimals)', options: ['3.12', '3.14', '3.16', '3.18'], answer: 1 },
    { id: 'm2', type: 'mcq', q: 'Derivative of sin(x) is', options: ['cos(x)', '-cos(x)', '-sin(x)', 'tan(x)'], answer: 0 },
    { id: 'm3', type: 'blank', q: '7 × 8 = ___', answer: '56' },
    { id: 'm4', type: 'mcq', q: 'log10(1000) =', options: ['1', '2', '3', '10'], answer: 2 },
    { id: 'm5', type: 'blank', q: 'Square root of 144 is ___', answer: '12' },
    { id: 'm6', type: 'mcq', q: 'Sum of interior angles of a triangle', options: ['90°', '180°', '270°', '360°'], answer: 1 },
    { id: 'm7', type: 'mcq', q: '∫ 1 dx =', options: ['0', 'x + C', 'x²/2 + C', '1'], answer: 1 },
    { id: 'm8', type: 'blank', q: '2³ = ___', answer: '8' },
  ],
  accounts: [
    { id: 'a1', type: 'mcq', q: 'The basic accounting equation is', options: ['Assets = Liabilities + Equity', 'Assets = Liabilities − Equity', 'Equity = Assets + Liabilities', 'Income = Assets'], answer: 0 },
    { id: 'a2', type: 'mcq', q: 'Goods sold for cash is recorded in', options: ['Purchase book', 'Sales book', 'Cash book', 'Journal'], answer: 2 },
    { id: 'a3', type: 'blank', q: 'Recording every transaction in two accounts is ___ entry', answer: 'double' },
    { id: 'a4', type: 'mcq', q: 'A trial balance is prepared to check', options: ['Profit', 'Equity', 'Arithmetical accuracy', 'Cash flow'], answer: 2 },
    { id: 'a5', type: 'blank', q: 'Excess of income over expenses is called ___', answer: 'profit', alts: ['surplus'] },
    { id: 'a6', type: 'mcq', q: 'Depreciation is charged on', options: ['Current assets', 'Fixed assets', 'Liabilities', 'Capital'], answer: 1 },
    { id: 'a7', type: 'mcq', q: 'Which is a personal account?', options: ['Cash A/c', 'Salary A/c', 'Ramesh A/c', 'Furniture A/c'], answer: 2 },
    { id: 'a8', type: 'blank', q: 'GST stands for Goods and ___ Tax', answer: 'services' },
  ],
  economics: [
    { id: 'e1', type: 'mcq', q: 'GDP stands for', options: ['Gross Domestic Product', 'General Demand Price', 'Government Demand Plan', 'Gross Direct Profit'], answer: 0 },
    { id: 'e2', type: 'mcq', q: 'Father of economics is', options: ['Keynes', 'Marshall', 'Adam Smith', 'Marx'], answer: 2 },
    { id: 'e3', type: 'blank', q: 'Demand curve usually slopes ___', answer: 'downward', alts: ['down'] },
    { id: 'e4', type: 'mcq', q: 'Inflation refers to', options: ['Falling prices', 'Rising prices', 'Stable prices', 'Zero prices'], answer: 1 },
    { id: 'e5', type: 'blank', q: 'Sale of goods to other countries is called ___', answer: 'export', alts: ['exports'] },
    { id: 'e6', type: 'mcq', q: 'A monopoly market has', options: ['Many sellers', 'Two sellers', 'One seller', 'No seller'], answer: 2 },
    { id: 'e7', type: 'mcq', q: 'RBI is the central bank of', options: ['UK', 'India', 'USA', 'Japan'], answer: 1 },
    { id: 'e8', type: 'blank', q: 'Money supply is controlled by the ___ bank', answer: 'central' },
  ],
  history: [
    { id: 'h1', type: 'mcq', q: 'India gained independence in', options: ['1942', '1945', '1947', '1950'], answer: 2 },
    { id: 'h2', type: 'mcq', q: 'Who built the Taj Mahal?', options: ['Akbar', 'Babur', 'Shah Jahan', 'Aurangzeb'], answer: 2 },
    { id: 'h3', type: 'blank', q: 'Mahatma Gandhi led the Salt March in ___', answer: '1930' },
    { id: 'h4', type: 'mcq', q: 'World War II ended in', options: ['1939', '1942', '1945', '1948'], answer: 2 },
    { id: 'h5', type: 'blank', q: 'The first PM of India was Jawaharlal ___', answer: 'Nehru', alts: ['nehru'] },
    { id: 'h6', type: 'mcq', q: 'Battle of Plassey was fought in', options: ['1707', '1757', '1857', '1947'], answer: 1 },
    { id: 'h7', type: 'mcq', q: 'Indus Valley civilization is also called', options: ['Harappan', 'Vedic', 'Mauryan', 'Gupta'], answer: 0 },
    { id: 'h8', type: 'blank', q: 'Indian constitution came into effect on 26 January ___', answer: '1950' },
  ],
  english: [
    { id: 'en1', type: 'mcq', q: 'Synonym of \u201chappy\u201d is', options: ['Sad', 'Joyful', 'Angry', 'Bored'], answer: 1 },
    { id: 'en2', type: 'mcq', q: 'Antonym of \u201cancient\u201d is', options: ['Old', 'Past', 'Modern', 'Aged'], answer: 2 },
    { id: 'en3', type: 'blank', q: 'She ___ to school every day. (verb \u201cgo\u201d)', answer: 'goes' },
    { id: 'en4', type: 'mcq', q: 'Choose the noun: \u201cThe quick brown fox jumps over the lazy dog.\u201d', options: ['quick', 'jumps', 'fox', 'over'], answer: 2 },
    { id: 'en5', type: 'blank', q: 'A ___ is a person who writes books.', answer: 'author', alts: ['writer'] },
    { id: 'en6', type: 'mcq', q: 'Past tense of \u201crun\u201d is', options: ['Runned', 'Ran', 'Running', 'Runs'], answer: 1 },
    { id: 'en7', type: 'mcq', q: 'Plural of \u201cchild\u201d is', options: ['Childs', 'Childes', 'Children', 'Childrens'], answer: 2 },
    { id: 'en8', type: 'blank', q: '\u201cI ___ a student.\u201d (be verb)', answer: 'am' },
  ],
}

export function subjectsForStream(stream) {
  const s = (stream || '').toLowerCase()
  if (!s) return SUBJECTS
  if (s.includes('science') || s.includes('pcm') || s.includes('pcb') || s.includes('engineer') || s.includes('medical')) {
    return SUBJECTS.filter((x) => x.streams.includes('Science'))
  }
  if (s.includes('commerce') || s.includes('business') || s.includes('management') || s.includes('finance')) {
    return SUBJECTS.filter((x) => x.streams.includes('Commerce'))
  }
  if (s.includes('arts') || s.includes('humanities') || s.includes('history') || s.includes('law')) {
    return SUBJECTS.filter((x) => x.streams.includes('Arts'))
  }
  return SUBJECTS
}

export function streamGroupFor(stream) {
  const s = (stream || '').toLowerCase()
  if (s.includes('science') || s.includes('pcm') || s.includes('pcb') || s.includes('engineer') || s.includes('medical')) return 'Science'
  if (s.includes('commerce') || s.includes('business') || s.includes('management') || s.includes('finance')) return 'Commerce'
  if (s.includes('arts') || s.includes('humanities') || s.includes('history') || s.includes('law')) return 'Arts'
  return 'Mixed'
}

// Mock peers seeded into the leaderboard so a fresh user still sees a list.
export const SEED_LEADERBOARD = [
  { id: 'seed-1', name: 'Aarav Sharma', stream: 'Science', subjectId: 'physics', score: 92, accuracy: 95, ts: Date.now() - 1000 * 60 * 22 },
  { id: 'seed-2', name: 'Priya Iyer', stream: 'Science', subjectId: 'biology', score: 88, accuracy: 91, ts: Date.now() - 1000 * 60 * 60 * 2 },
  { id: 'seed-3', name: 'Rohan Mehta', stream: 'Commerce', subjectId: 'accounts', score: 84, accuracy: 89, ts: Date.now() - 1000 * 60 * 50 },
  { id: 'seed-4', name: 'Sneha Patel', stream: 'Arts', subjectId: 'history', score: 80, accuracy: 86, ts: Date.now() - 1000 * 60 * 60 * 5 },
  { id: 'seed-5', name: 'Karan Verma', stream: 'Science', subjectId: 'mathematics', score: 78, accuracy: 84, ts: Date.now() - 1000 * 60 * 90 },
  { id: 'seed-6', name: 'Aditi Rao', stream: 'Commerce', subjectId: 'economics', score: 76, accuracy: 82, ts: Date.now() - 1000 * 60 * 60 * 3 },
  { id: 'seed-7', name: 'Vikram Singh', stream: 'Arts', subjectId: 'english', score: 74, accuracy: 80, ts: Date.now() - 1000 * 60 * 60 * 8 },
  { id: 'seed-8', name: 'Meera Joshi', stream: 'Science', subjectId: 'chemistry', score: 70, accuracy: 78, ts: Date.now() - 1000 * 60 * 30 },
  { id: 'seed-9', name: 'Anya Kapoor', stream: 'Science', subjectId: 'physics', score: 68, accuracy: 75, ts: Date.now() - 1000 * 60 * 60 * 18 },
  { id: 'seed-10', name: 'Devansh Roy', stream: 'Commerce', subjectId: 'mathematics', score: 65, accuracy: 73, ts: Date.now() - 1000 * 60 * 60 * 24 },
]
