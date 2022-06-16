// --- package imports ---
const express = require('express')
const cookieParser = require("cookie-parser");
const cors = require("cors")
const mongoose = require("mongoose")
require("dotenv").config()
const http = require("http")

const { Server } = require("socket.io")
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

app.use(express.urlencoded({ extended: true }))
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

// app.listen(PORT, () => {
//   console.log(`server is running on port: ${PORT}`)
// })
const webServer = http.createServer(app)

const io = new Server(webServer)
webServer.listen(PORT, () => console.log(`Listening on port ${PORT}`))

// --- create socket.io server ---
// require("./socketio/init")

// module.exports = { io }

// const httpServer = require("http")
// const { Server } = require("socket.io")
// const { io } = require("../server")
const RoomHelpers = require("./helpers/roomHelpers")
// const SOCKETPORT = process.env.SOCKETPORT || 3001

let { freeRooms, lobbyUsers, gamesInProgress } = require("./socketio/data")


// ? _-__-___-- was working _-_----_--
// console.log(webServer)

// const io = new Server(SOCKETPORT, {
//   cors: {
//     origin: true,
//     methods: ["GET", "POST"]
//   }
// });

// console.log(`Socket.io listening on port ${SOCKETPORT}`)
io.on("connection", (socket) => {
  socket.on("find-opponent", (data) => {
    const userContext = data.context
    const randomRooms = freeRooms.filter(room => !room?.roomName)
    // console.log(randomRooms)

    if (randomRooms.length !== 0 && randomRooms[0].userId !== userContext.userId) {
      // console.log("join")
      const enemyContext = randomRooms[0].userContext
      const emitObj = {
        player1Context: userContext,
        player2Context: enemyContext
      }

      socket.join(randomRooms[0].roomId)
      // console.log(randomRooms[0])
      io.to(randomRooms[0].roomId).emit("pair-with-opponent", { ...emitObj, socketRoom: freeRooms[0].roomId })
      gamesInProgress.push({ ...randomRooms[0], user2Context: userContext })
      freeRooms.shift()
      return
    }
    // console.log('create')

    const roomId = Math.random().toString(36).substring(2, 13)
    freeRooms.push({ roomId, userId: userContext.userId, userContext })
    socket.join(roomId)
  })

  socket.on("join-lobby", (userData) => {
    socket.join("lobby")
    lobbyUsers.push(userData.userId)
  })

  socket.on("create-room", async (data) => {
    const { userContext, roomName, passwordString } = data
    const hashedPassword = await RoomHelpers.hashRoomPassword(passwordString)
    const roomId = Math.random().toString(36).substring(2, 13)

    const object = {
      roomId,
      userId: userContext.userId,
      roomName,
      roomPassword: hashedPassword,
      userContext
    }
    // console.log(object)
    freeRooms.push(object)
    console.log(freeRooms)
    socket.join(roomId)
    io.to(roomId).emit("room-created", object)
    io.to("lobby").emit("private-room-added", object)
  })

  socket.on("list-private-rooms", () => {
    const privateRooms = freeRooms.filter(room => room?.roomName)
    io.to("lobby").emit("private-rooms", privateRooms)
  })

  socket.on("join-room", async (data) => {
    // if user is not in queue yet
    data.userContext.creator = false
    if (!io.sockets.adapter.rooms.get("queue" + data.roomId + data.userId)) {
      socket.join("queue" + data.roomId + data.userId)
    }
    const passVerified = await RoomHelpers.matchPasswords(data.roomPass, data.roomPassword)
    if (!passVerified) {
      return io.to("queue" + data.roomId + data.userId).emit("user-join-room", { err: "Wrong password" })
    }

    io.to("queue" + data.roomId + data.userId).emit("user-join-room", { msg: "Success", ...data })
  })

  socket.on("join-game", (data) => {
    // console.log(freeRooms)
    const privateRooms = freeRooms.filter(room => room?.roomName)
    // console.log(privateRooms)
    const foundRoom = privateRooms.find((room) => room.roomId == data.roomId)
    // console.log(foundRoom)
    const enemyContext = foundRoom.userContext
    // console.log(data.userContext)
    const emitObj = {
      userContext: data.userContext,
      enemyContext,
      roomId: data.roomId,
      roomName: data.roomName,
    }
    // console.log(data.userContext)
    // console.log(emitObj)
    socket.join(data.roomId)
    io.to(data.roomId).emit("users-joined-search", emitObj)


    // dodawanie informacji o userach
    if (foundRoom.joinedOne) {
      freeRooms = freeRooms.filter((room) => room.roomId !== data.roomId) // usuwanie

      gamesInProgress.push({ ...emitObj, user2Context: emitObj.enemyContext })
    } else {
      foundRoom.joinedOne = true
    }
    console.log(gamesInProgress)
  })

  socket.on("estabilish-game", (data) => {
    // console.log(data)
    socket.join(data.roomId)
    io.to(data.roomId).emit("connected-to-game", { roomId: data.roomId })

  })



  // * _-_-_-_-_-_- game playment _-_-_-_-_-_-
  socket.on("card-placement", (data) => {
    const { cardId, cords, roomId, user } = data
    socket.to(roomId).emit("do-card-placement", { cardId, cords, user })
  })

  socket.on("pass-turn", (data) => {
    const { roomId } = data
    socket.to(roomId).emit("end-turn")
  })

  socket.on("choose-first-player", (data) => {
    console.log(data)
    console.log(gamesInProgress)
    let foundRoom;
    if (data.roomId) {
      foundRoom = gamesInProgress.find((game) => game.roomId == data.roomId)
    } else {
      foundRoom = gamesInProgress.find((game) => game.userContext.userId == data.player || game.user2Context.userId == data.player)
    }

    if (!foundRoom?.firstPlayer) {
      const playerArr = [foundRoom.userContext, foundRoom.user2Context]
      const randomInt = Math.floor(Math.random() * 1.99)
      let firstPlayer = playerArr[randomInt]
      foundRoom.firstPlayer = firstPlayer.userId
    }

    firstPlayer = foundRoom.firstPlayer

    io.to(data.roomId).emit("first-player", { firstPlayer })
  })
});

// module.exports = { PORT }

