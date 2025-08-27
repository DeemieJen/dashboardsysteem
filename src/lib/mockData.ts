export interface Student {
  id: string;
  name: string;
  groupId: string;
  avatar: string;
  level: number;
  xp: number;
  streak: number;
  professionalityScores: {
    communication: number;
    taskDivision: number;
    documentation: number;
    professionalism: number;
  };
  averageScore: number;
  achievements: string[];
}

export interface Group {
  id: string;
  name: string;
  color: string;
  emoji: string;
  members: string[];
  normalizedScore: number;
  completeness: number;
  quality: number;
  level: number;
  xp: number;
  streak: number;
  badges: string[];
  dailyScores: number[]; // 8 dagen scores
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  status: 'Open' | 'Bijna sluiten' | 'Te laat' | 'Gesloten';
  submissionCount: number;
  totalGroups: number;
  xpReward: number;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert';
}

export interface Submission {
  id: string;
  assignmentId: string;
  groupId: string;
  submittedAt: Date;
  status: 'Niet beoordeeld' | 'Gedeeltelijk beoordeeld' | 'Beoordeeld';
  scores?: {
    communication: Record<string, number>;
    taskDivision: Record<string, number>;
    documentation: Record<string, number>;
    professionalism: Record<string, number>;
  };
}

export interface Upload {
  id: string;
  groupId: string;
  assignmentId: string;
  fileName: string;
  uploadedAt: Date;
  studentName: string;
}

// Extended mock data for 15 groups
export const mockGroups: Group[] = [
  {
    id: 'group1',
    name: 'Phoenix Coders',
    color: 'from-orange-400 to-red-500',
    emoji: '🔥',
    members: ['1', '2'],
    normalizedScore: 9.2,
    completeness: 0.98,
    quality: 9.1,
    level: 12,
    xp: 2850,
    streak: 7,
    badges: ['🏆', '⚡', '🎯'],
    dailyScores: [8.1, 8.3, 8.6, 8.8, 9.0, 9.1, 9.2, 9.2]
  },
  {
    id: 'group2',
    name: 'Quantum Devs',
    color: 'from-purple-400 to-blue-500',
    emoji: '⚛️',
    members: ['3', '4'],
    normalizedScore: 8.9,
    completeness: 1.0,
    quality: 8.8,
    level: 11,
    xp: 2640,
    streak: 5,
    badges: ['🚀', '💎', '🎭'],
    dailyScores: [7.8, 8.0, 8.2, 8.5, 8.7, 8.8, 8.9, 8.9]
  },
  {
    id: 'group3',
    name: 'Cyber Ninjas',
    color: 'from-green-400 to-emerald-500',
    emoji: '🥷',
    members: ['5', '6'],
    normalizedScore: 8.5,
    completeness: 0.92,
    quality: 8.7,
    level: 10,
    xp: 2380,
    streak: 3,
    badges: ['⚔️', '🌟'],
    dailyScores: [7.2, 7.5, 7.8, 8.0, 8.2, 8.3, 8.4, 8.5]
  },
  {
    id: 'group4',
    name: 'Digital Dragons',
    color: 'from-red-400 to-pink-500',
    emoji: '🐲',
    members: ['7', '8'],
    normalizedScore: 8.3,
    completeness: 0.89,
    quality: 8.5,
    level: 9,
    xp: 2150,
    streak: 4,
    badges: ['🔥', '💪'],
    dailyScores: [7.0, 7.3, 7.6, 7.9, 8.0, 8.1, 8.2, 8.3]
  },
  {
    id: 'group5',
    name: 'Code Wizards',
    color: 'from-blue-400 to-indigo-500',
    emoji: '🧙‍♂️',
    members: ['9', '10'],
    normalizedScore: 8.1,
    completeness: 0.85,
    quality: 8.3,
    level: 8,
    xp: 1920,
    streak: 2,
    badges: ['✨', '📚'],
    dailyScores: [6.8, 7.1, 7.4, 7.7, 7.9, 8.0, 8.0, 8.1]
  },
  {
    id: 'group6',
    name: 'Tech Titans',
    color: 'from-yellow-400 to-orange-500',
    emoji: '⚡',
    members: ['11', '12'],
    normalizedScore: 7.9,
    completeness: 0.82,
    quality: 8.1,
    level: 8,
    xp: 1850,
    streak: 6,
    badges: ['💪', '🎯'],
    dailyScores: [6.5, 6.8, 7.1, 7.4, 7.6, 7.7, 7.8, 7.9]
  },
  {
    id: 'group7',
    name: 'Pixel Pirates',
    color: 'from-cyan-400 to-teal-500',
    emoji: '🏴‍☠️',
    members: ['13', '14'],
    normalizedScore: 7.7,
    completeness: 0.78,
    quality: 7.9,
    level: 7,
    xp: 1680,
    streak: 1,
    badges: ['⚓', '💰'],
    dailyScores: [6.2, 6.5, 6.8, 7.1, 7.3, 7.5, 7.6, 7.7]
  },
  {
    id: 'group8',
    name: 'Binary Bears',
    color: 'from-pink-400 to-rose-500',
    emoji: '🐻',
    members: ['15', '16'],
    normalizedScore: 7.5,
    completeness: 0.75,
    quality: 7.7,
    level: 7,
    xp: 1540,
    streak: 0,
    badges: ['🍯'],
    dailyScores: [6.0, 6.3, 6.6, 6.9, 7.1, 7.2, 7.4, 7.5]
  },
  {
    id: 'group9',
    name: 'Cloud Riders',
    color: 'from-sky-400 to-blue-500',
    emoji: '☁️',
    members: ['17', '18'],
    normalizedScore: 7.3,
    completeness: 0.72,
    quality: 7.5,
    level: 6,
    xp: 1420,
    streak: 2,
    badges: ['🌤️'],
    dailyScores: [5.8, 6.1, 6.4, 6.7, 6.9, 7.0, 7.2, 7.3]
  },
  {
    id: 'group10',
    name: 'Matrix Makers',
    color: 'from-lime-400 to-green-500',
    emoji: '🔢',
    members: ['19', '20'],
    normalizedScore: 7.1,
    completeness: 0.69,
    quality: 7.3,
    level: 6,
    xp: 1320,
    streak: 1,
    badges: ['🧮'],
    dailyScores: [5.6, 5.9, 6.2, 6.5, 6.7, 6.9, 7.0, 7.1]
  },
  {
    id: 'group11',
    name: 'Syntax Squad',
    color: 'from-violet-400 to-purple-500',
    emoji: '💻',
    members: ['21', '22'],
    normalizedScore: 6.9,
    completeness: 0.66,
    quality: 7.1,
    level: 5,
    xp: 1180,
    streak: 0,
    badges: ['📝'],
    dailyScores: [5.4, 5.7, 6.0, 6.3, 6.5, 6.7, 6.8, 6.9]
  },
  {
    id: 'group12',
    name: 'Data Dashers',
    color: 'from-amber-400 to-yellow-500',
    emoji: '📊',
    members: ['23', '24'],
    normalizedScore: 6.7,
    completeness: 0.63,
    quality: 6.9,
    level: 5,
    xp: 1080,
    streak: 3,
    badges: ['📈'],
    dailyScores: [5.2, 5.5, 5.8, 6.1, 6.3, 6.5, 6.6, 6.7]
  },
  {
    id: 'group13',
    name: 'Bug Hunters',
    color: 'from-emerald-400 to-cyan-500',
    emoji: '🐛',
    members: ['25', '26'],
    normalizedScore: 6.5,
    completeness: 0.60,
    quality: 6.7,
    level: 4,
    xp: 950,
    streak: 1,
    badges: ['🔍'],
    dailyScores: [5.0, 5.3, 5.6, 5.9, 6.1, 6.3, 6.4, 6.5]
  },
  {
    id: 'group14',
    name: 'Script Samurai',
    color: 'from-rose-400 to-red-500',
    emoji: '⚔️',
    members: ['27', '28'],
    normalizedScore: 6.3,
    completeness: 0.57,
    quality: 6.5,
    level: 4,
    xp: 850,
    streak: 0,
    badges: ['🗡️'],
    dailyScores: [4.8, 5.1, 5.4, 5.7, 5.9, 6.0, 6.2, 6.3]
  },
  {
    id: 'group15',
    name: 'Logic Lions',
    color: 'from-orange-400 to-amber-500',
    emoji: '🦁',
    members: ['29', '30'],
    normalizedScore: 6.1,
    completeness: 0.54,
    quality: 6.3,
    level: 3,
    xp: 720,
    streak: 2,
    badges: ['👑'],
    dailyScores: [4.6, 4.9, 5.2, 5.5, 5.7, 5.9, 6.0, 6.1]
  }
];

// Extended student data
export const mockStudents: Student[] = [
  {
    id: '1',
    name: 'Emma van Bergen',
    groupId: 'group1',
    avatar: '👩‍💻',
    level: 15,
    xp: 3200,
    streak: 12,
    professionalityScores: {
      communication: 9.2,
      taskDivision: 8.8,
      documentation: 9.0,
      professionalism: 9.1
    },
    averageScore: 9.0,
    achievements: ['🔥', '⚡', '🎯', '💎', '👑']
  },
  {
    id: '2',
    name: 'Lars Jansen',
    groupId: 'group1',
    avatar: '👨‍💻',
    level: 14,
    xp: 2950,
    streak: 8,
    professionalityScores: {
      communication: 8.8,
      taskDivision: 9.0,
      documentation: 8.6,
      professionalism: 8.9
    },
    averageScore: 8.8,
    achievements: ['⚡', '🚀', '💪', '🌟']
  },
  {
    id: '3',
    name: 'Sophie de Wit',
    groupId: 'group2',
    avatar: '👩‍🎨',
    level: 13,
    xp: 2750,
    streak: 6,
    professionalityScores: {
      communication: 9.0,
      taskDivision: 8.8,
      documentation: 9.2,
      professionalism: 9.1
    },
    averageScore: 9.0,
    achievements: ['💎', '🎭', '📚', '✨']
  },
  // Add more students for all groups...
  {
    id: '29',
    name: 'Alex Peeters',
    groupId: 'group15',
    avatar: '👨‍🦱',
    level: 4,
    xp: 450,
    streak: 1,
    professionalityScores: {
      communication: 6.2,
      taskDivision: 6.0,
      documentation: 6.4,
      professionalism: 6.1
    },
    averageScore: 6.2,
    achievements: ['🌱']
  },
  {
    id: '30',
    name: 'Nina Bakker',
    groupId: 'group15',
    avatar: '👩‍🎓',
    level: 3,
    xp: 380,
    streak: 0,
    professionalityScores: {
      communication: 6.0,
      taskDivision: 6.2,
      documentation: 5.8,
      professionalism: 6.0
    },
    averageScore: 6.0,
    achievements: ['👑']
  }
];

// Updated assignments with XP and difficulty
export const mockAssignments: Assignment[] = [
  {
    id: 'assign1',
    title: 'Webapplicatie Prototype',
    description: 'Ontwikkel een volledig werkend prototype van een webapplicatie',
    dueDate: new Date('2025-09-01'),
    status: 'Open',
    submissionCount: 12,
    totalGroups: 15,
    xpReward: 500,
    difficulty: 'Hard'
  },
  {
    id: 'assign2',
    title: 'Database Design Document',
    description: 'Creëer een uitgebreid database ontwerp document',
    dueDate: new Date('2025-08-30'),
    status: 'Bijna sluiten',
    submissionCount: 8,
    totalGroups: 15,
    xpReward: 300,
    difficulty: 'Medium'
  },
  {
    id: 'assign3',
    title: 'Testing & Documentatie',
    description: 'Schrijf unit tests en documentatie voor je project',
    dueDate: new Date('2025-08-25'),
    status: 'Te laat',
    submissionCount: 5,
    totalGroups: 15,
    xpReward: 200,
    difficulty: 'Easy'
  }
];

export const mockSubmissions: Submission[] = [
  {
    id: 'sub1',
    assignmentId: 'assign1',
    groupId: 'group1',
    submittedAt: new Date('2025-08-27T10:30:00'),
    status: 'Gedeeltelijk beoordeeld'
  },
  {
    id: 'sub2',
    assignmentId: 'assign1',
    groupId: 'group2',
    submittedAt: new Date('2025-08-27T14:15:00'),
    status: 'Beoordeeld'
  }
];

export const mockUploads: Upload[] = [
  {
    id: 'upload1',
    groupId: 'group1',
    assignmentId: 'assign1',
    fileName: 'prototype-v2.zip',
    uploadedAt: new Date('2025-08-27T09:15:00'),
    studentName: 'Emma van Bergen'
  },
  {
    id: 'upload2',
    groupId: 'group2',
    assignmentId: 'assign1',
    fileName: 'final-submission.pdf',
    uploadedAt: new Date('2025-08-27T11:30:00'),
    studentName: 'Sophie de Wit'
  }
];

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'Open':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'Bijna sluiten':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'Te laat':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'Gesloten':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    case 'Niet beoordeeld':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'Gedeeltelijk beoordeeld':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'Beoordeeld':
      return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const getDifficultyColor = (difficulty: string): string => {
  switch (difficulty) {
    case 'Easy':
      return 'bg-green-100 text-green-800';
    case 'Medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'Hard':
      return 'bg-orange-100 text-orange-800';
    case 'Expert':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getLevelColor = (level: number): string => {
  if (level >= 12) return 'from-purple-500 to-pink-500';
  if (level >= 9) return 'from-blue-500 to-purple-500';
  if (level >= 6) return 'from-green-500 to-blue-500';
  if (level >= 3) return 'from-yellow-500 to-green-500';
  return 'from-gray-400 to-gray-500';
};