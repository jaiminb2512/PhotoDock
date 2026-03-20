import React, { useState, useMemo } from 'react';
import {
    Box,
    Typography,
    Container,
    Button,
    IconButton,
    Grid,
    Collapse
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const DAY_NAMES_FULL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const services = [
    { id: 1, title: 'Wedding Photography', duration: '15 days', price: '₹2,20,000' },
    { id: 2, title: 'Pre-wedding Photography', duration: '7 days', price: '₹1,10,000' },
];

const BookOnlinePage = () => {
    const navigate = useNavigate();
    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    const [selectedDate, setSelectedDate] = useState(today);
    const [selectedService, setSelectedService] = useState(services[0]);
    const [detailsExpanded, setDetailsExpanded] = useState(false);

    // Generate calendar grid
    const calendarDays = useMemo(() => {
        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

        const days = [];
        // Empty cells for days before the 1st
        for (let i = 0; i < firstDay; i++) {
            days.push(null);
        }
        for (let d = 1; d <= daysInMonth; d++) {
            days.push(d);
        }
        return days;
    }, [currentMonth, currentYear]);

    const prevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const nextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    const handleDateClick = (day) => {
        if (!day) return;
        const newDate = new Date(currentYear, currentMonth, day);
        // Don't allow selecting past dates
        const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        if (newDate < todayStart) return;
        setSelectedDate(newDate);
    };

    const isToday = (day) => {
        if (!day) return false;
        return day === today.getDate() &&
            currentMonth === today.getMonth() &&
            currentYear === today.getFullYear();
    };

    const isSelected = (day) => {
        if (!day || !selectedDate) return false;
        return day === selectedDate.getDate() &&
            currentMonth === selectedDate.getMonth() &&
            currentYear === selectedDate.getFullYear();
    };

    const isPast = (day) => {
        if (!day) return false;
        const date = new Date(currentYear, currentMonth, day);
        const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        return date < todayStart;
    };

    const formatSelectedDate = () => {
        if (!selectedDate) return '';
        const dayName = DAY_NAMES_FULL[selectedDate.getDay()];
        const day = selectedDate.getDate();
        const month = MONTHS[selectedDate.getMonth()];
        return `${dayName}, ${day} ${month}`;
    };

    const handleCheckNextAvailability = () => {
        // Move to next month to check availability
        nextMonth();
    };

    return (
        <Box sx={{ bgcolor: '#ffffff', minHeight: '100vh', color: '#000000', fontFamily: 'serif' }}>
            <Header />

            <Box sx={{ position: 'relative' }}>

                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: 4 }}>
                    {/* Back button */}
                    <Button
                        startIcon={<ArrowBackIosNewIcon sx={{ fontSize: '0.7rem !important' }} />}
                        onClick={() => navigate(-1)}
                        sx={{
                            color: '#4a7c59',
                            textTransform: 'none',
                            fontFamily: 'system-ui, -apple-system, sans-serif',
                            fontSize: '0.85rem',
                            mb: 3,
                            pl: 0,
                            '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' }
                        }}
                    >
                        Back
                    </Button>

                    {/* Title */}
                    <Typography variant="h4" sx={{
                        fontWeight: 300,
                        fontFamily: 'serif',
                        color: '#1a1a1a',
                        mb: 1
                    }}>
                        Schedule your service
                    </Typography>
                    <Typography variant="body2" sx={{
                        color: '#555',
                        mb: 5,
                        fontFamily: 'system-ui, -apple-system, sans-serif',
                        fontSize: '0.85rem'
                    }}>
                        Check out our availability and book the date and time that works for you
                    </Typography>

                    {/* Main Content Grid: Calendar | Availability | Service Details */}
                    <Grid container spacing={4}>
                        {/* Left: Calendar */}
                        <Grid item xs={12} md={5}>
                            <Typography variant="h6" sx={{
                                fontFamily: 'serif',
                                fontWeight: 300,
                                fontStyle: 'italic',
                                color: '#333',
                                mb: 3,
                                fontSize: '1.1rem'
                            }}>
                                Select a Date and Time
                            </Typography>

                            {/* Calendar */}
                            <Box sx={{
                                maxWidth: '340px',
                                userSelect: 'none'
                            }}>
                                {/* Month Navigation */}
                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    mb: 2,
                                    gap: 2
                                }}>
                                    <IconButton
                                        onClick={prevMonth}
                                        size="small"
                                        sx={{ color: '#333' }}
                                    >
                                        <ChevronLeftIcon />
                                    </IconButton>
                                    <Typography sx={{
                                        fontWeight: 500,
                                        fontSize: '0.95rem',
                                        fontFamily: 'system-ui, -apple-system, sans-serif',
                                        minWidth: '140px',
                                        textAlign: 'center'
                                    }}>
                                        {MONTHS[currentMonth]} {currentYear}
                                    </Typography>
                                    <IconButton
                                        onClick={nextMonth}
                                        size="small"
                                        sx={{ color: '#333' }}
                                    >
                                        <ChevronRightIcon />
                                    </IconButton>
                                </Box>

                                {/* Day Headers */}
                                <Box sx={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(7, 1fr)',
                                    mb: 1
                                }}>
                                    {DAYS.map((day) => (
                                        <Typography
                                            key={day}
                                            align="center"
                                            sx={{
                                                fontSize: '0.75rem',
                                                color: '#888',
                                                fontFamily: 'system-ui, -apple-system, sans-serif',
                                                fontWeight: 500,
                                                py: 0.5
                                            }}
                                        >
                                            {day}
                                        </Typography>
                                    ))}
                                </Box>

                                {/* Calendar Grid */}
                                <Box sx={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(7, 1fr)',
                                    gap: '2px'
                                }}>
                                    {calendarDays.map((day, idx) => (
                                        <Box
                                            key={idx}
                                            onClick={() => day && !isPast(day) && handleDateClick(day)}
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                height: '38px',
                                                width: '38px',
                                                mx: 'auto',
                                                borderRadius: '50%',
                                                cursor: day && !isPast(day) ? 'pointer' : 'default',
                                                fontSize: '0.85rem',
                                                fontFamily: 'system-ui, -apple-system, sans-serif',
                                                fontWeight: isToday(day) ? 600 : 400,
                                                color: isPast(day) ? '#ccc' : isSelected(day) ? '#fff' : isToday(day) ? '#4a7c59' : '#333',
                                                bgcolor: isSelected(day) ? '#5a7d65' : 'transparent',
                                                transition: 'all 0.2s ease',
                                                '&:hover': day && !isPast(day) ? {
                                                    bgcolor: isSelected(day) ? '#4a6d55' : 'rgba(90, 125, 101, 0.1)',
                                                } : {}
                                            }}
                                        >
                                            {day || ''}
                                        </Box>
                                    ))}
                                </Box>
                            </Box>
                        </Grid>

                        {/* Middle: Availability */}
                        <Grid item xs={12} md={4}>
                            <Box sx={{ pt: { xs: 0, md: 0 } }}>
                                <Typography variant="caption" sx={{
                                    color: '#8a6e2f',
                                    fontFamily: 'system-ui, -apple-system, sans-serif',
                                    fontSize: '0.75rem',
                                    display: 'block',
                                    mb: 3,
                                    textAlign: { xs: 'left', md: 'left' }
                                }}>
                                    India Standard Time (IST)
                                </Typography>

                                <Typography variant="body2" sx={{
                                    fontWeight: 500,
                                    fontFamily: 'system-ui, -apple-system, sans-serif',
                                    fontSize: '0.85rem',
                                    color: '#333',
                                    mb: 0.5
                                }}>
                                    Availability for {formatSelectedDate()}
                                </Typography>
                                <Typography variant="body2" sx={{
                                    color: '#888',
                                    fontSize: '0.8rem',
                                    fontFamily: 'system-ui, -apple-system, sans-serif',
                                    mb: 3
                                }}>
                                    No availability
                                </Typography>

                                <Button
                                    variant="contained"
                                    onClick={handleCheckNextAvailability}
                                    sx={{
                                        bgcolor: '#8c958e',
                                        color: '#fff',
                                        borderRadius: 0,
                                        py: 1.2,
                                        px: 4,
                                        fontSize: '0.75rem',
                                        letterSpacing: '0.05em',
                                        textTransform: 'none',
                                        fontFamily: 'system-ui, -apple-system, sans-serif',
                                        fontWeight: 500,
                                        boxShadow: 'none',
                                        '&:hover': {
                                            bgcolor: '#7a837c',
                                            boxShadow: 'none'
                                        }
                                    }}
                                >
                                    Check Next Availability
                                </Button>
                            </Box>
                        </Grid>

                        {/* Right: Service Details */}
                        <Grid item xs={12} md={3}>
                            <Typography variant="h6" sx={{
                                fontFamily: 'serif',
                                fontWeight: 300,
                                fontStyle: 'italic',
                                color: '#333',
                                mb: 3,
                                fontSize: '1.1rem'
                            }}>
                                Service Details
                            </Typography>

                            <Box sx={{
                                border: '1px solid #e8e8e8',
                                borderRadius: 0,
                                overflow: 'hidden'
                            }}>
                                <Box sx={{ p: 2.5 }}>
                                    <Typography sx={{
                                        fontWeight: 500,
                                        fontSize: '0.9rem',
                                        fontFamily: 'system-ui, -apple-system, sans-serif',
                                        mb: 1
                                    }}>
                                        {selectedService.title}
                                    </Typography>

                                    <Box
                                        onClick={() => setDetailsExpanded(!detailsExpanded)}
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            cursor: 'pointer',
                                            color: '#555',
                                            '&:hover': { color: '#333' }
                                        }}
                                    >
                                        <Typography sx={{
                                            fontSize: '0.8rem',
                                            fontFamily: 'system-ui, -apple-system, sans-serif',
                                            color: 'inherit'
                                        }}>
                                            More details
                                        </Typography>
                                        <ExpandMoreIcon sx={{
                                            fontSize: '1.2rem',
                                            ml: 0.5,
                                            transform: detailsExpanded ? 'rotate(180deg)' : 'rotate(0)',
                                            transition: 'transform 0.3s ease'
                                        }} />
                                    </Box>

                                    <Collapse in={detailsExpanded}>
                                        <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #eee' }}>
                                            <Typography variant="body2" sx={{
                                                color: '#666',
                                                fontSize: '0.8rem',
                                                fontFamily: 'system-ui, -apple-system, sans-serif',
                                                lineHeight: 1.6,
                                                mb: 1
                                            }}>
                                                <strong>Duration:</strong> {selectedService.duration}
                                            </Typography>
                                            <Typography variant="body2" sx={{
                                                color: '#666',
                                                fontSize: '0.8rem',
                                                fontFamily: 'system-ui, -apple-system, sans-serif',
                                                lineHeight: 1.6
                                            }}>
                                                <strong>Price:</strong> {selectedService.price}
                                            </Typography>
                                        </Box>
                                    </Collapse>
                                </Box>

                                {/* Service selector */}
                                <Box sx={{
                                    borderTop: '1px solid #e8e8e8',
                                    p: 1
                                }}>
                                    {services.map((service) => (
                                        <Box
                                            key={service.id}
                                            onClick={() => setSelectedService(service)}
                                            sx={{
                                                p: 1.5,
                                                cursor: 'pointer',
                                                bgcolor: selectedService.id === service.id ? 'rgba(90, 125, 101, 0.06)' : 'transparent',
                                                borderRadius: '4px',
                                                transition: 'background-color 0.2s ease',
                                                '&:hover': {
                                                    bgcolor: 'rgba(90, 125, 101, 0.1)'
                                                }
                                            }}
                                        >
                                            <Typography sx={{
                                                fontSize: '0.78rem',
                                                fontFamily: 'system-ui, -apple-system, sans-serif',
                                                fontWeight: selectedService.id === service.id ? 500 : 400,
                                                color: '#333'
                                            }}>
                                                {service.title}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>

                                {/* Request to Book */}
                                <Box sx={{ p: 2.5, borderTop: '1px solid #e8e8e8' }}>
                                    <Button
                                        variant="outlined"
                                        fullWidth
                                        sx={{
                                            borderColor: '#333',
                                            color: '#333',
                                            borderRadius: 0,
                                            py: 1,
                                            fontSize: '0.78rem',
                                            letterSpacing: '0.03em',
                                            textTransform: 'none',
                                            fontFamily: 'system-ui, -apple-system, sans-serif',
                                            fontWeight: 500,
                                            '&:hover': {
                                                borderColor: '#000',
                                                bgcolor: 'rgba(0,0,0,0.02)'
                                            }
                                        }}
                                    >
                                        Request to Book
                                    </Button>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            <Box sx={{ mt: 6 }}>
                <Footer />
            </Box>
        </Box>
    );
};

export default BookOnlinePage;
