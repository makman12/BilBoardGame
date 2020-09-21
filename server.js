const express = require("express");
const http = require("http");
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const bodyParser = require("body-parser");
const app = express();
const server = http.createServer(app);
const clientPath = `${__dirname}/client`;
const mongoose = require("mongoose");
const routes = require("./scripts/routes");
const api = require("./scripts/api");
const socketio = require("socket.io");
const io = socketio(server);
const PORT = process.env.PORT || 1997;
const fs = require("fs");

server.listen(PORT);

//Mongo DB

mongoose.connect(
  "mongodb+srv://mali12:19972005@arttimetravel.vvghh.mongodb.net/bilboard?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
);
mongoose.set("useFindAndModify", false);

// app.use
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const cookie_secret = "malisaddgdsd134";
app.use(
  session({
    secret: cookie_secret,
    resave: true,
    saveUninitialized: true,
  })
);

app.set("view engine", "ejs");

// Route
app.use("/", routes);
app.use("/", api.router);

//Static
app.use(express.static(clientPath));

api.io(io);

//Games
let gameList = [];
let gamesFolder = "./games";
fs.readdirSync(gamesFolder).forEach((file) => {
  let gameName = file.slice(0, -3);
  gameList.push(gameName);
});

let games = {};
gameList.forEach((game) => {
  games[game] = require("./games/" + game);
  games[game].io(io);
});
