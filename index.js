const express = require("express");
const app = express();
const userRouter = require("./routes/userroutes");
const noteRouter = require("./routes/noteRoutes");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();
const mongoose = require("mongoose");
app.use(express.json());
app.use(cors());

app.use("/user", userRouter);
app.use("/note", noteRouter);

app.get("/", (req, res) => {
    res.send("Notes API");
})

mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log("Connected to database");
        app.listen(process.env.PORT, () => {
            console.log(`Server started on port no ${process.env.PORT}.`);
        })
    }).catch((err) => {
        console.log(err);
    })