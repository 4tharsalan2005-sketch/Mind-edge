import { useState } from 'react';
import { UserRole } from './types.ts';
import { Navbar } from './components/Navbar.tsx';
import { RoleSelector } from './components/RoleSelector.tsx';
import { StudentPathway } from './components/StudentPathway.tsx';
import { TeacherPathway } from './components/TeacherPathway.tsx';
import { AdminPanel } from './components/AdminPanel.tsx';

export default function App() {
  const [currentRole, setCurrentRole] = useState<UserRole | null>(null);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Navbar
        currentRole={currentRole}
        onSelectRole={(role) => setCurrentRole(role)}
      />

      <div className="flex-1">
        {currentRole === null && (
          <RoleSelector onSelectRole={(role) => setCurrentRole(role)} />
        )}

        {currentRole === 'student' && (
          <StudentPathway onBackToRoles={() => setCurrentRole(null)} />
        )}

        {currentRole === 'teacher' && (
          <TeacherPathway onBackToRoles={() => setCurrentRole(null)} />
        )}

        {currentRole === 'admin' && (
          <AdminPanel onBack={() => setCurrentRole(null)} />
        )}
      </div>
    </div>
  );
}
