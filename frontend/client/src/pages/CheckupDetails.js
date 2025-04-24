import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const CheckupDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [checkup, setCheckup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newImage, setNewImage] = useState(null);
  const [description, setDescription] = useState('');

  useEffect(() => {
    const fetchCheckup = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/checkups/${id}`);
        setCheckup(res.data);
      } catch (error) {
        console.error('Error fetching checkup:', error);
        setError('Failed to load checkup details');
      } finally {
        setLoading(false);
      }
    };

    fetchCheckup();
  }, [id]);

  const handleImageUpload = async (e) => {
    e.preventDefault();
    if (!newImage) return;

    const formData = new FormData();
    formData.append('images', newImage);
    formData.append('descriptions[]', description);

    try {
      const res = await axios.post(
        `http://localhost:5000/api/checkups/${id}/images`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      setCheckup(res.data);
      setNewImage(null);
      setDescription('');
    } catch (error) {
      console.error('Error uploading image:', error);
      setError('Failed to upload image');
    }
  };

  const handleExportPDF = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/checkups/${id}/export`,
        {
          responseType: 'blob'
        }
      );
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `checkup-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error exporting PDF:', error);
      setError('Failed to export PDF');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!checkup) {
    return (
      <div className="text-center py-12">
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          Checkup not found
        </h3>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Checkup Details
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {user.role === 'dentist'
              ? `Patient: ${checkup.patient.name}`
              : `Dentist: Dr. ${checkup.dentist.name}`}
          </p>
        </div>
        <button
          onClick={handleExportPDF}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Export PDF
        </button>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4 mb-4">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      {user.role === 'dentist' && (
        <form onSubmit={handleImageUpload} className="mb-8">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="image"
                className="block text-sm font-medium text-gray-700"
              >
                Upload Image
              </label>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={(e) => setNewImage(e.target.files[0])}
                className="mt-1 block w-full"
              />
            </div>
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <textarea
                id="description"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Upload
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {checkup.images.map((image, index) => (
          <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
            <img
              src={`http://localhost:5000/${image.url}`}
              alt={`Checkup image ${index + 1}`}
              className="w-full h-48 object-cover"
            />
            <div className="px-4 py-5 sm:p-6">
              <p className="text-sm text-gray-500">{image.description}</p>
              <p className="mt-1 text-xs text-gray-400">
                {new Date(image.uploadedAt).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CheckupDetails; 