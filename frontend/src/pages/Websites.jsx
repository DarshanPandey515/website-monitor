// src/pages/Websites.jsx
import { useEffect, useState } from 'react';
import { fetchWebsites, triggerCheck } from '../utils/api';

const Websites = () => {
  const [websites, setWebsites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadWebsites = async () => {
      try {
        setLoading(true);
        const data = await fetchWebsites();
        setWebsites(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadWebsites();
  }, []);

  const handleCheck = async (id) => {
    try {
      await triggerCheck(id);
      alert('Check triggered successfully');
    } catch (err) {
      alert('Failed to trigger check: ' + err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">🌍 Monitored Websites</h1>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 dark:border-blue-400 border-t-transparent rounded-full" />
        </div>
      ) : error ? (
        <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-4 rounded-lg">{error}</div>
      ) : websites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {websites.map((site) => (
            <div
              key={site.id}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{site.name}</h3>
              <div className="mt-4 space-y-2">
                <p className="text-gray-600 dark:text-gray-300">
                  URL:{' '}
                  <a
                    href={site.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {site.url}
                  </a>
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  Interval:{' '}
                  <span className="font-medium">{site.check_interval} minutes</span>
                </p>
                <button
                  onClick={() => handleCheck(site.id)}
                  className="mt-4 bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200"
                >
                  Check Now
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 dark:text-gray-400">No websites available</p>
      )}
    </div>
  );
};

export default Websites;