import React, { useEffect, useState } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Grid,
    Button,
    Container,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
} from '@mui/material';
import api from '../Common/Api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const YourEvents = ({ Auth }) => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [currentEvent, setCurrentEvent] = useState({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        maxAttendees: '',
        image: null
    });
    const [isEditMode, setIsEditMode] = useState(false);
    const [eventIdToEdit, setEventIdToEdit] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const navigate = useNavigate();

    const fetchYourEvents = async () => {
        try {
            const res = await api.listUserEvents(Auth?._id);
            setEvents(res.data.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
            toast.error("Failed to fetch events!");
        }
    };

    useEffect(() => {
        if (!Auth && !Auth?._id) {
            navigate('/signup');
        }

        fetchYourEvents();
        // eslint-disable-next-line
    }, []);

    const handleDelete = async (id) => {
        try {
            await api.deleteEvent(id);
            fetchYourEvents();
            setEvents(events.filter((event) => event._id !== id));
            toast.success("Event Delete Successful!")
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete event!");
        }
    };

    const convertTo24Hour = (time12h) => {
        let [time, modifier] = time12h.split(' ');
        let [hours, minutes] = time.split(':');
    
        if (modifier === 'PM' && hours !== '12') {
            hours = parseInt(hours, 10) + 12;
        } else if (modifier === 'AM' && hours === '12') {
            hours = '00';
        }
        
        return `${String(hours).padStart(2, '0')}:${minutes}`;
    };    

    const handleOpen = (event = {
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        maxAttendees: '',
        image: null
    }, isEdit = false) => {
        const formattedDate = isEdit ? new Date(event.date).toISOString().split('T')[0] : '';
        const formattedTime = isEdit ? convertTo24Hour(event.time) : '';

        console.log("Current Event Time:", formattedTime);

        setCurrentEvent({
            title: event.title,
            description: event.description,
            date: formattedDate,
            time: formattedTime,
            location: event.location,
            maxAttendees: event.maxAttendees,
            image: null
        });
        setIsEditMode(isEdit);
        setEventIdToEdit(isEdit ? event._id : null);
        setImagePreview(isEdit ? event.image : null);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setCurrentEvent({
            title: '',
            description: '',
            date: '',
            time: '',
            location: '',
            maxAttendees: '',
            image: null
        });
        setIsEditMode(false);
        setImagePreview(null);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setCurrentEvent({ ...currentEvent, image: file });
        setImagePreview(URL.createObjectURL(file));
    };

    const formatTime = (time) => {
        const [hours, minutes] = time.split(':');
        const formattedHours = hours % 12 || 12;
        const ampm = hours < 12 ? 'AM' : 'PM';
        return `${formattedHours}:${minutes} ${ampm}`;
    };

    const handleSave = async () => {
        try {
            if (!currentEvent.title || !currentEvent.description || !currentEvent.date || !currentEvent.time || !currentEvent.location || !currentEvent.maxAttendees) {
                alert("Please fill in all fields.");
                return;
            }

            const formattedTime = formatTime(currentEvent.time);

            const formData = new FormData();
            formData.append('title', currentEvent.title);
            formData.append('description', currentEvent.description);
            formData.append('date', currentEvent.date);
            formData.append('time', formattedTime); 
            formData.append('location', currentEvent.location);
            formData.append('maxAttendees', currentEvent.maxAttendees);
            formData.append('creator', Auth?._id)

            if (currentEvent.image) {
                formData.append('file', currentEvent.image);
            }
            
            if (isEditMode) {
                await api.editEvent(eventIdToEdit, formData);
                toast.success("Event updated successfully!");
            } else {
                await api.addEvent(formData);
                toast.success("Event added successfully!");
            }
            fetchYourEvents();
            handleClose();
        } catch (err) {
            console.error(err);
            toast.error("Failed to save event!");
        }
    };

    if (loading) {
        return (
            <Container>
                <CircularProgress />
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" style={{ marginTop: '2rem' }}>
            <Typography variant="h4" gutterBottom align="center">
                Your Events
            </Typography>
            <Button
                variant="contained"
                color="primary"
                style={{ marginBottom: '1.5rem' }}
                onClick={() => handleOpen()}
            >
                Add New Event
            </Button>
            <Grid container spacing={4}>
                {events?.map((event) => (
                    <Grid item xs={12} sm={6} md={4} key={event?._id}>
                        <Card style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <CardContent style={{ flexGrow: 1 }}>
                                <Typography variant="h5" component="h2" gutterBottom>
                                    {event?.title}
                                </Typography>
                                {event.image && (
                                    <img src={event.image} alt={event.title} style={{ maxWidth: '100%', maxHeight: '150px', objectFit: 'cover' }} />
                                )}
                                <Typography variant="body2" color="textSecondary">
                                    {event?.description.length > 100 ? `${event?.description.substring(0, 100)}...` : event?.description}
                                </Typography>
                                <Typography variant="body2" style={{ marginTop: '1rem' }}>
                                    Date: {new Date(event?.date).toLocaleDateString()}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Time: {formatTime(event?.time)}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Location: {event?.location}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Max Attendees: {event?.maxAttendees}
                                </Typography>
                            </CardContent>

                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem' }}>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => handleOpen(event, true)}
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={() => handleDelete(event?._id)}
                                >
                                    Delete
                                </Button>
                            </div>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{isEditMode ? 'Edit Event' : 'Add New Event'}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Title"
                        type="text"
                        fullWidth
                        value={currentEvent.title}
                        onChange={(e) => setCurrentEvent({ ...currentEvent, title: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Description"
                        type="text"
                        fullWidth
                        multiline
                        rows={4}
                        value={currentEvent.description}
                        onChange={(e) => setCurrentEvent({ ...currentEvent, description: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Date"
                        type="date"
                        fullWidth
                        value={currentEvent.date}
                        onChange={(e) => setCurrentEvent({ ...currentEvent, date: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Time"
                        type="time"
                        fullWidth
                        value={currentEvent.time}
                        onChange={(e) => setCurrentEvent({ ...currentEvent, time: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Location"
                        type="text"
                        fullWidth
                        value={currentEvent.location}
                        onChange={(e) => setCurrentEvent({ ...currentEvent, location: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Max Attendees"
                        type="number"
                        fullWidth
                        value={currentEvent.maxAttendees}
                        onChange={(e) => setCurrentEvent({ ...currentEvent, maxAttendees: e.target.value })}
                    />
                    <input type="file" onChange={handleImageChange} />
                    {imagePreview && <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%', marginTop: '1rem' }} />}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSave} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default YourEvents;
