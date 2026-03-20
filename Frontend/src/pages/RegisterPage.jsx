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
import authService from '../services/authService';
import colors from '../styles/colors';

const RegisterPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const {
        control,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm({
        defaultValues: {
            fullName: '',
            email: '',
            password: '',
            confirmPassword: ''
        }
    });

    const password = watch('password');

    const onSubmit = async (data) => {
        setError('');
        setLoading(true);

        try {
            await authService.register({ fullName: data.fullName, emailId: data.email, password: data.password });
            navigate('/login', { state: { message: 'Registration successful! Please login.' } });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to register. Please try again.');
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
                        Create Account
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
                            name="fullName"
                            control={control}
                            rules={{
                                required: 'Full name is required',
                                validate: value => value.trim() !== '' || 'Full name cannot be empty'
                            }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="fullName"
                                    label="Full Name"
                                    variant="standard"
                                    error={!!errors.fullName}
                                    helperText={errors.fullName?.message}
                                    sx={{ 
                                        '& .MuiInput-underline:after': { borderBottomColor: colors.black },
                                        '& .MuiInputLabel-root.Mui-focused': { color: colors.black }
                                    }}
                                />
                            )}
                        />
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
                                        '& .MuiInput-underline:after': { borderBottomColor: colors.black },
                                        '& .MuiInputLabel-root.Mui-focused': { color: colors.black }
                                    }}
                                />
                            )}
                        />
                        <Controller
                            name="password"
                            control={control}
                            rules={{
                                required: 'Password is required',
                                minLength: {
                                    value: 6,
                                    message: 'Password must be at least 6 characters'
                                }
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
                                        '& .MuiInput-underline:after': { borderBottomColor: colors.black },
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
                        <Controller
                            name="confirmPassword"
                            control={control}
                            rules={{
                                required: 'Please confirm your password',
                                validate: value => value === password || "Passwords don't match"
                            }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    margin="normal"
                                    required
                                    fullWidth
                                    label="Confirm Password"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    variant="standard"
                                    error={!!errors.confirmPassword}
                                    helperText={errors.confirmPassword?.message}
                                    sx={{ 
                                        '& .MuiInput-underline:after': { borderBottomColor: '#000' },
                                        '& .MuiInputLabel-root.Mui-focused': { color: '#000' }
                                    }}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    edge="end"
                                                >
                                                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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
                            {loading ? <CircularProgress size={24} color="inherit" /> : 'SIGN UP'}
                        </Button>
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                            <MuiLink 
                                component={Link} 
                                to="/login" 
                                sx={{ 
                                    textDecoration: 'none',
                                    color: colors.text.light,
                                    fontSize: '0.8rem',
                                    '&:hover': { color: colors.black }
                                }}
                            >
                                Already have an account? Sign In
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

export default RegisterPage;
