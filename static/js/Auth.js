export class Auth {
    login = (login, password) => {
        return new Promise(async (resolve, reject) => {
            try {
                const res = await fetch("/login", {
                    method: "POST",
                    body: JSON.stringify({login, password})
                })
                const resData = await res.json()
                resolve(resData)
            } catch (err) {
                reject({err})
            }
        })
    }

    register = (nick, login, password) => {
        return new Promise(async (resolve, reject) => {
            try {
                const res = await fetch("/register", {
                    method: "POST",
                    body: JSON.stringify({login, password, name: nick})
                })
                const resData = await res.json()
                resolve(resData)
            } catch (err) {
                reject({err})
            }
        })
    }
}