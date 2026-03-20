import React from 'react';
import { 
    Box, 
    Typography, 
    Container, 
    Grid
} from '@mui/material';
import Header from '../components/Header';
import Footer from '../components/Footer';

const HomePage = () => {
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
            {/* Shared Header */}
            <Header />

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

            <Footer />
        </Box>
    );
};

export default HomePage;
