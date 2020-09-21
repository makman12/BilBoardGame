const mongoose = require("mongoose");
const { findByIdAndDelete } = require("./User");
mongoose.set("useFindAndModify", false);

const roomSchema = new mongoose.Schema({
  name: String,
  _id: String,
  password: String,
  users: Array,
  game: String,
  started: Boolean,
});

roomSchema.methods.create = async function (user) {
  this._id = randomId();
  this.users.push({ session: user.session, username: user.username });
  this.started = false;
  await this.save();
};

roomSchema.methods.start = async function () {
  this.started = true;
  await this.save();
};

roomSchema.methods.join = async function (user) {
  for (i of this.users) {
    if (i.username == user.username) {
      return false;
    }
    if (this.started) {
      return false;
    }
  }
  this.users.push({ session: user.session, username: user.username });
  await this.save();
  return true;
};

roomSchema.methods.leave = async function (user) {
  console.log("çıkıyor");
  let index;
  for (i in this.users) {
    if (this.users[i].username === user.username) {
      index = i;
    }
  }

  if (index) {
    console.log(index);
    this.users.splice(index, 1);
    if (this.users.length === 0) {
      await Room.findByIdAndDelete(this._id, (err, data) => {});
      return true;
    } else {
      await this.save();
      return false;
    }
  }
  return false;
};

const Room = mongoose.model("Rooms", roomSchema);

module.exports = Room;

let randomId = () => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};
