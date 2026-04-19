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
    Alert,
    InputAdornment,
    IconButton,
    MenuItem
} from '@mui/material';
import {
    PersonAdd as PersonAddIcon,
    Visibility,
    VisibilityOff
} from '@mui/icons-material';
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
        projectDescription: '',
        displayMessage: '',
        tagline: '',
        twitterUrl: '',
        instagramUrl: '',
        facebookUrl: '',
        planId: '' // New field
    });

    const [plans, setPlans] = useState([]);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // Fetch plans on mount
    React.useEffect(() => {
        const fetchPlans = async () => {
            try {
                const url = getApiUrl(API_ENDPOINTS.SUBSCRIPTION_PLANS.endpoint);
                const response = await api.get(url);
                setPlans(response.data.data);
                
                // Auto-select default plan if any
                const defaultPlan = response.data.data.find(p => p.isDefault);
                if (defaultPlan) {
                    setFormData(prev => ({ ...prev, planId: defaultPlan.planId }));
                }
            } catch (error) {
                console.error('Failed to fetch plans:', error);
            }
        };
        fetchPlans();
    }, []);

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
                projectDescription: '',
                displayMessage: '',
                tagline: '',
                twitterUrl: '',
                instagramUrl: '',
                facebookUrl: '',
                planId: plans.find(p => p.isDefault)?.planId || ''
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
                                            type={showPassword ? 'text' : 'password'}
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            fullWidth
                                            required
                                            variant="outlined"
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            onClick={() => setShowPassword(!showPassword)}
                                                            edge="end"
                                                            sx={{ color: 'text.secondary' }}
                                                        >
                                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
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
                                            select
                                            label="Initial Subscription Plan"
                                            name="planId"
                                            value={formData.planId}
                                            onChange={handleInputChange}
                                            fullWidth
                                            required
                                            variant="outlined"
                                            helperText="Select the service tier for this photographer"
                                        >
                                            {plans.map((option) => (
                                                <MenuItem key={option.planId} value={option.planId}>
                                                    {option.planName} (${parseFloat(option.price).toFixed(2)} / {option.billingCycle})
                                                </MenuItem>
                                            ))}
                                            {plans.length === 0 && (
                                                <MenuItem disabled value="">
                                                    No plans available. Create one first.
                                                </MenuItem>
                                            )}
                                        </TextField>
                                    </Grid>
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
                                    <Grid item xs={12}>
                                        <TextField
                                            label="Public Display Message"
                                            name="displayMessage"
                                            value={formData.displayMessage}
                                            onChange={handleInputChange}
                                            fullWidth
                                            required
                                            multiline
                                            rows={2}
                                            variant="outlined"
                                            placeholder="A short welcome message for visitors (e.g. Capturing your best moments...)"
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            label="Tagline / Motto"
                                            name="tagline"
                                            value={formData.tagline}
                                            onChange={handleInputChange}
                                            fullWidth
                                            variant="outlined"
                                            placeholder="Optional short catchy phrase..."
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>

                            {/* Social Presence Section */}
                            <Grid item xs={12}>
                                <Typography variant="h6" fontWeight="bold" color="text.primary" gutterBottom sx={{ mt: 2 }}>
                                    Social Presence
                                </Typography>
                                <Divider sx={{ mb: 3 }} />
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={4}>
                                        <TextField
                                            label="Instagram URL"
                                            name="instagramUrl"
                                            value={formData.instagramUrl}
                                            onChange={handleInputChange}
                                            fullWidth
                                            variant="outlined"
                                            placeholder="https://instagram.com/..."
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <TextField
                                            label="Facebook URL"
                                            name="facebookUrl"
                                            value={formData.facebookUrl}
                                            onChange={handleInputChange}
                                            fullWidth
                                            variant="outlined"
                                            placeholder="https://facebook.com/..."
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <TextField
                                            label="Twitter URL"
                                            name="twitterUrl"
                                            value={formData.twitterUrl}
                                            onChange={handleInputChange}
                                            fullWidth
                                            variant="outlined"
                                            placeholder="https://twitter.com/..."
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
