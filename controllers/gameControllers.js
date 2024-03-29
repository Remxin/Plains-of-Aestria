const userHelpers = require("../helpers/userHelpers")
const path = require("path")
const Card = require("../models/Card")

const sendGameFile = async (req, res) => {
    // ! ODHASHUJ, by działało tylko po weryfikacji uzytkownika (kazde kilka pierwszych linijek ponizszych funkcji)
    // const { jwt, roomId } = req.cookies
    // const user = await userHelpers.verifyUser(jwt)
    // // console.log(user)
    // if (user.err) {
    //     return res.redirect("/login")
    // }

    // if (!roomId) {
    //     return res.redirect("/")
    // }

    return res.sendFile(path.resolve("static/pages/index.html"))

}

const getAllCards = async (req, res) => {
    console.log('wchodzi')
    // const { jwt, roomId } = req.cookies
    // const user = await userHelpers.verifyUser(jwt)

    // if (user.err) return res.send([])
    const fraction = JSON.parse(req.body).fraction
    console.log(fraction)
    const cards = await Card.find()
    // console.log(cards)
    return res.send({ cards, fraction })

}

const showWinMenu = async (req, res) => {
    const { jwt } = req.cookies
    const user = await userHelpers.verifyUser(jwt)
    // console.log(user)
    if (user.err) {
        return res.redirect("/login")
    }

    return res.sendFile(path.resolve("static/pages/win.html"))

}


module.exports = { sendGameFile, getAllCards, showWinMenu }