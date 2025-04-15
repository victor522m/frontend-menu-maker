import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Login from './components/Login';
import OwnerDashboard from './components/OwnerDashboard';
import EmployedDashboard from './components/EmployedDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [userRole, setUserRole] = useState(() => {
    return localStorage.getItem('userRole') || null;
  });

  const handleLogin = (roles) => {
    const mainRole = roles[0];
    localStorage.setItem('userRole', mainRole);
    setUserRole(mainRole);
  };

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    setUserRole(null);
  };

  return (
    <>
      <HashRouter>
        <Routes>
          <Route path="/" element={
            userRole ?
              <Navigate to="/dashboard" replace /> :
              <Login onLogin={handleLogin} />
          } />

          <Route path="/dashboard" element={
            <ProtectedRoute allowedRoles={['OWNER', 'EMPLOYED']}>
              {userRole === 'OWNER' ?
                <OwnerDashboard onLogout={handleLogout} /> :
                <EmployedDashboard onLogout={handleLogout} />
              }
            </ProtectedRoute>
          } />

          <Route path="/unauthorized" element={<div>Acceso no autorizado</div>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}

export default App;

