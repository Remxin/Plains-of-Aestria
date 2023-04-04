const { Router } = require("express")
const gameControllers = require("../controllers/gameControllers")
const router = Router()

router.get("/play", gameControllers.sendGameFile)
router.get("/summary", gameControllers.showWinMenu)
router.post("/get/cards", gameControllers.getAllCards)


module.exports = router