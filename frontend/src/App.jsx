import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import CreateTicket from './pages/CreateTicket';
import MyTickets from './pages/MyTickets';

/*
  Route Protection Helper.
  Reason: Agar koi bina login kiye dashboard access kare toh usse rokna hai.
  Role based protection bhi handle kar sakte hain.
*/
const ProtectedRoute = ({ children, allowedRoles }) => {
  const role = localStorage.getItem('userRole'); // 'admin' or 'user'

  // Agar login nahi hai
  if (!role) {
    return <Navigate to="/login" replace />;
  }

  // Agar role match nahi karta (e.g. User trying to access Admin)
  if (allowedRoles && !allowedRoles.includes(role)) {
    // Redirect to their respective dashboard
    return role === 'admin' ? <Navigate to="/admin-dashboard" /> : <Navigate to="/user-dashboard" />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* 
               Admin Route 
               Access: Only 'admin'
            */}
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* 
               User Route 
               Access: Only 'user'
            */}
          <Route
            path="/user-dashboard"
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <UserDashboard />
              </ProtectedRoute>
            }
          />

          {/* General Routes (Accessible to both for now, can be restricted further) */}
          <Route
            path="/create-ticket"
            element={
              <ProtectedRoute allowedRoles={['user', 'admin']}>
                <CreateTicket />
              </ProtectedRoute>
            }
          />

          <Route
            path="/tickets"
            element={
              <ProtectedRoute allowedRoles={['user', 'admin']}>
                <MyTickets />
              </ProtectedRoute>
            }
          />

          {/* Fallback to Dashboard based on role logic can be complex, simply redirect to login for 404 */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
