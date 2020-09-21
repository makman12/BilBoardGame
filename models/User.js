const mongoose = require("mongoose");

mongoose.set("useFindAndModify", false);

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
  session: String,
});

userSchema.methods.login = async function (sessionId) {
  User.findOneAndUpdate(
    { username: this.username },
    { session: sessionId },
    (err, data) => {}
  );
};

userSchema.methods.isLogged = async function () {
  let result = await User.findOne(
    { session: this.session },
    (err, data) => data
  );
  return result;
};

userSchema.methods.logout = async function () {
  let result = await User.findOneAndUpdate(
    { session: this.session },
    {
      session: null,
    },
    (err, data) => data
  );
  return result;
};

userSchema.methods.register = async function () {
  //username check
  let nameInvalid = await User.findOne(
    { username: this.username },
    (err, data) => data
  );
  if (!nameInvalid) {
    // email check
    let emailInvalid = await User.findOne(
      { email: this.email },
      (err, data) => data
    );
    if (!emailInvalid) {
      this.save();
      return "done";
    } else {
      return "email_taken";
    }
  } else {
    return "username_taken";
  }
};

const User = mongoose.model("Users", userSchema);

module.exports = User;
