import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';
import authService from '../services/authService';

/**
 * RoleRoute is a wrapper for react-router-dom routes that restricts access 
 * based on user roles (e.g., ['ADMIN'] or ['USER', 'ADMIN']).
 */
const RoleRoute = ({ allowedRoles }) => {
    const [isAuthorized, setIsAuthorized] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkRole = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                // Not logged in at all
                setIsAuthorized(false);
                setIsLoading(false);
                return;
            }

            // Verify token with backend to get fresh user data including role
            const { valid, user } = await authService.verifyToken();

            if (valid && user && allowedRoles.includes(user.role)) {
                // User is authenticated and their role is in the allowedRoles array!
                setIsAuthorized(true);
            } else {
                // User is authenticated but does not have the correct role
                setIsAuthorized(false);
            }

            setIsLoading(false);
        };

        checkRole();
    }, [allowedRoles]);

    if (isLoading) {
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

    if (!isAuthorized) {
        // If not authorized for this route, redirect back to home (or a "Not Authorized" page)
        return <Navigate to="/:login" replace />;
    }

    // Authorization passed, render the children routes
    return <Outlet />;
};

export default RoleRoute;
