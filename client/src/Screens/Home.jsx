import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Grid, Container, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, Button, CardMedia } from '@mui/material';
import api from '../Common/Api';
import { toast } from 'react-toastify';

const Home = ({Auth}) => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    const fetchEvents = async () => {
        try {
            const res = await api.listAllEvents(); 
            setEvents(res.data.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
            toast.error("Failed to fetch events!");
        }
    };

    useEffect(() => {
        fetchEvents();
        // eslint-disable-next-line
    }, []);

    const handleCardClick = (event) => {
        setSelectedEvent(event);
        setOpenDialog(true);
    };

    if (loading) {
        return (
            <Container>
                <CircularProgress />
            </Container>
        );
    }

    const handleBookNow = async (event) => {
        if (event) {
            console.log(event)
            console.log(Auth)
            const data = {
                eventId: event._id,
                userId: Auth._id
            }
            const res = await api.bookEvent(data);
            if(res.data.message === "Success"){
                setOpenDialog(false)
                toast.success(`Successfully booked for ${event.title}!`); // Notification
            }
        } else {
            toast.error("Failed to book the event!");
        }
    };

    return (
        <Container maxWidth="lg" style={{ marginTop: '2rem' }}>
            <Typography variant="h4" gutterBottom align="center">
                Upcoming Events
            </Typography>

            {events?.length === 0 ? (
                <Typography variant="h6" align="center" color="textSecondary">
                    No events available.
                </Typography>
            ) : (
                <Grid container spacing={4}>
                    {events?.map((event) => (
                        <Grid item xs={12} sm={6} md={4} key={event._id}>
                            <Card
                                style={{
                                    height: '340px',
                                    borderRadius: '12px',
                                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.transform = 'scale(1.05)';
                                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.2)';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.transform = 'scale(1)';
                                    e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
                                }}
                                onClick={() => handleCardClick(event)}
                            >
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={event.image}
                                    alt={event.title}
                                />
                                <CardContent style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                    <Typography variant="h5" component="h2" gutterBottom style={{ fontWeight: 'bold', marginBottom: '1rem' }}>
                                        {event.title}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" style={{ flexGrow: 1 }}>
                                        {event.description.length > 100
                                            ? `${event.description.substring(0, 100)}...`
                                            : event.description}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" style={{ marginTop: '1rem' }}>
                                        Location: {event.location}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" style={{ marginTop: '0.5rem' }}>
                                        Date: {new Date(event.date).toLocaleDateString()}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" style={{ marginTop: '0.5rem' }}>
                                        Time: {event.time}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" style={{ marginTop: '0.5rem', fontStyle: 'italic', textAlign: 'right' }}>
                                        Creator: {event.creator.fullName}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle>{selectedEvent?.title}</DialogTitle>
                <DialogContent>
                    {selectedEvent?.image && (
                        <CardMedia
                            component="img"
                            height="500"
                            image={selectedEvent.image}
                            alt={selectedEvent.title}
                            style={{ marginBottom: '1rem', width: '100%', objectFit: "contain" }}
                            className='image-cover'
                        />
                    )}
                    <Typography variant="body1" gutterBottom>
                        {selectedEvent?.description}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" style={{ marginTop: '1rem' }}>
                        Location: {selectedEvent?.location}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" style={{ marginTop: '0.5rem' }}>
                        Date: {new Date(selectedEvent?.date).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" style={{ marginTop: '0.5rem' }}>
                        Time: {selectedEvent?.time}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" style={{ marginTop: '1rem' }}>
                        Max Attendees: {selectedEvent?.maxAttendees}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" style={{ marginTop: '1rem' }}>
                        Creator: {selectedEvent?.creator?.fullName}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleBookNow(selectedEvent)}
                    >
                        Book Now
                    </Button>
                    <Button onClick={() => setOpenDialog(false)} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Home;
