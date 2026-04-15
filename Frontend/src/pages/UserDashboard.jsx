import React, { useState, useEffect } from 'react';
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    Grid,
    CircularProgress,
    Snackbar,
    Alert,
    Card,
    CardContent,
    Divider
} from '@mui/material';
import {
    Edit as EditIcon,
    Save as SaveIcon,
    Cancel as CancelIcon
} from '@mui/icons-material';
import Header from '../components/Header';
import colors from '../styles/colors';
import { useAuth } from '../contexts/AuthContext';
import projectService from '../services/projectService';

const UserDashboard = () => {
    const { user } = useAuth();
    console.log('User data in UserDashboard:', user);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    
    const [projectData, setProjectData] = useState({
        projectId: '',
        projectName: '',
        projectDescription: '',
        displayMessage: '',
        tagline: '',
        twitterUrl: '',
        instagramUrl: '',
        facebookUrl: ''
    });

    const [editFormData, setEditFormData] = useState({
        projectId: '',
        projectDescription: '',
        displayMessage: '',
        tagline: '',
        twitterUrl: '',
        instagramUrl: '',
        facebookUrl: ''
    });

    // Fetch user's project data
    useEffect(() => {
        const fetchProjectData = async () => {
            try {
                if (!user || !user.projectId) {
                    setSnackbar({
                        open: true,
                        message: 'Project information not available',
                        severity: 'warning'
                    });
                    setIsLoading(false);
                    return;
                }

                const response = await projectService.getAllProjects();
                
                // Find the user's project
                if (response.data && Array.isArray(response.data)) {
                    const userProject = response.data.find(p => p.projectId === user.projectId);
                    if (userProject) {
                        setProjectData(userProject);
                        setEditFormData({
                            projectId: userProject.projectId,
                            projectDescription: userProject.projectDescription,
                            displayMessage: userProject.displayMessage,
                            tagline: userProject.tagline || '',
                            twitterUrl: userProject.twitterUrl || '',
                            instagramUrl: userProject.instagramUrl || '',
                            facebookUrl: userProject.facebookUrl || ''
                        });
                    }
                }
            } catch (error) {
                console.error('Error fetching project:', error);
                setSnackbar({
                    open: true,
                    message: 'Failed to load project data',
                    severity: 'error'
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchProjectData();
    }, [user]);

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditFormData({ ...editFormData, [name]: value });
    };

    const handleSave = async () => {
        try {
            setIsSaving(true);
            await projectService.updateProject(editFormData);
            
            setProjectData({
                ...projectData,
                projectDescription: editFormData.projectDescription,
                displayMessage: editFormData.displayMessage,
                tagline: editFormData.tagline,
                twitterUrl: editFormData.twitterUrl,
                instagramUrl: editFormData.instagramUrl,
                facebookUrl: editFormData.facebookUrl
            });

            setIsEditing(false);
            setSnackbar({
                open: true,
                message: 'Project updated successfully!',
                severity: 'success'
            });
        } catch (error) {
            setSnackbar({
                open: true,
                message: error.response?.data?.message || 'Failed to update project',
                severity: 'error'
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        // Reset edit form to current data
        setEditFormData({
            projectId: projectData.projectId,
            projectDescription: projectData.projectDescription,
            displayMessage: projectData.displayMessage,
            tagline: projectData.tagline || '',
            twitterUrl: projectData.twitterUrl || '',
            instagramUrl: projectData.instagramUrl || '',
            facebookUrl: projectData.facebookUrl || ''
        });
        setIsEditing(false);
    };

    const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
                <Header />
                <Container maxWidth="md" sx={{ mt: 10, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <CircularProgress />
                </Container>
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
            <Header />

            <Container maxWidth="md" sx={{ mt: 10, mb: 10, flexGrow: 1 }}>
                {/* Project Header Card */}
                <Card sx={{ mb: 4, boxShadow: 2 }}>
                    <CardContent sx={{ p: 4 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h4" sx={{ fontWeight: 600, color: colors.text.primary }}>
                                {projectData.projectName}
                            </Typography>
                            {!isEditing && (
                                <Button
                                    startIcon={<EditIcon />}
                                    onClick={() => setIsEditing(true)}
                                    sx={{
                                        bgcolor: colors.accent.primary,
                                        color: '#fff',
                                        '&:hover': { bgcolor: colors.accent.hover }
                                    }}
                                >
                                    Edit
                                </Button>
                            )}
                        </Box>
                        <Typography variant="body2" sx={{ color: colors.text.faint }}>
                            Created on {new Date(projectData.createdAt).toLocaleDateString()}
                        </Typography>
                    </CardContent>
                </Card>

                {/* Edit Mode */}
                {isEditing ? (
                    <Paper elevation={0} sx={{ p: 4, borderRadius: 2, border: `1px solid ${colors.text.faint}` }}>
                        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                            Edit Project Details
                        </Typography>
                        <Divider sx={{ mb: 3 }} />

                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={3}
                                    label="Project Description"
                                    name="projectDescription"
                                    value={editFormData.projectDescription}
                                    onChange={handleEditChange}
                                    variant="outlined"
                                    placeholder="Describe your project..."
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={3}
                                    label="Display Message"
                                    name="displayMessage"
                                    value={editFormData.displayMessage}
                                    onChange={handleEditChange}
                                    variant="outlined"
                                    placeholder="Enter a display message for your project..."
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Tagline"
                                    name="tagline"
                                    value={editFormData.tagline}
                                    onChange={handleEditChange}
                                    variant="outlined"
                                    placeholder="Add a catchy tagline..."
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Divider />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Twitter URL"
                                    name="twitterUrl"
                                    value={editFormData.twitterUrl}
                                    onChange={handleEditChange}
                                    variant="outlined"
                                    placeholder="https://twitter.com/yourhandle"
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Instagram URL"
                                    name="instagramUrl"
                                    value={editFormData.instagramUrl}
                                    onChange={handleEditChange}
                                    variant="outlined"
                                    placeholder="https://instagram.com/yourhandle"
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Facebook URL"
                                    name="facebookUrl"
                                    value={editFormData.facebookUrl}
                                    onChange={handleEditChange}
                                    variant="outlined"
                                    placeholder="https://facebook.com/yourpage"
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                />
                            </Grid>

                            <Grid item xs={12} sx={{ mt: 2 }}>
                                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                    <Button
                                        startIcon={<CancelIcon />}
                                        onClick={handleCancel}
                                        disabled={isSaving}
                                        sx={{
                                            color: colors.text.primary,
                                            border: `1px solid ${colors.text.faint}`,
                                            '&:hover': { bgcolor: 'rgba(0,0,0,0.05)' }
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        startIcon={<SaveIcon />}
                                        onClick={handleSave}
                                        disabled={isSaving}
                                        sx={{
                                            bgcolor: colors.accent.primary,
                                            color: '#fff',
                                            '&:hover': { bgcolor: colors.accent.hover },
                                            '&:disabled': { opacity: 0.6 }
                                        }}
                                    >
                                        {isSaving ? 'Saving...' : 'Save Changes'}
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </Paper>
                ) : (
                    /* View Mode */
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                                        Project Description
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: colors.text.faint, whiteSpace: 'pre-wrap' }}>
                                        {projectData.projectDescription}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                                        Display Message
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: colors.text.faint, whiteSpace: 'pre-wrap' }}>
                                        {projectData.displayMessage}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        {projectData.tagline && (
                            <Grid item xs={12}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                                            Tagline
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: colors.text.faint }}>
                                            {projectData.tagline}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        )}

                        <Grid item xs={12}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                                        Social Links
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                        {projectData.twitterUrl && (
                                            <Typography variant="body2">
                                                <strong>Twitter:</strong> <a href={projectData.twitterUrl} target="_blank" rel="noopener noreferrer">{projectData.twitterUrl}</a>
                                            </Typography>
                                        )}
                                        {projectData.instagramUrl && (
                                            <Typography variant="body2">
                                                <strong>Instagram:</strong> <a href={projectData.instagramUrl} target="_blank" rel="noopener noreferrer">{projectData.instagramUrl}</a>
                                            </Typography>
                                        )}
                                        {projectData.facebookUrl && (
                                            <Typography variant="body2">
                                                <strong>Facebook:</strong> <a href={projectData.facebookUrl} target="_blank" rel="noopener noreferrer">{projectData.facebookUrl}</a>
                                            </Typography>
                                        )}
                                        {!projectData.twitterUrl && !projectData.instagramUrl && !projectData.facebookUrl && (
                                            <Typography variant="body2" sx={{ color: colors.text.faint }}>
                                                No social links added yet
                                            </Typography>
                                        )}
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                )}
            </Container>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default UserDashboard;
