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
import { useNavigate } from 'react-router-dom';
import colors from '../styles/colors';

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
        <Box sx={{ bgcolor: colors.white, minHeight: '100vh', color: colors.black, fontFamily: colors.font.serif }}>


            <Box sx={{ position: 'relative' }}>

                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: 4 }}>
                    {/* Back button */}
                    <Button
                        startIcon={<ArrowBackIosNewIcon sx={{ fontSize: '0.7rem !important' }} />}
                        onClick={() => navigate(-1)}
                        sx={{
                            color: colors.accent.primary,
                            textTransform: 'none',
                            fontFamily: colors.font.sans,
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
                        fontFamily: colors.font.serif,
                        color: colors.text.heading,
                        mb: 1
                    }}>
                        Schedule your service
                    </Typography>
                    <Typography variant="body2" sx={{
                        color: colors.text.medium,
                        mb: 5,
                        fontFamily: colors.font.sans,
                        fontSize: '0.85rem'
                    }}>
                        Check out our availability and book the date and time that works for you
                    </Typography>

                    {/* Main Content Grid: Calendar | Availability | Service Details */}
                    <Grid container spacing={4}>
                        {/* Left: Calendar */}
                        <Grid item xs={12} md={5}>
                            <Typography variant="h6" sx={{
                                fontFamily: colors.font.serif,
                                fontWeight: 300,
                                fontStyle: 'italic',
                                color: colors.text.dark,
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
                                        sx={{ color: colors.text.dark }}
                                    >
                                        <ChevronLeftIcon />
                                    </IconButton>
                                    <Typography sx={{
                                        fontWeight: 500,
                                        fontSize: '0.95rem',
                                        fontFamily: colors.font.sans,
                                        minWidth: '140px',
                                        textAlign: 'center'
                                    }}>
                                        {MONTHS[currentMonth]} {currentYear}
                                    </Typography>
                                    <IconButton
                                        onClick={nextMonth}
                                        size="small"
                                        sx={{ color: colors.text.dark }}
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
                                                color: colors.text.muted,
                                                fontFamily: colors.font.sans,
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
                                                fontFamily: colors.font.sans,
                                                fontWeight: isToday(day) ? 600 : 400,
                                                color: isPast(day) ? colors.text.faint : isSelected(day) ? colors.white : isToday(day) ? colors.accent.primary : colors.text.dark,
                                                bgcolor: isSelected(day) ? colors.accent.medium : 'transparent',
                                                transition: 'all 0.2s ease',
                                                '&:hover': day && !isPast(day) ? {
                                                    bgcolor: isSelected(day) ? colors.accent.dark : colors.accent.hover,
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
                                    color: colors.gold,
                                    fontFamily: colors.font.sans,
                                    fontSize: '0.75rem',
                                    display: 'block',
                                    mb: 3,
                                    textAlign: { xs: 'left', md: 'left' }
                                }}>
                                    India Standard Time (IST)
                                </Typography>

                                <Typography variant="body2" sx={{
                                    fontWeight: 500,
                                    fontFamily: colors.font.sans,
                                    fontSize: '0.85rem',
                                    color: colors.text.dark,
                                    mb: 0.5
                                }}>
                                    Availability for {formatSelectedDate()}
                                </Typography>
                                <Typography variant="body2" sx={{
                                    color: colors.text.muted,
                                    fontSize: '0.8rem',
                                    fontFamily: colors.font.sans,
                                    mb: 3
                                }}>
                                    No availability
                                </Typography>

                                <Button
                                    variant="contained"
                                    onClick={handleCheckNextAvailability}
                                    sx={{
                                        bgcolor: colors.button.primary,
                                        color: colors.white,
                                        borderRadius: 0,
                                        py: 1.2,
                                        px: 4,
                                        fontSize: '0.75rem',
                                        letterSpacing: '0.05em',
                                        textTransform: 'none',
                                        fontFamily: colors.font.sans,
                                        fontWeight: 500,
                                        boxShadow: 'none',
                                        '&:hover': {
                                            bgcolor: colors.button.primaryHover,
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
                                fontFamily: colors.font.serif,
                                fontWeight: 300,
                                fontStyle: 'italic',
                                color: colors.text.dark,
                                mb: 3,
                                fontSize: '1.1rem'
                            }}>
                                Service Details
                            </Typography>

                            <Box sx={{
                                border: colors.border.section,
                                borderRadius: 0,
                                overflow: 'hidden'
                            }}>
                                <Box sx={{ p: 2.5 }}>
                                    <Typography sx={{
                                        fontWeight: 500,
                                        fontSize: '0.9rem',
                                        fontFamily: colors.font.sans,
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
                                            color: colors.text.medium,
                                            '&:hover': { color: colors.text.dark }
                                        }}
                                    >
                                        <Typography sx={{
                                            fontSize: '0.8rem',
                                            fontFamily: colors.font.sans,
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
                                        <Box sx={{ mt: 2, pt: 2, borderTop: colors.border.subtle }}>
                                            <Typography variant="body2" sx={{
                                                color: colors.text.light,
                                                fontSize: '0.8rem',
                                                fontFamily: colors.font.sans,
                                                lineHeight: 1.6,
                                                mb: 1
                                            }}>
                                                <strong>Duration:</strong> {selectedService.duration}
                                            </Typography>
                                            <Typography variant="body2" sx={{
                                                color: colors.text.light,
                                                fontSize: '0.8rem',
                                                fontFamily: colors.font.sans,
                                                lineHeight: 1.6
                                            }}>
                                                <strong>Price:</strong> {selectedService.price}
                                            </Typography>
                                        </Box>
                                    </Collapse>
                                </Box>

                                {/* Service selector */}
                                <Box sx={{
                                    borderTop: colors.border.section,
                                    p: 1
                                }}>
                                    {services.map((service) => (
                                        <Box
                                            key={service.id}
                                            onClick={() => setSelectedService(service)}
                                            sx={{
                                                p: 1.5,
                                                cursor: 'pointer',
                                                bgcolor: selectedService.id === service.id ? colors.accent.subtle : 'transparent',
                                                borderRadius: '4px',
                                                transition: 'background-color 0.2s ease',
                                                '&:hover': {
                                                    bgcolor: colors.accent.hover
                                                }
                                            }}
                                        >
                                            <Typography sx={{
                                                fontSize: '0.78rem',
                                                fontFamily: colors.font.sans,
                                                fontWeight: selectedService.id === service.id ? 500 : 400,
                                                color: colors.text.dark
                                            }}>
                                                {service.title}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>

                                {/* Request to Book */}
                                <Box sx={{ p: 2.5, borderTop: colors.border.section }}>
                                    <Button
                                        variant="outlined"
                                        fullWidth
                                        sx={{
                                            borderColor: colors.button.outlineBorder,
                                            color: colors.button.outlineBorder,
                                            borderRadius: 0,
                                            py: 1,
                                            fontSize: '0.78rem',
                                            letterSpacing: '0.03em',
                                            textTransform: 'none',
                                            fontFamily: colors.font.sans,
                                            fontWeight: 500,
                                            '&:hover': {
                                                borderColor: colors.button.outlineHoverBorder,
                                                bgcolor: colors.button.outlineHoverBg
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
        </Box>
    );
};

export default BookOnlinePage;
