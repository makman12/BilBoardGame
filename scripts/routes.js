const express = require("express");
const User = require("../models/User");
const Room = require("../models/Room");
const router = express.Router();

async function isloggedin(req) {
  let user = { session: req.session.id };
  user = new User(user);
  let result = await user.isLogged();
  return result;
}

router.get("/", async (req, res, next) => {
  console.log("index aranıyor");
  let loggedIn = await isloggedin(req);
  res.render("index.ejs", { loggedin: loggedIn });
});

router.get("/login", async (req, res, next) => {
  let loggedIn = await isloggedin(req);
  if (loggedIn) {
    res.redirect("/");
  } else {
    res.render("login.ejs");
  }
});

router.get("/register", async (req, res, next) => {
  let loggedIn = await isloggedin(req);
  if (loggedIn) {
    res.redirect("/");
  } else {
    res.render("register.ejs");
  }
});

router.get("/room/:id", async (req, res, next) => {
  let loggedIn = await isloggedin(req);
  if (loggedIn) {
    await sleep(300);
    room = await Room.findById(req.params.id, (err, data) => data);
    if (room) {
      let isinroom = false;
      for (i of room.users) {
        console.log(i.username);
        if (i.username === loggedIn.username) {
          isinroom = true;
        }
      }
      if (!isinroom) {
        res.redirect("/");
      } else {
        res.render("room.ejs", { room: room });
      }
    } else {
      res.redirect("/");
    }
  } else {
    res.redirect("/login");
  }
});

router.get("/account", async (req, res, next) => {
  let loggedIn = await isloggedin(req);
  if (loggedIn) {
    res.render("account.ejs", { username: loggedIn.username });
  } else {
    res.redirect("/login");
  }
});

module.exports = router;

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
