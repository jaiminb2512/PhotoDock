import React, { useState, useEffect } from 'react';
import {
    Container,
    Box,
    Typography,
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    FormControlLabel,
    Switch,
    CircularProgress,
    Snackbar,
    Alert,
    Chip,
    Tooltip,
    InputAdornment
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Refresh as RefreshIcon,
    Star as StarIcon,
    StarBorder as StarBorderIcon
} from '@mui/icons-material';
import Header from '../components/Header';
import colors from '../styles/colors';
import api, { API_ENDPOINTS, getApiUrl } from '../utils/api';

const SubscriptionPlansPage = () => {
    const [plans, setPlans] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isActionLoading, setIsActionLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    
    // Dialog State
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogMode, setDialogMode] = useState('add'); // 'add' or 'edit'
    const [selectedPlanId, setSelectedPlanId] = useState(null);
    
    // Form State
    const initialFormState = {
        planName: '',
        description: '',
        price: '',
        billingCycle: 'MONTHLY',
        durationDays: 30,
        maxPhotos: 100,
        monthlyPhotoUploads: 50,
        onlineBookingAllowed: true,
        maxOnlineBookingAllowed: 5,
        isDefault: false
    };
    const [formData, setFormData] = useState(initialFormState);

    const fetchPlans = async () => {
        setIsLoading(true);
        try {
            const url = getApiUrl(API_ENDPOINTS.SUBSCRIPTION_PLANS.endpoint);
            const response = await api.get(url);
            setPlans(response.data.data);
        } catch (error) {
            showSnackbar(error.response?.data?.message || 'Failed to fetch plans', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPlans();
    }, []);

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

    const handleOpenDialog = (mode, plan = null) => {
        setDialogMode(mode);
        if (mode === 'edit' && plan) {
            setSelectedPlanId(plan.planId);
            setFormData({
                planName: plan.planName,
                description: plan.description,
                price: plan.price,
                billingCycle: plan.billingCycle,
                durationDays: plan.durationDays,
                maxPhotos: plan.maxPhotos,
                monthlyPhotoUploads: plan.monthlyPhotoUploads,
                onlineBookingAllowed: plan.onlineBookingAllowed,
                maxOnlineBookingAllowed: plan.maxOnlineBookingAllowed || '',
                isDefault: plan.isDefault
            });
        } else {
            setSelectedPlanId(null);
            setFormData(initialFormState);
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsActionLoading(true);
        try {
            const baseUrl = getApiUrl(API_ENDPOINTS.SUBSCRIPTION_PLANS.endpoint);
            const dataToSubmit = {
                ...formData,
                price: parseFloat(formData.price),
                durationDays: parseInt(formData.durationDays),
                maxPhotos: parseInt(formData.maxPhotos),
                monthlyPhotoUploads: parseInt(formData.monthlyPhotoUploads),
                maxOnlineBookingAllowed: formData.maxOnlineBookingAllowed ? parseInt(formData.maxOnlineBookingAllowed) : null
            };

            if (dialogMode === 'add') {
                await api.post(baseUrl, dataToSubmit);
                showSnackbar('Subscription plan created successfully');
            } else {
                await api.put(`${baseUrl}/${selectedPlanId}`, dataToSubmit);
                showSnackbar('Subscription plan updated successfully');
            }
            
            handleCloseDialog();
            fetchPlans();
        } catch (error) {
            showSnackbar(error.response?.data?.message || 'Failed to save subscription plan', 'error');
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleDeletePlan = async (id) => {
        if (!window.confirm('Are you sure you want to delete this subscription plan?')) return;
        
        setIsActionLoading(true);
        try {
            const baseUrl = getApiUrl(API_ENDPOINTS.SUBSCRIPTION_PLANS.endpoint);
            await api.delete(`${baseUrl}/${id}`);
            showSnackbar('Subscription plan deleted successfully');
            fetchPlans();
        } catch (error) {
            showSnackbar(error.response?.data?.message || 'Failed to delete plan', 'error');
        } finally {
            setIsActionLoading(false);
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
            <Header shadow />
            
            {/* Spacer for fixed header */}
            <Box sx={{ height: { xs: '80px', md: '100px' } }} />

            <Container maxWidth="lg" sx={{ mt: 2, mb: 10, flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 5 }}>
                    <Box>
                        <Typography variant="h3" sx={{ 
                            fontWeight: 600, 
                            color: colors.text.heading,
                            letterSpacing: '-0.02em',
                            mb: 1
                        }}>
                            Subscription Plans
                        </Typography>
                        <Typography variant="body1" sx={{ color: colors.text.muted }}>
                            Manage your service tiers and user usage limits.
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button 
                            variant="outlined" 
                            startIcon={<RefreshIcon />} 
                            onClick={fetchPlans}
                            sx={{ 
                                borderRadius: '12px',
                                textTransform: 'none',
                                borderColor: colors.text.faint,
                                color: colors.text.medium,
                                px: 3,
                                '&:hover': {
                                    borderColor: colors.text.muted,
                                    bgcolor: 'rgba(0,0,0,0.02)'
                                }
                            }}
                        >
                            Refresh
                        </Button>
                        <Button 
                            variant="contained" 
                            startIcon={<AddIcon />} 
                            onClick={() => handleOpenDialog('add')}
                            sx={{ 
                                bgcolor: colors.accent.primary,
                                '&:hover': { bgcolor: colors.accent.dark },
                                borderRadius: '12px',
                                textTransform: 'none',
                                px: 4,
                                boxShadow: '0 4px 14px 0 rgba(74, 124, 89, 0.39)'
                            }}
                        >
                            Add New Plan
                        </Button>
                    </Box>
                </Box>

                {isLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
                        <CircularProgress sx={{ color: colors.accent.primary }} />
                    </Box>
                ) : (
                    <TableContainer 
                        component={Paper} 
                        elevation={0}
                        sx={{ 
                            borderRadius: '24px', 
                            border: `1px solid ${colors.text.faint}`,
                            background: '#ffffff',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.04)',
                            overflow: 'hidden'
                        }}
                    >
                        <Table sx={{ minWidth: 650 }} aria-label="subscription plans table">
                            <TableHead sx={{ bgcolor: '#f9fafb' }}>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 700, color: colors.text.medium, py: 3 }}>Plan Name</TableCell>
                                    <TableCell sx={{ fontWeight: 700, color: colors.text.medium }}>Price</TableCell>
                                    <TableCell sx={{ fontWeight: 700, color: colors.text.medium }}>Cycle</TableCell>
                                    <TableCell sx={{ fontWeight: 700, color: colors.text.medium }}>Limits (Photos/Uploads)</TableCell>
                                    <TableCell sx={{ fontWeight: 700, color: colors.text.medium }}>Booking</TableCell>
                                    <TableCell sx={{ fontWeight: 700, color: colors.text.medium }}>Default</TableCell>
                                    <TableCell sx={{ fontWeight: 700, color: colors.text.medium }} align="right">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {plans.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                                            <Typography color="text.secondary">No subscription plans found. Create one to get started.</Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    plans.map((plan) => (
                                        <TableRow key={plan.planId} hover>
                                            <TableCell>
                                                <Typography variant="subtitle2" fontWeight="bold">{plan.planName}</Typography>
                                                <Typography variant="caption" color="text.secondary">{plan.description}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography fontWeight="medium">${parseFloat(plan.price).toFixed(2)}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Chip 
                                                    label={plan.billingCycle} 
                                                    size="small" 
                                                    variant="outlined"
                                                    color={plan.billingCycle === 'YEARLY' ? 'primary' : 'default'}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2">{plan.maxPhotos} total / {plan.monthlyPhotoUploads} monthly</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Chip 
                                                    label={plan.onlineBookingAllowed ? `Allowed (${plan.maxOnlineBookingAllowed || '∞'})` : 'Disabled'} 
                                                    size="small" 
                                                    sx={{ 
                                                        fontWeight: 600,
                                                        bgcolor: plan.onlineBookingAllowed ? 'rgba(74, 124, 89, 0.1)' : 'rgba(211, 47, 47, 0.1)',
                                                        color: plan.onlineBookingAllowed ? colors.accent.primary : '#d32f2f',
                                                        border: 'none'
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                {plan.isDefault ? (
                                                    <Tooltip title="This plan is assigned to new users by default">
                                                        <StarIcon sx={{ color: colors.accent.primary }} />
                                                    </Tooltip>
                                                ) : (
                                                    <StarBorderIcon sx={{ color: colors.text.faint }} />
                                                )}
                                            </TableCell>
                                            <TableCell align="right">
                                                <IconButton onClick={() => handleOpenDialog('edit', plan)} size="small" sx={{ mr: 1, color: colors.text.secondary }}>
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                                <IconButton onClick={() => handleDeletePlan(plan.planId)} size="small" color="error">
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Container>

            {/* Plan Form Dialog */}
            <Dialog 
                open={openDialog} 
                onClose={handleCloseDialog} 
                maxWidth="sm" 
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        backgroundImage: 'none',
                    }
                }}
            >
                <DialogTitle sx={{ fontWeight: 'bold' }}>
                    {dialogMode === 'add' ? 'Create New Subscription Plan' : 'Edit Subscription Plan'}
                </DialogTitle>
                <DialogContent dividers>
                    <Box component="form" sx={{ mt: 1 }}>
                        <TextField
                            name="planName"
                            label="Plan Name"
                            fullWidth
                            required
                            margin="normal"
                            value={formData.planName}
                            onChange={handleInputChange}
                        />
                        <TextField
                            name="description"
                            label="Description"
                            fullWidth
                            multiline
                            rows={2}
                            margin="normal"
                            value={formData.description}
                            onChange={handleInputChange}
                        />
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField
                                name="price"
                                label="Price"
                                type="number"
                                fullWidth
                                margin="normal"
                                required
                                value={formData.price}
                                onChange={handleInputChange}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                }}
                            />
                            <TextField
                                select
                                name="billingCycle"
                                label="Billing Cycle"
                                fullWidth
                                margin="normal"
                                value={formData.billingCycle}
                                onChange={handleInputChange}
                            >
                                <MenuItem value="MONTHLY">Monthly</MenuItem>
                                <MenuItem value="YEARLY">Yearly</MenuItem>
                            </TextField>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField
                                name="durationDays"
                                label="Duration (Days)"
                                type="number"
                                fullWidth
                                margin="normal"
                                required
                                value={formData.durationDays}
                                onChange={handleInputChange}
                            />
                            <TextField
                                name="maxPhotos"
                                label="Max Photos (Total)"
                                type="number"
                                fullWidth
                                margin="normal"
                                required
                                value={formData.maxPhotos}
                                onChange={handleInputChange}
                            />
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField
                                name="monthlyPhotoUploads"
                                label="Monthly Photo Uploads"
                                type="number"
                                fullWidth
                                margin="normal"
                                required
                                value={formData.monthlyPhotoUploads}
                                onChange={handleInputChange}
                            />
                            <TextField
                                name="maxOnlineBookingAllowed"
                                label="Max Online Bookings (Optional)"
                                type="number"
                                fullWidth
                                margin="normal"
                                placeholder="Leave empty for unlimited"
                                value={formData.maxOnlineBookingAllowed}
                                onChange={handleInputChange}
                            />
                        </Box>
                        
                        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        name="onlineBookingAllowed"
                                        checked={formData.onlineBookingAllowed}
                                        onChange={handleInputChange}
                                        color="primary"
                                    />
                                }
                                label="Enable Online Booking"
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        name="isDefault"
                                        checked={formData.isDefault}
                                        onChange={handleInputChange}
                                        color="secondary"
                                    />
                                }
                                label="Set as Default Plan"
                            />
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={handleCloseDialog} color="inherit">Cancel</Button>
                    <Button 
                        onClick={handleSubmit} 
                        variant="contained" 
                        disabled={isActionLoading}
                        sx={{ 
                            bgcolor: colors.accent.primary,
                            '&:hover': { bgcolor: colors.accent.dark },
                            borderRadius: 2
                        }}
                    >
                        {isActionLoading ? <CircularProgress size={24} color="inherit" /> : (dialogMode === 'add' ? 'Create Plan' : 'Update Plan')}
                    </Button>
                </DialogActions>
            </Dialog>

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

export default SubscriptionPlansPage;
