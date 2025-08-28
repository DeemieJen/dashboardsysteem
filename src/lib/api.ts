export async function addAssignment(assignment: any) {
  const res = await fetch(`${API_URL}/assignments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(assignment),
  });
  return res.json();
}

export async function editAssignment(id: string, updates: any) {
  const res = await fetch(`${API_URL}/assignments/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  return res.json();
}

export async function deleteAssignment(id: string) {
  await fetch(`${API_URL}/assignments/${id}`, {
    method: 'DELETE',
  });
}
const API_URL = "http://localhost:3001";

export async function fetchStudents() {
  const res = await fetch(`${API_URL}/students`);
  return res.json();
}

export async function fetchGroups() {
  const res = await fetch(`${API_URL}/groups`);
  return res.json();
}

export async function fetchAssignments() {
  const res = await fetch(`${API_URL}/assignments`);
  return res.json();
}

export async function fetchSubmissions() {
  const res = await fetch(`${API_URL}/submissions`);
  return res.json();
}
