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
const fs = require("fs");
require("dotenv").config();
server.listen(process.env.PORT);

//Mongo DB

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.set("useFindAndModify", false);

// app.use
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.COOKIE_SECRET,
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
