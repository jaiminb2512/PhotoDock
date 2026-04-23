import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Container,
    Grid,
    Button,
    Divider,
    Modal,
    TextField,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import colors from '../styles/colors';
import api, { API_ENDPOINTS } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import { useParams } from 'react-router-dom';

const PricingPage = () => {
    const { isAuthenticated } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPlanId, setEditingPlanId] = useState(null);
    const [newPlan, setNewPlan] = useState({ title: '', price: '', validity: '', description: '' });
    const projectName = useParams().projectName;

    const [plans, setPlans] = useState([]);

    // Delete Confirmation State
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [planToDelete, setPlanToDelete] = useState(null);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await api({
                    method: API_ENDPOINTS.GET_SERVICES.method,
                    url: `${API_ENDPOINTS.CREATE_SERVICE.endpoint}/${projectName}`
                });
                if (response.data && response.data.data) {
                    const fetchedPlans = response.data.data.map(service => ({
                        id: service.serviceId,
                        title: service.serviceName,
                        price: service.servicePrice,
                        description: service.serviceDescription || "",
                        validity: "" // Validity isn't natively stored or can be extracted from description if needed
                    }));
                    setPlans(fetchedPlans);
                }
            } catch (error) {
                console.error("Failed to fetch services:", error);
            }
        };

        fetchServices();
    }, []);

    const handleOpen = () => {
        setEditingPlanId(null);
        setNewPlan({ title: '', price: '', validity: '', description: '' });
        setIsModalOpen(true);
    };

    const handleClose = () => {
        setIsModalOpen(false);
        setEditingPlanId(null);
        setNewPlan({ title: '', price: '', validity: '', description: '' });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewPlan(prev => ({ ...prev, [name]: value }));
    };

    const handleEditClick = (plan) => {
        setEditingPlanId(plan.id);
        setNewPlan({
            title: plan.title,
            price: plan.price,
            description: plan.description,
            validity: plan.validity
        });
        setIsModalOpen(true);
    };

    const handleDeleteClick = (planId) => {
        setPlanToDelete(planId);
        setIsDeleteDialogOpen(true);
    };

    const closeDeleteDialog = () => {
        setIsDeleteDialogOpen(false);
        setPlanToDelete(null);
    };

    const confirmDelete = async () => {
        try {
            await api({
                method: API_ENDPOINTS.DELETE_SERVICE.method,
                url: `${API_ENDPOINTS.DELETE_SERVICE.endpoint}/${planToDelete}`
            });
            setPlans(prev => prev.filter(p => p.id !== planToDelete));
            closeDeleteDialog();
        } catch (error) {
            console.error("Failed to delete plan:", error);
            alert("Failed to delete plan. Please check the console for details.");
            closeDeleteDialog();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                serviceName: newPlan.title,
                servicePrice: newPlan.price,
                serviceDescription: newPlan.description + (newPlan.validity ? ` (Validity: ${newPlan.validity})` : '')
            };

            if (editingPlanId) {
                // Update Service
                const response = await api({
                    method: API_ENDPOINTS.UPDATE_SERVICE.method,
                    url: `${API_ENDPOINTS.UPDATE_SERVICE.endpoint}/${editingPlanId}`,
                    data: payload
                });

                if (response.data && response.data.success) {
                    const updatedService = response.data.data;
                    setPlans(prev => prev.map(p => p.id === editingPlanId ? {
                        id: updatedService.serviceId,
                        title: updatedService.serviceName,
                        price: updatedService.servicePrice,
                        description: updatedService.serviceDescription,
                        validity: newPlan.validity
                    } : p));
                    handleClose();
                }
            } else {
                // Create Service
                const response = await api({
                    method: API_ENDPOINTS.CREATE_SERVICE.method,
                    url: `${API_ENDPOINTS.CREATE_SERVICE.endpoint}/${projectName}`,
                    data: payload
                });

                if (response.data && response.data.success) {
                    const createdService = response.data.data;
                    setPlans(prev => [...prev, {
                        id: createdService.serviceId,
                        title: createdService.serviceName,
                        price: createdService.servicePrice,
                        description: createdService.serviceDescription,
                        validity: newPlan.validity
                    }]);
                    handleClose();
                }
            }
        } catch (error) {
            console.error("Failed to save plan:", error);
            alert("Failed to save plan. Please check the console for details.");
        }
    };

    const modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: 2
    };

    return (
        <Box sx={{ bgcolor: colors.white, minHeight: '100vh', color: colors.black, fontFamily: colors.font.serif }}>
            <Container maxWidth="lg" sx={{ pt: 5, mb: 10, textAlign: 'center' }}>
                <Typography variant="h4" sx={{
                    mb: 8,
                    fontWeight: 300,
                    color: colors.text.dark,
                    letterSpacing: '0.05em',
                    fontFamily: colors.font.serif
                }}>
                    Choose your pricing plan
                </Typography>

                {isAuthenticated && (
                    <Box sx={{ mb: 6 }}>
                        <Button
                            variant="contained"
                            onClick={handleOpen}
                            sx={{
                                bgcolor: colors.button.primary,
                                color: colors.white,
                                borderRadius: 0,
                                px: 4,
                                py: 1.5,
                                fontSize: '0.9rem',
                                letterSpacing: '0.1em',
                                '&:hover': { bgcolor: colors.button.primaryHover }
                            }}
                        >
                            Add Plan
                        </Button>
                    </Box>
                )}

                <Grid container spacing={4} justifyContent="center">
                    {plans.map((plan, index) => (
                        <Grid item xs={12} md={5} key={index}>
                            <Box sx={{
                                border: colors.border.card,
                                p: 6,
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                transition: 'all 0.3s ease',
                                position: 'relative',
                                '&:hover': {
                                    boxShadow: colors.shadow.cardHover
                                }
                            }}>
                                {isAuthenticated && (
                                    <Box sx={{ position: 'absolute', top: 16, right: 16, display: 'flex', gap: 1 }}>
                                        <IconButton onClick={() => handleEditClick(plan)} size="small" sx={{ color: colors.text.light }}>
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton onClick={() => handleDeleteClick(plan.id)} size="small" sx={{ color: '#f44336' }}>
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                )}

                                <Typography variant="h5" sx={{ mb: 2, fontWeight: 300, fontFamily: colors.font.serif, mt: isAuthenticated ? 2 : 0 }}>
                                    {plan.title}
                                </Typography>

                                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2, mt: 2 }}>
                                    <Typography variant="h6" sx={{ mt: 1, mr: 0.5, fontWeight: 300 }}>₹</Typography>
                                    <Typography variant="h2" sx={{ fontWeight: 400, fontFamily: colors.font.serif }}>
                                        {plan.price}
                                    </Typography>
                                </Box>

                                {plan.description && (
                                    <Typography variant="body2" sx={{
                                        color: colors.text.light,
                                        lineHeight: 1.6,
                                        mb: 3,
                                        maxWidth: '300px',
                                        textAlign: 'center'
                                    }}>
                                        {plan.description}
                                    </Typography>
                                )}

                                <Typography variant="caption" sx={{ color: colors.text.disabled, mb: 4, fontStyle: 'italic' }}>
                                    {plan.validity}
                                </Typography>

                                <Box sx={{ mt: 'auto', width: '100%' }}>
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        sx={{
                                            bgcolor: colors.button.primary,
                                            color: colors.white,
                                            borderRadius: 0,
                                            py: 1.5,
                                            fontSize: '0.8rem',
                                            letterSpacing: '0.1em',
                                            '&:hover': { bgcolor: colors.button.primaryHover }
                                        }}
                                    >
                                        Select
                                    </Button>
                                </Box>

                                <Divider sx={{ width: '100%', my: 6, opacity: 0.3 }} />

                                <Typography variant="subtitle2" sx={{
                                    color: colors.text.dark,
                                    fontWeight: 300,
                                    letterSpacing: '0.05em'
                                }}>
                                    {plan.title}
                                </Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* Add/Edit Plan Modal */}
            <Modal
                open={isModalOpen}
                onClose={handleClose}
                aria-labelledby="add-plan-modal-title"
            >
                <Box sx={modalStyle}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography id="add-plan-modal-title" variant="h6" component="h2" sx={{ fontFamily: colors.font.serif }}>
                            {editingPlanId ? "Edit Plan" : "Add New Plan"}
                        </Typography>
                        <IconButton onClick={handleClose}>
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Plan Title"
                            name="title"
                            value={newPlan.title}
                            onChange={handleChange}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="Price (e.g., 50,000)"
                            name="price"
                            value={newPlan.price}
                            onChange={handleChange}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="Validity (e.g., Valid for 30 days)"
                            name="validity"
                            value={newPlan.validity}
                            onChange={handleChange}
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Description"
                            name="description"
                            value={newPlan.description}
                            onChange={handleChange}
                            margin="normal"
                            multiline
                            rows={3}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            sx={{
                                mt: 3,
                                bgcolor: colors.button.primary,
                                color: colors.white,
                                borderRadius: 0,
                                py: 1.5,
                                '&:hover': { bgcolor: colors.button.primaryHover }
                            }}
                        >
                            {editingPlanId ? "Save Changes" : "Add Plan"}
                        </Button>
                    </form>
                </Box>
            </Modal>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={isDeleteDialogOpen}
                onClose={closeDeleteDialog}
                aria-labelledby="delete-dialog-title"
                aria-describedby="delete-dialog-description"
            >
                <DialogTitle id="delete-dialog-title">
                    {"Delete Plan?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="delete-dialog-description">
                        Are you sure you want to delete this plan? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ p: 2, pt: 0 }}>
                    <Button onClick={closeDeleteDialog} color="inherit">
                        Cancel
                    </Button>
                    <Button onClick={confirmDelete} color="error" variant="contained" autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default PricingPage;
