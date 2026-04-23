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
    Divider,
    Modal
} from '@mui/material';
import {
    Edit as EditIcon,
    Save as SaveIcon,
    Cancel as CancelIcon
} from '@mui/icons-material';
import colors from '../styles/colors';
import { useAuth } from '../contexts/AuthContext';
import projectService from '../services/projectService';
import photoService from '../services/photoService';

const UserDashboard = () => {
    const { user } = useAuth();
    console.log('User data in UserDashboard:', user);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [uploadModalOpen, setUploadModalOpen] = useState(false);
    const [uploadLoading, setUploadLoading] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [uploadForm, setUploadForm] = useState({
        photoName: '',
        photoDescription: '',
        setNo: '1',
        sequence: '1'
    });
    
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

    const modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '90%',
        maxWidth: 520,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: 2,
        outline: 'none'
    };

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

    const handleUploadFormChange = (e) => {
        const { name, value } = e.target;
        setUploadForm({ ...uploadForm, [name]: value });
    };

    const handleFileChange = (e) => {
        const files = e.target.files ? Array.from(e.target.files) : [];
        setSelectedFiles(files);
    };

    const openUploadModal = () => {
        setUploadModalOpen(true);
    };

    const closeUploadModal = () => {
        setUploadModalOpen(false);
        setSelectedFiles([]);
        setUploadForm({ photoName: '', photoDescription: '', setNo: '1', sequence: '1' });
    };

    const handleUploadPhotos = async () => {
        if (!selectedFiles.length) {
            setSnackbar({ open: true, message: 'Please select at least one image to upload.', severity: 'warning' });
            return;
        }

        if (!projectData.projectId) {
            setSnackbar({ open: true, message: 'Project ID is missing.', severity: 'error' });
            return;
        }

        if (!uploadForm.setNo.trim()) {
            setSnackbar({ open: true, message: 'Set number is required.', severity: 'warning' });
            return;
        }

        const formData = new FormData();
        formData.append('projectId', projectData.projectId);
        formData.append('setNo', uploadForm.setNo);
        if (uploadForm.photoName) formData.append('photoName', uploadForm.photoName);
        if (uploadForm.photoDescription) formData.append('photoDescription', uploadForm.photoDescription);
        if (uploadForm.sequence) formData.append('sequence', uploadForm.sequence);

        selectedFiles.forEach((file) => {
            formData.append('photos', file);
        });

        try {
            setUploadLoading(true);
            await photoService.savePhotos(formData);
            setSnackbar({ open: true, message: 'Photos uploaded successfully!', severity: 'success' });
            closeUploadModal();
        } catch (error) {
            setSnackbar({
                open: true,
                message: error.response?.data?.message || 'Failed to upload photos.',
                severity: 'error'
            });
        } finally {
            setUploadLoading(false);
        }
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
                <Container maxWidth="md" sx={{ mt: 10, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <CircularProgress />
                </Container>
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>


            <Container maxWidth="md" sx={{ mt: 10, mb: 10, flexGrow: 1 }}>
                {/* Project Header Card */}
                <Card sx={{ mb: 4, boxShadow: 2 }}>
                    <CardContent sx={{ p: 4 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 2 }}>
                            <Typography variant="h4" sx={{ fontWeight: 600, color: colors.text.primary }}>
                                {projectData.projectName}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={openUploadModal}
                                    sx={{
                                        bgcolor: colors.accent.primary,
                                        color: '#fff',
                                        '&:hover': { bgcolor: colors.accent.hover }
                                    }}
                                >
                                    Upload Photos
                                </Button>
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

            <Modal
                open={uploadModalOpen}
                onClose={closeUploadModal}
                aria-labelledby="upload-photos-modal-title"
                aria-describedby="upload-photos-modal-description"
            >
                <Box sx={modalStyle}>
                    <Typography id="upload-photos-modal-title" variant="h6" component="h2" sx={{ mb: 2, fontWeight: 700 }}>
                        Upload Photos
                    </Typography>
                    <Divider sx={{ mb: 3 }} />
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Button component="label" variant="outlined" fullWidth>
                                Select Images
                                <input
                                    hidden
                                    accept="image/*"
                                    multiple
                                    type="file"
                                    onChange={handleFileChange}
                                />
                            </Button>
                            {selectedFiles.length > 0 && (
                                <Typography variant="body2" sx={{ mt: 1, color: colors.text.faint }}>
                                    {selectedFiles.length} file(s) selected
                                </Typography>
                            )}
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Set No"
                                name="setNo"
                                value={uploadForm.setNo}
                                onChange={handleUploadFormChange}
                                variant="outlined"
                                type="number"
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Sequence"
                                name="sequence"
                                value={uploadForm.sequence}
                                onChange={handleUploadFormChange}
                                variant="outlined"
                                type="number"
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Photo Name"
                                name="photoName"
                                value={uploadForm.photoName}
                                onChange={handleUploadFormChange}
                                variant="outlined"
                                placeholder="Optional photo name"
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                label="Photo Description"
                                name="photoDescription"
                                value={uploadForm.photoDescription}
                                onChange={handleUploadFormChange}
                                variant="outlined"
                                placeholder="Optional description for all selected photos"
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            />
                        </Grid>
                        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 1 }}>
                            <Button onClick={closeUploadModal} disabled={uploadLoading}>
                                Cancel
                            </Button>
                            <Button
                                onClick={handleUploadPhotos}
                                variant="contained"
                                disabled={uploadLoading}
                                sx={{ bgcolor: colors.accent.primary, color: '#fff', '&:hover': { bgcolor: colors.accent.hover } }}
                            >
                                {uploadLoading ? 'Uploading...' : 'Upload'}
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Modal>

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
