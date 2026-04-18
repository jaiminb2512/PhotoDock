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
                setProjectInfo(projectResponse.data); 
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
            default:
                return {};
        }
    };

    const getGroupedPhotos = () => {
        if (!photos || photos.length === 0) return [];

        const grouped = photos.reduce((acc, photo) => {
            const setKey = photo.setNo ?? 0;
            if (!acc[setKey]) acc[setKey] = [];
            acc[setKey].push(photo);
            return acc;
        }, {});

        return Object.keys(grouped)
            .map((setKey) => ({
                setNo: Number(setKey),
                photos: grouped[setKey].sort((a, b) => {
                    if (a.sequence !== b.sequence) return a.sequence - b.sequence;
                    return new Date(a.createdAt) - new Date(b.createdAt);
                })
            }))
            .sort((a, b) => a.setNo - b.setNo);
    };

    const groupedPhotos = getGroupedPhotos();

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

                    {/* Gallery grouped by setNo - each set in single row */}
                    <Box sx={{ px: { xs: 0, md: 0, lg: 4 }, mb: 10 }}>
                        {groupedPhotos.length === 0 ? (
                            <Typography variant="body2" sx={{ textAlign: 'center', color: colors.text.light, fontStyle: 'italic' }}>
                                No photos found for this project yet.
                            </Typography>
                        ) : (
                            groupedPhotos.map((group) => (
                                <Box key={group.setNo} sx={{ mb: 6 }}>
                                    {/* Special handling for setNo 1 (main photo - single and bigger) */}
                                    {group.setNo === 1 ? (
                                        <Box sx={{ width: '100%' }}>
                                            {group.photos.map((photo, index) => (
                                                <Box
                                                    key={photo.photoId || index}
                                                    component="img"
                                                    src={photo.photoUrl}
                                                    alt={photo.photoName}
                                                    sx={{
                                                        width: '100%',
                                                        height: { xs: '300px', sm: '400px', md: '500px' },
                                                        objectFit: 'contain',
                                                        display: 'block',
                                                        borderRadius: '4px',
                                                        backgroundColor: '#f5f5f5'
                                                    }}
                                                />
                                            ))}
                                        </Box>
                                    ) : (
                                        /* Dynamic grid for other sets - tries to fit all in single row */
                                        <Box
                                            sx={{
                                                display: 'grid',
                                                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                                gap: '8px',
                                                width: '100%'
                                            }}
                                        >
                                            {group.photos.map((photo, index) => (
                                                <Box
                                                    key={photo.photoId || index}
                                                    component="img"
                                                    src={photo.photoUrl}
                                                    alt={photo.photoName}
                                                    sx={{
                                                        width: '100%',
                                                        height: { xs: '200px', sm: '250px', md: '300px' },
                                                        objectFit: 'contain',
                                                        display: 'block',
                                                        borderRadius: '4px',
                                                        backgroundColor: '#f5f5f5'
                                                    }}
                                                />
                                            ))}
                                        </Box>
                                    )}

                                </Box>
                            ))
                        )}
                    </Box>
                </>
            )}

            <Footer projectInfo={projectInfo} />
        </Box>
    );
};

export default HomePage;
