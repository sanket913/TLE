import React, { useState } from 'react';
import { Student } from './types';
import { StudentsTable } from './components/StudentsTable';
import { StudentForm } from './components/StudentForm';
import { StudentProfile } from './components/StudentProfile';
import { ThemeToggle } from './components/ThemeToggle';
import { SyncSettings } from './components/SyncSettings';
import { mockStudents } from './utils/mockData';
import { ArrowLeft, Users, Settings } from 'lucide-react';

type View = 'table' | 'profile' | 'settings';

function App() {
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [currentView, setCurrentView] = useState<View>('table');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | undefined>(undefined);

  const handleAddStudent = () => {
    setEditingStudent(undefined);
    setIsFormOpen(true);
  };

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
    setIsFormOpen(true);
  };

  const handleSaveStudent = (studentData: Omit<Student, 'id'>) => {
    if (editingStudent) {
      setStudents(prev => prev.map(s => 
        s.id === editingStudent.id 
          ? { ...studentData, id: editingStudent.id }
          : s
      ));
    } else {
      const newStudent: Student = {
        ...studentData,
        id: (students.length + 1).toString(),
      };
      setStudents(prev => [...prev, newStudent]);
    }
    setIsFormOpen(false);
    setEditingStudent(undefined);
  };

  const handleDeleteStudent = (id: string) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      setStudents(prev => prev.filter(s => s.id !== id));
    }
  };

  const handleViewStudent = (student: Student) => {
    setSelectedStudent(student);
    setCurrentView('profile');
  };

  const handleBackToTable = () => {
    setCurrentView('table');
    setSelectedStudent(null);
  };

  const handleNavigation = (view: View) => {
    setCurrentView(view);
    if (view !== 'profile') {
      setSelectedStudent(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {currentView === 'profile' && (
                <button
                  onClick={handleBackToTable}
                  className="mr-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                Student Progress System
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <nav className="flex space-x-2">
                <button
                  onClick={() => handleNavigation('table')}
                  className={`flex items-center px-3 py-2 rounded ${
                    currentView === 'table'
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                      : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
                  }`}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Students
                </button>
                <button
                  onClick={() => handleNavigation('settings')}
                  className={`flex items-center px-3 py-2 rounded ${
                    currentView === 'settings'
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                      : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
                  }`}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </button>
              </nav>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4">
        {currentView === 'table' && (
          <StudentsTable
            students={students}
            onAddStudent={handleAddStudent}
            onEditStudent={handleEditStudent}
            onDeleteStudent={handleDeleteStudent}
            onViewStudent={handleViewStudent}
          />
        )}

        {currentView === 'profile' && selectedStudent && (
          <StudentProfile
            student={selectedStudent}
            onBack={handleBackToTable}
          />
        )}

        {currentView === 'settings' && (
          <SyncSettings />
        )}
      </main>

      {/* Student Form Modal */}
      <StudentForm
        student={editingStudent}
        onSave={handleSaveStudent}
        onCancel={() => {
          setIsFormOpen(false);
          setEditingStudent(undefined);
        }}
        isOpen={isFormOpen}
      />
    </div>
  );
}

export default App;