import React from 'react';
import { 
    Box, 
    List, 
    ListItem, 
    ListItemButton, 
    ListItemIcon, 
    ListItemText, 
    Typography,
    Divider,
    Button
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Dashboard as DashboardIcon,
    Assignment as ProjectsIcon,
    Subscriptions as PlansIcon,
    Logout as LogoutIcon,
    PersonAdd as CreateIcon,
    AccountCircle as UserIcon
} from '@mui/icons-material';
import authService from '../services/authService';
import colors from '../styles/colors';

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = authService.getCurrentUser();

    const isAdmin = user?.role === 'ADMIN';

    const adminLinks = [
        { label: 'Create User', path: '/admin/user-create', icon: <CreateIcon /> },
        { label: 'Projects', path: '/admin/projects', icon: <ProjectsIcon /> },
        { label: 'Subscription Plans', path: '/admin/subscription-plans', icon: <PlansIcon /> }
    ];

    const userLinks = [
        { label: 'Dashboard', path: `/user/dashboard/${user?.projectName}`, icon: <DashboardIcon /> }
    ];

    const handleLogout = async () => {
        await authService.logout();
        navigate('/login');
    };

    const links = isAdmin ? adminLinks : userLinks;

    return (
        <Box sx={{ 
            width: 280, 
            height: '100vh', 
            bgcolor: '#ffffff', 
            borderRight: `1px solid ${colors.text.faint}`,
            display: 'flex',
            flexDirection: 'column',
            position: 'fixed',
            left: 0,
            top: 0,
            zIndex: 1200
        }}>
            {/* Logo Area */}
            <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h5" sx={{ 
                    fontWeight: 700, 
                    color: colors.accent.primary,
                    letterSpacing: '-0.02em',
                    fontFamily: colors.font.serif
                }}>
                    PhotoDock
                </Typography>
                <Typography variant="caption" sx={{ 
                    color: colors.text.muted, 
                    letterSpacing: '0.15em',
                    fontSize: '0.65rem',
                    textTransform: 'uppercase'
                }}>
                    {isAdmin ? 'Management Console' : 'Photographer Panel'}
                </Typography>
            </Box>

            <Divider sx={{ mb: 2, opacity: 0.6 }} />

            {/* Navigation Links */}
            <List sx={{ px: 2, flexGrow: 1 }}>
                {links.map((item) => (
                    <ListItem key={item.label} disablePadding sx={{ mb: 1 }}>
                        <ListItemButton 
                            onClick={() => navigate(item.path)}
                            selected={location.pathname === item.path}
                            sx={{
                                borderRadius: '12px',
                                color: location.pathname === item.path ? colors.accent.primary : colors.text.medium,
                                bgcolor: location.pathname === item.path ? 'rgba(74, 124, 89, 0.08)' : 'transparent',
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    bgcolor: 'rgba(74, 124, 89, 0.04)'
                                },
                                '&.Mui-selected': {
                                    bgcolor: 'rgba(74, 124, 89, 0.08)',
                                    color: colors.accent.primary,
                                    '&:hover': {
                                        bgcolor: 'rgba(74, 124, 89, 0.12)'
                                    }
                                }
                            }}
                        >
                            <ListItemIcon sx={{ 
                                color: 'inherit',
                                minWidth: 40
                            }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText 
                                primary={item.label} 
                                primaryTypographyProps={{ 
                                    fontWeight: location.pathname === item.path ? 700 : 500,
                                    fontSize: '0.9rem',
                                    letterSpacing: '0.02em'
                                }} 
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>

            <Divider sx={{ opacity: 0.6 }} />

            {/* Profile & Logout Section */}
            <Box sx={{ p: 3 }}>
                <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1.5, 
                    mb: 3, 
                    p: 1.5,
                    borderRadius: '16px',
                    bgcolor: '#f9fafb'
                }}>
                    <Box sx={{ 
                        width: 42, 
                        height: 42, 
                        bgcolor: colors.accent.primary, 
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        boxShadow: '0 4px 10px rgba(74, 124, 89, 0.2)'
                    }}>
                        <UserIcon fontSize="small" />
                    </Box>
                    <Box sx={{ overflow: 'hidden' }}>
                        <Typography variant="body2" fontWeight={700} noWrap sx={{ color: colors.text.heading }}>
                            {user?.fullName || 'User'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block', opacity: 0.8 }}>
                            {user?.emailId || 'account@photodock.com'}
                        </Typography>
                    </Box>
                </Box>
                <Button
                    fullWidth
                    variant="text"
                    startIcon={<LogoutIcon />}
                    onClick={handleLogout}
                    sx={{
                        borderRadius: '12px',
                        textTransform: 'none',
                        color: colors.text.medium,
                        justifyContent: 'flex-start',
                        px: 2,
                        py: 1,
                        '&:hover': {
                            color: '#d32f2f',
                            bgcolor: 'rgba(211, 47, 47, 0.04)'
                        }
                    }}
                >
                    Sign Out
                </Button>
            </Box>
        </Box>
    );
};

export default Sidebar;
