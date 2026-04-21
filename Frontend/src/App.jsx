import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider, CssBaseline, Box } from '@mui/material'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import HomePage from './pages/HomePage.jsx'
import PricingPage from './pages/PricingPage.jsx'
import BookOnlinePage from './pages/BookOnlinePage.jsx'
import UserCreate from './pages/UserCreate.jsx'
import SubscriptionPlansPage from './pages/SubscriptionPlansPage.jsx'
import AdminProjectsPage from './pages/AdminProjectsPage.jsx'
import UserDashboard from './pages/UserDashboard.jsx'
import { lightTheme, darkTheme } from './styles/theme'
import authService from './services/authService'
import RoleRoute from './components/RoleRoute.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import './App.css'
import colors from './styles/colors'
import { AuthProvider } from './contexts/AuthContext'

function AppContent() {
  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          width: '100%',
          transition: (theme) => theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          '&::-webkit-scrollbar': {
            width: '12px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: colors.scrollbar.thumb,
            borderRadius: '6px',
            border: '2px solid transparent',
            backgroundClip: 'padding-box',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: colors.scrollbar.thumbHover,
          }
        }}
      >
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/:projectName/plans-pricing" element={<PricingPage />} />
          <Route path="/:projectName/book-online" element={<BookOnlinePage />} />
          <Route path="/:projectName" element={<HomePage />} />

          {/* Protected Routes (Authenticated Users) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/user/dashboard/:projectName" element={<UserDashboard />} />
          </Route>

          {/* Admin Routes (ADMIN only) */}
          <Route element={<RoleRoute allowedRoles={['ADMIN']} />}>
            <Route path="/admin/user-create" element={<UserCreate />} />
            <Route path="/admin/subscription-plans" element={<SubscriptionPlansPage />} />
            <Route path="/admin/projects" element={<AdminProjectsPage />} />
          </Route>
        </Routes>
      </Box>
    </Box >
  );
}

function App() {
  const [themeMode, setThemeMode] = useState('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('themeMode');
    if (savedTheme) {
      setThemeMode(savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newThemeMode = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(newThemeMode);
    localStorage.setItem('themeMode', newThemeMode);
  };

  const theme = themeMode === 'light' ? lightTheme : darkTheme;

  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <AppContent themeMode={themeMode} toggleTheme={toggleTheme} />
        </Router>
      </ThemeProvider>
    </AuthProvider>
  )
}

export default App
