const { httpErrors, httpSuccess } = require("../constents");
const EventModel = require("./EventModel");
const randomstring = require('randomstring')

class EventController extends EventModel {
    constructor() {
        super();
        this.addEvent = this.addEvent.bind(this)
        this.listEvents = this.listEvents.bind(this)
        this.getEventsByUserId = this.getEventsByUserId.bind(this)
        this.updateEvent = this.updateEvent.bind(this)
        this.deleteEvent = this.deleteEvent.bind(this)
    }
    async uploadMedia(file){
        let fileExt = file.name
        let fileName = randomstring.generate({
            length: 12,
            charset: 'alphabetic'
        });

        let ext = fileExt.split(".");
        ext = ext[ext.length - 1];
        fileName = fileName + "." + ext;
        let filePath = "/public/" + fileName;
        await file.mv(`.${filePath}`, (err) => {
            if (err) {
                console.error("Error moving file: ", err);
                throw new Error("File move failed");
            }
        });
        return { name: fileName, path: filePath }
    }
    async addEvent(req, res) {
        const { title, description, date, location, maxAttendees, creator, time } = req.body;
        const { file } = req.files;
        console.log("req.body :-", req.body )
        console.log("req.files :-", req.files )
        if (!title || !description || !date || !location || !maxAttendees || !creator || !file || !time) throw httpErrors[400];

        const image = await this.uploadMedia(file);
        const result = await this.model.create({ ...req.body, image: image.path });
        if (!result) throw httpErrors[500];
        return res.status(200).send({ message: httpSuccess });
    }

    async listEvents(req, res) {
        try {
            const events = await this.model.find().populate([{path:"creator"}]);
            if (!events) throw httpErrors[404];
            const updatedEvents = events.map(event => {
                // Assuming the image is stored in event.image.path
                if (event.image) {
                    event.image = `${process.env.APP_URL}${event.image}`; // Concatenate the base URL
                }
                return event;
            });
            return res.status(200).send({message:httpSuccess, data: updatedEvents});
        } catch (err) {
            return res.status(500).send({ message: httpErrors[500], error: err.message });
        }
    }

    async getEventsByUserId(req, res) {
        const { id } = req.params; // Assuming userId is passed as a parameter
        try {
            const events = await this.model.find({ creator: id });
            if (!events || events.length === 0) {
                throw httpErrors[404];
            }
    
            // Concatenate the base URL to each event's image path
            const updatedEvents = events.map(event => {
                // Assuming the image is stored in event.image.path
                if (event.image) {
                    event.image = `${process.env.APP_URL}${event?.image}`; // Concatenate the base URL
                }
                return event;
            });
            return res.status(200).send({message: httpSuccess, data:updatedEvents});
        } catch (err) {
            return res.status(500).send({ message: httpErrors[500], error: err.message });
        }
    }

    async updateEvent(req, res) {
        const { id } = req.params;
        const { title, description, date, location, maxAttendees, creator } = req.body;
        const file = req.files?.file;

        if (!title || !description || !date || !location || !maxAttendees || !creator) throw httpErrors[400];

        let updateData = { ...req.body };

        if (file) {
            const image = await this.uploadMedia(file);
            updateData = { ...updateData, image: image.path };
        }

        try {
            const updatedEvent = await this.model.findOneAndUpdate({_id : id}, {...updateData}, { new: true });
            if (!updatedEvent) throw httpErrors[404];
            return res.status(200).send({ message: httpSuccess, event: updatedEvent });
        } catch (err) {
            return res.status(500).send({ message: httpErrors[500], error: err.message });
        }
    }

    async deleteEvent(req, res) {
        const { id } = req.params;
        try {
            const deletedEvent = await this.model.deleteOne({_id: id});
            if (!deletedEvent || !deletedEvent.deletedCount > 0) throw httpErrors[500]
            return res.status(200).send({ message: httpSuccess });
        } catch (err) {
            return res.status(500).send({ message: httpErrors[500], error: err.message });
        }
    }

    async findOneEvent(id){
        const result = await this.model.findOne({_id: id})
        if(!result) throw httpErrors[404]
        return result
    }
}

const eventController = new EventController();
module.exports = eventController;
