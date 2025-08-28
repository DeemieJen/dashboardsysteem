// ...existing code, ensure only one import per symbol...

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Calendar, Users, BookOpen, Database, Plus, Edit, Trash2, Upload, Download, FileText, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import Papa from 'papaparse';

import {
	mockAssignments,
	mockGroups,
	mockStudents,
	mockSubmissions,
	getStatusColor,
	getDifficultyColor,
	getLevelColor
} from '../lib/mockData';


// Helper for drag-and-drop (move)
function reorder(list, startIndex, endIndex) {
	const result = Array.from(list);
	const [removed] = result.splice(startIndex, 1);
	result.splice(endIndex, 0, removed);
	return result;
}

function ManagementPanel2() {
	const [assignments, setAssignments] = React.useState(mockAssignments || []);
	const [groups, setGroups] = React.useState(mockGroups || []);
	const [students, setStudents] = React.useState(mockStudents || []);
	const [submissions, setSubmissions] = React.useState(mockSubmissions || []);

	// Dialog state
	const [openDialog, setOpenDialog] = React.useState(null); // {type, mode, data}
	const [dragged, setDragged] = React.useState(null);

	// Gamified card style
	const cardBase = "rounded-xl shadow-lg p-4 bg-gradient-to-br border-2 flex flex-col gap-2 hover:scale-105 transition-transform duration-200";

	// Add/Edit/Delete/Move handlers (example for assignments, similar for others)
	const handleDelete = (type, id) => {
		if (type === 'assignment') setAssignments(a => a.filter(x => x.id !== id));
		if (type === 'group') setGroups(g => g.filter(x => x.id !== id));
		if (type === 'student') setStudents(s => s.filter(x => x.id !== id));
	};
	const handleEdit = (type, item) => {
		setOpenDialog({ type, mode: 'edit', data: item });
	};
	const handleAdd = (type) => {
		setOpenDialog({ type, mode: 'add', data: null });
	};
	const handleMove = (type, from, to) => {
		if (type === 'assignment') setAssignments(a => reorder(a, from, to));
		if (type === 'group') setGroups(g => reorder(g, from, to));
		if (type === 'student') setStudents(s => reorder(s, from, to));
	};

	// Drag-and-drop logic (for move)
	const onDragStart = (type, idx) => setDragged({ type, idx });
	const onDragOver = (e) => e.preventDefault();
	const onDrop = (type, idx) => {
		if (dragged && dragged.type === type && dragged.idx !== idx) {
			handleMove(type, dragged.idx, idx);
		}
		setDragged(null);
	};

	// Gamified panel UI
	return (
		<div className="container mx-auto p-6 space-y-8">
			<h1 className="text-4xl font-extrabold mb-6 text-center text-gradient bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent drop-shadow-lg">🏆 Management Panel</h1>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				{/* Assignments */}
				<div className="flex flex-col gap-4">
					<div className="flex items-center justify-between mb-2">
						<h2 className="text-xl font-bold flex items-center gap-2"><BookOpen className="w-5 h-5" /> Opdrachten</h2>
						<Button size="sm" variant="outline" onClick={() => handleAdd('assignment')}><Plus className="w-4 h-4 mr-1" />Toevoegen</Button>
					</div>
					{assignments.map((a, i) => (
						<div
							key={a.id}
							className={`${cardBase} border-yellow-300 bg-gradient-to-br from-yellow-100 to-yellow-200 cursor-move`}
							draggable
							onDragStart={() => onDragStart('assignment', i)}
							onDragOver={onDragOver}
							onDrop={() => onDrop('assignment', i)}
						>
							<div className="flex justify-between items-center">
								<span className={`px-2 py-1 rounded text-xs font-bold ${getStatusColor(a.status)}`}>{a.status}</span>
								<span className={`px-2 py-1 rounded text-xs font-bold ${getDifficultyColor(a.difficulty)}`}>{a.difficulty}</span>
							</div>
							<div className="font-semibold text-lg">{a.title}</div>
							<div className="text-xs text-gray-600">{a.description}</div>
							<div className="flex gap-2 items-center mt-2">
								<Badge variant="secondary">XP: {a.xpReward}</Badge>
								<Badge variant="outline"><Calendar className="w-3 h-3 mr-1 inline" />{new Date(a.dueDate).toLocaleDateString()}</Badge>
							</div>
							<div className="flex gap-2 mt-2">
								<Button size="icon" variant="ghost" onClick={() => handleEdit('assignment', a)}><Edit className="w-4 h-4" /></Button>
								<Button size="icon" variant="ghost" onClick={() => handleDelete('assignment', a.id)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
							</div>
						</div>
					))}
				</div>

				{/* Groups */}
				<div className="flex flex-col gap-4">
					<div className="flex items-center justify-between mb-2">
						<h2 className="text-xl font-bold flex items-center gap-2"><Users className="w-5 h-5" /> Groepen</h2>
						<Button size="sm" variant="outline" onClick={() => handleAdd('group')}><Plus className="w-4 h-4 mr-1" />Toevoegen</Button>
					</div>
					{groups.map((g, i) => (
						<div
							key={g.id}
							className={`${cardBase} border-purple-300 bg-gradient-to-br from-purple-100 to-purple-200 cursor-move`}
							draggable
							onDragStart={() => onDragStart('group', i)}
							onDragOver={onDragOver}
							onDrop={() => onDrop('group', i)}
						>
							<div className="flex justify-between items-center">
								<span className={`text-2xl mr-2`}>{g.emoji}</span>
								<span className={`px-2 py-1 rounded text-xs font-bold bg-white/80 border ${getLevelColor(g.level)}`}>Lvl {g.level}</span>
							</div>
							<div className="font-semibold text-lg flex items-center gap-2">{g.name} <Badge variant="secondary">XP: {g.xp}</Badge></div>
							<div className="flex gap-1 mt-1">
								{g.badges.map(b => <span key={b} className="text-lg">{b}</span>)}
							</div>
							<div className="flex gap-2 mt-2">
								<Button size="icon" variant="ghost" onClick={() => handleEdit('group', g)}><Edit className="w-4 h-4" /></Button>
								<Button size="icon" variant="ghost" onClick={() => handleDelete('group', g.id)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
							</div>
						</div>
					))}
				</div>

				{/* Students */}
				<div className="flex flex-col gap-4">
					<div className="flex items-center justify-between mb-2">
						<h2 className="text-xl font-bold flex items-center gap-2"><UserPlus className="w-5 h-5" /> Studenten</h2>
						<Button size="sm" variant="outline" onClick={() => handleAdd('student')}><Plus className="w-4 h-4 mr-1" />Toevoegen</Button>
					</div>
					{students.map((s, i) => (
						<div
							key={s.id}
							className={`${cardBase} border-green-300 bg-gradient-to-br from-green-100 to-green-200 cursor-move`}
							draggable
							onDragStart={() => onDragStart('student', i)}
							onDragOver={onDragOver}
							onDrop={() => onDrop('student', i)}
						>
							<div className="flex justify-between items-center">
								<span className="text-2xl mr-2">{s.avatar}</span>
								<span className={`px-2 py-1 rounded text-xs font-bold bg-white/80 border ${getLevelColor(s.level)}`}>Lvl {s.level}</span>
							</div>
							<div className="font-semibold text-lg flex items-center gap-2">{s.name} <Badge variant="secondary">XP: {s.xp}</Badge></div>
							<div className="flex gap-1 mt-1">
								{s.achievements.map(a => <span key={a} className="text-lg">{a}</span>)}
							</div>
							<div className="flex gap-2 mt-2">
								<Button size="icon" variant="ghost" onClick={() => handleEdit('student', s)}><Edit className="w-4 h-4" /></Button>
								<Button size="icon" variant="ghost" onClick={() => handleDelete('student', s.id)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
							</div>
						</div>
					))}
				</div>

				{/* Submissions (read-only, gamified) */}
				<div className="flex flex-col gap-4">
					<div className="flex items-center justify-between mb-2">
						<h2 className="text-xl font-bold flex items-center gap-2"><FileText className="w-5 h-5" /> Inzendingen</h2>
					</div>
					{submissions.map((sub, i) => (
						<div key={sub.id} className={`${cardBase} border-blue-300 bg-gradient-to-br from-blue-100 to-blue-200`}>
							<div className="flex justify-between items-center">
								<span className={`px-2 py-1 rounded text-xs font-bold ${getStatusColor(sub.status)}`}>{sub.status}</span>
								<span className="text-xs text-gray-500">{new Date(sub.submittedAt).toLocaleString()}</span>
							</div>
							<div className="text-sm">Assignment: <b>{sub.assignmentId}</b></div>
							<div className="text-sm">Group: <b>{sub.groupId}</b></div>
						</div>
					))}
				</div>
			</div>

			{/* Dialogs for Add/Edit (not fully implemented, placeholder) */}
			{openDialog && (
				<Dialog open onOpenChange={() => setOpenDialog(null)}>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>{openDialog.mode === 'add' ? 'Toevoegen' : 'Bewerken'} {openDialog.type}</DialogTitle>
							<DialogDescription>Deze functie is nog niet volledig geïmplementeerd.</DialogDescription>
						</DialogHeader>
						<div className="flex gap-2 mt-4">
							<Button onClick={() => setOpenDialog(null)}>Sluiten</Button>
						</div>
					</DialogContent>
				</Dialog>
			)}
		</div>
	);
}

export default ManagementPanel2;
