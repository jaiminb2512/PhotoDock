import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Button,
    Chip,
    Avatar,
    Tooltip,
    TextField,
    InputAdornment,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    Divider,
    MenuItem,
    TablePagination
} from '@mui/material';
import {
    Visibility as ViewIcon,
    Edit as EditIcon,
    Search as SearchIcon,
    Refresh as RefreshIcon,
    FilterList as FilterIcon,
    Email as EmailIcon,
    Person as PersonIcon,
    Image as ImageIcon,
    Assessment as UsageIcon,
    History as HistoryIcon
} from '@mui/icons-material';
import Header from '../components/Header'; // Remove this line if you want to be extra clean, but I'll just remove the usage below
import colors from '../styles/colors';
import api, { API_ENDPOINTS, getApiUrl } from '../utils/api';

const AdminProjectsPage = () => {
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [plans, setPlans] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProject, setSelectedProject] = useState(null);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const [editFormData, setEditFormData] = useState({
        projectId: '',
        projectName: '',
        projectDescription: '',
        displayMessage: '',
        tagline: '',
        twitterUrl: '',
        instagramUrl: '',
        facebookUrl: '',
        planId: ''
    });

    const fetchProjects = async () => {
        setIsLoading(true);
        try {
            const url = getApiUrl(API_ENDPOINTS.GET_PROJECT.endpoint);
            const response = await api.get(url);
            setProjects(response.data.data);
        } catch (error) {
            console.error('Failed to fetch projects:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchPlans = async () => {
        try {
            const url = getApiUrl(API_ENDPOINTS.SUBSCRIPTION_PLANS.endpoint);
            const response = await api.get(url);
            setPlans(response.data.data);
        } catch (error) {
            console.error('Failed to fetch plans:', error);
        }
    };

    useEffect(() => {
        fetchProjects();
        fetchPlans();
    }, []);

    const handleOpenUsage = (project) => {
        navigate(`/admin/usage/${project.projectId}`);
    };

    const handleViewDetails = (project) => {
        setSelectedProject(project);
        setDetailsOpen(true);
    };

    const handleOpenEdit = (project) => {
        setSelectedProject(project);
        setEditFormData({
            projectId: project.projectId,
            projectName: project.projectName,
            projectDescription: project.projectDescription,
            displayMessage: project.displayMessage,
            tagline: project.tagline || '',
            twitterUrl: project.twitterUrl || '',
            instagramUrl: project.instagramUrl || '',
            facebookUrl: project.facebookUrl || '',
            planId: project.plan?.planId || ''
        });
        setEditOpen(true);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveEdit = async () => {
        setIsSaving(true);
        try {
            const url = getApiUrl(API_ENDPOINTS.UPDATE_PROJECT.endpoint);
            await api.put(url, editFormData);
            setEditOpen(false);
            fetchProjects(); // Refresh list
        } catch (error) {
            console.error('Failed to update project:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const filteredProjects = projects.filter(p =>
        p.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.user?.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.user?.emailId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
            <Container maxWidth="3xl" sx={{ mt: 5, mb: 10, flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 5 }}>
                    <Box>
                        <Typography variant="h3" sx={{
                            fontWeight: 600,
                            color: colors.text.heading,
                            letterSpacing: '-0.02em',
                            mb: 1
                        }}>
                            Photographer Projects
                        </Typography>
                        <Typography variant="body1" sx={{ color: colors.text.muted }}>
                            Monitor all active photographer workspaces and their usage.
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <TextField
                            size="small"
                            placeholder="Search projects or users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            sx={{
                                bgcolor: 'white',
                                borderRadius: '12px',
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px',
                                }
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon sx={{ color: colors.text.muted }} />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Button
                            variant="outlined"
                            startIcon={<RefreshIcon />}
                            onClick={fetchProjects}
                            sx={{
                                borderRadius: '12px',
                                textTransform: 'none',
                                borderColor: colors.text.faint,
                                color: colors.text.medium,
                                px: 3
                            }}
                        >
                            Refresh
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
                        <Table sx={{ minWidth: 650 }}>
                            <TableHead sx={{ bgcolor: '#f9fafb' }}>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 700, color: colors.text.medium, py: 3 }}>Photographer</TableCell>
                                    <TableCell sx={{ fontWeight: 700, color: colors.text.medium }}>Project Name</TableCell>
                                    <TableCell sx={{ fontWeight: 700, color: colors.text.medium }}>Subscription</TableCell>
                                    <TableCell sx={{ fontWeight: 700, color: colors.text.medium }}>Created At</TableCell>
                                    <TableCell sx={{ fontWeight: 700, color: colors.text.medium }}>Plan End Date</TableCell>
                                    <TableCell sx={{ fontWeight: 700, color: colors.text.medium }} align="right">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredProjects.map((project) => {
                                    const plan = project.plan;
                                    const planEndDate = project.planEndDate;
                                    return (
                                        <TableRow key={project.projectId} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <Avatar sx={{ bgcolor: colors.accent.primary, width: 32, height: 32, fontSize: '0.875rem' }}>
                                                        {project.user?.fullName?.charAt(0) || '?'}
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="body2" fontWeight={600}>{project.user?.fullName}</Typography>
                                                        <Typography variant="caption" color="text.secondary">{project.user?.emailId}</Typography>
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" fontWeight={500}>{project.projectName}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                {plan ? (
                                                    <Chip
                                                        label={plan.planName}
                                                        size="small"
                                                        sx={{
                                                            fontWeight: 600,
                                                            bgcolor: 'rgba(74, 124, 89, 0.1)',
                                                            color: colors.accent.primary,
                                                            border: 'none'
                                                        }}
                                                    />
                                                ) : (
                                                    <Chip label="No Plan" size="small" variant="outlined" />
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" color="text.secondary">
                                                    {new Date(project.createdAt).toLocaleDateString()}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" color="text.secondary">
                                                    {new Date(project.planEndDate).toLocaleDateString()}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="right">
                                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                                    <Tooltip title="View Detailed Info">
                                                        <IconButton 
                                                            onClick={() => handleViewDetails(project)}
                                                            sx={{ color: colors.accent.primary }}
                                                        >
                                                            <ViewIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Check Usage History">
                                                        <IconButton 
                                                            onClick={() => handleOpenUsage(project)}
                                                            sx={{ color: colors.text.medium }}
                                                        >
                                                            <UsageIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Edit Project & Plan">
                                                        <IconButton
                                                            onClick={() => handleOpenEdit(project)}
                                                            sx={{ color: colors.text.medium }}
                                                        >
                                                            <EditIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                                {filteredProjects.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center" sx={{ py: 10 }}>
                                            <Typography variant="body1" color="text.secondary">
                                                No projects found matching your search.
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Container>

            {/* Project Details Dialog */}
            <Dialog
                open={detailsOpen}
                onClose={() => setDetailsOpen(false)}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: { borderRadius: '24px', p: 1 }
                }}
            >
                {selectedProject && (
                    <>
                        <DialogTitle>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="h5" fontWeight={700}>Project Details</Typography>
                                <Chip
                                    label={selectedProject.projectName}
                                    sx={{ bgcolor: colors.accent.primary, color: 'white' }}
                                />
                            </Box>
                        </DialogTitle>
                        <DialogContent dividers sx={{ borderBottom: 'none' }}>
                            <Grid container spacing={4} sx={{ mt: 1 }}>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="overline" color="text.secondary">Owner Information</Typography>
                                    <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <PersonIcon sx={{ color: colors.text.muted }} />
                                            <Typography variant="body1">{selectedProject.user?.fullName}</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <EmailIcon sx={{ color: colors.text.muted }} />
                                            <Typography variant="body1">{selectedProject.user?.emailId}</Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="overline" color="text.secondary">Workspace Status</Typography>
                                    <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography variant="body2" color="text.secondary">Current Plan:</Typography>
                                            <Typography variant="body2" fontWeight={600}>
                                                {selectedProject.plan?.planName || 'N/A'}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography variant="body2" color="text.secondary">Billing Cycle:</Typography>
                                            <Typography variant="body2" fontWeight={600}>
                                                {selectedProject.plan?.billingCycle || 'N/A'}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography variant="body2" color="text.secondary">Total Photos:</Typography>
                                            <Typography variant="body2" fontWeight={600}>
                                                {selectedProject._count?.photos || 0}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                                <Grid item xs={12}>
                                    <Divider sx={{ my: 1 }} />
                                    <Typography variant="overline" color="text.secondary">Public Profile Info</Typography>
                                    <Box sx={{ mt: 2 }}>
                                        <Typography variant="body2" gutterBottom><strong>Description:</strong> {selectedProject.projectDescription}</Typography>
                                        <Typography variant="body2" gutterBottom><strong>Tagline:</strong> {selectedProject.tagline || 'No tagline set'}</Typography>
                                        <Typography variant="body2"><strong>Display Message:</strong> {selectedProject.displayMessage}</Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions sx={{ p: 3 }}>
                            <Button
                                onClick={() => setDetailsOpen(false)}
                                variant="contained"
                                sx={{
                                    borderRadius: '12px',
                                    textTransform: 'none',
                                    px: 4,
                                    bgcolor: colors.accent.primary,
                                    '&:hover': { bgcolor: colors.accent.dark }
                                }}
                            >
                                Close
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>

            <EditProjectDialog
                open={editOpen}
                onClose={() => setEditOpen(false)}
                isSaving={isSaving}
                editFormData={editFormData}
                handleEditChange={handleEditChange}
                handleSaveEdit={handleSaveEdit}
                plans={plans}
            />
        </Box>
    );
};

export default AdminProjectsPage;

// Edit Project & Plan Dialog
// (This is usually better as a separate component, but I'll add the state-driven Dialog here)
const EditProjectDialog = ({ open, onClose, isSaving, editFormData, handleEditChange, handleSaveEdit, plans }) => (
    <Dialog
        open={open}
        onClose={() => !isSaving && onClose()}
        maxWidth="md"
        fullWidth
        PaperProps={{
            sx: { borderRadius: '24px', p: 1 }
        }}
    >
        <DialogTitle>
            <Typography variant="h5" fontWeight={700}>Edit Project & Plan</Typography>
        </DialogTitle>
        <DialogContent dividers sx={{ borderBottom: 'none' }}>
            <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={12} md={6}>
                    <TextField
                        label="Project Name"
                        name="projectName"
                        value={editFormData.projectName}
                        onChange={handleEditChange}
                        fullWidth
                        variant="outlined"
                        disabled={isSaving}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        select
                        label="Subscription Plan"
                        name="planId"
                        value={editFormData.planId}
                        onChange={handleEditChange}
                        fullWidth
                        variant="outlined"
                        disabled={isSaving}
                    >
                        {plans.map((plan) => (
                            <MenuItem key={plan.planId} value={plan.planId}>
                                {plan.planName} (${parseFloat(plan.price).toFixed(2)})
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="Project Description"
                        name="projectDescription"
                        value={editFormData.projectDescription}
                        onChange={handleEditChange}
                        fullWidth
                        multiline
                        rows={3}
                        variant="outlined"
                        disabled={isSaving}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="Display Message"
                        name="displayMessage"
                        value={editFormData.displayMessage}
                        onChange={handleEditChange}
                        fullWidth
                        multiline
                        rows={2}
                        variant="outlined"
                        disabled={isSaving}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        label="Tagline"
                        name="tagline"
                        value={editFormData.tagline}
                        onChange={handleEditChange}
                        fullWidth
                        variant="outlined"
                        disabled={isSaving}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="overline" color="text.secondary">Social URLs</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                    <TextField
                        label="Instagram"
                        name="instagramUrl"
                        value={editFormData.instagramUrl}
                        onChange={handleEditChange}
                        fullWidth
                        variant="outlined"
                        disabled={isSaving}
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <TextField
                        label="Facebook"
                        name="facebookUrl"
                        value={editFormData.facebookUrl}
                        onChange={handleEditChange}
                        fullWidth
                        variant="outlined"
                        disabled={isSaving}
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <TextField
                        label="Twitter"
                        name="twitterUrl"
                        value={editFormData.twitterUrl}
                        onChange={handleEditChange}
                        fullWidth
                        variant="outlined"
                        disabled={isSaving}
                    />
                </Grid>
            </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
            <Button
                onClick={onClose}
                disabled={isSaving}
            >
                Cancel
            </Button>
            <Button
                onClick={handleSaveEdit}
                variant="contained"
                disabled={isSaving}
                startIcon={isSaving && <CircularProgress size={20} color="inherit" />}
                sx={{
                    borderRadius: '12px',
                    textTransform: 'none',
                    px: 4,
                    bgcolor: colors.accent.primary,
                    '&:hover': { bgcolor: colors.accent.dark }
                }}
            >
                {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
        </DialogActions>
    </Dialog>
);

