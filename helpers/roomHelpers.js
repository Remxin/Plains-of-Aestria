const bcrypt = require("bcrypt")
class RoomHelpers {
    static hashRoomPassword = (password) => {
        return new Promise(async (resolve, reject) => {
            console.log(password)
            const cryptedPass = await bcrypt.hash(password, 12)
            console.log(cryptedPass)
            resolve(cryptedPass)
        })
    }

    static matchPasswords = (password, hashedPassword) => {
        return new Promise(async (resolve, reject) => {
            const passwordMatches = await bcrypt.compare(password, hashedPassword)
            resolve(passwordMatches)
        })
    }
}

module.exports = RoomHelpers