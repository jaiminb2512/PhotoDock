import React, { useState, useEffect } from 'react';
import { 
    Box, 
    Typography, 
    Button,
    IconButton
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import authService from '../services/authService';

const Header = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userData = authService.getCurrentUser();
        if (userData) {
            setUser(userData);
        }
    }, []);

    const handleLogout = async () => {
        await authService.logout();
        navigate('/login');
    };

    return (
        <Box component="header" sx={{ 
            py: 3, 
            px: { xs: 2, md: 6 }, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(0,0,0,0.05)',
            bgcolor: '#ffffff',
            color: '#000000',
            fontFamily: 'serif'
        }}>
            <Box sx={{ display: 'flex', gap: 3 }}>
                {[
                    { label: 'HOME', path: '/' },
                    { label: 'BOOK ONLINE', path: '/book-online' },
                    { label: 'Plans & Pricing', path: '/plans-pricing' }
                ].map((item) => (
                    <Typography 
                        key={item.label} 
                        component={Link}
                        to={item.path}
                        sx={{ 
                            fontSize: '0.8rem', 
                            letterSpacing: '0.1em', 
                            cursor: 'pointer',
                            textDecoration: 'none',
                            color: 'inherit',
                            '&:hover': { opacity: 0.7 },
                            fontWeight: 400,
                            fontFamily: 'system-ui, -apple-system, sans-serif'
                        }}>
                        {item.label}
                    </Typography>
                ))}
            </Box>

            <Box sx={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => navigate('/')}>
                <Typography variant="h4" sx={{ fontWeight: 500, letterSpacing: '0.05em', lineHeight: 1.1 }}>
                    Maulik Doshi
                </Typography>
                <Typography variant="caption" sx={{ letterSpacing: '0.3em', fontSize: '0.65rem' }}>
                    PHOTOGRAPHY
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {user ? (
                    <>
                        <Typography sx={{ fontSize: '0.9rem', mr: 1 }}>{user.fullName}</Typography>
                        <Button size="small" variant="text" color="inherit" onClick={handleLogout} sx={{ fontSize: '0.75rem' }}>
                            LOGOUT
                        </Button>
                    </>
                ) : (
                    <Button 
                        component={Link} 
                        to="/login"
                        startIcon={<AccountCircleIcon />} 
                        sx={{ color: '#000000', fontSize: '0.85rem', textTransform: 'none' }}
                    >
                        Log In
                    </Button>
                )}
            </Box>
        </Box>
    );
};

export default Header;
