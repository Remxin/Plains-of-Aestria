export default class UsersInfo {
    static context = JSON.parse(sessionStorage.getItem("UserContext"))
    static userContext = this.context?.userContext ? this.context.userContext : this.context
    static enemyContext = JSON.parse(sessionStorage.getItem("EnemyContext"))

    static getUserFraction = () => {
        return this.userContext.fraction.name.toLowerCase().slice(0, -1)
    }

    static getEnemyFraction = () => {
        return this.enemyContext.fraction.name.toLowerCase().slice(0, -1)
    }

}