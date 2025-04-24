import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CheckupRequest from './pages/CheckupRequest';
import CheckupDetails from './pages/CheckupDetails';
import DentistDashboard from './pages/DentistDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/checkup/request"
                element={
                  <PrivateRoute>
                    <CheckupRequest />
                  </PrivateRoute>
                }
              />
              <Route
                path="/checkup/:id"
                element={
                  <PrivateRoute>
                    <CheckupDetails />
                  </PrivateRoute>
                }
              />
              <Route
                path="/dentist/dashboard"
                element={
                  <PrivateRoute>
                    <DentistDashboard />
                  </PrivateRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
