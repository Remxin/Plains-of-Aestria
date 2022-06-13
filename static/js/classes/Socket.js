import Space from "./Space.js"

export default class Socket {
    constructor() {
        const contextData = JSON.parse(sessionStorage.getItem("UserContext"))
        console.log(contextData)
        this.socketRoom = contextData.roomId
        this.userContext = contextData.userContext
        this.enemyCotext = JSON.parse(sessionStorage.getItem("EnemyContext"))
        this.space = null

        this.connectToSocket()

    }

    connectToSocket = () => {
        this.socket = io.connect("http://localhost:3001");
        this.socket.emit("estabilish-game", { roomId: this.socketRoom })
        this.socket.on("connected-to-game", (data) => console.log(data))
        this.socket.on("do-card-placement", (data) => {
            console.log(data)
            console.log(this.space)
        })
    }

    passCardPlacement = (cardId, cords) => {
        console.log(this.space)
        const data = { cardId, cords, roomId: this.socketRoom }
        this.socket.emit("card-placement", data)
    }
}

