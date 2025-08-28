import React, { useState, useRef } from 'react';
import Confetti from './components/Confetti';
import Typewriter from './components/Typewriter';
import ParallaxBackground from './components/ParallaxBackground';
import { TeacherDashboard } from './components/TeacherDashboard';
import { StudentDashboard } from './components/StudentDashboard';
import { Button } from './components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';

export default function App() {
  const [userRole, setUserRole] = useState<'teacher' | 'student' | null>(null);
  const [confetti, setConfetti] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
  };

  if (!userRole) {
    return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 p-2 sm:p-4">
        <Confetti trigger={confetti} />
        <ParallaxBackground />
        <audio ref={audioRef} src="/sounds/success.mp3" preload="auto" />
  <div className="relative w-full max-w-md sm:max-w-md animate-fadein-scale mx-2 sm:mx-0 scale-[1.32]">
          <div className="absolute -inset-1 rounded-2xl z-0 animate-gradient-border pointer-events-none" />
          <Card className="relative z-10 shadow-2xl border-0 bg-white/90 backdrop-blur-md">
            <CardHeader className="flex flex-col items-center gap-2">
              <span className="text-5xl mb-2 animate-float-wiggle" aria-hidden="true">🎮</span>
              <h1 className="text-xl sm:text-2xl font-extrabold text-black drop-shadow-sm">
                Welkom bij de projectweek!
              </h1>
              <CardDescription className="text-center text-sm sm:text-base text-gray-900 drop-shadow-sm">
                Kies je rol en begin je leeravontuur!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 flex flex-col items-center">
              <Button 
                aria-label="Inloggen als Docent"
                onClick={e => {
                  e.currentTarget.classList.remove('animate-bounce-once');
                  void e.currentTarget.offsetWidth;
                  e.currentTarget.classList.add('animate-bounce-once');
                  setConfetti(true);
                  playSound();
                  setTimeout(() => {
                    setUserRole('teacher');
                    setConfetti(false);
                  }, 600);
                }}
                className="w-full py-4 text-base sm:text-lg font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg hover:scale-105 hover:animate-pulse-fast active:scale-95 transition-all focus-visible:ring-4 focus-visible:ring-blue-400/40 focus:outline-none"
                variant="default"
              >
                👩‍🏫 <span className="sr-only">Inloggen als Docent</span><span className="drop-shadow-sm">Inloggen als Docent</span>
                <span className="ml-2 inline-block bg-yellow-400 text-yellow-900 rounded-full px-2 py-0.5 text-xs font-semibold drop-shadow-sm">XP Boost</span>
              </Button>
              <Button 
                aria-label="Inloggen als Student"
                onClick={e => {
                  e.currentTarget.classList.remove('animate-bounce-once');
                  void e.currentTarget.offsetWidth;
                  e.currentTarget.classList.add('animate-bounce-once');
                  setConfetti(true);
                  playSound();
                  setTimeout(() => {
                    setUserRole('student');
                    setConfetti(false);
                  }, 600);
                }}
                className="w-full py-4 text-base sm:text-lg font-bold bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg hover:scale-105 hover:animate-pulse-fast active:scale-95 transition-all focus-visible:ring-4 focus-visible:ring-pink-400/40 focus:outline-none"
                variant="default"
              >
                🧑‍🎓 <span className="sr-only">Inloggen als Student</span><span className="drop-shadow-sm">Inloggen als Student</span>
                <span className="ml-2 inline-block bg-blue-200 text-blue-900 rounded-full px-2 py-0.5 text-xs font-semibold drop-shadow-sm">Level Up</span>
              </Button>
              <div className="flex flex-wrap justify-center gap-2 mt-2">
                <span className="inline-flex items-center gap-1 bg-green-100 text-green-900 px-2 py-0.5 rounded-full text-xs font-semibold animate-badge-in drop-shadow-sm" style={{animationDelay:'0.1s'}}>🏫 mboRijnland</span>
                <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-900 px-2 py-0.5 rounded-full text-xs font-semibold animate-badge-in drop-shadow-sm" style={{animationDelay:'0.3s'}}>📅 Projectweek</span>
                <span className="inline-flex items-center gap-1 bg-pink-100 text-pink-900 px-2 py-0.5 rounded-full text-xs font-semibold animate-badge-in drop-shadow-sm" style={{animationDelay:'0.5s'}}>🏆 Mastery</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  if (userRole === 'teacher') {
    return <TeacherDashboard onLogout={() => setUserRole(null)} />;
  }
  return <StudentDashboard onLogout={() => setUserRole(null)} />;
}