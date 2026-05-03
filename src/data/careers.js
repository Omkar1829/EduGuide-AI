// Career catalogue used by the Learning Hub's Career-Fit Scorecard,
// the Mock Interview prep, and the Resume Builder. Each role lists the
// skills it draws on so we can compute a match percentage from the
// student's proficiency map (see src/utils/proficiency.js).

export const CAREER_ROLES = [
  {
    id: 'data-scientist',
    title: 'Data Scientist',
    streams: ['Science', 'Commerce'],
    summary:
      'Turns raw data into product decisions using statistics, ML and clear communication.',
    coreSubjects: ['mathematics', 'physics', 'english'],
    skills: [
      'Statistics',
      'Python',
      'SQL',
      'Machine Learning',
      'Data Storytelling',
      'Linear Algebra',
    ],
    interviewPrep: [
      { kind: 'tech', q: 'Explain bias-variance tradeoff in your own words.' },
      { kind: 'tech', q: 'When would you use logistic regression over a tree-based model?' },
      { kind: 'hr', q: 'Tell me about a time you made a decision with incomplete data.' },
      { kind: 'tech', q: 'Walk me through how you would A/B test a new homepage.' },
    ],
  },
  {
    id: 'software-engineer',
    title: 'Software Engineer',
    streams: ['Science'],
    summary:
      'Designs, builds and maintains the systems that power modern products.',
    coreSubjects: ['mathematics', 'physics', 'english'],
    skills: [
      'Data Structures',
      'Algorithms',
      'System Design',
      'Git',
      'Testing',
      'Communication',
    ],
    interviewPrep: [
      { kind: 'tech', q: 'Reverse a linked list — explain pointers step by step.' },
      { kind: 'tech', q: 'Design a URL shortener at high level.' },
      { kind: 'hr', q: 'Describe a time you debugged a tricky production issue.' },
      { kind: 'tech', q: 'When do you choose a hashmap over a tree?' },
    ],
  },
  {
    id: 'mechanical-engineer',
    title: 'Mechanical Engineer',
    streams: ['Science'],
    summary:
      'Designs physical systems — engines, robots, manufacturing lines, HVAC.',
    coreSubjects: ['physics', 'mathematics'],
    skills: [
      'Mechanics',
      'Thermodynamics',
      'CAD',
      'Materials',
      'Problem Solving',
      'Teamwork',
    ],
    interviewPrep: [
      { kind: 'tech', q: 'State the second law of thermodynamics in your own words.' },
      { kind: 'tech', q: 'Why does a beam fail under bending vs. shear?' },
      { kind: 'hr', q: 'Tell me about a project where you owned the design end-to-end.' },
    ],
  },
  {
    id: 'doctor',
    title: 'Medical Doctor',
    streams: ['Science'],
    summary:
      'Diagnoses, treats and supports patients across primary or specialty care.',
    coreSubjects: ['biology', 'chemistry'],
    skills: [
      'Anatomy',
      'Diagnosis',
      'Empathy',
      'Communication',
      'Pharmacology',
      'Decision Making',
    ],
    interviewPrep: [
      { kind: 'tech', q: 'Differentiate between viral and bacterial infections clinically.' },
      { kind: 'hr', q: 'How do you stay calm with a distressed patient?' },
      { kind: 'tech', q: 'What does a high WBC count typically suggest?' },
    ],
  },
  {
    id: 'chartered-accountant',
    title: 'Chartered Accountant',
    streams: ['Commerce'],
    summary:
      'Audits, taxes and advises businesses on financial compliance and strategy.',
    coreSubjects: ['accounts', 'economics', 'mathematics'],
    skills: [
      'Accounting',
      'Auditing',
      'Tax',
      'Financial Analysis',
      'Compliance',
      'Excel',
    ],
    interviewPrep: [
      { kind: 'tech', q: 'Explain double-entry bookkeeping.' },
      { kind: 'tech', q: 'Difference between deferred tax asset vs. liability?' },
      { kind: 'hr', q: 'How do you handle a client request that seems aggressive on tax?' },
    ],
  },
  {
    id: 'business-analyst',
    title: 'Business Analyst',
    streams: ['Commerce', 'Science'],
    summary:
      'Bridges business goals and technical teams with data-backed recommendations.',
    coreSubjects: ['economics', 'mathematics', 'english'],
    skills: [
      'Excel',
      'SQL',
      'Stakeholder Management',
      'Process Mapping',
      'Storytelling',
      'Critical Thinking',
    ],
    interviewPrep: [
      { kind: 'tech', q: 'Walk me through a SWOT analysis you have done.' },
      { kind: 'hr', q: 'Tell me about a time you said no to a stakeholder.' },
      { kind: 'tech', q: 'How would you size the market for paid streaming in India?' },
    ],
  },
  {
    id: 'economist',
    title: 'Economist',
    streams: ['Commerce', 'Arts'],
    summary:
      'Studies how people, firms and governments allocate resources.',
    coreSubjects: ['economics', 'mathematics', 'english'],
    skills: [
      'Microeconomics',
      'Macroeconomics',
      'Statistics',
      'Research',
      'Policy Analysis',
      'Writing',
    ],
    interviewPrep: [
      { kind: 'tech', q: 'How does inflation affect interest rates?' },
      { kind: 'hr', q: 'Tell me about an economic question you find personally exciting.' },
      { kind: 'tech', q: 'Explain elasticity with a real-world example.' },
    ],
  },
  {
    id: 'civil-services',
    title: 'Civil Services Officer',
    streams: ['Arts', 'Commerce', 'Science'],
    summary:
      'Public administration roles — policy, governance and on-ground execution.',
    coreSubjects: ['history', 'economics', 'english'],
    skills: [
      'Public Policy',
      'Constitution',
      'Current Affairs',
      'Communication',
      'Leadership',
      'Ethics',
    ],
    interviewPrep: [
      { kind: 'tech', q: 'Discuss federalism vs. unitary government.' },
      { kind: 'hr', q: 'Why civil services and not the private sector?' },
      { kind: 'tech', q: 'Pick one current policy and critique it.' },
    ],
  },
  {
    id: 'journalist',
    title: 'Journalist / Writer',
    streams: ['Arts'],
    summary:
      'Researches, interviews and reports stories that inform the public.',
    coreSubjects: ['english', 'history', 'economics'],
    skills: [
      'Writing',
      'Research',
      'Interviewing',
      'Editing',
      'Curiosity',
      'Ethics',
    ],
    interviewPrep: [
      { kind: 'hr', q: 'Pitch me a story you would write this week.' },
      { kind: 'tech', q: 'How do you verify a source?' },
      { kind: 'hr', q: 'How do you handle a story that could harm someone?' },
    ],
  },
  {
    id: 'teacher',
    title: 'Teacher / Educator',
    streams: ['Arts', 'Science', 'Commerce'],
    summary:
      'Designs and delivers learning experiences across subjects and ages.',
    coreSubjects: ['english', 'history', 'mathematics'],
    skills: [
      'Subject Mastery',
      'Pedagogy',
      'Patience',
      'Communication',
      'Classroom Management',
      'Empathy',
    ],
    interviewPrep: [
      { kind: 'tech', q: 'How would you teach fractions to a 5th-grader?' },
      { kind: 'hr', q: 'Describe a difficult student interaction and how you handled it.' },
      { kind: 'hr', q: 'How do you measure if a class actually learned?' },
    ],
  },
]

export function rolesForStream(stream) {
  if (!stream) return CAREER_ROLES
  const s = stream.toLowerCase()
  const canonical = s.includes('comm')
    ? 'Commerce'
    : s.includes('art') || s.includes('human')
    ? 'Arts'
    : 'Science'
  return CAREER_ROLES.filter((r) => r.streams.includes(canonical))
}
