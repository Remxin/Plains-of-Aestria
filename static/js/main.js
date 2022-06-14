import Space from './classes/Space.js'
import Board from './classes/Board.js'
import Card from './classes/Card.js'
import cards from './classes/card_examples.js'
import { resize_handler } from './utilityFunctions.js'
import Socket from './classes/Socket.js'
import ModelLoader from './classes/ModelLoader.js'

async function init() {
    // console.log(cards)

    let socket = new Socket()
    let root = document.getElementById('root')

    let space = new Space(socket)
    space.render()

    socket.space = space



    // console.log(await JSON.parse(sessionStorage.getItem("UserContext")).userContext.fraction.name)
    let all_cards = await cards.all_cards()
    console.log(all_cards)

    let board = new Board(0, 0, 0, window.innerWidth, window.innerHeight, space, Card, all_cards)
    space.board = board


    // for (let i = 0; i < 7; i++) {
    //     let card = new Card(i, space, 500, 10, 300, all_cards)
    //     board.cards.push(card)
    // }

    resize_handler(space)
}
init()

