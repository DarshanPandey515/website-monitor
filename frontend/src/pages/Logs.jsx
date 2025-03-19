// src/pages/Logs.jsx
import { useEffect, useState } from 'react';
import { fetchLogs } from '../utils/api';

const Logs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadLogs = async () => {
      try {
        setLoading(true);
        const data = await fetchLogs();
        setLogs(data.results || data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadLogs();
    const interval = setInterval(loadLogs, 30000);  // Auto-refresh every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">📜 Uptime Logs</h1>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 dark:border-blue-400 border-t-transparent rounded-full" />
        </div>
      ) : error ? (
        <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-4 rounded-lg">{error}</div>
      ) : logs.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700">
                <th className="p-4 text-left text-gray-700 dark:text-gray-200">Website</th>
                <th className="p-4 text-left text-gray-700 dark:text-gray-200">Status</th>
                <th className="p-4 text-left text-gray-700 dark:text-gray-200">Response Time</th>
                <th className="p-4 text-left text-gray-700 dark:text-gray-200">Code</th>
                <th className="p-4 text-left text-gray-700 dark:text-gray-200">Time</th>
                <th className="p-4 text-left text-gray-700 dark:text-gray-200">Error</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750">
                  <td className="p-4 text-gray-800 dark:text-gray-100">{log.website_name}</td>
                  <td className={`p-4 ${
                    log.status === 'UP' ? 'text-green-600 dark:text-green-400' :
                    log.status === 'DOWN' ? 'text-red-600 dark:text-red-400' :
                    'text-yellow-600 dark:text-yellow-400'
                  }`}>
                    {log.status}
                  </td>
                  <td className="p-4 text-gray-600 dark:text-gray-300">{log.response_time}ms</td>
                  <td className="p-4 text-gray-600 dark:text-gray-300">{log.status_code}</td>
                  <td className="p-4 text-gray-600 dark:text-gray-300">
                    {new Date(log.checked_at).toLocaleString()}
                  </td>
                  <td className="p-4 text-gray-600 dark:text-gray-300">{log.error_message || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-600 dark:text-gray-400">No logs available</p>
      )}
    </div>
  );
};

export default Logs;