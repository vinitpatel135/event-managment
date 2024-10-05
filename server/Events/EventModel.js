const { default: mongoose } = require("mongoose");

class EventModel {
    constructor() {
        this.schema = new mongoose.Schema({
            title: { type: String, required: true },
            description:{ type: String, required: true},
            date: { type: Date, required: true },
            time: { type: String, required: true },
            location: { type: String, required: true },
            maxAttendees: { type: Number, required: true },
            image: { type: String, required: true },
            creator: { type: mongoose.Types.ObjectId, ref: 'tbl_users' },
        }, { timestamps: true })

        this.model = mongoose.model("tbl_events", this.schema)
    }
}

module.exports = EventModel