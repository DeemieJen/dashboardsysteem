import React, { useState } from 'react';
import { CheckCircle, Clock, AlertCircle, FileText, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Progress } from './ui/progress';
import {
  mockAssignments,
  mockGroups,
  mockStudents,
  mockSubmissions,
  getStatusColor,
  getLevelColor
} from '../lib/mockData';


export default function AssessmentPanel() {
  // Use local state and mock data only
  const [assignments, setAssignments] = useState(mockAssignments);
  const [groups, setGroups] = useState(mockGroups);
  const [students, setStudents] = useState(mockStudents);
  const [submissions, setSubmissions] = useState(mockSubmissions);
  const [selectedAssignment, setSelectedAssignment] = useState<string>('');
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [assessmentData, setAssessmentData] = useState<Record<string, Record<string, number>>>({});
  const [feedback, setFeedback] = useState<string>('');
  const [dragged, setDragged] = useState<{type: string, idx: number}|null>(null);
  const [openDialog, setOpenDialog] = useState<any>(null);

  const assignment = assignments.find(a => a.id === selectedAssignment);
  const group = groups.find(g => g.id === selectedGroup);
  const groupMembers = group ? students.filter(s => group.members.includes(s.id)) : [];
  const submission = submissions.find(s => s.assignmentId === selectedAssignment && s.groupId === selectedGroup);

  const assessmentCategories = [
    { id: 'communication', label: 'Communicatie', description: 'Duidelijkheid en effectiviteit van communicatie' },
    { id: 'taskDivision', label: 'Taakverdeling', description: 'Eerlijke verdeling en uitvoering van taken' },
    { id: 'documentation', label: 'Documentatie', description: 'Kwaliteit en volledigheid van documentatie' },
    { id: 'professionalism', label: 'Professionaliteit', description: 'Professionele houding en werkwijze' }
  ];

  const handleScoreChange = (category: string, studentId: string, score: number) => {
    setAssessmentData(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [studentId]: score
      }
    }));
  };

  const getAssessmentProgress = () => {
    const totalFields = (assessmentCategories?.length || 0) * (groupMembers?.length || 0);
    const filledFields = Object.values(assessmentData).reduce(
      (sum: number, category) => sum + Object.keys(category as Record<string, number>).length,
      0
    ) as number;
    return totalFields > 0 ? (Number(filledFields) / Number(totalFields)) * 100 : 0;
  };

  // Utility to safely count filled fields in assessmentData
  function getFilledFieldsCount(obj: Record<string, any>) {
    let count = 0;
    for (const key in obj) {
      if (obj[key] !== undefined && obj[key] !== null && obj[key] !== "") {
        count++;
      }
    }
    return count;
  }

  const getAssessmentStatus = () => {
    const progress = getAssessmentProgress();
    if (progress === 0) return 'Niet beoordeeld';
    if (progress === 100) return 'Beoordeeld';
    return 'Gedeeltelijk beoordeeld';
  };

  // Gamified move (drag-and-drop) for submissions
  function reorder(list: any[], startIndex: number, endIndex: number) {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  }

  const handleDelete = (type: string, id: string) => {
    if (type === 'submission') setSubmissions(s => s.filter(x => x.id !== id));
  };
  const handleEdit = (type: string, item: any) => {
    setOpenDialog({ type, mode: 'edit', data: item });
  };
  const handleMove = (type: string, from: number, to: number) => {
    if (type === 'submission') setSubmissions(s => reorder(s, from, to));
  };
  const onDragStart = (type: string, idx: number) => setDragged({ type, idx });
  const onDragOver = (e: React.DragEvent) => e.preventDefault();
  const onDrop = (type: string, idx: number) => {
    if (dragged && dragged.type === type && dragged.idx !== idx) {
      handleMove(type, dragged.idx, idx);
    }
    setDragged(null);
  };

  const saveAssessment = () => {
    // Local only: show toast
    alert('Beoordeling opgeslagen!');
  };

  return (
    <div className="space-y-6">
      {/* Selectie Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gradient bg-gradient-to-r from-pink-500 via-yellow-400 to-purple-600 bg-clip-text text-transparent">Beoordeling Selecteren</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="assignment">Opdracht</Label>
              <Select value={selectedAssignment} onValueChange={setSelectedAssignment}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecteer een opdracht" />
                </SelectTrigger>
                <SelectContent>
                  {assignments.map((assignment: any) => (
                    <SelectItem key={assignment.id} value={assignment.id}>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{assignment.title}</span>
                        <Badge className={`text-xs ${getStatusColor(assignment.status)}`}>{assignment.status}</Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="group">Groep</Label>
              <Select value={selectedGroup} onValueChange={setSelectedGroup} disabled={!selectedAssignment}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecteer een groep" />
                </SelectTrigger>
                <SelectContent>
                  {groups.map((group: any) => {
                    const hasSubmission = submissions.some((s: any) => s.assignmentId === selectedAssignment && s.groupId === group.id);
                    return (
                      <SelectItem key={group.id} value={group.id} disabled={!hasSubmission}>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-lg">{group.emoji} {group.name}</span>
                          {hasSubmission ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <Clock className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Beoordelingspaneel */}
      {selectedAssignment && selectedGroup && (
        <div className="space-y-6">
          {/* Voortgang en Status */}
          <Card className="bg-gradient-to-br from-yellow-100 to-pink-100 border-yellow-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold">{assignment?.title} - <span className="text-lg">{group?.emoji} {group?.name}</span></CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">{groupMembers.length} studenten te beoordelen</p>
                </div>
                <Badge className={getStatusColor(getAssessmentStatus())}>{getAssessmentStatus()}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Voortgang beoordeling</span>
                  <span>{Math.round(getAssessmentProgress())}%</span>
                </div>
                <Progress value={getAssessmentProgress()} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Beoordelingsformulier */}
          <Card className="bg-gradient-to-br from-purple-100 to-blue-100 border-purple-200">
            <CardHeader>
              <CardTitle>Individuele Beoordelingen</CardTitle>
              <p className="text-sm text-muted-foreground">Beoordeel elke student per categorie (1-10)</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {assessmentCategories.map(category => (
                  <div key={category.id} className="space-y-4">
                    <div>
                      <h4 className="font-medium">{category.label}</h4>
                      <p className="text-sm text-muted-foreground">{category.description}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {groupMembers.map(student => (
                        <div key={student.id} className={`flex items-center gap-3 p-3 border rounded-lg bg-gradient-to-r from-white to-green-50 ${getLevelColor(student.level)}`}>
                          <span className="text-2xl mr-2">{student.avatar}</span>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{student.name}</p>
                            <p className="text-xs text-muted-foreground">Gemiddeld: {student.averageScore.toFixed(1)}</p>
                          </div>
                          <div className="w-20">
                            <Input
                              type="number"
                              min="1"
                              max="10"
                              step="0.1"
                              placeholder="Score"
                              value={assessmentData[category.id]?.[student.id] || ''}
                              onChange={(e) => handleScoreChange(category.id, student.id, parseFloat(e.target.value))}
                              className="text-center"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Feedback */}
          <Card className="bg-gradient-to-br from-green-100 to-yellow-100 border-green-200">
            <CardHeader>
              <CardTitle>Groepsfeedback</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="feedback">Algemene feedback voor de groep</Label>
                  <Textarea
                    id="feedback"
                    placeholder="Voer hier uw feedback in..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={saveAssessment} className="flex-1 bg-gradient-to-r from-pink-400 to-yellow-400 text-white font-bold">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Beoordeling Opslaan
                  </Button>
                  <Button variant="outline">
                    <FileText className="w-4 h-4 mr-2" />
                    Export Rapport
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Overzicht alle beoordelingen (fully gamified) */}
      <Card className="bg-gradient-to-br from-blue-50 to-purple-100 border-blue-200">
        <CardHeader>
          <CardTitle className="text-2xl font-extrabold text-gradient bg-gradient-to-r from-blue-500 via-purple-400 to-pink-500 bg-clip-text text-transparent drop-shadow-lg flex items-center gap-2">🏅 Beoordelingen Overzicht</CardTitle>
          <p className="text-sm text-muted-foreground">Status, XP, badges en voortgang van alle inzendingen</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {submissions.map((submission: any, i: number) => {
              const assignment = assignments.find((a: any) => a.id === submission.assignmentId);
              const group = groups.find((g: any) => g.id === submission.groupId);
              if (!group) return null;
              return (
                <div
                  key={submission.id}
                  className={`flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border-2 rounded-xl bg-gradient-to-r from-blue-100 to-purple-100 shadow-md cursor-move hover:scale-[1.02] transition-transform duration-150`}
                  draggable
                  onDragStart={() => onDragStart('submission', i)}
                  onDragOver={onDragOver}
                  onDrop={() => onDrop('submission', i)}
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <span className="text-3xl md:text-4xl drop-shadow-sm">{group.emoji}</span>
                    <div className="flex flex-col min-w-0">
                      <span className="font-bold text-lg truncate">{group.name}</span>
                      <span className="text-xs text-gray-500 truncate">{assignment?.title} • {new Date(submission.submittedAt).toLocaleDateString('nl-NL')}</span>
                      <div className="flex gap-2 mt-1 flex-wrap">
                        <Badge variant="secondary">Lvl {group.level}</Badge>
                        <Badge variant="outline">XP: {group.xp}</Badge>
                        <Badge variant="outline">Streak: {group.streak}🔥</Badge>
                        {group.badges.map(b => <span key={b} className="text-lg" title="Badge">{b}</span>)}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 min-w-[120px]">
                    <Badge className={getStatusColor(submission.status)}>{submission.status}</Badge>
                    <div className="w-28">
                      <Progress value={Math.min(100, group.completeness * 100)} className="h-2 bg-gradient-to-r from-green-200 to-green-400" />
                      <span className="text-xs text-gray-500">Voltooid: {Math.round(group.completeness * 100)}%</span>
                    </div>
                    <div className="flex gap-1 mt-1">
                      <Button size="icon" variant="ghost" onClick={() => handleEdit('submission', submission)}><FileText className="w-4 h-4" /></Button>
                      <Button size="icon" variant="ghost" onClick={() => handleDelete('submission', submission.id)}><AlertCircle className="w-4 h-4 text-red-500" /></Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Dialogs for Edit (placeholder) */}
      {openDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 min-w-[300px]">
            <h2 className="text-xl font-bold mb-2">{openDialog.mode === 'edit' ? 'Bewerken' : 'Toevoegen'} {openDialog.type}</h2>
            <p className="mb-4 text-gray-600">Deze functie is nog niet volledig geïmplementeerd.</p>
            <Button onClick={() => setOpenDialog(null)}>Sluiten</Button>
          </div>
        </div>
      )}
    </div>
  );
}