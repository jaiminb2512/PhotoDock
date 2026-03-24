import React, { useState } from 'react';
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    Divider,
    Grid,
    CircularProgress,
    Snackbar,
    Alert
} from '@mui/material';
import { PersonAdd as PersonAddIcon } from '@mui/icons-material';
import Header from '../components/Header';
import colors from '../styles/colors';
import api, { API_ENDPOINTS, getApiUrl } from '../utils/api';

const AdminDashboard = () => {
    // Form State
    const [formData, setFormData] = useState({
        fullName: '',
        emailId: '',
        password: '',
        projectName: '',
        projectDescription: ''
    });

    const [isLoading, setIsLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const url = getApiUrl(API_ENDPOINTS.ADMIN_CREATE.endpoint);
            const response = await api.post(url, formData);

            setSnackbar({
                open: true,
                message: response.data.message || 'User and Project created successfully!',
                severity: 'success'
            });

            // Reset form
            setFormData({
                fullName: '',
                emailId: '',
                password: '',
                projectName: '',
                projectDescription: ''
            });
        } catch (error) {
            setSnackbar({
                open: true,
                message: error.response?.data?.message || 'Failed to create User and Project',
                severity: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
            <Header />

            <Container maxWidth="md" sx={{ mt: 10, mb: 10, flexGrow: 1 }}>

                <Paper
                    elevation={0}
                    sx={{
                        p: 5,
                        borderRadius: 4,
                        border: `1px solid ${colors.text.faint}`,
                        background: 'rgba(255, 255, 255, 0.02)',
                        backdropFilter: 'blur(10px)',
                    }}
                >
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={4}>
                            {/* User Account Section */}
                            <Grid item xs={12}>
                                <Typography variant="h6" fontWeight="bold" color="text.primary" gutterBottom>
                                    User Credentials
                                </Typography>
                                <Divider sx={{ mb: 3 }} />
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            label="Full Name"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleInputChange}
                                            fullWidth
                                            required
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            label="Email Address"
                                            name="emailId"
                                            type="email"
                                            value={formData.emailId}
                                            onChange={handleInputChange}
                                            fullWidth
                                            required
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            label="Initial Password"
                                            name="password"
                                            type="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            fullWidth
                                            required
                                            variant="outlined"
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>

                            {/* Project Workspace Section */}
                            <Grid item xs={12}>
                                <Typography variant="h6" fontWeight="bold" color="text.primary" gutterBottom sx={{ mt: 2 }}>
                                    Project Workspace Configuration
                                </Typography>
                                <Divider sx={{ mb: 3 }} />
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <TextField
                                            label="Project Name"
                                            name="projectName"
                                            value={formData.projectName}
                                            onChange={handleInputChange}
                                            fullWidth
                                            required
                                            variant="outlined"
                                            placeholder="e.g. Jaimin Photography"
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            label="Detailed Description"
                                            name="projectDescription"
                                            value={formData.projectDescription}
                                            onChange={handleInputChange}
                                            fullWidth
                                            required
                                            multiline
                                            rows={3}
                                            variant="outlined"
                                            placeholder="Overview of this photographer's focus and services..."
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>

                            {/* Submit Button */}
                            <Grid item xs={12} sx={{ mt: 2 }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    fullWidth
                                    disabled={isLoading}
                                    startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <PersonAddIcon />}
                                    sx={{
                                        py: 2,
                                        fontSize: '1.1rem',
                                        fontWeight: 'bold',
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        bgcolor: colors.accent.primary,
                                        '&:hover': {
                                            bgcolor: colors.accent.dark
                                        }
                                    }}
                                >
                                    {isLoading ? 'Provisioning...' : 'Provision User & Project Workspace'}
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Paper>
            </Container>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default AdminDashboard;
