import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import {
    Box,
    Button,
    TextField,
    Typography,
    Container,
    Alert,
    CircularProgress,
    InputAdornment,
    IconButton,
    Link as MuiLink
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import colors from '../styles/colors';

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const {
        control,
        handleSubmit,
        formState: { errors }
    } = useForm({
        defaultValues: {
            email: '',
            password: ''
        }
    });

    const onSubmit = async (data) => {
        setError('');
        setLoading(true);

        try {
            const response = await login({ emailId: data.email, password: data.password });
            const user = response.data.data ? response.data.data : response.data;

            if (user.role === 'ADMIN') {
                navigate('/admin/dashboard');
            } else if (user.role === 'USER') {
                const projectName = user.projectName;
                navigate(`/${projectName}`);
            } else {
                navigate('/');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to login. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: colors.white,
                color: colors.black,
                fontFamily: colors.font.serif
            }}
        >
            <Container maxWidth="xs">
                <Box
                    sx={{
                        p: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Typography
                        variant="h4"
                        sx={{
                            mb: 1,
                            fontWeight: 300,
                            color: colors.black,
                            fontFamily: colors.font.serif,
                            letterSpacing: '0.05em'
                        }}
                    >
                        Log In
                    </Typography>
                    <Typography
                        variant="caption"
                        sx={{
                            mb: 4,
                            letterSpacing: '0.2em',
                            fontSize: '0.7rem',
                            color: colors.text.light
                        }}
                    >
                        PHOTODOCK
                    </Typography>

                    {error && (
                        <Alert
                            severity="error"
                            variant="outlined"
                            sx={{
                                width: '100%',
                                mb: 3,
                                borderRadius: 0,
                                color: '#d32f2f',
                                border: '1px solid #d32f2f'
                            }}
                        >
                            {error}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1, width: '100%' }}>
                        <Controller
                            name="email"
                            control={control}
                            rules={{
                                required: 'Email address is required',
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: 'Please enter a valid email address'
                                }
                            }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    variant="standard"
                                    error={!!errors.email}
                                    helperText={errors.email?.message}
                                    sx={{
                                        '& .MuiInput-underline:before': { borderBottomColor: colors.border.section },
                                        '& .MuiInput-underline:after': { borderBottomColor: colors.black },
                                        '& .MuiInputLabel-root': { color: colors.text.medium },
                                        '& .MuiInputLabel-root.Mui-focused': { color: colors.black },
                                        '& .MuiInputBase-input': { color: colors.black }
                                    }}
                                />
                            )}
                        />
                        <Controller
                            name="password"
                            control={control}
                            rules={{
                                required: 'Password is required'
                            }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    margin="normal"
                                    required
                                    fullWidth
                                    label="Password"
                                    type={showPassword ? 'text' : 'password'}
                                    variant="standard"
                                    error={!!errors.password}
                                    helperText={errors.password?.message}
                                    sx={{
                                        '& .MuiInput-underline:before': { borderBottomColor: colors.border.section },
                                        '& .MuiInput-underline:after': { borderBottomColor: colors.black },
                                        '& .MuiInputLabel-root': { color: colors.text.medium },
                                        '& .MuiInputLabel-root.Mui-focused': { color: colors.black }
                                    }}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    edge="end"
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            )}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={loading}
                            sx={{
                                mt: 5,
                                mb: 3,
                                py: 1.5,
                                bgcolor: colors.black,
                                color: colors.white,
                                borderRadius: 0,
                                fontSize: '0.8rem',
                                letterSpacing: '0.2em',
                                '&:hover': { bgcolor: colors.text.dark }
                            }}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : 'SIGN IN'}
                        </Button>
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                            <MuiLink
                                component={Link}
                                to="/register"
                                sx={{
                                    textDecoration: 'none',
                                    color: colors.text.light,
                                    fontSize: '0.8rem',
                                    '&:hover': { color: colors.black }
                                }}
                            >
                                Don't have an account? Sign Up
                            </MuiLink>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                            <MuiLink
                                component={Link}
                                to="/"
                                sx={{
                                    textDecoration: 'none',
                                    color: colors.text.disabled,
                                    fontSize: '0.75rem',
                                    '&:hover': { color: colors.black }
                                }}
                            >
                                ← Back to Home
                            </MuiLink>
                        </Box>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default LoginPage;
