import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Lock, 
  Unlock, 
  Download, 
  Upload, 
  RotateCcw,
  Database,
  Users,
  Calendar,
  Settings
} from 'lucide-react';
import { mockAssignments, mockGroups, getStatusColor } from '../lib/mockData';

export function ManagementPanel() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedAssignments, setSelectedAssignments] = useState<string[]>([]);
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    dueDate: '',
    groups: [] as string[]
  });

  const handleAssignmentSelect = (assignmentId: string) => {
    setSelectedAssignments(prev => 
      prev.includes(assignmentId)
        ? prev.filter(id => id !== assignmentId)
        : [...prev, assignmentId]
    );
  };

  const bulkAssignToGroups = () => {
    if (selectedAssignments.length === 0) return;
    alert(`${selectedAssignments.length} opdrachten toegewezen aan geselecteerde groepen`);
  };

  const toggleAssignmentStatus = (assignmentId: string) => {
    const assignment = mockAssignments.find(a => a.id === assignmentId);
    if (!assignment) return;
    
    const newStatus = assignment.status === 'Gesloten' ? 'Open' : 'Gesloten';
    alert(`Opdracht "${assignment.title}" is nu ${newStatus.toLowerCase()}`);
  };

  const createAssignment = () => {
    if (!newAssignment.title || !newAssignment.dueDate) return;
    
    alert('Nieuwe opdracht aangemaakt!');
    setIsCreateDialogOpen(false);
    setNewAssignment({ title: '', description: '', dueDate: '', groups: [] });
  };

  const exportData = (type: string) => {
    alert(`${type} data wordt geëxporteerd...`);
  };

  const importData = () => {
    alert('Data import functionaliteit - hier zou een bestand upload interface komen');
  };

  const resetSystem = () => {
    if (confirm('Weet u zeker dat u het systeem wilt resetten? Alle data gaat verloren.')) {
      alert('Systeem wordt gereset...');
    }
  };

  const loadSeedData = () => {
    alert('Seed dataset wordt geladen...');
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="assignments" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="assignments">Opdrachten</TabsTrigger>
          <TabsTrigger value="groups">Groepen</TabsTrigger>
          <TabsTrigger value="data">Data Beheer</TabsTrigger>
        </TabsList>

        <TabsContent value="assignments" className="space-y-6">
          {/* Opdrachten Beheer */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Opdrachten Beheer</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Maak, bewerk en beheer opdrachten
                  </p>
                </div>
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Nieuwe Opdracht
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Nieuwe Opdracht Aanmaken</DialogTitle>
                      <DialogDescription>
                        Vul de details in voor de nieuwe opdracht
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="title">Titel</Label>
                        <Input
                          id="title"
                          value={newAssignment.title}
                          onChange={(e) => setNewAssignment(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="Opdracht titel"
                        />
                      </div>
                      <div>
                        <Label htmlFor="description">Beschrijving</Label>
                        <Textarea
                          id="description"
                          value={newAssignment.description}
                          onChange={(e) => setNewAssignment(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Opdracht beschrijving"
                        />
                      </div>
                      <div>
                        <Label htmlFor="dueDate">Inleverdatum</Label>
                        <Input
                          id="dueDate"
                          type="datetime-local"
                          value={newAssignment.dueDate}
                          onChange={(e) => setNewAssignment(prev => ({ ...prev, dueDate: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label>Toewijzen aan groepen</Label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {mockGroups.map(group => (
                            <label key={group.id} className="flex items-center space-x-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={newAssignment.groups.includes(group.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setNewAssignment(prev => ({ 
                                      ...prev, 
                                      groups: [...prev.groups, group.id] 
                                    }));
                                  } else {
                                    setNewAssignment(prev => ({ 
                                      ...prev, 
                                      groups: prev.groups.filter(id => id !== group.id) 
                                    }));
                                  }
                                }}
                              />
                              <span className="text-sm">{group.name}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2 pt-4">
                        <Button onClick={createAssignment} className="flex-1">
                          Opdracht Aanmaken
                        </Button>
                        <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                          Annuleren
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Bulk acties */}
                <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                  <span className="text-sm">Geselecteerd: {selectedAssignments.length}</span>
                  <Button size="sm" onClick={bulkAssignToGroups} disabled={selectedAssignments.length === 0}>
                    <Users className="w-4 h-4 mr-1" />
                    Toewijzen
                  </Button>
                </div>

                {/* Opdrachten lijst */}
                <div className="space-y-3">
                  {mockAssignments.map(assignment => (
                    <div key={assignment.id} className="flex items-center gap-3 p-4 border rounded-lg">
                      <input
                        type="checkbox"
                        checked={selectedAssignments.includes(assignment.id)}
                        onChange={() => handleAssignmentSelect(assignment.id)}
                      />
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{assignment.title}</h4>
                          <Badge className={getStatusColor(assignment.status)}>
                            {assignment.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {assignment.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {assignment.dueDate.toLocaleDateString('nl-NL')}
                          </span>
                          <span>
                            {assignment.submissionCount}/{assignment.totalGroups} ingeleverd
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => toggleAssignmentStatus(assignment.id)}
                        >
                          {assignment.status === 'Gesloten' ? 
                            <Unlock className="w-4 h-4" /> : 
                            <Lock className="w-4 h-4" />
                          }
                        </Button>
                        <Button size="sm" variant="outline" className="text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="groups" className="space-y-6">
          {/* Groepen Beheer */}
          <Card>
            <CardHeader>
              <CardTitle>Groepen Beheer</CardTitle>
              <p className="text-sm text-muted-foreground">
                Overzicht en beheer van alle groepen
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockGroups.map(group => (
                  <div key={group.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{group.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {group.members.length} leden • Score: {group.normalizedScore.toFixed(1)}
                      </p>
                      <div className="flex gap-1 mt-2">
                        <Badge variant="outline">
                          {Math.round(group.completeness * 100)}% volledig
                        </Badge>
                        <Badge variant="outline">
                          Kwaliteit: {group.quality.toFixed(1)}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-6">
          {/* Data Beheer */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Data Export</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Exporteer data voor backup of analyse
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button onClick={() => exportData('Studenten')} className="w-full justify-start">
                  <Download className="w-4 h-4 mr-2" />
                  Studenten Data
                </Button>
                <Button onClick={() => exportData('Beoordelingen')} className="w-full justify-start">
                  <Download className="w-4 h-4 mr-2" />
                  Beoordelingen
                </Button>
                <Button onClick={() => exportData('Opdrachten')} className="w-full justify-start">
                  <Download className="w-4 h-4 mr-2" />
                  Opdrachten
                </Button>
                <Button onClick={() => exportData('Alle')} className="w-full justify-start">
                  <Download className="w-4 h-4 mr-2" />
                  Volledige Database
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Operaties</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Import, reset en seed operaties
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button onClick={importData} className="w-full justify-start">
                  <Upload className="w-4 h-4 mr-2" />
                  Data Importeren
                </Button>
                <Button onClick={loadSeedData} className="w-full justify-start" variant="outline">
                  <Database className="w-4 h-4 mr-2" />
                  Seed Dataset Laden
                </Button>
                <Button onClick={resetSystem} className="w-full justify-start" variant="destructive">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Systeem Resetten
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Statistieken */}
          <Card>
            <CardHeader>
              <CardTitle>Systeem Statistieken</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 border rounded">
                  <div className="text-2xl font-bold text-blue-600">6</div>
                  <div className="text-sm text-muted-foreground">Studenten</div>
                </div>
                <div className="text-center p-4 border rounded">
                  <div className="text-2xl font-bold text-green-600">3</div>
                  <div className="text-sm text-muted-foreground">Groepen</div>
                </div>
                <div className="text-center p-4 border rounded">
                  <div className="text-2xl font-bold text-purple-600">3</div>
                  <div className="text-sm text-muted-foreground">Opdrachten</div>
                </div>
                <div className="text-center p-4 border rounded">
                  <div className="text-2xl font-bold text-orange-600">2</div>
                  <div className="text-sm text-muted-foreground">Beoordelingen</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}