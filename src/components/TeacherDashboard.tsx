import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { 
  Users, 
  FileText, 
  TrendingUp, 
  Upload, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  LogOut,
  Settings,
  Eye,
  Zap,
  Star,
  Crown,
  Flame,
  Trophy,
  Target,
  X
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { 
  mockStudents, 
  mockGroups, 
  mockAssignments, 
  mockSubmissions, 
  mockUploads,
  getStatusColor,
  getDifficultyColor 
} from '../lib/mockData';
import { AssessmentPanel } from './AssessmentPanel';
import { ManagementPanel } from './ManagementPanel';

interface TeacherDashboardProps {
  onLogout: () => void;
}

export function TeacherDashboard({ onLogout }: TeacherDashboardProps) {
  const [activeTab, setActiveTab] = useState('dashboard');
  // State voor geselecteerde groep sync
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

  // Bereken dashboard statistieken
  const totalStudents = mockStudents.length;
  const pendingAssessments = mockSubmissions.filter(s => s.status !== 'Beoordeeld').length;
  const averageGroupScore = mockGroups.reduce((sum, group) => sum + group.normalizedScore, 0) / mockGroups.length;
  const todayUploads = mockUploads.filter(u => {
    const today = new Date();
    const uploadDate = new Date(u.uploadedAt);
    return uploadDate.toDateString() === today.toDateString();
  }).length;

  // Sorteer groepen voor leaderboard
  const sortedGroups = [...mockGroups].sort((a, b) => b.normalizedScore - a.normalizedScore);

  // Top en bottom performers
  const topPerformers = mockStudents
    .sort((a, b) => b.averageScore - a.averageScore)
    .slice(0, 5);
  
  const needsAttention = mockStudents
    .sort((a, b) => a.averageScore - b.averageScore)
    .slice(0, 3);

  // Operationele status opdrachten
  const almostClosing = mockAssignments.filter(a => a.status === 'Bijna sluiten');
  const overdue = mockAssignments.filter(a => a.status === 'Te laat');
  const missing = mockAssignments.filter(a => a.submissionCount < a.totalGroups);

  // Chart data voor groepen performance
  const chartData = Array.from({ length: 8 }, (_, index) => {
    const day = index + 1;
    const dayData: any = { day: `Dag ${day}` };
    
    sortedGroups.slice(0, 5).forEach((group, groupIndex) => {
      dayData[group.name] = group.dailyScores[index];
    });
    
    return dayData;
  });

  // Handler voor groep selectie
  const handleGroupSelect = (groupId: string) => {
    setSelectedGroupId(selectedGroupId === groupId ? null : groupId);
  };

  // Get selected group data
  const selectedGroup = selectedGroupId ? mockGroups.find(g => g.id === selectedGroupId) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Animated Header */}
      <div className="border-b bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-2xl">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-3xl backdrop-blur-sm">
              👨‍🏫
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">
                Docent Dashboard ✨
              </h1>
              <p className="text-purple-100 mt-1">Beheer al je klassen met style en overzicht</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="bg-white bg-opacity-20 border-white border-opacity-30 text-white hover:bg-white hover:bg-opacity-30">
              <Settings className="w-4 h-4 mr-2" />
              Instellingen
            </Button>
            <Button variant="outline" className="bg-white bg-opacity-20 border-white border-opacity-30 text-white hover:bg-white hover:bg-opacity-30" onClick={onLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Uitloggen
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 bg-white shadow-lg rounded-xl border-0 p-1">
            <TabsTrigger value="dashboard" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white">
              📊 Dashboard
            </TabsTrigger>
            <TabsTrigger value="assessment" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">
              🎯 Beoordeling
            </TabsTrigger>
            <TabsTrigger value="management" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-blue-500 data-[state=active]:text-white">
              ⚙️ Beheer
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6 mt-6">
            {/* Gamified Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium opacity-90">Totaal Studenten</CardTitle>
                  <Users className="h-6 w-6" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{totalStudents}</div>
                  <p className="text-xs opacity-80 mt-1">
                    Verdeeld over {mockGroups.length} groepen
                  </p>
                  <div className="mt-2 flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    <span className="text-xs">Actieve community</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-500 to-red-500 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium opacity-90">Te Beoordelen</CardTitle>
                  <FileText className="h-6 w-6" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{pendingAssessments}</div>
                  <p className="text-xs opacity-80 mt-1">
                    Nog te beoordelen quests
                  </p>
                  <div className="mt-2">
                    <Badge className="bg-white bg-opacity-20 text-white border-0">
                      🎯 Action needed
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-500 to-emerald-500 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium opacity-90">Gemiddelde Score</CardTitle>
                  <TrendingUp className="h-6 w-6" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{averageGroupScore.toFixed(1)}</div>
                  <p className="text-xs opacity-80 mt-1">
                    Class performance level
                  </p>
                  <div className="mt-2">
                    <Badge className="bg-white bg-opacity-20 text-white border-0">
                      📈 Trending up
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500 to-pink-500 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium opacity-90">Uploads Vandaag</CardTitle>
                  <Upload className="h-6 w-6" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{todayUploads}</div>
                  <p className="text-xs opacity-80 mt-1">
                    Nieuwe submissions
                  </p>
                  <div className="mt-2">
                    <Badge className="bg-white bg-opacity-20 text-white border-0">
                      🚀 Active day
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Epic Leaderboard - Nu met click handlers */}
              <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
                <CardHeader className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-5 h-5" />
                    🏆 Class Championship
                  </CardTitle>
                  <p className="text-sm opacity-90">
                    Top performing teams gerangschikt
                  </p>
                  {selectedGroup && (
                    <div className="mt-2 text-sm bg-white bg-opacity-20 rounded px-2 py-1 flex items-center justify-between">
                      <span>💡 Klik een groep om de evolutie te bekijken!</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-auto p-1 text-white hover:bg-white/20"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedGroupId(null);
                        }}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                </CardHeader>
                <CardContent className="p-0">
                  <div className="max-h-80 overflow-y-auto">
                    {sortedGroups.slice(0, 10).map((group, index) => {
                      const isSelected = group.id === selectedGroupId;
                      return (
                        <div 
                          key={group.id} 
                          onClick={() => handleGroupSelect(group.id)}
                          className={`flex items-center justify-between p-4 border-b hover:bg-gray-50 transition-all duration-200 cursor-pointer ${
                            isSelected ? 'ring-2 ring-purple-400 bg-purple-50 transform scale-[1.02]' : ''
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-lg transition-all duration-200 ${
                              index === 0 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                              index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-600' :
                              index === 2 ? 'bg-gradient-to-r from-orange-400 to-orange-600' :
                              isSelected ? 'bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg' :
                              'bg-gradient-to-r from-blue-400 to-blue-600'
                            } ${isSelected ? 'animate-pulse' : ''}`}>
                              {index < 3 ? (
                                index === 0 ? '👑' : index === 1 ? '🥈' : '🥉'
                              ) : (
                                index + 1
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-2xl">{group.emoji}</span>
                              <div>
                                <p className={`font-medium transition-colors ${isSelected ? 'text-purple-900' : ''}`}>
                                  {group.name}
                                </p>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <span>Level {group.level}</span>
                                  <span>•</span>
                                  <span className="flex items-center gap-1">
                                    <Star className="w-3 h-3 text-yellow-500" />
                                    {group.xp} XP
                                  </span>
                                  {group.streak > 0 && (
                                    <>
                                      <span>•</span>
                                      <span className="flex items-center gap-1">
                                        <Flame className="w-3 h-3 text-orange-500" />
                                        {group.streak}
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg">{group.normalizedScore.toFixed(1)}</p>
                            <div className="flex gap-1 mt-1">
                              {group.badges.map((badge, badgeIndex) => (
                                <span key={badgeIndex} className="text-sm">{badge}</span>
                              ))}
                            </div>
                            <Badge variant="outline" className={`text-xs mt-1 ${isSelected ? 'border-purple-300 text-purple-700' : ''}`}>
                              {Math.round(group.completeness * 100)}% complete
                            </Badge>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Performance Evolution Chart - Nu met highlighting en compacter detail panel */}
              <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
                <CardHeader className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    📈 Performance Evolution
                  </CardTitle>
                  <p className="text-sm opacity-90">
                    Top 5 teams over 8 dagen
                  </p>
                  {selectedGroup && (
                    <div className="mt-2 text-sm bg-white bg-opacity-20 rounded px-2 py-1 flex items-center justify-between">
                      <span>🎯 Focus: {selectedGroup.emoji} {selectedGroup.name}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-auto p-1 text-white hover:bg-white/20"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedGroupId(null);
                        }}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                </CardHeader>
                <CardContent className="p-6">
                  <div className="relative">
                    <ResponsiveContainer width="100%" height={280}>
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="day" stroke="#666" />
                        <YAxis domain={[4, 10]} stroke="#666" />
                        <Tooltip 
                          contentStyle={{ 
                            background: 'rgba(255, 255, 255, 0.95)', 
                            border: 'none', 
                            borderRadius: '12px',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                          }}
                          labelFormatter={(label) => `📅 ${label}`}
                          formatter={(value: any, name: string) => [
                            `${value.toFixed(1)} 📊`,
                            selectedGroup?.name === name ? `${selectedGroup.emoji} ${name} (Geselecteerd)` : name
                          ]}
                        />
                        {sortedGroups.slice(0, 5).map((group, index) => {
                          const isSelected = group.id === selectedGroupId;
                          return (
                            <Line 
                              key={group.id}
                              type="monotone" 
                              dataKey={group.name} 
                              stroke={
                                isSelected 
                                  ? '#8b5cf6' // Purple voor geselecteerde
                                  : `hsl(${index * 72}, 70%, 50%)`
                              }
                              strokeWidth={isSelected ? 6 : 3}
                              dot={{ 
                                fill: isSelected ? '#8b5cf6' : `hsl(${index * 72}, 70%, 50%)`, 
                                strokeWidth: 2, 
                                r: isSelected ? 8 : 5,
                                opacity: isSelected || !selectedGroupId ? 1 : 0.3
                              }}
                              activeDot={{ 
                                r: isSelected ? 12 : 8, 
                                stroke: isSelected ? '#8b5cf6' : `hsl(${index * 72}, 70%, 50%)`, 
                                strokeWidth: 3,
                                fill: '#fff'
                              }}
                              opacity={isSelected || !selectedGroupId ? 1 : 0.3}
                            />
                          );
                        })}
                      </LineChart>
                    </ResponsiveContainer>

                    {/* Compact floating detail panel */}
                    {selectedGroup && (
                      <div className="absolute top-2 right-2 bg-white border border-purple-200 rounded-lg shadow-lg p-3 min-w-[200px] max-w-[280px] z-10">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1">
                            <span className="text-sm">{selectedGroup.emoji}</span>
                            <span className="text-sm font-medium text-purple-900">{selectedGroup.name}</span>
                          </div>
                          <Badge className="bg-purple-100 text-purple-800 text-xs">#{sortedGroups.findIndex(g => g.id === selectedGroup.id) + 1}</Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                          <div className="bg-gray-50 rounded p-1">
                            <div className="text-muted-foreground">Start</div>
                            <div className="font-medium">{selectedGroup.dailyScores[0].toFixed(1)}</div>
                          </div>
                          <div className="bg-gray-50 rounded p-1">
                            <div className="text-muted-foreground">Nu</div>
                            <div className="font-medium">{selectedGroup.dailyScores[7].toFixed(1)}</div>
                          </div>
                          <div className="bg-green-50 rounded p-1">
                            <div className="text-muted-foreground">Groei</div>
                            <div className="font-medium text-green-600">
                              +{(selectedGroup.dailyScores[7] - selectedGroup.dailyScores[0]).toFixed(1)}
                            </div>
                          </div>
                          <div className="bg-orange-50 rounded p-1">
                            <div className="text-muted-foreground">Streak</div>
                            <div className="font-medium flex items-center gap-1">
                              {selectedGroup.streak} <Flame className="w-3 h-3 text-orange-500" />
                            </div>
                          </div>
                        </div>
                        <div className="pt-2 border-t border-gray-200">
                          <div className="text-xs text-muted-foreground mb-1">Teamleden:</div>
                          <div className="flex gap-1 flex-wrap">
                            {selectedGroup.members.map(memberId => {
                              const student = mockStudents.find(s => s.id === memberId);
                              return student ? (
                                <div key={memberId} className="flex items-center gap-1 text-xs bg-gray-100 rounded px-1 py-0.5">
                                  <span>{student.avatar}</span>
                                  <span className="text-xs">{student.name.split(' ')[0]}</span>
                                </div>
                              ) : null;
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Student Highlights */}
              <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
                <CardHeader className="bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    🌟 Student Spotlights
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-green-800 mb-3 flex items-center gap-2">
                        <Crown className="w-4 h-4" />
                        🏆 Hall of Fame
                      </h4>
                      <div className="space-y-2">
                        {topPerformers.slice(0, 3).map((student, index) => (
                          <div key={student.id} className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{student.avatar}</span>
                              <div>
                                <span className="text-sm font-medium">{student.name}</span>
                                <div className="text-xs text-muted-foreground">Level {student.level}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className="bg-green-100 text-green-800 border-0">
                                {student.averageScore.toFixed(1)}
                              </Badge>
                              {index === 0 && <span>👑</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-orange-800 mb-3 flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        🎯 Needs Support
                      </h4>
                      <div className="space-y-2">
                        {needsAttention.map(student => (
                          <div key={student.id} className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-200">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{student.avatar}</span>
                              <span className="text-sm font-medium">{student.name}</span>
                            </div>
                            <Badge className="bg-orange-100 text-orange-800 border-0">
                              {student.averageScore.toFixed(1)}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Mission Control */}
              <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
                <CardHeader className="bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    🚨 Mission Control
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    {almostClosing.length > 0 && (
                      <div>
                        <h4 className="font-medium text-yellow-800 mb-2 flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          ⏰ Urgent Quests ({almostClosing.length})
                        </h4>
                        {almostClosing.map(assignment => (
                          <div key={assignment.id} className="p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                            <div className="text-sm font-medium">{assignment.title}</div>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className={getDifficultyColor(assignment.difficulty)}>
                                {assignment.difficulty}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {assignment.xpReward} XP
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {overdue.length > 0 && (
                      <div>
                        <h4 className="font-medium text-red-800 mb-2 flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4" />
                          💀 Failed Quests ({overdue.length})
                        </h4>
                        {overdue.map(assignment => (
                          <div key={assignment.id} className="p-3 bg-gradient-to-r from-red-50 to-pink-50 rounded-lg border border-red-200">
                            <div className="text-sm font-medium">{assignment.title}</div>
                            <div className="text-xs text-red-600 mt-1">Recovery mission needed</div>
                          </div>
                        ))}
                      </div>
                    )}

                    {missing.length > 0 && (
                      <div>
                        <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          📋 Missing Submissions
                        </h4>
                        {missing.map(assignment => (
                          <div key={assignment.id} className="p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                            <div className="text-sm font-medium">{assignment.title}</div>
                            <Progress 
                              value={(assignment.submissionCount / assignment.totalGroups) * 100} 
                              className="mt-2 h-2"
                            />
                            <div className="text-xs text-muted-foreground mt-1">
                              {assignment.submissionCount}/{assignment.totalGroups} teams submitted
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Activity Feed */}
              <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
                <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="w-5 h-5" />
                    📡 Live Activity Feed
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {mockUploads.slice(0, 6).map(upload => {
                      const group = mockGroups.find(g => g.id === upload.groupId);
                      const assignment = mockAssignments.find(a => a.id === upload.assignmentId);
                      return (
                        <div key={upload.id} className="flex items-center gap-3 p-3 border border-purple-100 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50">
                          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm">
                            📁
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{upload.fileName}</p>
                            <p className="text-xs text-muted-foreground">
                              {group?.emoji} {group?.name} • {assignment?.title}
                            </p>
                            <p className="text-xs text-purple-600 font-medium">
                              door {upload.studentName}
                            </p>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {upload.uploadedAt.toLocaleTimeString('nl-NL', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="assessment">
            <AssessmentPanel />
          </TabsContent>

          <TabsContent value="management">
            <ManagementPanel />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}