import Space from './classes/Space.js'
import Board from './classes/Board.js'
import Card from './classes/Card.js'
import cards from './classes/card_examples.js'
import { resize_handler } from './utilityFunctions.js'
import Socket from './classes/Socket.js'
import ModelLoader from './classes/ModelLoader.js'
import UsersInfo from './classes/UsersInfo.js'

async function init() {
    console.log(UsersInfo.getEnemyFraction())

    let socket = new Socket()
    let root = document.getElementById('root')

    let space = new Space(socket)
    space.render()

    socket.space = space



    // console.log(await JSON.parse(sessionStorage.getItem("UserContext")).userContext.fraction.name)
    const cardData = await cards.all_cards()
    let all_cards = cardData.cards
    let fraction = cardData.fraction
    console.log(all_cards)
    console.log(UsersInfo.getUserFraction(), UsersInfo.getEnemyFraction(), 'qwerty')

    //loading-hero-model-------------------
    let hero_model_user = new ModelLoader(space, UsersInfo.getUserFraction(), false)
    let hero_model_enemy = new ModelLoader(space, UsersInfo.getEnemyFraction(), true)
    //-------------------------------------

    let board = new Board(0, 0, 0, window.innerWidth, window.innerHeight, space, Card, all_cards, fraction, hero_model_user, hero_model_enemy)
    space.board = board


    // for (let i = 0; i < 7; i++) {
    //     let card = new Card(i, space, 500, 10, 300, all_cards)
    //     board.cards.push(card)
    // }

    resize_handler(space)
}
init()

