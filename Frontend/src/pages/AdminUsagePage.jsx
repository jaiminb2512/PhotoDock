import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
    Button,
    Chip,
    CircularProgress,
    TablePagination,
    Breadcrumbs,
    Link
} from '@mui/material';
import {
    ArrowBack as BackIcon,
    NavigateNext as NextIcon,
    Assessment as UsageIcon
} from '@mui/icons-material';
import colors from '../styles/colors';
import api, { API_ENDPOINTS, getApiUrl } from '../utils/api';

const AdminUsagePage = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();

    const [usageHistory, setUsageHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [projectInfo, setProjectInfo] = useState(null);
    const [pagination, setPagination] = useState({
        page: 0,
        rowsPerPage: 10,
        totalCount: 0
    });

    const fetchUsageHistory = async (page = 0, limit = 10) => {
        setIsLoading(true);
        try {
            const url = `${getApiUrl(API_ENDPOINTS.PROJECT_USAGE.endpoint)}/${projectId}?page=${page + 1}&limit=${limit}`;
            const response = await api.get(url);
            setUsageHistory(response.data.data.usages);

            // Set project info from the first usage record if available
            if (response.data.data.usages.length > 0) {
                setProjectInfo(response.data.data.usages[0].project);
            }

            setPagination(prev => ({
                ...prev,
                totalCount: response.data.data.pagination.totalCount,
                page,
                rowsPerPage: limit
            }));
        } catch (error) {
            console.error('Failed to fetch usage history:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (projectId) {
            fetchUsageHistory();
        }
    }, [projectId]);

    const handlePageChange = (event, newPage) => {
        fetchUsageHistory(newPage, pagination.rowsPerPage);
    };

    const handleRowsPerPageChange = (event) => {
        const newLimit = parseInt(event.target.value, 10);
        fetchUsageHistory(0, newLimit);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
            <Container sx={{ mt: 5, mb: 10, flexGrow: 1 }}>
                {/* Breadcrumbs */}
                <Breadcrumbs separator={<NextIcon fontSize="small" />} sx={{ mb: 3 }}>
                    <Link
                        underline="hover"
                        color="inherit"
                        href="#"
                        onClick={(e) => { e.preventDefault(); navigate('/admin/projects'); }}
                        sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                    >
                        Projects
                    </Link>
                    <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <UsageIcon sx={{ fontSize: '1.1rem' }} />
                        Usage History
                    </Typography>
                </Breadcrumbs>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 5 }}>
                    <Box>
                        <Typography variant="h3" sx={{
                            fontWeight: 600,
                            color: colors.text.heading,
                            letterSpacing: '-0.02em',
                            mb: 1
                        }}>
                            Usage History
                        </Typography>
                        <Typography variant="body1" sx={{ color: colors.text.muted }}>
                            {projectInfo ? `Viewing subscription and photo upload history for "${projectInfo.projectName}".` : 'Loading project information...'}
                        </Typography>
                    </Box>
                    <Button
                        variant="outlined"
                        startIcon={<BackIcon />}
                        onClick={() => navigate('/admin/projects')}
                        sx={{
                            borderRadius: '12px',
                            textTransform: 'none',
                            borderColor: colors.text.faint,
                            color: colors.text.medium,
                            px: 3
                        }}
                    >
                        Back to Projects
                    </Button>
                </Box>

                {isLoading && usageHistory.length === 0 ? (
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
                        <Table sx={{ minWidth: 800 }}>
                            <TableHead sx={{ bgcolor: '#f9fafb' }}>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 700, py: 3 }}>Plan</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Price</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Photos (Used/Limit)</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Period</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {usageHistory.map((usage) => (
                                    <TableRow key={usage.usageId} hover>
                                        <TableCell sx={{ py: 2.5 }}>
                                            <Typography variant="body2" fontWeight={600}>{usage.plan.planName}</Typography>
                                            <Typography variant="caption" color="text.secondary">{usage.plan.billingCycle}</Typography>
                                        </TableCell>
                                        <TableCell>${parseFloat(usage.plan.price).toFixed(2)}</TableCell>
                                        <TableCell>
                                            <Typography variant="body2">{usage.maxPhotosUsed} / {usage.maxPhotos}</Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                Monthly Uploads: {usage.monthlyPhotoUploadsUsed} / {usage.monthlyPhotoUploadsLimit}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={usage.status}
                                                size="small"
                                                sx={{
                                                    fontWeight: 600,
                                                    bgcolor: usage.status === 'ACTIVE' ? 'rgba(74, 124, 89, 0.1)' : 'rgba(0,0,0,0.05)',
                                                    color: usage.status === 'ACTIVE' ? colors.accent.primary : colors.text.muted
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">
                                                {new Date(usage.startDate).toLocaleDateString()} - {new Date(usage.endDate).toLocaleDateString()}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                Created: {new Date(usage.createdAt).toLocaleDateString()}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {usageHistory.length === 0 && !isLoading && (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center" sx={{ py: 10 }}>
                                            <Typography variant="body1" color="text.secondary">
                                                No usage records found for this project.
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                        <TablePagination
                            component="div"
                            count={pagination.totalCount}
                            page={pagination.page}
                            onPageChange={handlePageChange}
                            rowsPerPage={pagination.rowsPerPage}
                            onRowsPerPageChange={handleRowsPerPageChange}
                            rowsPerPageOptions={[5, 10, 25]}
                        />
                    </TableContainer>
                )}
            </Container>
        </Box>
    );
};

export default AdminUsagePage;
