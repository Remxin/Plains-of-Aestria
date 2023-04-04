const { Router } = require("express")
const searchControllers = require("../controllers/searchControllers")
const router = Router()

router.get("/", searchControllers.sendIndexFile)
router.get("/search", searchControllers.sendSearchFile)
router.post("/fraction", searchControllers.getFractionsInfo)
router.post("/set/game/cookies", searchControllers.setGameRequiredCookies)
router.post("/reset/game/cookies", searchControllers.resetGameRequiredCookies)

module.exports = router