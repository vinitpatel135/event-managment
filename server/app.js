const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./Config/Db');
const userRouter = require('./Users/UserRouter');
const fileUpload = require('express-fileupload');
const eventRouter = require('./Events/EventRouter');
const bookRouter = require('./Book/BookRouter');


dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(cors())
app.use(fileUpload())
app.use("/public", express.static("./public"))

app.use("/user", userRouter)
app.use("/event", eventRouter)
app.use("/book", bookRouter)

app.use("/", (req,res) => {
    return res.status(200).send({message:"Success"})
})

app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).send({ error: message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
