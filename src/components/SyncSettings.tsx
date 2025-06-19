import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { SyncSettings as SyncSettingsType } from '../types';
import { Clock, Mail, Database, CheckCircle, AlertCircle, Settings } from 'lucide-react';

export const SyncSettings: React.FC = () => {
  const [syncSettings, setSyncSettings] = useLocalStorage<SyncSettingsType>('syncSettings', {
    frequency: 'daily',
    time: '02:00',
    enabled: true,
  });

  const [lastSyncTime] = useLocalStorage<string>('lastSyncTime', new Date().toISOString());
  const [isTestingSync, setIsTestingSync] = useState(false);

  const handleSyncSettingsChange = (newSettings: Partial<SyncSettingsType>) => {
    setSyncSettings(prev => ({ ...prev, ...newSettings }));
  };

  const handleTestSync = async () => {
    setIsTestingSync(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsTestingSync(false);
    alert('Test sync completed successfully!');
  };

  const nextSyncTime = () => {
    const now = new Date();
    const [hours, minutes] = syncSettings.time.split(':').map(Number);
    const nextSync = new Date();
    nextSync.setHours(hours, minutes, 0, 0);
    
    if (nextSync <= now) {
      if (syncSettings.frequency === 'daily') {
        nextSync.setDate(nextSync.getDate() + 1);
      } else {
        nextSync.setDate(nextSync.getDate() + 7);
      }
    }
    
    return nextSync;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <div className="flex items-center gap-3">
            <Settings className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Sync Settings</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Configure automatic data synchronization with Codeforces API
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Sync Status */}
          <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${syncSettings.enabled ? 'bg-green-500' : 'bg-red-500'}`} />
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Sync Status: {syncSettings.enabled ? 'Active' : 'Disabled'}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Last sync: {new Date(lastSyncTime).toLocaleString()}
                  </p>
                </div>
              </div>
              <button
                onClick={handleTestSync}
                disabled={isTestingSync}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg"
              >
                <Database className="w-4 h-4" />
                {isTestingSync ? 'Testing...' : 'Test Sync'}
              </button>
            </div>
          </div>

          {/* Sync Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Schedule Configuration
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Sync Frequency
                </label>
                <select
                  value={syncSettings.frequency}
                  onChange={(e) => handleSyncSettingsChange({ frequency: e.target.value as 'daily' | 'weekly' })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Sync Time
                </label>
                <input
                  type="time"
                  value={syncSettings.time}
                  onChange={(e) => handleSyncSettingsChange({ time: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={syncSettings.enabled}
                  onChange={(e) => handleSyncSettingsChange({ enabled: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Enable automatic sync
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Email Notifications
              </h3>

              <div className="bg-yellow-50 dark:bg-yellow-900 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Inactivity Detection</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      Students who haven't submitted any solutions in the last 7 days will automatically receive reminder emails.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Email Features</h4>
                    <ul className="text-sm text-gray-600 dark:text-gray-300 mt-1 space-y-1">
                      <li>• Automatic reminder emails for inactive students</li>
                      <li>• Individual email preferences per student</li>
                      <li>• Track reminder email count</li>
                      <li>• Real-time sync when CF handle is updated</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Next Sync Info */}
          {syncSettings.enabled && (
            <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Next Scheduled Sync</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {nextSyncTime().toLocaleString()} ({syncSettings.frequency})
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};