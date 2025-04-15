import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
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
    window.location.href = '/'; // Redirige al login después de cerrar sesión
  };

  return (
    <HashRouter>
      <InnerApp
        userRole={userRole}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />
    </HashRouter>
  );
}

function InnerApp({ userRole, onLogin, onLogout }) {
  const location = useLocation();

  // Redirigir a login si no hay userRole al inicio
  useEffect(() => {
    if (!userRole && location.pathname !== '/') {
      window.location.href = '/'; // Aseguramos redirigir a login si no hay userRole
    }
  }, [userRole, location]);

  return (
    <>
      <Routes key={location.pathname}>
        <Route
          path="/"
          element={
            userRole ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Login onLogin={onLogin} />
            )
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={['OWNER', 'EMPLOYED']}>
              {userRole === 'OWNER' ? (
                <OwnerDashboard onLogout={onLogout} />
              ) : (
                <EmployedDashboard onLogout={onLogout} />
              )}
            </ProtectedRoute>
          }
        />

        <Route path="/unauthorized" element={<div>Acceso no autorizado</div>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

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
