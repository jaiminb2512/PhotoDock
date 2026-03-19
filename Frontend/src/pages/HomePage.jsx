import React, { useEffect, useState } from 'react';
import { 
    Box, 
    Typography, 
    Container, 
    Paper, 
    Button, 
    Grid, 
    Avatar,
    Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import authService from '../services/authService';

const HomePage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    const handleLogout = async () => {
        await authService.logout();
        navigate('/login');
    };

    return (
        <Box sx={{ 
            minHeight: '100vh', 
            bgcolor: '#f8f9fa',
            pt: 8,
            pb: 4
        }}>
            <Container maxWidth="md">
                <Paper elevation={0} sx={{ 
                    p: 4, 
                    borderRadius: 4, 
                    textAlign: 'center',
                    border: '1px solid #e0e0e0',
                    background: 'linear-gradient(135deg, #ffffff 0%, #f1f4f8 100%)'
                }}>
                    <Avatar sx={{ 
                        width: 100, 
                        height: 100, 
                        bgcolor: 'primary.main', 
                        mx: 'auto', 
                        mb: 2,
                        boxShadow: '0 4px 20px rgba(25, 118, 210, 0.3)'
                    }}>
                        <PersonIcon sx={{ fontSize: 60 }} />
                    </Avatar>
                    
                    <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 800, color: '#1a202c' }}>
                        Welcome to PhotoDock
                    </Typography>
                    
                    <Typography variant="h6" color="text.secondary" sx={{ mb: 4, fontWeight: 400 }}>
                        {user ? `Hello, ${user.fullName || user.emailId || 'User'}!` : 'You are successfully logged in.'}
                    </Typography>

                    <Divider sx={{ mb: 4 }} />

                    <Grid container spacing={3} justifyContent="center">
                        <Grid item xs={12} sm={6}>
                            <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #edf2f7' }}>
                                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                                    Your Dashboard
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    This is your simplified workspace. Everything you need is right here.
                                </Typography>
                                <Button variant="outlined" color="primary" fullWidth>
                                    View Settings
                                </Button>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #edf2f7' }}>
                                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                                    Quick Actions
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    Ready to sign out? You can always come back and pick up where you left off.
                                </Typography>
                                <Button 
                                    variant="contained" 
                                    color="error" 
                                    startIcon={<LogoutIcon />}
                                    onClick={handleLogout}
                                    fullWidth
                                >
                                    Logout
                                </Button>
                            </Paper>
                        </Grid>
                    </Grid>
                </Paper>

                <Box sx={{ mt: 4, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                        © {new Date().getFullYear()} PhotoDock. All rights reserved.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default HomePage;
