import React, { useState } from 'react';
import { Contest } from '../types';
import { generateMockContests } from '../utils/mockData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, TrendingUp, TrendingDown, Award } from 'lucide-react';
import { format, subDays } from 'date-fns';

interface ContestHistoryProps {
  studentId: string;
}

export const ContestHistory: React.FC<ContestHistoryProps> = ({ studentId }) => {
  const [timeFilter, setTimeFilter] = useState<30 | 90 | 365>(90);
  const contests = generateMockContests(20);

  const filteredContests = contests.filter(contest => 
    contest.date >= subDays(new Date(), timeFilter)
  ).sort((a, b) => a.date.getTime() - b.date.getTime());

  const chartData = filteredContests.map(contest => ({
    date: format(contest.date, 'MMM dd'),
    rating: contest.newRating,
    change: contest.ratingChange,
  }));

  const totalRatingChange = filteredContests.reduce((sum, contest) => sum + contest.ratingChange, 0);
  const avgRank = Math.round(filteredContests.reduce((sum, contest) => sum + contest.rank, 0) / filteredContests.length);
  const bestRank = Math.min(...filteredContests.map(contest => contest.rank));

  return (
    <div className="space-y-6">
      {/* Filter Controls */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Contest Performance</h3>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(Number(e.target.value) as 30 | 90 | 365)}
            className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
            <option value={365}>Last 365 days</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 dark:text-blue-300 text-sm font-medium">Contests</p>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{filteredContests.length}</p>
            </div>
            <Award className="w-8 h-8 text-blue-600 dark:text-blue-300" />
          </div>
        </div>

        <div className={`p-4 rounded-lg ${
          totalRatingChange >= 0 
            ? 'bg-green-50 dark:bg-green-900'
            : 'bg-red-50 dark:bg-red-900'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${
                totalRatingChange >= 0 
                  ? 'text-green-600 dark:text-green-300'
                  : 'text-red-600 dark:text-red-300'
              }`}>
                Rating Change
              </p>
              <p className={`text-2xl font-bold ${
                totalRatingChange >= 0 
                  ? 'text-green-900 dark:text-green-100'
                  : 'text-red-900 dark:text-red-100'
              }`}>
                {totalRatingChange > 0 ? '+' : ''}{totalRatingChange}
              </p>
            </div>
            {totalRatingChange >= 0 ? (
              <TrendingUp className="w-8 h-8 text-green-600 dark:text-green-300" />
            ) : (
              <TrendingDown className="w-8 h-8 text-red-600 dark:text-red-300" />
            )}
          </div>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 dark:text-purple-300 text-sm font-medium">Best Rank</p>
              <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{isFinite(bestRank) ? bestRank : 'N/A'}</p>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 dark:bg-orange-900 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-600 dark:text-orange-300 text-sm font-medium">Avg Rank</p>
              <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">{isFinite(avgRank) ? avgRank : 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Rating Chart */}
      {filteredContests.length > 0 && (
        <div className="bg-white dark:bg-gray-700 p-4 rounded-lg">
          <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">Rating Progress</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="rating" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  dot={{ fill: '#3B82F6', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Contest List */}
      <div className="bg-white dark:bg-gray-700 rounded-lg">
        <div className="px-6 py-4 border-b">
          <h4 className="text-md font-semibold text-gray-900 dark:text-white">Recent Contests</h4>
        </div>
        <div className="divide-y">
          {filteredContests.slice(0, 10).map((contest) => (
            <div key={contest.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <h5 className="font-medium text-gray-900 dark:text-white">{contest.name}</h5>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      contest.ratingChange >= 0
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {contest.ratingChange > 0 ? '+' : ''}{contest.ratingChange}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span>Rank: {contest.rank}</span>
                    <span>Solved: {contest.problemsSolved}/{contest.totalProblems}</span>
                    <span>New Rating: {contest.newRating}</span>
                  </div>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {format(contest.date, 'MMM dd, yyyy')}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};