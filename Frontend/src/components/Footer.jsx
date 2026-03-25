import React from 'react';
import {
    Box,
    Typography,
    IconButton,
    Link as MuiLink
} from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import colors from '../styles/colors';

const Footer = () => {
    return (
        <Box component="footer" sx={{
            py: 10,
            px: 4,
            textAlign: 'center',
            bgcolor: colors.white,
            borderTop: colors.border.light
        }}>
            <Box sx={{ mb: 1 }}>
                <IconButton sx={{ color: colors.black }}><InstagramIcon /></IconButton>
                <IconButton sx={{ color: colors.black }}><FacebookIcon /></IconButton>
            </Box>
            {/* <Typography variant="body2" sx={{ color: colors.text.light, letterSpacing: '0.1em' }}>
                © {new Date().getFullYear()} PHOTODOCK
            </Typography>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 3 }}>
                <MuiLink href="#" color="inherit" sx={{ fontSize: '0.75rem', textDecoration: 'none' }}>Privacy Policy</MuiLink>
                <MuiLink href="#" color="inherit" sx={{ fontSize: '0.75rem', textDecoration: 'none' }}>Terms & Conditions</MuiLink>
            </Box> */}
        </Box>
    );
};

export default Footer;
