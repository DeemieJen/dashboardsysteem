import React, { useState } from 'react';
import { TeacherDashboard } from './components/TeacherDashboard';
import { StudentDashboard } from './components/StudentDashboard';
import { Button } from './components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';

export default function App() {
  const [userRole, setUserRole] = useState<'teacher' | 'student' | null>(null);

  if (!userRole) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Onderwijsdashboard Login</CardTitle>
            <CardDescription>
              Selecteer uw rol om in te loggen
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={() => setUserRole('teacher')} 
              className="w-full"
              variant="default"
            >
              Inloggen als Docent
            </Button>
            <Button 
              onClick={() => setUserRole('student')} 
              className="w-full"
              variant="outline"
            >
              Inloggen als Student
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (userRole === 'teacher') {
    return <TeacherDashboard onLogout={() => setUserRole(null)} />;
  }

  return <StudentDashboard onLogout={() => setUserRole(null)} />;
}