import React from 'react';
import { 
    Box, 
    Typography, 
    Container, 
    Grid, 
    Button,
    Divider
} from '@mui/material';
import Header from '../components/Header';
import Footer from '../components/Footer';

const PricingPage = () => {
    const plans = [
        {
            title: "Wedding Photography",
            price: "2,20,000",
            validity: "Valid for 15 days",
            description: ""
        },
        {
            title: "Pre-wedding Photography",
            price: "1,10,000",
            validity: "Valid for 7 days",
            description: "1 min of cinematic teaser, 3-6 mins track of cinematic shoot, 2-4 cinematic reels, 70+ Photos..."
        }
    ];

    return (
        <Box sx={{ bgcolor: '#ffffff', minHeight: '100vh', color: '#000000', fontFamily: 'serif' }}>
            {/* Header */}
            <Header />

            <Container maxWidth="lg" sx={{ mt: 10, mb: 10, textAlign: 'center' }}>
                <Typography variant="h4" sx={{ 
                    mb: 8, 
                    fontWeight: 300, 
                    color: '#333',
                    letterSpacing: '0.05em',
                    fontFamily: 'serif'
                }}>
                    Choose your pricing plan
                </Typography>

                <Grid container spacing={4} justifyContent="center">
                    {plans.map((plan, index) => (
                        <Grid item xs={12} md={5} key={index}>
                            <Box sx={{ 
                                border: '1px solid #e0e0e0',
                                p: 6,
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
                                }
                            }}>
                                <Typography variant="h5" sx={{ mb: 2, fontWeight: 300, fontFamily: 'serif' }}>
                                    {plan.title}
                                </Typography>
                                
                                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2, mt: 2 }}>
                                    <Typography variant="h6" sx={{ mt: 1, mr: 0.5, fontWeight: 300 }}>₹</Typography>
                                    <Typography variant="h2" sx={{ fontWeight: 400, fontFamily: 'serif' }}>
                                        {plan.price}
                                    </Typography>
                                </Box>

                                {plan.description && (
                                    <Typography variant="body2" sx={{ 
                                        color: '#666', 
                                        lineHeight: 1.6, 
                                        mb: 3,
                                        maxWidth: '300px',
                                        textAlign: 'center'
                                    }}>
                                        {plan.description}
                                    </Typography>
                                )}

                                <Typography variant="caption" sx={{ color: '#999', mb: 4, fontStyle: 'italic' }}>
                                    {plan.validity}
                                </Typography>

                                <Button 
                                    variant="contained" 
                                    fullWidth
                                    sx={{ 
                                        bgcolor: '#8c958e', // Greenish grey from screenshot
                                        color: '#fff',
                                        borderRadius: 0,
                                        py: 1.5,
                                        fontSize: '0.8rem',
                                        letterSpacing: '0.1em',
                                        '&:hover': { bgcolor: '#7a837c' }
                                    }}
                                >
                                    Select
                                </Button>

                                <Divider sx={{ width: '100%', my: 6, opacity: 0.3 }} />

                                <Typography variant="subtitle2" sx={{ 
                                    color: '#333', 
                                    fontWeight: 300,
                                    letterSpacing: '0.05em'
                                }}>
                                    {plan.title}
                                </Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            <Footer />
        </Box>
    );
};

export default PricingPage;
