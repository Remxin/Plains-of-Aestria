// ----- imports -----
const User = require("../models/User");
const userHelpers = require("../helpers/userHelpers")
const path = require("path")

// ----- variables and non export functions -----
const jwtAge = "5d"

const alertErr = (err) => {
  // this errors will occure bcs of User model manually built function login
  let errors = { name: "", password: "", email: "" };

  if (err.message === "incorrect email") {
    errors.name = "Did not found email";
  }
  if (err.message === "incorrect password") {
    errors.password = "Incorrect password";
  }
  if (err.code === 11000) {
    errors.email = "This email is already registered";
  }
  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      // @ts-ignore
      errors[properties.path] = properties.message;
    });
  }
  return errors;
};

// ----- export functions -----
const signup = async (req, res) => {
  const { name, email, password } = JSON.parse(req.body);
  // console.log(name, email, password,)
  try {
    const user = await User.create({ name, email, password});
    // console.log(user)
    const token = await userHelpers.signToken(user.email, user._id, jwtAge)
    if (token.err) {
      return res.send({err: token.err})
    }
    // console.log(token);
    res.cookie("jwt", token, { httpOnly: true, maxAge: 60*60*24* 1000 });
    res.status(201).json({ user });
    // res.redirect("/")
  } catch (error) {
    let errors = alertErr(error);
    res.status(400).json({ errors });
  }
};

const login = async (req, res) => {
  const { email, password } = JSON.parse(req.body);
  try {
    const user = await User.login(email, password); //executing our created login function (located in User model), it'll throw err if something went wrong, so then catch will execute
    const token = await userHelpers.signToken(user.email, user._id, jwtAge)
    // @ts-ignore
    res.cookie("jwt", token, { expiresIn: jwtAge * 1000, httpOnly: true });
    res.status(201).json({ user });
  } catch (err) {
    let errors = alertErr(err); // alert function will set errors
    res.status(400).json({ errors });
  }
};

const verifyuser = async (req, res, next) => {
  const token = req.cookies.jwt;
  const userData = await userHelpers.verifyUser(token)
  if (userData.err) {
      return res.send({err: "User not verified"})
  }

  const user = await User.findById(userData.id)
  res.json(user)
  next()
};

const logout = (req, res) => {
  if (req.cookies.Ajwt) {
    res.cookie("jwt", "", { maxAge: 1 }).cookie("Ajwt", "", { maxAge: 1 });
  } else {
    res.cookie("jwt", "", { maxAge: 1 });
  }
  res.status(200).json({ logout: true });
};

const sendLoginPage = async (req, res) => {
  const decodedUser = await userHelpers.verifyUser(req.cookies.jwt)
  if (!decodedUser.err) {
    return res.redirect("/")
  }
    return res.sendFile(path.resolve("static/pages/login.html"))
}
const sendRegisterPage = async (req,res) => {
  const decodedUser = await userHelpers.verifyUser(req.cookies.jwt)
  if (!decodedUser.err) {
    return res.redirect("/")
  }  
  
  return res.sendFile(path.resolve("static/pages/register.html"))
}

const getUserInfo = async (req, res) => {
  const decodedUser = await userHelpers.verifyUser(req.cookies.jwt)
  if (decodedUser.err) {
    return res.send({err: "Cannot verify user"})
  }
  const foundUser = await User.findById(decodedUser.id)
  if (!foundUser) {
    return res.send({err: "Cannot find user"})
  }

  return res.send(foundUser)
}
module.exports = { signup, login, logout, verifyuser, sendLoginPage, sendRegisterPage, getUserInfo };
