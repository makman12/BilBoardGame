const express = require("express");
const User = require("../models/user");
const Room = require("../models/room");
const { connect } = require("mongoose");
const { route } = require("./routes");
const router = express.Router();

// Register a new user
router.post("/api/register", async (req, res, next) => {
  let registered = new User(req.body);

  let result = await registered.register();

  res.send(result);
});

// Login

router.post("/api/login", async (req, res, next) => {
  let userData = req.body;
  const user = await User.findOne(
    { username: userData.username },
    (err, data) => data
  );
  if (user) {
    if (user.password === userData.password) {
      let currentUser = new User(user);
      currentUser.login(req.session.id);
      res.send("login");
      console.log(`${user.username} bağlandı`);
    } else {
      res.send("wrong_password");
      console.log(`${user.username} yanlış şifre`);
    }
  } else {
    res.send("wrong_username");
    console.log(`${userData.username} diye biri yok`);
  }
});

//logout

router.get("/api/logout", async (req, res, next) => {
  let user = new User({ session: req.session.id });
  await user.logout();
  res.sendStatus(200);
});

router.get("/api/mydata", async (req, res) => {
  let yourdata = await User.findOne(
    { session: req.session.id },
    (err, data) => data
  );
  if (!yourdata) {
    console.log(yourdata);
    console.log(req.session.id);
    res.send("noluyor aq");
  } else {
    res.send(yourdata);
  }
});

router.post("/api/leaveroom", (req, res, next) => {
  console.log("leave room");
  console.log(req.originalUrl);
  res.sendStatus(200);
});

//Create Room
async function isloggedin(req) {
  let user = { session: req.session.id };
  user = new User(user);
  let result = await user.isLogged();
  return result;
}

module.exports = {
  router: router,
  io: async (io) => {
    io.on("connection", async (sock) => {
      sock.on("joinroom", async (room_id) => {
        sock.join(room_id);
        let room = await Room.findById(room_id, (err, data) => data);
        io.to(room._id).emit("myroom", room);
      });
      sock.on("sendchat", (data) => {
        if (data.chat != "") {
          io.to(data.room).emit("takechat", {
            chat: data.chat,
            user: data.user,
          });
        }
      });

      sock.on("game", (event) => {
        io.emit("game", event);
      });

      sock.on("leaveroom", async (data) => {
        let user = data.user;
        let room = data.room;
        user = await User.findOne({ session: user }, (err, data) => data);
        room = await Room.findOne({ _id: room }, (err, data) => data);
        room = new Room(room);
        let result = await room.leave(user);
        io.to(room._id).emit("roompart", room.users);
        io.emit("refreshRoom", 200);
      });

      router.get("/", (req, res) => {
        res.sendStatus(200);
      });
      router.get("/api/getrooms", async (req, res, next) => {
        let allRooms = await Room.find();
        res.send(allRooms);
      });

      router.post("/api/croom", async (req, res, next) => {
        let user = await isloggedin(req);
        if (user) {
          let roomdata = req.body;
          let currentroom = new Room(roomdata);
          await currentroom.create(user);
          sock.join(currentroom._id);
          let allRooms = await Room.find();
          io.emit("refreshRoom", 200);
          res.send(currentroom._id);
        } else {
          res.send(404);
        }
      });

      router.post("/api/joinroom", async (req, res, next) => {
        let sessionid = req.session.id;
        let user = await User.findOne(
          { session: sessionid },
          (err, data) => data
        );
        if (user) {
          let roomid = req.body.roomid;
          let room;
          await Room.findById(roomid, async (err, data) => {
            room = new Room(data);
            valid = await room.join(user);
            if (valid) {
              io.emit("refreshRoom", 200);
              res.sendStatus(200);
            } else {
              res.sendStatus(305);
            }
          });
        } else {
          res.sendStatus(305);
        }
      });
    });
  },
};
