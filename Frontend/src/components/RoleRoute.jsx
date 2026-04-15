import React from 'react';
import { Navigate, Outlet, useParams } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

/**
 * RoleRoute is a wrapper for react-router-dom routes that restricts access 
 * based on user roles (e.g., ['ADMIN'] or ['USER', 'ADMIN']).
 */
const RoleRoute = ({ allowedRoles }) => {
    const { user, isAuthenticated, loading } = useAuth();
    const { projectName } = useParams();

    if (loading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh'
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    if (!isAuthenticated) {
        // Redirect to login if not authenticated
        return <Navigate to="/login" replace />;
    }

    if (user && !allowedRoles.includes(user.role)) {
        // If authenticated but role not allowed, redirect to home or project home
        return <Navigate to={projectName ? `/${projectName}` : "/"} replace />;
    }

    // Role authorized, render children
    return <Outlet />;
};

export default RoleRoute;
