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
import { fetchGroups, fetchStudents, fetchAssignments, fetchSubmissions } from '../lib/api';
import { getStatusColor } from '../lib/mockData';

export default function AssessmentPanel() {



  const [selectedAssignment, setSelectedAssignment] = useState<string>('');
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [assessmentData, setAssessmentData] = useState<Record<string, Record<string, number>>>({});
  const [feedback, setFeedback] = useState<string>('');
  const [assignments, setAssignments] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);

  React.useEffect(() => {
    fetchAssignments().then(setAssignments);
    fetchGroups().then(setGroups);
    fetchStudents().then(setStudents);
    fetchSubmissions().then(setSubmissions);
  }, []);

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

  const saveAssessment = () => {
    // Hier zou normaal de beoordeling worden opgeslagen
    alert('Beoordeling opgeslagen!');
  };

  return (
    <div className="space-y-6">
      {/* Selectie Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Beoordeling Selecteren</CardTitle>
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
                        <span>{assignment.title}</span>
                        <Badge className={`text-xs ${getStatusColor(assignment.status)}`}>
                          {assignment.status}
                        </Badge>
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
                      const hasSubmission = submissions.some((s: any) => 
                        s.assignmentId === selectedAssignment && s.groupId === group.id
                      );
                      return (
                        <SelectItem key={group.id} value={group.id} disabled={!hasSubmission}>
                          <div className="flex items-center gap-2">
                            <span>{group.name}</span>
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
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{assignment?.title} - {group?.name}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {groupMembers.length} studenten te beoordelen
                  </p>
                </div>
                <Badge className={getStatusColor(getAssessmentStatus())}>
                  {getAssessmentStatus()}
                </Badge>
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
          <Card>
            <CardHeader>
              <CardTitle>Individuele Beoordelingen</CardTitle>
              <p className="text-sm text-muted-foreground">
                Beoordeel elke student per categorie (1-10)
              </p>
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
                        <div key={student.id} className="flex items-center gap-3 p-3 border rounded-lg">
                          <User className="w-5 h-5 text-muted-foreground" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">{student.name}</p>
                            <p className="text-xs text-muted-foreground">
                              Gemiddeld: {student.averageScore.toFixed(1)}
                            </p>
                          </div>
                          <div className="w-20">
                            <Input
                              type="number"
                              min="1"
                              max="10"
                              step="0.1"
                              placeholder="Score"
                              value={assessmentData[category.id]?.[student.id] || ''}
                              onChange={(e) => handleScoreChange(
                                category.id, 
                                student.id, 
                                parseFloat(e.target.value)
                              )}
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
          <Card>
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
                  <Button onClick={saveAssessment} className="flex-1">
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

      {/* Overzicht alle beoordelingen */}
      <Card>
        <CardHeader>
          <CardTitle>Beoordelingen Overzicht</CardTitle>
          <p className="text-sm text-muted-foreground">
            Status van alle inzendingen
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {submissions.map((submission: any) => {
              const assignment = assignments.find((a: any) => a.id === submission.assignmentId);
              const group = groups.find((g: any) => g.id === submission.groupId);
              return (
                <div key={submission.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{assignment?.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {group?.name} • Ingeleverd: {new Date(submission.submittedAt).toLocaleDateString('nl-NL')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(submission.status)}>
                      {submission.status}
                    </Badge>
                    <Button size="sm" variant="outline">
                      Bekijk
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}