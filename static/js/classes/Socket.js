import Space from "./Space.js"
import { SOCKET_PORT } from '../GLOBAL_VARS.js'

export default class Socket {
    constructor() {
        const contextData = JSON.parse(sessionStorage.getItem("UserContext"))
        // console.log(contextData)
        this.contextData = contextData
        this.socketRoom = contextData.roomId
        console.log(this.contextData)
        this.userContext = contextData.userContext
        this.enemyContext = JSON.parse(sessionStorage.getItem("EnemyContext"))
        this.space = null
        this.whoseTurn = null

        this.connectToSocket()

    }

    connectToSocket = () => {
        this.socket = io.connect(SOCKET_PORT);
        this.socket.emit("estabilish-game", { roomId: this.socketRoom })
        this.socket.emit("choose-first-player", { roomId: this.socketRoom, player: this.contextData?.userId })
        this.socket.on("first-player", (data) => { this.whoseTurn = data.firstPlayer; console.log(this.whoseTurn) })
        this.socket.on("connected-to-game", (data) => console.log(data))
        this.socket.on("do-card-placement", (data) => {
            //place the card given to the correct position
            //cardId: id from mongo
            //cords: grid index to place
            const card_id = data.cardId
            const index = data.cords
            const sender = data.user

            //stops if sender is user
            console.log(sender, this.userContext, this.enemyContext)
            console.log('blablablas')
            //if(sender == this.userContext) return

            let grid_tile = this.space.board.grid_display[index]
            let x = grid_tile.position.x
            let y = grid_tile.position.y + 13
            let z = grid_tile.position.z
            console.log(grid_tile)



            let this_card;
            for (let card_data of this.space.board.cards_json) {
                if (card_data.id = card_id) {
                    this_card = new this.space.board.Card(card_id, this.space, x, y, z, this.space.board.cards_json, null)
                    this_card.full_initialization(x, -100, z)

                    new TWEEN.Tween(this_card.mesh.position)
                        .to({
                            y: y + 100
                        }, 200)
                        .easing(TWEEN.Easing.Exponential.Out)
                        .start()
                        .onUpdate(() => {
                            this_card.update_position()
                            this_card.set_position(this_card.x, this_card.y, this_card.z)
                        })
                        .onComplete(() => {
                            this_card.update_position()
                            this_card.set_position(this_card.x, this_card.y, this_card.z)

                            new TWEEN.Tween(this_card.mesh.position)
                                .to({
                                    y: y
                                }, 200)
                                .easing(TWEEN.Easing.Exponential.Out)
                                .start()
                                .onUpdate(() => {
                                    this_card.update_position()
                                    this_card.set_position(this_card.x, this_card.y, this_card.z)
                                })
                                .onComplete(() => {
                                    this_card.update_position()
                                    this_card.set_position(this_card.x, this_card.y, this_card.z)
                                    this.space.board.cards_on_grid[index] = this_card
                                })

                        })

                    break
                }
            }

            this.space.board.cards_on_grid[index] = this_card
            console.log(data)
        })
        this.socket.on("end-turn", () => {
            this.space.board.end_turn()
        })
    }

    passCardPlacement = (cardId, cords) => {
        //console.log(this.space)
        const data = { cardId, cords, roomId: this.socketRoom, enemy: this.userContext }
        this.socket.emit("card-placement", data)
    }

    passTurn = () => {
        //console.log(this.space)
        const data = { roomId: this.socketRoom }
        this.socket.emit("pass-turn", data)
    }
}

