import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const DentistDashboard = () => {
  const [checkups, setCheckups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCheckups = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/checkups/dentist');
        setCheckups(res.data);
      } catch (error) {
        console.error('Error fetching checkups:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCheckups();
  }, []);

  const handleStatusUpdate = async (checkupId, status) => {
    try {
      await axios.put(`http://localhost:5000/api/checkups/${checkupId}`, {
        status
      });
      setCheckups(checkups.map(checkup => 
        checkup._id === checkupId ? { ...checkup, status } : checkup
      ));
    } catch (error) {
      console.error('Error updating status:', error);
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Patient Checkups</h1>
      </div>

      {checkups.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="mt-2 text-sm font-medium text-gray-900">No checkups</h3>
          <p className="mt-1 text-sm text-gray-500">
            No patients have requested checkups yet.
          </p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {checkups.map((checkup) => (
              <li key={checkup._id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-primary-600 truncate">
                        {checkup.patient.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {checkup.patient.email}
                      </p>
                    </div>
                    <div className="ml-2 flex-shrink-0 flex">
                      <select
                        value={checkup.status}
                        onChange={(e) => handleStatusUpdate(checkup._id, e.target.value)}
                        className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          checkup.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        {new Date(checkup.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <Link
                        to={`/checkup/${checkup._id}`}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DentistDashboard; 