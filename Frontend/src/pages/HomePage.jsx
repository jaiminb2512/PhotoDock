import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Container,
    Grid,
    CircularProgress
} from '@mui/material';
import Header from '../components/Header';
import Footer from '../components/Footer';
import colors from '../styles/colors';
import photoService from '../services/photoService';

const HomePage = () => {
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPhotos = async () => {
            try {
                const data = await photoService.getPhotos();
                setPhotos(data);
            } catch (error) {
                console.error("Error fetching photos:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPhotos();
    }, []);

    // Helper to determine grid width and height based on masonry pattern (repeat every 6 images)
    const getGridStyles = (index) => {
        const patternIdx = index % 6;

        switch (patternIdx) {
            case 0: // Hero image (1st in every set of 6)
                return { xs: 12, md: 12, height: { xs: '400px', md: '700px' } };
            case 1:
            case 2: // Side-by-side (2nd & 3rd)
                return { xs: 12, md: 6, height: '500px' };
            case 3:
            case 4:
            case 5: // Three-column (4th, 5th, 6th)
                return { xs: 12, md: 4, height: '400px' };
            default:
                return { xs: 12, md: 12, height: '400px' };
        }
    };

    return (
        <Box sx={{ bgcolor: colors.white, minHeight: '100vh', color: colors.black, fontFamily: colors.font.serif }}>
            {/* Shared Header */}
            <Header />

            <Container maxWidth="md" sx={{ mt: 10, mb: 10, textAlign: 'center' }}>
                <Typography variant="h3" sx={{ mb: 4, fontWeight: 300, color: colors.text.heading }}>
                    Embrace The Journey
                </Typography>

                <Box sx={{ maxWidth: '700px', mx: 'auto', mb: 4 }}>
                    <Typography variant="body1" sx={{
                        lineHeight: 1.8,
                        fontSize: '1.1rem',
                        color: colors.text.dark,
                        fontFamily: colors.font.serif,
                        fontStyle: 'italic'
                    }}>
                        Photographs have always been a powerful way to experience some of the most cherished moments of our lives. They become heirlooms that we pass down from generation to generation. My passion lies in creating photographs that document these moments in an intentional, artful and cinematic way. I often think about how my photos would feel like in someone's hand 15-20 years from now. Are they going to smile or cry when they revisit those moments..? I hope my photography will make much comfort in a way nothing else can....!!!
                    </Typography>
                </Box>

                <Box sx={{ mb: 6 }}>
                    <Typography variant="body1" sx={{ color: colors.black, fontSize: '1rem' }}>
                        Let us write all the chapters of your beautiful fairy-tale to make it the most memorable phase of your life...
                    </Typography>
                    <Typography variant="h6" sx={{ mt: 2, fontWeight: 400 }}>
                        - Maulik Doshi
                    </Typography>
                </Box>
            </Container>

            {/* Dynamic Masonry-style Gallery */}
            <Box sx={{ px: { xs: 0, md: 4, lg: 8 }, mb: 10 }}>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                        <CircularProgress color="inherit" />
                    </Box>
                ) : (
                    <Grid container spacing={1}>
                        {photos.map((photo, index) => {
                            const styles = getGridStyles(index);
                            return (
                                <Grid item xs={styles.xs} md={styles.md} key={photo.photoId || index}>
                                    <Box
                                        component="img"
                                        src={photo.photoUrl}
                                        alt={photo.photoName}
                                        sx={{
                                            width: '100%',
                                            height: styles.height,
                                            objectFit: 'cover',
                                            display: 'block'
                                        }}
                                    />
                                </Grid>
                            );
                        })}
                    </Grid>
                )}
            </Box>

            <Footer />
        </Box>
    );
};

export default HomePage;
