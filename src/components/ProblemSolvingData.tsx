import React, { useState } from 'react';
import { Problem } from '../types';
import { generateMockProblems, generateSubmissionHeatmap } from '../utils/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, Trophy, Target, TrendingUp, Activity } from 'lucide-react';
import { format, subDays } from 'date-fns';

interface ProblemSolvingDataProps {
  studentId: string;
}

export const ProblemSolvingData: React.FC<ProblemSolvingDataProps> = ({ studentId }) => {
  const [timeFilter, setTimeFilter] = useState<7 | 30 | 90>(30);
  const problems = generateMockProblems(150);
  const heatmapData = generateSubmissionHeatmap(90);

  const filteredProblems = problems.filter(problem => 
    problem.solvedDate >= subDays(new Date(), timeFilter)
  );

  const mostDifficultProblem = filteredProblems.reduce((max, problem) => 
    problem.rating > (max?.rating || 0) ? problem : max, null as Problem | null
  );

  const averageRating = Math.round(
    filteredProblems.reduce((sum, problem) => sum + problem.rating, 0) / filteredProblems.length
  );

  const averageProblemsPerDay = Number((filteredProblems.length / timeFilter).toFixed(1));

  // Group problems by rating buckets
  const ratingBuckets = [
    { range: '800-999', min: 800, max: 999, count: 0 },
    { range: '1000-1199', min: 1000, max: 1199, count: 0 },
    { range: '1200-1399', min: 1200, max: 1399, count: 0 },
    { range: '1400-1599', min: 1400, max: 1599, count: 0 },
    { range: '1600-1799', min: 1600, max: 1799, count: 0 },
    { range: '1800+', min: 1800, max: 9999, count: 0 },
  ];

  filteredProblems.forEach(problem => {
    const bucket = ratingBuckets.find(b => problem.rating >= b.min && problem.rating <= b.max);
    if (bucket) bucket.count++;
  });

  const chartData = ratingBuckets.filter(bucket => bucket.count > 0);

  // Generate heatmap for the last 7 weeks
  const generateHeatmapGrid = () => {
    const grid = [];
    const today = new Date();
    
    for (let week = 6; week >= 0; week--) {
      const weekData = [];
      for (let day = 0; day < 7; day++) {
        const date = new Date(today);
        date.setDate(date.getDate() - (week * 7 + (6 - day)));
        const dateKey = format(date, 'yyyy-MM-dd');
        const submissions = heatmapData[dateKey] || 0;
        weekData.push({
          date: dateKey,
          submissions,
          day: date.getDay(),
        });
      }
      grid.push(weekData);
    }
    return grid;
  };

  const heatmapGrid = generateHeatmapGrid();
  const maxSubmissions = Math.max(...Object.values(heatmapData));

  const getHeatmapColor = (submissions: number) => {
    if (submissions === 0) return 'bg-gray-100 dark:bg-gray-800';
    const intensity = submissions / maxSubmissions;
    if (intensity <= 0.25) return 'bg-green-200 dark:bg-green-900';
    if (intensity <= 0.5) return 'bg-green-300 dark:bg-green-800';
    if (intensity <= 0.75) return 'bg-green-400 dark:bg-green-700';
    return 'bg-green-500 dark:bg-green-600';
  };

  return (
    <div className="space-y-6">
      {/* Filter Controls */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Problem Solving Analysis</h3>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(Number(e.target.value) as 7 | 30 | 90)}
            className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 dark:text-blue-300 text-sm font-medium">Total Problems</p>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{filteredProblems.length}</p>
            </div>
            <Target className="w-8 h-8 text-blue-600 dark:text-blue-300" />
          </div>
        </div>

        <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 dark:text-green-300 text-sm font-medium">Average Rating</p>
              <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                {isFinite(averageRating) ? averageRating : 'N/A'}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600 dark:text-green-300" />
          </div>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 dark:text-purple-300 text-sm font-medium">Daily Average</p>
              <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{averageProblemsPerDay}</p>
            </div>
            <Activity className="w-8 h-8 text-purple-600 dark:text-purple-300" />
          </div>
        </div>

        <div className="bg-orange-50 dark:bg-orange-900 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-600 dark:text-orange-300 text-sm font-medium">Hardest Problem</p>
              <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                {mostDifficultProblem?.rating || 'N/A'}
              </p>
            </div>
            <Trophy className="w-8 h-8 text-orange-600 dark:text-orange-300" />
          </div>
        </div>
      </div>

      {/* Most Difficult Problem */}
      {mostDifficultProblem && (
        <div className="bg-white dark:bg-gray-700 p-4 rounded-lg">
          <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3">Most Difficult Problem Solved</h4>
          <div className="flex items-center justify-between p-4 bg-orange-50 dark:bg-orange-900 rounded-lg">
            <div>
              <h5 className="font-medium text-gray-900 dark:text-white">{mostDifficultProblem.name}</h5>
              <div className="flex items-center gap-4 mt-2">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                  Rating: {mostDifficultProblem.rating}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Solved on {format(mostDifficultProblem.solvedDate, 'MMM dd, yyyy')}
                </span>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {mostDifficultProblem.tags.map(tag => (
                  <span key={tag} className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-gray-300">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <Trophy className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      )}

      {/* Problems by Rating Chart */}
      {chartData.length > 0 && (
        <div className="bg-white dark:bg-gray-700 p-4 rounded-lg">
          <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">Problems by Rating Range</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Submission Heatmap */}
      <div className="bg-white dark:bg-gray-700 p-4 rounded-lg">
        <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">Submission Activity (Last 7 weeks)</h4>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300 mb-2">
            <span className="w-12">Mon</span>
            <div className="flex-1 grid grid-cols-7 gap-1">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                <div key={index} className="text-center">{day}</div>
              ))}
            </div>
          </div>
          {heatmapGrid.map((week, weekIndex) => (
            <div key={weekIndex} className="flex items-center gap-2">
              <span className="w-12 text-xs text-gray-600 dark:text-gray-300">
                {format(new Date(week[0].date), 'MMM dd')}
              </span>
              <div className="flex-1 grid grid-cols-7 gap-1">
                {week.map((day, dayIndex) => (
                  <div
                    key={dayIndex}
                    className={`w-4 h-4 rounded-sm ${getHeatmapColor(day.submissions)}`}
                    title={`${day.submissions} submissions on ${format(new Date(day.date), 'MMM dd, yyyy')}`}
                  />
                ))}
              </div>
            </div>
          ))}
          <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-300 mt-2">
            <span>Less</span>
            <div className="flex items-center gap-1">
              {[0, 1, 2, 3, 4].map(level => (
                <div
                  key={level}
                  className={`w-3 h-3 rounded-sm ${
                    level === 0 ? 'bg-gray-100 dark:bg-gray-800' :
                    level === 1 ? 'bg-green-200 dark:bg-green-900' :
                    level === 2 ? 'bg-green-300 dark:bg-green-800' :
                    level === 3 ? 'bg-green-400 dark:bg-green-700' :
                    'bg-green-500 dark:bg-green-600'
                  }`}
                />
              ))}
            </div>
            <span>More</span>
          </div>
        </div>
      </div>
    </div>
  );
};