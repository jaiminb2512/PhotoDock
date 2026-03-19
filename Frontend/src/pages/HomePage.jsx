import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Container,
    Grid,
    Button,
    IconButton,
    Link as MuiLink,
    Divider
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import authService from '../services/authService';

const HomePage = () => {
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

    // Placeholder high-quality photography images
    const photos = [
        "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2069&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1519225497282-14ad01974078?q=80&w=1974&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=2070&auto=format&fit=crop"
    ];

    return (
        <Box sx={{ bgcolor: '#ffffff', minHeight: '100vh', color: '#000000', fontFamily: 'serif' }}>
            {/* Navigation Header */}
            <Box component="header" sx={{
                py: 3,
                px: { xs: 2, md: 6 },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid rgba(0,0,0,0.05)'
            }}>
                <Box sx={{ display: 'flex', gap: 3 }}>
                    {['HOME', 'BOOK ONLINE', 'Plans & Pricing'].map((item) => (
                        <Typography key={item} sx={{
                            fontSize: '0.8rem',
                            letterSpacing: '0.1em',
                            cursor: 'pointer',
                            '&:hover': { opacity: 0.7 },
                            fontWeight: 400,
                            fontFamily: 'system-ui, -apple-system, sans-serif'
                        }}>
                            {item}
                        </Typography>
                    ))}
                </Box>

                <Box sx={{ textAlign: 'center' }}>
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

            <Container maxWidth="md" sx={{ mt: 10, mb: 10, textAlign: 'center' }}>
                <Typography variant="h3" sx={{ mb: 4, fontWeight: 300, color: '#1a1a1a' }}>
                    Embrace The Journey
                </Typography>

                <Box sx={{ maxWidth: '700px', mx: 'auto', mb: 4 }}>
                    <Typography variant="body1" sx={{
                        lineHeight: 1.8,
                        fontSize: '1.1rem',
                        color: '#333',
                        fontFamily: 'serif',
                        fontStyle: 'italic'
                    }}>
                        Photographs have always been a powerful way to experience some of the most cherished moments of our lives. They become heirlooms that we pass down from generation to generation. My passion lies in creating photographs that document these moments in an intentional, artful and cinematic way. I often think about how my photos would feel like in someone's hand 15-20 years from now. Are they going to smile or cry when they revisit those moments..? I hope my photography will make much comfort in a way nothing else can....!!!
                    </Typography>
                </Box>

                <Box sx={{ mb: 6 }}>
                    <Typography variant="body1" sx={{ color: '#000', fontSize: '1rem' }}>
                        Let us write all the chapters of your beautiful fairy-tale to make it the most memorable phase of your life...
                    </Typography>
                    <Typography variant="h6" sx={{ mt: 2, fontWeight: 400 }}>
                        - Maulik Doshi
                    </Typography>
                </Box>
            </Container>

            {/* Masonry-style Gallery */}
            <Box sx={{ px: { xs: 0, md: 4, lg: 8 }, mb: 10 }}>
                <Grid container spacing={1}>
                    {/* Hero Image */}
                    <Grid item xs={12}>
                        <Box
                            component="img"
                            src={photos[0]}
                            sx={{
                                width: '100%',
                                height: { xs: '400px', md: '700px' },
                                objectFit: 'cover',
                                display: 'block'
                            }}
                        />
                    </Grid>

                    {/* Grid items */}
                    <Grid item xs={12} md={6}>
                        <Box
                            component="img"
                            src={photos[1]}
                            sx={{
                                width: '100%',
                                height: '500px',
                                objectFit: 'cover',
                                display: 'block'
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box
                            component="img"
                            src={photos[2]}
                            sx={{
                                width: '100%',
                                height: '500px',
                                objectFit: 'cover',
                                display: 'block'
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Box
                            component="img"
                            src={photos[3]}
                            sx={{ width: '100%', height: '400px', objectFit: 'cover', display: 'block' }}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Box
                            component="img"
                            src={photos[4]}
                            sx={{ width: '100%', height: '400px', objectFit: 'cover', display: 'block' }}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Box
                            component="img"
                            src={photos[5]}
                            sx={{ width: '100%', height: '400px', objectFit: 'cover', display: 'block' }}
                        />
                    </Grid>
                </Grid>
            </Box>

            {/* Simple Footer */}
            <Box component="footer" sx={{
                py: 10,
                px: 4,
                textAlign: 'center',
                bgcolor: '#ffffff',
                borderTop: '1px solid rgba(0,0,0,0.05)'
            }}>
                <Box sx={{ mb: 4 }}>
                    <IconButton sx={{ color: '#000' }}><InstagramIcon /></IconButton>
                    <IconButton sx={{ color: '#000' }}><FacebookIcon /></IconButton>
                </Box>
                <Typography variant="body2" sx={{ color: '#666', letterSpacing: '0.1em' }}>
                    © {new Date().getFullYear()} MAULIK DOSHI PHOTOGRAPHY
                </Typography>
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 3 }}>
                    <MuiLink href="#" color="inherit" sx={{ fontSize: '0.75rem', textDecoration: 'none' }}>Privacy Policy</MuiLink>
                    <MuiLink href="#" color="inherit" sx={{ fontSize: '0.75rem', textDecoration: 'none' }}>Terms & Conditions</MuiLink>
                </Box>
            </Box>
        </Box>
    );
};

export default HomePage;
