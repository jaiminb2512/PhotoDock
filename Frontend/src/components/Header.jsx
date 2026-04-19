import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button
} from '@mui/material';
import { useNavigate, Link, useParams } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import authService from '../services/authService';
import colors from '../styles/colors';

const Header = ({ shadow }) => {
    const navigate = useNavigate();
    const { projectName: urlProjectName } = useParams();
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
            borderBottom: shadow ? 'none' : colors.border.light,
            boxShadow: shadow ? '0 4px 20px rgba(0,0,0,0.08)' : 'none',
            bgcolor: colors.white,
            color: colors.black,
            fontFamily: colors.font.serif,
            position: shadow ? 'fixed' : 'relative',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1100
        }}>
            <Box sx={{ display: 'flex', gap: 3 }}>
                {[
                    ...(user?.role === 'ADMIN' ? [
                        { label: 'DASHBOARD', path: '/admin/dashboard' },
                        { label: 'SUBSCRIPTION PLANS', path: '/admin/subscription-plans' }
                    ] : [
                        ...(user ? [
                            { label: 'MY PROJECT', path: `/user/dashboard/${user.projectName}` }
                        ] : []),
                        { label: 'HOME', path: `/${user?.projectName || urlProjectName || 'default'}` },
                        { label: 'BOOK ONLINE', path: `/${user?.projectName || urlProjectName || 'default'}/book-online` },
                        { label: 'Plans & Pricing', path: `/${user?.projectName || urlProjectName || 'default'}/plans-pricing` }
                    ])
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
                            fontFamily: colors.font.sans
                        }}>
                        {item.label}
                    </Typography>
                ))}
            </Box>

            <Box sx={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => navigate('/')}>
                <Typography variant="h4" sx={{ fontWeight: 500, letterSpacing: '0.05em', lineHeight: 1.1 }}>
                    {user?.fullName || urlProjectName || 'Maulik Doshi'}
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
                        sx={{ color: colors.black, fontSize: '0.85rem', textTransform: 'none' }}
                    >
                        Log In
                    </Button>
                )}
            </Box>
        </Box>
    );
};

export default Header;
