import React from 'react';
import {
    Box,
    Typography,
    IconButton,
    Link as MuiLink
} from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import colors from '../styles/colors';

const Footer = ({ projectInfo }) => {
    return (
        <Box component="footer" sx={{
            py: 10,
            px: 4,
            textAlign: 'center',
            bgcolor: colors.white,
            borderTop: colors.border.light
        }}>
            <Box sx={{ mb: 1, display: 'flex', justifyContent: 'center', gap: 1 }}>
                {projectInfo?.instagramUrl && (
                    <IconButton 
                        component="a" 
                        href={projectInfo.instagramUrl} 
                        target="_blank" 
                        sx={{ color: colors.black }}
                    >
                        <InstagramIcon />
                    </IconButton>
                )}
                {projectInfo?.facebookUrl && (
                    <IconButton 
                        component="a" 
                        href={projectInfo.facebookUrl} 
                        target="_blank" 
                        sx={{ color: colors.black }}
                    >
                        <FacebookIcon />
                    </IconButton>
                )}
                {projectInfo?.twitterUrl && (
                    <IconButton 
                        component="a" 
                        href={projectInfo.twitterUrl} 
                        target="_blank" 
                        sx={{ color: colors.black }}
                    >
                        <TwitterIcon />
                    </IconButton>
                )}
            </Box>
            <Typography variant="body2" sx={{ color: colors.text.light, letterSpacing: '0.1em', mt: 2 }}>
                © {new Date().getFullYear()} {projectInfo?.projectName?.toUpperCase() || 'PHOTODOCK'}
            </Typography>
        </Box>
    );
};

export default Footer;
