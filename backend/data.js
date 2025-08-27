// Temporary local data store for the Onderwijsdashboard Systeem backend
// This file will be used by the Node.js backend to serve data to the frontend

const students = [
  // Example student
  {
    id: '1',
    name: 'Emma van Bergen',
    groupId: 'group1',
    avatar: '',
    level: 1,
    xp: 0,
    streak: 0,
    professionalityScores: {
      communication: 0,
      taskDivision: 0,
      documentation: 0,
      professionalism: 0,
    },
    averageScore: 0,
    achievements: [],
  },
  // Add more students as needed
];

const groups = [
  // Example group
  {
    id: 'group1',
    name: 'Groep 1',
    color: '#FF5733',
    emoji: '🦁',
    members: ['1'],
    normalizedScore: 0,
    completeness: 0,
    quality: 0,
    level: 1,
    xp: 0,
    streak: 0,
    badges: [],
    dailyScores: [0,0,0,0,0,0,0,0],
  },
  // Add more groups as needed
];

const assignments = [
  // Example assignment
  {
    id: 'a1',
    title: 'Opdracht 1',
    description: 'Beschrijving van opdracht 1',
    dueDate: new Date(),
    status: 'Open',
    submissionCount: 0,
    totalGroups: 1,
  },
  // Add more assignments as needed
];

const submissions = [
  // Example submission
  {
    id: 's1',
    assignmentId: 'a1',
    groupId: 'group1',
    status: 'Ingediend',
    submittedAt: new Date(),
    feedback: '',
    scores: {},
  },
  // Add more submissions as needed
];

module.exports = {
  students,
  groups,
  assignments,
  submissions,
};
