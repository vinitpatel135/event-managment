const { default: mongoose } = require("mongoose");

class BookModel {
    constructor(){
        this.schema = new mongoose.Schema({
            eventId: { type: mongoose.Types.ObjectId, required:true, ref:"tbl_events" },
            userId: { type: mongoose.Types.ObjectId, required: true, ref:"tbl_users" },
            status: { type: String, default:"Booked"},
        },{ timestamps: true })

        this.model = mongoose.model("tbl_books", this.schema)
    }
}

module.exports = BookModel