const userHelpers = require("../helpers/userHelpers")
const path = require("path")
const Fraction = require("../models/Fraction")

const sendIndexFile = async (req, res) => {
    // const { jwt } = req.cookies
    // const user = await userHelpers.verifyUser(jwt)
    // console.log(user)
    // if (user.err) {
    //     return res.redirect("/login")
    // }

    return res.sendFile(path.resolve("static/pages/home.html"))
}

const getFractionsInfo = async (req, res) => {
    try {
        const fractions = await Fraction.find()
        return res.send(fractions)
    } catch (err) {
        console.log(err)
    }
}

const sendSearchFile = async (req, res) => {
    const { jwt } = req.cookies
    const user = await userHelpers.verifyUser(jwt)
    // console.log(user)
    if (user.err) {
        return res.redirect("/login")
    }

    return res.sendFile(path.resolve("static/pages/search.html"))
}

const setGameRequiredCookies = async (req, res) => {
    const { jwt } = req.cookies
    const user = await userHelpers.verifyUser(jwt)
    // console.log(user)
    if (user.err) {
        return res.redirect("/login")
    }

    const { roomId } = JSON.parse(req.body)
    res.cookie("roomId", roomId, { httpOnly: true, maxAge: 60 * 60 * 6 }); // na 6h
    return res.send({ msg: "Success" })
}

const resetGameRequiredCookies = async (req, res) => {
    const { jwt } = req.cookies
    const user = await userHelpers.verifyUser(jwt)
    // console.log(user)
    if (user.err) {
        return res.redirect("/login")
    }

    res.cookie("roomId", "", { maxAge: 1 }); // na 6h
    return res.send({ msg: "Success" })
}

module.exports = { sendIndexFile, getFractionsInfo, sendSearchFile, setGameRequiredCookies, resetGameRequiredCookies }