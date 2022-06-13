const jwt = require("jsonwebtoken")


module.exports = {
    verifyUser: (token) => {
        return new Promise((resolve, reject) => {
            if (!token) {
                return resolve({err: "Token not given"})
            }

            try {
                jwt.verify(token, process.env.TOKEN, (err, decodedUser) => {
                    if (err) {
                        return resolve({err})
                    }
                    return resolve(decodedUser)
                })
            } catch (err) {
                reject({err})
            }
        })
    },

    signToken: (userEmail, userId, tokenAge) => {
        if (!userEmail || !userId || !tokenAge) {
            return {err: "Missing data - cannot sign token"}
        }
        

        return jwt.sign({email: userEmail, id: userId}, process.env.TOKEN, { expiresIn: tokenAge })
        
    }
}