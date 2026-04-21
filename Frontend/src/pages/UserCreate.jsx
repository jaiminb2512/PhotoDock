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

const UserCreate = () => {
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
        planId: ''
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
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            bgcolor: 'background.default',
            overflowX: 'hidden'
        }}>
            <Header />

            <Container maxWidth="none" sx={{ mt: 8, mb: 10, flexGrow: 1 }}>

                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 3, md: 6 },
                        borderRadius: 6,
                        border: `1px solid ${colors.text.faint}`,
                        background: 'rgba(255, 255, 255, 0.01)',
                        backdropFilter: 'blur(20px)',
                        boxShadow: '0 30px 60px rgba(0,0,0,0.05)',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={6}>
                            {/* Left Side: User Account */}
                            <Grid item xs={12} lg={5}>
                                <Box sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between'
                                }}>
                                    <Box>
                                        <Typography variant="h5" fontWeight="800" color="text.primary" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                            <Box sx={{ width: 4, height: 24, bgcolor: colors.accent.primary, borderRadius: 1 }} />
                                            User Identity
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                                            Primary account details for the photographer's login.
                                        </Typography>

                                        <Grid container spacing={3}>
                                            <Grid item xs={12}>
                                                <TextField
                                                    label="Full Legal Name"
                                                    name="fullName"
                                                    value={formData.fullName}
                                                    onChange={handleInputChange}
                                                    fullWidth
                                                    required
                                                    variant="outlined"
                                                    placeholder="John Doe"
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    label="Email Address"
                                                    name="emailId"
                                                    type="email"
                                                    value={formData.emailId}
                                                    onChange={handleInputChange}
                                                    fullWidth
                                                    required
                                                    variant="outlined"
                                                    placeholder="john@example.com"
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    label="Secure Password"
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
                                    </Box>

                                    <Box sx={{ mt: 6 }}>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            fullWidth
                                            disabled={isLoading}
                                            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <PersonAddIcon />}
                                            sx={{
                                                py: 2.5,
                                                fontSize: '1.1rem',
                                                fontWeight: '800',
                                                borderRadius: 3,
                                                textTransform: 'none',
                                                bgcolor: colors.accent.primary,
                                                boxShadow: `0 10px 20px ${colors.accent.primary}33`,
                                                '&:hover': {
                                                    bgcolor: colors.accent.dark,
                                                    boxShadow: `0 15px 30px ${colors.accent.primary}44`,
                                                }
                                            }}
                                        >
                                            {isLoading ? 'Creating Workspace...' : 'Deploy User & Workspace'}
                                        </Button>
                                    </Box>
                                </Box>
                            </Grid>

                            <Grid item xs={12} lg={1} sx={{ display: { xs: 'none', lg: 'flex' }, justifyContent: 'center' }}>
                                <Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />
                            </Grid>

                            {/* Right Side: Project & Social */}
                            <Grid item xs={12} lg={6}>
                                <Box>
                                    <Typography variant="h5" fontWeight="800" color="text.primary" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                        <Box sx={{ width: 4, height: 24, bgcolor: colors.accent.primary, borderRadius: 1 }} />
                                        Workspace Configuration
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                                        Define the project scope and social media footprint.
                                    </Typography>

                                    <Grid container spacing={3}>
                                        <Grid item xs={12}>
                                            <TextField
                                                select
                                                label="Service Tier / Plan"
                                                name="planId"
                                                value={formData.planId}
                                                onChange={handleInputChange}
                                                fullWidth
                                                required
                                                variant="outlined"
                                                helperText="Determines storage and feature limits"
                                            >
                                                {plans.map((option) => (
                                                    <MenuItem key={option.planId} value={option.planId}>
                                                        {option.planName} — ₹ {parseFloat(option.price).toFixed(2)} / {option.billingCycle}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                label="Project Brand Name"
                                                name="projectName"
                                                value={formData.projectName}
                                                onChange={handleInputChange}
                                                fullWidth
                                                required
                                                variant="outlined"
                                                placeholder="e.g. JDS Studios"
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                label="Public Motto / Tagline"
                                                name="tagline"
                                                value={formData.tagline}
                                                onChange={handleInputChange}
                                                fullWidth
                                                variant="outlined"
                                                placeholder="Capturing life's best moments"
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                label="Description"
                                                name="projectDescription"
                                                value={formData.projectDescription}
                                                onChange={handleInputChange}
                                                fullWidth
                                                required
                                                multiline
                                                rows={3}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                label="Welcome Message"
                                                name="displayMessage"
                                                value={formData.displayMessage}
                                                onChange={handleInputChange}
                                                fullWidth
                                                required
                                                multiline
                                                rows={3}
                                            />
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Typography variant="subtitle2" fontWeight="700" color="text.secondary" sx={{ mt: 2, mb: 1, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                                Social Connectivity
                                            </Typography>
                                            <Divider sx={{ mb: 3 }} />
                                            <Grid container spacing={2}>
                                                <Grid item xs={12} md={4}>
                                                    <TextField
                                                        label="Instagram"
                                                        name="instagramUrl"
                                                        value={formData.instagramUrl}
                                                        onChange={handleInputChange}
                                                        fullWidth
                                                        placeholder="@username"
                                                    />
                                                </Grid>
                                                <Grid item xs={12} md={4}>
                                                    <TextField
                                                        label="Facebook"
                                                        name="facebookUrl"
                                                        value={formData.facebookUrl}
                                                        onChange={handleInputChange}
                                                        fullWidth
                                                        placeholder="facebook.com/..."
                                                    />
                                                </Grid>
                                                <Grid item xs={12} md={4}>
                                                    <TextField
                                                        label="Twitter"
                                                        name="twitterUrl"
                                                        value={formData.twitterUrl}
                                                        onChange={handleInputChange}
                                                        fullWidth
                                                        placeholder="@twitter"
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Box>
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

export default UserCreate;
