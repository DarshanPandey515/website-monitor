// src/pages/AddWebsite.jsx
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import { api } from '../utils/api';  // Import api directly

const AddWebsite = () => {
    const { isDarkMode } = useContext(ThemeContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        url: '',
        check_interval: 5,
        expected_status_code: 200,
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('websites/', formData);  // Use POST directly
            navigate('/websites');
        } catch (err) {
            setError(err.response?.data?.detail || err.message);
        } finally {
            setLoading(false);
        }
    };

    // Rest of the component remains the same
    return (
        <div className="max-w-md mx-auto mt-10">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">Add New Website</h1>
            {error && (
                <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-4 rounded-lg mb-4">
                    {error}
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-2">Name</label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-2">URL</label>
                    <input
                        type="url"
                        value={formData.url}
                        onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                        className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-2">Check Interval (minutes)</label>
                    <input
                        type="number"
                        min="1"
                        value={formData.check_interval}
                        onChange={(e) => setFormData({ ...formData, check_interval: parseInt(e.target.value) })}
                        className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-2">Expected Status Code</label>
                    <input
                        type="number"
                        min="100"
                        max="599"
                        value={formData.expected_status_code}
                        onChange={(e) => setFormData({ ...formData, expected_status_code: parseInt(e.target.value) })}
                        className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 dark:bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50"
                >
                    {loading ? 'Adding...' : 'Add Website'}
                </button>
            </form>
        </div>
    );
};

export default AddWebsite;