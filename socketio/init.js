const httpServer = require("http")
const { Server } = require("socket.io")
const RoomHelpers = require("../helpers/roomHelpers")
const SOCKETPORT = process.env.SOCKETPORT || 3001

const { freeRooms, lobbyUsers } = require("./data")

const io = new Server(SOCKETPORT, {
  cors: {
    origin: true,
    methods: ["GET", "POST"]
  }
});

console.log(`Socket.io listening on port ${SOCKETPORT}`)
io.on("connection", (socket) => {
  socket.on("find-opponent", (data) => {
    const userContext = data.context
    const randomRooms = freeRooms.filter(room => !room?.roomName)

    if (randomRooms.length !== 0 && randomRooms[0].userId !== userContext.userId) {
      const enemyContext = randomRooms[0].userContext
      const emitObj = {
        player1Context: userContext,
        player2Context: enemyContext
      }

      socket.join(randomRooms[0].roomId)
      io.to(randomRooms[0].roomId).emit("pair-with-opponent", { ...emitObj, socketRoom: freeRooms[0].roomId })
      return randomRooms.shift()
    }

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
    socket.join(roomId)
    io.to(roomId).emit("room-created", object)
    io.to("lobby").emit("private-room-added", object)
  })

  socket.on("list-private-rooms", () => {
    // console.log("lisuje")
    const privateRooms = freeRooms.filter(room => room?.roomName)
    io.to("lobby").emit("private-rooms", privateRooms)
  })

  socket.on("join-room", async (data) => {
    // console.log(data)
    // console.log(io.sockets.adapter.rooms.get("queue" + data.roomId))
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
    const privateRooms = freeRooms.filter(room => room?.roomName)
    const foundRoom = privateRooms.find((room) => room.roomId == data.roomId)
    console.log(foundRoom)
    const enemyContext = foundRoom.userContext
    // console.log(data.userContext)

    const emitObj = {
      userContext: data.userContext,
      enemyContext,
      roomId: data.roomId,
      roomName: data.roomName,
    }
    // console.log(emitObj)
    socket.join(data.roomId)
    io.to(data.roomId).emit("users-joined-search", emitObj)
  })

  socket.on("estabilish-game", (data) => {
    console.log(data)
    socket.join(data.roomId)
    io.to(data.roomId).emit("connected-to-game", { roomId: data.roomId })
  })



  // * _-_-_-_-_-_- game playment _-_-_-_-_-_-
  socket.on("card-placement", (data) => {
    const { cardId, cords, roomId } = data
    io.to(roomId).emit("do-card-placement", { cardId, cords })
  })
});
