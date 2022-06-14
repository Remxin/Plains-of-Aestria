import { UserContext } from "./UserContext.js";


export class Home {

    constructor() {
        this.userData;
        this.fractionData;
        this.userChoosenFractionP;
        this.deckShowed = false
        this.socketEstabilished = false
        this.mainDiv = document.getElementById("main")
        this.deckDiv = document.getElementsByClassName('deck')[0]
        this.insertDiv = document.getElementsByClassName("user-info")[0]
        this.userDiv = document.getElementsByClassName("user")[0]
        this.init()
        this.deleteSessionData()
    }

    init = async () => {
        // TODO: Dodaj kreciola
        if (this.userData) {
            return this.createUserInfo(this.userData)
        }

        try {
            const res = await fetch('/user', {
                method: "POST",
                credentials: "include"
            })
            const resData = await res.json()
            this.userData = resData
            // console.log(this.userData)
            this.createUserInfo(resData)
        } catch (err) {

        }
    }

    createUserInfo = (userInfo) => {
        // TODO: usun kreciola
        const userName = document.createElement("h2")
        userName.innerText = "Welcome " + userInfo.name + "!"
        userName.classList.add("user-name")

        const userEmail = document.createElement('p')
        userEmail.innerHTML = "<i class='material-icons'>email</i> " + userInfo.email
        userEmail.classList.add("user-email")

        const pickFractionBtn = document.createElement("button")
        pickFractionBtn.innerText = "Choose your fraction"
        pickFractionBtn.setAttribute("id", "pick-fraction-btn")
        pickFractionBtn.classList.add("button")
        pickFractionBtn.onclick = () => this.showFractionMenu()

        const userChoosenFraction = document.createElement("p")
        userChoosenFraction.innerText = "Choosen fraction: none"
        this.userChoosenFractionP = userChoosenFraction

        // --- start game button ---
        const startGameButton = document.createElement("button")
        startGameButton.setAttribute("disabled", "true")
        startGameButton.innerText = "START GAME"
        startGameButton.classList.add("button")
        startGameButton.onclick = () => this.showSearchForGameMenu()
        this.startGameButton = startGameButton

        this.userDiv.appendChild(userName)
        this.userDiv.appendChild(userEmail)
        this.userDiv.appendChild(pickFractionBtn)
        this.userDiv.appendChild(userChoosenFraction)
        this.userDiv.appendChild(startGameButton)
    }

    showMainMenu = () => {
        this.fractionMenu.style.display = "none"
        // this.searchGameMenu.style.display = "none"
        this.insertDiv.style.display = "flex"
        this.userChoosenFractionP.innerText = "Choosen fraction: " + this.fractionData.name
        this.startGameButton.removeAttribute("disabled")
        if (!this.deckShowed) {
            this.showDeckCards()
        }

    }

    showFractionMenu = async () => {
        this.insertDiv.style.display = "none"

        // creating choose fraction menu
        const main = document.createElement("div")
        main.classList.add("choose-fraction-menu")
        this.fractionMenu = main

        const title = document.createElement("h3")
        title.innerText = "Choose your fraction"
        main.appendChild(title)

        this.mainDiv.appendChild(main)

        // creating card for each fraction
        const fractionContainer = document.createElement("div")
        fractionContainer.classList.add("fraction-container")
        const fractionsData = await this.fetchForFractions()
        // console.log(fractionsData)
        // --- choosen info ---
        const infoP = document.createElement("p")
        infoP.innerText = "You choosed: "
        infoP.setAttribute("id", "choosen-info")
        // --- accept button ---
        const acceptBtn = document.createElement("button")
        acceptBtn.innerText = "SELECT THIS FRACTION"
        acceptBtn.setAttribute("disabled", "true")
        acceptBtn.onclick = () => this.showMainMenu()
        acceptBtn.classList.add("button")


        // ------- fractions -------
        fractionsData.data.forEach((fraction) => {
            // --- main container ---
            const container = document.createElement("div")
            container.classList.add("fraction-card")
            container.onclick = () => {
                this.fractionData = fraction
                acceptBtn.removeAttribute("disabled")
                infoP.innerText = "You choosed: " + fraction.name
            }
            let imgSrc = "/imgs/"
            let liderSrc = "/imgs/liders/"
            let bgc
            switch (fraction.name) {
                case "Humans":
                    imgSrc += "human-kingdom.png"
                    liderSrc += "human-king.png"
                    bgc = "blue"
                    break
                case "Demons":
                    imgSrc += "demons-kingdom.webp"
                    liderSrc += "demons-king.png"
                    bgc = "red"
                    break
                case "Undeads":
                    imgSrc += "undeads-kingdom.jpeg"
                    liderSrc += "undeads-king.png"
                    bgc = "green"
                    break
            }
            container.style.background = `url("${imgSrc}")`
            // --- info container (blured)---
            const infoContainer = document.createElement("div")
            infoContainer.classList.add("info-container")

            const title = document.createElement("h3")
            title.innerText = fraction.name
            infoContainer.appendChild(title)

            const description = document.createElement("p")
            description.innerText = fraction.description
            infoContainer.appendChild(description)

            // --- lider ---
            const liderContainer = document.createElement("div")
            liderContainer.classList.add("lider-container")

            const liderImg = document.createElement("img")
            liderImg.src = liderSrc
            liderImg.alt = fraction.name + " king"
            liderContainer.appendChild(liderImg)

            const liderTitle = document.createElement("p")
            liderTitle.innerText = fraction.lider.name
            liderTitle.classList.add("lider-name")
            liderContainer.appendChild(liderTitle)

            const liderLifes = document.createElement("p")
            liderLifes.innerText = "Lifes: " + fraction.lider.lifes
            liderLifes.classList.add("lider-lifes")
            liderContainer.appendChild(liderLifes)

            infoContainer.appendChild(liderContainer)
            container.appendChild(infoContainer)
            fractionContainer.appendChild(container)
        })

        main.appendChild(fractionContainer)
        main.appendChild(infoP)
        main.appendChild(acceptBtn)





    }

    showDeckCards = () => {
        this.deckShowed = true
        const title = document.createElement("h3")
        title.innerText = "Your cards: "
        title.classList.add("deck-title")
        this.deckDiv.appendChild(title)
    }

    showSearchForGameMenu = () => {
        console.log("aa")
        this.insertDiv.style.display = "none"
        if (this.searchGameMenu) {
            return this.searchGameMenu.style.display = "flex"
        }

        // creating choose fraction menu
        const main = document.createElement("div")
        main.classList.add("search-game-menu")
        this.searchGameMenu = main

        const title = document.createElement("h3")
        title.innerText = "Search for game"
        main.appendChild(title)

        this.mainDiv.appendChild(main)

        const gamePickMenu = document.createElement("div")
        this.gamePickMenu = gamePickMenu
        gamePickMenu.classList.add("game-pick-menu")
        main.appendChild(gamePickMenu)
        // create game button
        const createGameBtn = document.createElement("button")
        createGameBtn.classList.add("button")
        createGameBtn.innerText = "CREATE GAME"
        createGameBtn.onclick = () => this.showCreateGameMenu()
        main.appendChild(createGameBtn)

        // join game button
        const joinGameButton = document.createElement("button")
        joinGameButton.classList.add("button")
        joinGameButton.innerText = "JOIN GAME"
        joinGameButton.onclick = () => this.showPrivateGamesMenu()

        main.appendChild(joinGameButton)

        // search for random game button
        const randomGameBtn = document.createElement("button")
        randomGameBtn.classList.add("button")
        randomGameBtn.innerText = "RANDOM ENEMY"
        randomGameBtn.onclick = () => this.searchForRandomGame()
        main.appendChild(randomGameBtn)

        // back button
        const backBtn = document.createElement("button")
        backBtn.classList.add("back-button")
        backBtn.classList.add("button")
        backBtn.innerText = "BACK"
        backBtn.onclick = () => {
            this.searchGameMenu.style.display = "none"
            this.showMainMenu()
        }
        main.appendChild(backBtn)

        if (!this.socketEstabilished) {
            this.estabilishSocket()
        }
    }

    searchForRandomGame = () => {
        const context = {
            userId: this.userData._id,
            userName: this.userData.name,
            userEmail: this.userData.email,
            fraction: this.fractionData
        }
        sessionStorage.setItem("UserContext", JSON.stringify(context))
        window.location.href = "/search"
    }

    fetchForFractions = () => {
        return new Promise(async (resolve, reject) => {
            try {
                const res = await fetch("/fraction", {
                    method: "POST"
                })
                const resData = await res.json()
                resolve({ data: resData })
            } catch (err) {
                reject({ err })
            }
        })
    }

    estabilishSocket = () => {
        const socket = io.connect("http://localhost:3001");
        this.socket = socket
        socket.emit("join-lobby", { userId: this.userData._id });
        this.socketEstabilished = true
    }

    showCreateGameMenu = () => {
        if (!this.socketEstabilished) return // jeśli nie ma połączenia z socketem
        if (this.createGameMenu) return this.createGameMenu.style.display = "flex" // jeśli było ju wcześniej generowane

        const createGameMenu = document.createElement("div")
        createGameMenu.classList.add("create-game-menu")

        const gameNameLabel = document.createElement("label")
        gameNameLabel.setAttribute("for", "game-name")
        gameNameLabel.innerText = "Game name"
        const gameNameInput = document.createElement("input")
        gameNameInput.setAttribute("id", "game-name")
        gameNameInput.setAttribute("autocomplete", "off")
        gameNameInput.setAttribute("placeholder", "name")
        createGameMenu.appendChild(gameNameLabel)
        createGameMenu.appendChild(gameNameInput)

        const gamePasswordLabel = document.createElement("label")
        gamePasswordLabel.setAttribute("for", "game-password")
        gamePasswordLabel.innerText = "Game password"
        const gamePasswordInput = document.createElement("input")
        gamePasswordInput.setAttribute("id", "game-password")
        gamePasswordInput.setAttribute("type", "password")
        gamePasswordInput.setAttribute("autocomplete", "off")
        gamePasswordInput.setAttribute("placeholder", "password")

        createGameMenu.appendChild(gamePasswordLabel)
        createGameMenu.appendChild(gamePasswordInput)

        const createGameButton = document.createElement("button")
        createGameButton.innerText = "CREATE GAME"
        createGameButton.classList.add("button")
        createGameButton.setAttribute("disabled", "true")
        createGameButton.onclick = () => this.createGame(gameNameInput.value, gamePasswordInput.value)

        // unlblock/block button
        gamePasswordInput.onchange = () => (gamePasswordInput.value && gameNameInput.value) ? createGameButton.removeAttribute("disabled") : createGameButton.setAttribute("disabled", "true")
        gameNameInput.onchange = () => (gamePasswordInput.value && gameNameInput.value) ? createGameButton.removeAttribute("disabled") : createGameButton.setAttribute("disabled", "true")

        createGameMenu.appendChild(createGameButton)
        this.createGameMenu = createGameMenu

        // back button
        const backButton = document.createElement("button")
        backButton.innerText = "BACK"
        backButton.classList.add("button")
        backButton.onclick = () => this.createGameMenu.style.display = "none"
        this.createGameMenu.appendChild(backButton)

        this.mainDiv.appendChild(createGameMenu)

    }

    createGame = (gameName, gamePassword) => {
        const context = {
            userId: this.userData._id,
            userName: this.userData.name,
            userEmail: this.userData.email,
            fraction: this.fractionData
        }
        const emitObject = {
            userContext: context,
            roomName: gameName,
            passwordString: gamePassword,
            creator: true
        }

        this.socket.emit("create-room", emitObject)
        this.socket.on("room-created", (data) => {
            sessionStorage.setItem("UserContext", JSON.stringify({ ...context, roomId: data.roomId, roomName: data.roomName }))
            window.location.href = "/search"
        })

    }

    showPrivateGamesMenu = () => {
        if (!this.socketEstabilished) return
        if (this.privateGamesMenu) return this.privateGamesMenu.style.display = "flex"
        const container = document.createElement("div")
        container.classList.add("private-games-menu")
        this.privateGamesMenu = container

        const privateGamesTable = document.createElement("table")
        this.privateGamesTable = privateGamesTable
        const tableHeadersRow = document.createElement("tr")
        const nameHeaderCell = document.createElement("th")
        nameHeaderCell.innerText = "Room Name"

        const creatorNameCell = document.createElement("th")
        creatorNameCell.innerText = "Owner"

        const passwordCell = document.createElement("th")

        tableHeadersRow.appendChild(nameHeaderCell)
        tableHeadersRow.appendChild(creatorNameCell)
        tableHeadersRow.appendChild(passwordCell)
        privateGamesTable.appendChild(tableHeadersRow)
        container.appendChild(privateGamesTable)


        const joinButton = document.createElement("button")
        joinButton.innerText = "JOIN ROOM"
        joinButton.classList.add("button")
        joinButton.setAttribute("disabled", "true")
        joinButton.onclick = () => this.showJoinRoomMenu()
        this.joinGameButton = joinButton
        container.appendChild(joinButton)

        const backButton = document.createElement("button")
        backButton.innerText = "BACK"
        backButton.classList.add("button")
        backButton.onclick = () => this.privateGamesMenu.style.display = "none"
        container.appendChild(backButton)
        this.mainDiv.appendChild(container)

        this.socket.emit("list-private-rooms")
        this.socket.on("private-rooms", (data) => this.generatePrivateGamesTable(data))
        this.socket.on("private-room-added", (data) => this.generatePrivateGamesTable([data]))
    }

    generatePrivateGamesTable = (roomsData) => {
        roomsData.forEach((roomData) => {
            const tr = document.createElement("tr")
            // -_-_ selecting private game room -_-_

            tr.onclick = () => {
                if (this.selectedPrivateRoom) {
                    this.selectedPrivateRoom.row.style.background = "none"
                }
                this.selectedPrivateRoom = { row: tr, roomData }
                this.joinGameButton.removeAttribute("disabled")
                this.selectedPrivateRoom.row.style.background = "#afb"
            }


            // --- creating table ---
            const roomNameCell = document.createElement("td")
            roomNameCell.innerText = roomData.roomName

            const creatorNameCell = document.createElement("td")
            creatorNameCell.innerText = roomData.userContext.userName

            const lockIconCell = document.createElement("td")
            lockIconCell.innerText = "🔒"

            tr.appendChild(roomNameCell)
            tr.appendChild(creatorNameCell)
            tr.appendChild(lockIconCell)
            this.privateGamesTable.appendChild(tr)
        })
    }

    showJoinRoomMenu = () => {
        const container = document.createElement("div")
        container.classList.add("join-password-menu")

        const passLabel = document.createElement("label")
        passLabel.setAttribute("for", "join-room-pass")
        passLabel.innerText = "Enter room password: "
        container.appendChild(passLabel)

        const joinButton = document.createElement("button")
        const passInput = document.createElement("input")
        passInput.setAttribute("id", "join-room-pass")
        passInput.setAttribute("type", "password")
        passInput.setAttribute("placeholder", "Room password")
        this.roomPassInput = passInput
        passInput.onchange = () => passInput.value ? joinButton.removeAttribute('disabled') : joinButton.setAttribute('disabled', "true")
        container.appendChild(passInput)

        joinButton.innerText = "JOIN"
        joinButton.classList.add("button")
        joinButton.setAttribute('disabled', "true")
        joinButton.onclick = () => this.validatePass()
        container.appendChild(joinButton)

        const backButton = document.createElement("button")
        backButton.innerText = "BACK"
        backButton.classList.add("button")
        backButton.onclick = () => this.mainDiv.removeChild(container)
        container.appendChild(backButton)

        const joinErrP = document.createElement("p")
        this.joinErrP = joinErrP
        container.appendChild(joinErrP)

        this.mainDiv.appendChild(container)
    }

    validatePass = () => {
        // console.log(this.roomPassInput.value, this.selectedPrivateRoom.roomData)
        this.socket.emit("join-room", { ...this.selectedPrivateRoom.roomData, roomPass: this.roomPassInput.value })

        this.socket.on("user-join-room", (data) => {
            console.log(data)
            if (data.err) return this.joinErrP.innerText = data.err
            const userContext = {
                userId: this.userData._id,
                userName: this.userData.name,
                userEmail: this.userData.email,
                fraction: this.fractionData
            }

            //good password
            const context = {
                // userContext: data.userContext,
                userContext,
                roomName: data.roomName,
                roomId: data.roomId
            }
            sessionStorage.setItem("UserContext", JSON.stringify(context))
            window.location.href = "/search"
        })
    }

    deleteSessionData = () => {
        sessionStorage.removeItem("UserContext")
        sessionStorage.removeItem("EnemyContext")
    }
}