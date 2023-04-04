const { Router } = require("express")
const authControllers = require("../controllers/authControllers")
const router = Router()

router.get("/login", authControllers.sendLoginPage)
router.get("/register", authControllers.sendRegisterPage)
router.post("/register", authControllers.signup)
router.post("/login", authControllers.login)
router.post("/user", authControllers.getUserInfo)

module.exports = router