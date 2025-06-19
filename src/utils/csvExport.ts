import { Student } from '../types';

export const exportToCSV = (students: Student[]) => {
  const headers = [
    'Name',
    'Email',
    'Phone',
    'Codeforces Handle',
    'Current Rating',
    'Max Rating',
    'Last Updated',
    'Email Reminders Count',
    'Email Reminders Enabled',
    'Joined Date'
  ];

  const csvContent = [
    headers.join(','),
    ...students.map(student => [
      student.name,
      student.email,
      student.phone,
      student.codeforcesHandle,
      student.currentRating.toString(),
      student.maxRating.toString(),
      student.lastUpdated.toISOString(),
      student.emailRemindersCount.toString(),
      student.emailRemindersEnabled.toString(),
      student.joinedDate.toISOString()
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `students_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};