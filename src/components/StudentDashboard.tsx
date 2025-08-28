import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  Trophy, 
  TrendingUp, 
  User, 
  LogOut,
  Award,
  Target,
  Zap,
  Star,
  Crown,
  Flame,
  Gift,
  X,
  Info
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { fetchGroups, fetchStudents } from '../lib/api';
import { getLevelColor } from '../lib/mockData';

interface StudentDashboardProps {
  onLogout: () => void;
}

export function StudentDashboard({ onLogout }: StudentDashboardProps) {
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);

  React.useEffect(() => {
    fetchStudents().then(setStudents);
    fetchGroups().then(setGroups);
  }, []);

  // For demo, pick the first student as current
  const currentStudentId = students.length > 0 ? students[0].id : null;
  const currentStudent = students.find(s => s.id === currentStudentId);
  const currentGroup = groups.find(g => g.members.includes(currentStudentId));

  const sortedGroups = [...groups].sort((a, b) => b.normalizedScore - a.normalizedScore);
  const currentGroupPosition = currentGroup ? sortedGroups.findIndex(g => g.id === currentGroup.id) + 1 : null;

  // Data voor 8-dagen chart
  const chartData = Array.from({ length: 8 }, (_, index) => {
    const day = index + 1;
    const dayData: any = { day: `Dag ${day}` };
    
    sortedGroups.slice(0, 5).forEach((group, groupIndex) => {
      dayData[group.name] = group.dailyScores[index];
    });
    
    return dayData;
  });

  // Professionaliteitstrend voor student
  const professionalityTrend = [
    { category: 'Communicatie', score: currentStudent?.professionalityScores.communication || 0, trend: 'up', color: 'bg-blue-500' },
    { category: 'Taakverdeling', score: currentStudent?.professionalityScores.taskDivision || 0, trend: 'up', color: 'bg-green-500' },
    { category: 'Documentatie', score: currentStudent?.professionalityScores.documentation || 0, trend: 'stable', color: 'bg-purple-500' },
    { category: 'Professionaliteit', score: currentStudent?.professionalityScores.professionalism || 0, trend: 'up', color: 'bg-orange-500' }
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down':
        return <TrendingUp className="w-4 h-4 text-red-600 rotate-180" />;
      default:
        return <div className="w-4 h-4 bg-gray-400 rounded-full" />;
    }
  };

  const getPositionIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Award className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-orange-500" />;
      default:
        return <Target className="w-6 h-6 text-blue-500" />;
    }
  };

  const getXPToNextLevel = (currentXP: number, level: number) => {
    const xpNeeded = level * 250; // 250 XP per level
    return xpNeeded - (currentXP % 250);
  };

  // Handler voor groep selectie
  const handleGroupSelect = (groupId: string) => {
    setSelectedGroupId(selectedGroupId === groupId ? null : groupId);
  };

  // Get selected group data
  const selectedGroup = selectedGroupId ? groups.find((g: any) => g.id === selectedGroupId) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50">
      {/* Animated Header */}
      <div className="border-b bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white shadow-xl">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-2xl backdrop-blur-sm">
              {currentStudent?.avatar}
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">
                Welkom terug, {currentStudent?.name}! 🎉
              </h1>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1">
                  <Zap className="w-4 h-4 text-yellow-300" />
                  <span className="text-yellow-200">Level {currentStudent?.level}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-300" />
                  <span className="text-yellow-200">{currentStudent?.xp} XP</span>
                </div>
                <div className="flex items-center gap-1">
                  <Flame className="w-4 h-4 text-orange-300" />
                  <span className="text-orange-200">{currentStudent?.streak} dag streak</span>
                </div>
              </div>
            </div>
          </div>
          <Button variant="outline" className="bg-white bg-opacity-20 border-white border-opacity-30 text-white hover:bg-white hover:bg-opacity-30" onClick={onLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Uitloggen
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Gamified Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Jouw Rang</CardTitle>
              {currentGroupPosition !== null && currentGroupPosition !== undefined ? getPositionIcon(currentGroupPosition) : null}
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">#{currentGroupPosition}</div>
              <p className="text-xs opacity-90 mt-1">
                van {sortedGroups.length} groepen
              </p>
              <div className="mt-2">
                <Badge className="bg-white bg-opacity-20 text-white border-0">
                  {currentGroup?.emoji} {currentGroup?.name}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-pink-500 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Level Progress</CardTitle>
              <Zap className="h-5 w-5" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">Level {currentStudent?.level}</div>
              <div className="mt-2">
                <Progress 
                  value={(currentStudent?.xp % 250) / 250 * 100} 
                  className="h-2 bg-white bg-opacity-20" 
                />
                <p className="text-xs opacity-90 mt-1">
                  {getXPToNextLevel(currentStudent?.xp || 0, currentStudent?.level || 1)} XP to level up
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-emerald-500 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Groepsscore</CardTitle>
              <Trophy className="h-5 w-5" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{currentGroup?.normalizedScore.toFixed(1)}</div>
              <p className="text-xs opacity-90 mt-1">
                Genormaliseerde score
              </p>
              <div className="flex gap-1 mt-2">
                {currentGroup?.badges.map((badge, index) => (
                  <span key={index} className="text-lg">{badge}</span>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Achievements</CardTitle>
              <Gift className="h-5 w-5" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{currentStudent?.achievements.length}</div>
              <p className="text-xs opacity-90 mt-1">
                Behaalde prestaties
              </p>
              <div className="flex flex-wrap gap-1 mt-2">
                {currentStudent?.achievements.slice(0, 4).map((achievement, index) => (
                  <span key={index} className="text-lg">{achievement}</span>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Epic Leaderboard met alle 15 groepen - Nu met click handlers */}
          <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                🏆 Ultimate Leaderboard
              </CardTitle>
              <p className="text-sm opacity-90">
                Alle groepen gerangschikt op prestaties
              </p>
              {selectedGroup && (
                <div className="mt-2 text-sm bg-white bg-opacity-20 rounded px-2 py-1 flex items-center justify-between">
                  <span>💡 Bekijk {selectedGroup.emoji} {selectedGroup.name} in de chart!</span>
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
              <div className="max-h-96 overflow-y-auto">
                {sortedGroups.map((group, index) => {
                  const isCurrentGroup = group.id === currentGroup?.id;
                  const isSelected = group.id === selectedGroupId;
                  return (
                    <div 
                      key={group.id} 
                      onClick={() => handleGroupSelect(group.id)}
                      className={`flex items-center justify-between p-4 border-b hover:bg-gray-50 transition-all duration-200 cursor-pointer ${
                        isCurrentGroup ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200' : ''
                      } ${
                        isSelected ? 'ring-2 ring-purple-400 bg-purple-50 transform scale-[1.02]' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold transition-all duration-200 ${
                          index === 0 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 shadow-lg' :
                          index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-600 shadow-lg' :
                          index === 2 ? 'bg-gradient-to-r from-orange-400 to-orange-600 shadow-lg' :
                          isCurrentGroup ? 'bg-gradient-to-r from-blue-500 to-purple-500' :
                          isSelected ? 'bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg' :
                          'bg-gradient-to-r from-gray-300 to-gray-400'
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
                            <p className={`font-medium transition-colors ${
                              isCurrentGroup ? 'text-blue-900' : isSelected ? 'text-purple-900' : ''
                            }`}>
                              {group.name}
                              {isCurrentGroup && <span className="ml-2 text-sm text-blue-600 font-normal">(Jouw team! 🎯)</span>}
                            </p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>Level {group.level}</span>
                              <span>•</span>
                              <span>{group.xp} XP</span>
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
                          {Math.round(group.completeness * 100)}% compleet
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* 8-Dagen Progress Chart - Nu met highlighting en compacter detail panel */}
          <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
            <CardHeader className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                📈 8-Dagen Evolutie
              </CardTitle>
              <p className="text-sm opacity-90">
                Prestaties van top groepen over tijd
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
                      const isCurrentGroup = group.id === currentGroup?.id;
                      return (
                        <Line 
                          key={group.id}
                          type="monotone" 
                          dataKey={group.name} 
                          stroke={
                            isSelected 
                              ? '#8b5cf6' // Purple voor geselecteerde
                              : isCurrentGroup 
                              ? '#3b82f6' // Blue voor huidige groep
                              : `hsl(${index * 72}, 70%, 50%)`
                          }
                          strokeWidth={
                            isSelected ? 6 : // Extra dik voor geselecteerde
                            isCurrentGroup ? 4 : // Dik voor huidige groep
                            2 // Normaal voor anderen
                          }
                          dot={{ 
                            fill: isSelected ? '#8b5cf6' : isCurrentGroup ? '#3b82f6' : `hsl(${index * 72}, 70%, 50%)`, 
                            strokeWidth: 2, 
                            r: isSelected ? 8 : isCurrentGroup ? 6 : 4,
                            opacity: isSelected || !selectedGroupId ? 1 : 0.3 // Fade niet-geselecteerde lijnen
                          }}
                          activeDot={{ 
                            r: isSelected ? 12 : 8, 
                            stroke: isSelected ? '#8b5cf6' : isCurrentGroup ? '#3b82f6' : `hsl(${index * 72}, 70%, 50%)`, 
                            strokeWidth: 3,
                            fill: '#fff'
                          }}
                          opacity={isSelected || !selectedGroupId ? 1 : 0.3} // Fade niet-geselecteerde lijnen
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
                    <div className="grid grid-cols-2 gap-2 text-xs">
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
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Persoonlijke Skill Progress */}
        <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
          <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              🎯 Jouw Skill Development
            </CardTitle>
            <p className="text-sm opacity-90">
              Persoonlijke groei per vaardigheid
            </p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {professionalityTrend.map(item => (
                <div key={item.category} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full ${item.color}`}></div>
                      <span className="font-medium">{item.category}</span>
                      {getTrendIcon(item.trend)}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg">{item.score.toFixed(1)}</span>
                      <div className={`px-2 py-1 rounded text-xs font-medium ${item.color} text-white`}>
                        {item.score >= 8.5 ? 'Excellent' : item.score >= 7.5 ? 'Great' : item.score >= 6.5 ? 'Good' : 'Needs Work'}
                      </div>
                    </div>
                  </div>
                  <div className="relative">
                    <Progress value={item.score * 10} className="h-3" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 rounded-full"></div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {item.score >= 8.5 && "🔥 Je bent een expert!"}
                    {item.score >= 7.5 && item.score < 8.5 && "⭐ Bijna perfect!"}
                    {item.score >= 6.5 && item.score < 7.5 && "👍 Goed bezig!"}
                    {item.score < 6.5 && "💪 Blijf oefenen!"}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 p-6 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl border border-purple-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Star className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-purple-900">Daily Quest Completed! 🎉</span>
              </div>
              <p className="text-sm text-purple-800">
                Geweldig werk! Je hebt vandaag je documenten bijgewerkt en teamcommunicatie verbeterd. 
                Blijf zo doorgaan voor extra XP bonussen! 
              </p>
              <div className="flex gap-2 mt-3">
                <Badge className="bg-purple-500 text-white">+50 XP</Badge>
                <Badge className="bg-pink-500 text-white">Streak Bonus</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quest & Assignments */}
        <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
          <CardHeader className="bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              🎮 Active Quests
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border-2 border-green-200 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white">✓</div>
                  <div>
                    <p className="font-medium">Webapplicatie Prototype</p>
                    <p className="text-sm text-muted-foreground">Status: Ingeleverd • Gedeeltelijk beoordeeld</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-100 text-green-800">Quest Complete</Badge>
                  <span className="text-lg">🏆</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 border-2 border-yellow-200 rounded-xl bg-gradient-to-r from-yellow-50 to-orange-50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white animate-pulse">⏰</div>
                  <div>
                    <p className="font-medium">Database Design Document</p>
                    <p className="text-sm text-muted-foreground">Deadline: 30 augustus • Nog 3 dagen</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-yellow-100 text-yellow-800">Active Quest</Badge>
                  <span className="text-lg">⚡</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 border-2 border-red-200 rounded-xl bg-gradient-to-r from-red-50 to-pink-50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white">!</div>
                  <div>
                    <p className="font-medium">Testing & Documentatie</p>
                    <p className="text-sm text-muted-foreground">Deadline: 25 augustus • Te laat! Deadline gemist</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-red-100 text-red-800">Failed Quest</Badge>
                  <span className="text-lg">💀</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}