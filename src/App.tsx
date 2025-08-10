import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './hooks/useAuth'
import { ThemeProvider } from './hooks/useTheme'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import PatientForm from './pages/PatientForm'
import PatientRecord from './pages/PatientRecord'
import Appointments from './pages/Appointments'
import Reports from './pages/Reports'
import Backup from './pages/Backup'
import UserManagement from './pages/UserManagement'
import MainLayout from './components/MainLayout'

import './App.css'

// Layout para páginas protegidas
const ProtectedPagesLayout: React.FC = () => {
  return (
    <MainLayout>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/paciente/novo" element={<PatientForm />} />
        <Route path="/paciente/:id" element={<PatientRecord />} />
        <Route path="/agendamentos" element={<Appointments />} />
        <Route path="/relatorios" element={<Reports />} />
        <Route path="/backup" element={<Backup />} />
        <Route path="/usuarios" element={<UserManagement />} />
        <Route path="/*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </MainLayout>
  );
};

// Componente para proteger rotas
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-indigo-600"></div>
      </div>
    )
  }

  return user ? <>{children}</> : <Navigate to="/login" replace />
}

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <Router>
        <AuthProvider>
          <div className="App">
            <AppRoutes />
          </div>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  )
}



// Componente principal de rotas
const AppRoutes: React.FC = () => {
  const { user } = useAuth()

  return (
    <Routes>
      <Route 
        path="/login" 
        element={user ? <Navigate to="/dashboard" replace /> : <Login />} 
      />
      <Route 
        path="/*" 
        element={
          <ProtectedRoute>
            <ProtectedPagesLayout />
          </ProtectedRoute>
        } 
      />
    </Routes>
  )
}

export default App