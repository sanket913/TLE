import React, { useState } from 'react';
import { Student } from '../types';
import { ContestHistory } from './ContestHistory';
import { ProblemSolvingData } from './ProblemSolvingData';
import { User, Trophy, Code, Mail, Phone } from 'lucide-react';
import { format } from 'date-fns';

interface StudentProfileProps {
  student: Student;
  onBack: () => void;
}

export const StudentProfile: React.FC<StudentProfileProps> = ({ student, onBack }) => {
  const [activeTab, setActiveTab] = useState<'contests' | 'problems'>('contests');

  return (
    <div className="space-y-6">
      {/* Student Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="bg-blue-600 px-6 py-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">{student.name}</h1>
              <div className="flex flex-wrap gap-4 text-blue-100">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{student.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">{student.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Code className="w-4 h-4" />
                  <span className="text-sm font-mono">{student.codeforcesHandle}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded">
              <div className="text-2xl font-bold text-blue-600">{student.currentRating}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Current Rating</div>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded">
              <div className="text-2xl font-bold text-green-600">{student.maxRating}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Max Rating</div>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{student.emailRemindersCount}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Reminders Sent</div>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Joined {format(student.joinedDate, 'MMM yyyy')}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Updated {format(student.lastUpdated, 'MMM dd, yyyy')}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="border-b">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('contests')}
              className={`flex-1 py-4 px-6 text-center font-medium ${
                activeTab === 'contests'
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <Trophy className="w-5 h-5 mx-auto mb-1" />
              Contest History
            </button>
            <button
              onClick={() => setActiveTab('problems')}
              className={`flex-1 py-4 px-6 text-center font-medium ${
                activeTab === 'problems'
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <Code className="w-5 h-5 mx-auto mb-1" />
              Problem Solving
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'contests' && <ContestHistory studentId={student.id} />}
          {activeTab === 'problems' && <ProblemSolvingData studentId={student.id} />}
        </div>
      </div>
    </div>
  );
};