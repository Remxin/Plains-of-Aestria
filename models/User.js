const mongoose = require("mongoose")
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Enter your name"],
  },
  email: {
    type: String,
    required: [true, "Enter your email"],
    unique: true,
    validate: [isEmail, "Enter a valid email address"],
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "Enter password"],
    minlength: [6, "Password should be at least 6 characters long"],
  },
 
  cards: {
      type: Array,
      default: []
  }
});


userSchema.pre("save", async function (next) {
  // wykona się przed zapisaniem do bazy danych
  const salt = await bcrypt.genSalt(); // generuje dodatkowe zbędne znaki
  this.password = await bcrypt.hash(this.password, salt); // hashuje hasło z dodatkowymi znakami
  next();
});

userSchema.statics.login = async function (email, password) {
  // creating own function to the schema
  const user = await this.findOne({ email });
  if (user) {
    const isAuthenticated = await bcrypt.compare(password, user.password);
    if (isAuthenticated) {
      return user;
    } else {
      throw Error("incorrect password");
    }
  } else {
    throw Error("incorrect email");
  }
};
const User = mongoose.model("user", userSchema);
module.exports = User;
