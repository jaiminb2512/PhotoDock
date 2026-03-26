import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
import projectService from '../services/projectService';

const HomePage = () => {
    const { projectName } = useParams();
    const [photos, setPhotos] = useState([]);
    const [projectInfo, setProjectInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPageData = async () => {
            try {
                // Fetch both photos and project info in parallel
                const [photosData, projectResponse] = await Promise.all([
                    photoService.getPhotos({ projectName }),
                    projectService.getProjectByProjectName(projectName)
                ]);

                setPhotos(photosData);
                setProjectInfo(projectResponse.data); // Based on response structure provided
                console.log(projectResponse.data);
            } catch (error) {
                console.error("Error fetching homepage data:", error);
            } finally {
                setLoading(false);
            }
        };

        if (projectName) {
            fetchPageData();
        }
    }, [projectName]);

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

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                    <CircularProgress color="inherit" />
                </Box>
            ) : (
                <>
                    <Container maxWidth="md" sx={{ mt: 10, mb: 10, textAlign: 'center' }}>
                        <Typography variant="h3" sx={{ mb: 4, fontWeight: 300, color: colors.text.heading, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                            {projectInfo?.tagline || "PORTFOLIO"}
                        </Typography>

                        <Box sx={{ maxWidth: '700px', mx: 'auto', mb: 4 }}>
                            <Typography variant="body1" sx={{
                                lineHeight: 1.8,
                                fontSize: '1.1rem',
                                color: colors.text.dark,
                                fontFamily: colors.font.serif,
                                fontStyle: 'italic'
                            }}>
                                {projectInfo?.displayMessage || "Welcome to my portfolio. Capturing moments that last forever."}
                            </Typography>
                        </Box>

                        <Box sx={{ mb: 6 }}>
                            <Typography variant="h6" sx={{ mt: 2, fontWeight: 400, letterSpacing: '0.05em' }}>
                                — {projectInfo?.projectName || "Not Found"}
                            </Typography>
                        </Box>
                    </Container>

                    {/* Dynamic Masonry-style Gallery */}
                    <Box sx={{ px: { xs: 0, md: 4, lg: 8 }, mb: 10 }}>
                        {photos.length === 0 ? (
                            <Typography variant="body2" sx={{ textAlign: 'center', color: colors.text.light, fontStyle: 'italic' }}>
                                No photos found for this project yet.
                            </Typography>
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
                </>
            )}

            <Footer projectInfo={projectInfo} />
        </Box>
    );
};

export default HomePage;
