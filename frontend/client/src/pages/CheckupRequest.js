import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CheckupRequest = () => {
  const [dentists, setDentists] = useState([]);
  const [selectedDentist, setSelectedDentist] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDentists = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/users/dentists');
        setDentists(res.data);
      } catch (error) {
        console.error('Error fetching dentists:', error);
        setError('Failed to load dentists');
      } finally {
        setLoading(false);
      }
    };

    fetchDentists();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await axios.post('http://localhost:5000/api/checkups', {
        dentistId: selectedDentist
      });
      navigate('/dashboard');
    } catch (error) {
      setError('Failed to create checkup request');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Request a Checkup</h1>
        <p className="mt-2 text-sm text-gray-600">
          Select a dentist for your dental checkup
        </p>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4 mb-4">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="dentist"
            className="block text-sm font-medium text-gray-700"
          >
            Select Dentist
          </label>
          <select
            id="dentist"
            name="dentist"
            required
            value={selectedDentist}
            onChange={(e) => setSelectedDentist(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
          >
            <option value="">Select a dentist</option>
            {dentists.map((dentist) => (
              <option key={dentist._id} value={dentist._id}>
                Dr. {dentist.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Request Checkup
          </button>
        </div>
      </form>
    </div>
  );
};

export default CheckupRequest; 