import React from 'react';
import { 
    Box, 
    Typography, 
    IconButton,
    Link as MuiLink
} from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';

const Footer = () => {
    return (
        <Box component="footer" sx={{ 
            py: 10, 
            px: 4, 
            textAlign: 'center', 
            bgcolor: '#ffffff',
            borderTop: '1px solid rgba(0,0,0,0.05)'
        }}>
            <Box sx={{ mb: 4 }}>
                <IconButton sx={{ color: '#000' }}><InstagramIcon /></IconButton>
                <IconButton sx={{ color: '#000' }}><FacebookIcon /></IconButton>
            </Box>
            <Typography variant="body2" sx={{ color: '#666', letterSpacing: '0.1em' }}>
                © {new Date().getFullYear()} MAULIK DOSHI PHOTOGRAPHY
            </Typography>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 3 }}>
                <MuiLink href="#" color="inherit" sx={{ fontSize: '0.75rem', textDecoration: 'none' }}>Privacy Policy</MuiLink>
                <MuiLink href="#" color="inherit" sx={{ fontSize: '0.75rem', textDecoration: 'none' }}>Terms & Conditions</MuiLink>
            </Box>
        </Box>
    );
};

export default Footer;
