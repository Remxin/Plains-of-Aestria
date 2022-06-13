// --- package imports ---
const express = require('express')
const cookieParser = require("cookie-parser");
const cors = require("cors")
const mongoose = require("mongoose")
require("dotenv").config()
// const Fraction = require("./models/Fraction")

// --- global vars ---
const app = express()
const PORT = process.env.PORT || 3000
const corsOptions = {
    origin: true,
    credentials: true,
    optionsSuccessStatus: 200,
  };

// --- importing routes ---
const authRoutes = require("./routes/authRoutes")
const searchRoutes = require("./routes/searchRoutes")
const gameRoutes = require("./routes/gameRoutes")

// --- app use --
app.use(express.static('./static'))
app.use(express.static('./libs'))

app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(express.text())

app.use(cookieParser())
app.use(cors(corsOptions))

// --- app use routes ---
app.use(authRoutes)
app.use(searchRoutes)
app.use(gameRoutes)

// --- connecting to mongodb ---
const mongodbUrl = process.env.MONGODB_URL || "";
mongoose
  .connect(mongodbUrl)
  .then(() => console.log("mongodb successfully connected"))
  .catch((err) => console.log(err));


// --- listening ---

app.listen(PORT, () => {
    console.log(`server is running on port: ${PORT}`)
})

// --- create socket.io server ---
require("./socketio/init")
