// src/pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import { fetchPerformanceMetrics } from '../utils/api';

const Dashboard = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const data = await fetchPerformanceMetrics();
        setStats(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">📊 Dashboard</h1>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 dark:border-blue-400 border-t-transparent rounded-full" />
        </div>
      ) : error ? (
        <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-4 rounded-lg">{error}</div>
      ) : stats.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((site) => (
            <div
              key={site.id}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{site.website}</h3>
              <div className="mt-4 space-y-2">
                <p className="text-gray-600 dark:text-gray-300">
                  Uptime:{' '}
                  <span className="font-medium text-green-600 dark:text-green-400">{site.uptime_percentage}%</span>
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  Avg Response:{' '}
                  <span className="font-medium text-blue-600 dark:text-blue-400">{site.avg_response_time}ms</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 dark:text-gray-400">No data available</p>
      )}
    </div>
  );
};

export default Dashboard;