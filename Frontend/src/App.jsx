import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider, CssBaseline, Box } from '@mui/material'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import HomePage from './pages/HomePage.jsx'
import PricingPage from './pages/PricingPage.jsx'
import BookOnlinePage from './pages/BookOnlinePage.jsx'
import { lightTheme, darkTheme } from './styles/theme'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import authService from './services/authService'
import './App.css'
import colors from './styles/colors'

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
          <Route path="/" element={<HomePage />} />
          <Route path="/plans-pricing" element={<PricingPage />} />
          <Route path="/book-online" element={<BookOnlinePage />} />
        </Routes>
      </Box>
    </Box>
  );
}

function App() {
  const [themeMode, setThemeMode] = useState('light');

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Verify token on app load
      authService.verifyToken().catch(() => {
        // Token invalid, will be handled by ProtectedRoute
        console.log("Token verification failed on app load");
      });
    }

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
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppContent themeMode={themeMode} toggleTheme={toggleTheme} />
      </Router>
    </ThemeProvider>
  )
}

export default App
