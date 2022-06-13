export class UserContext {
    static userName = ""
    static userEmail = ""
    static fractionData = {}

    static setUserName = (userName) => {
        this.userName = userName
    }

    static setUserEmail = (userEmail) => {
        this.userEmail = userEmail
    }

    static setFractionData = (fractionData) => {
        this.fractionData = fractionData
    }
}