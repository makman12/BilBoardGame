const game = io();
let gamediv = document.getElementById("game");
gamediv.className = "divider row";
gamediv.style.display = "none";
let main = document.getElementsByTagName("main")[0];

let oneplayertext = document.createElement("h4");
oneplayertext.innerText = "Oyuncular Bekleniyor";
oneplayertext.id = "wait";
document
  .getElementsByTagName("main")[0]
  .insertBefore(oneplayertext, main.childNodes[0]);

const StartGameButton = document.createElement("button");
StartGameButton.id = "startBtn";
StartGameButton.className = "btn green darken-2";
StartGameButton.innerText = "Oyunu Başlat";
StartGameButton.addEventListener("click", (e) => {
  e.preventDefault();
  game.emit("SplendorNew", myroom);
  gamediv.style.display = "";
  document.getElementById("startBtn").style.display = "none";
});
StartGameButton.style.display = "none";
main.insertBefore(StartGameButton, main.childNodes[0]);

const checkNumPlayers = async () => {
  while (!listofusers) {
    await sleep(1000);
  }
  game.emit("SplendorJoin", myroom);
  if (listofusers.length > 1) {
    document.getElementById("wait").style.display = "none";
    document.getElementById("startBtn").style.display = "";
  } else {
    document.getElementById("wait").style.display = "none";
    document.getElementById("startBtn").style.display = "none";
  }
};

checkNumPlayers();

sock.on("myroom", (room) => {
  checkNumPlayers();
  if (room.started) {
    document.getElementById("wait").style.display = "none";
    gamediv.style.display = "";
    document.getElementById("startBtn").style.display = "none";
  }
});

let head = document.getElementsByTagName("HEAD")[0];
let link = document.createElement("link");
link.innerHTML =
  '<link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap" rel="stylesheet">';
head.appendChild(link);

let colorDic = {
  blue: "blue darken-1",
  red: "red darken-1",
  black: "grey darken-4",
  white: "grey lighten-3",
  yellow: "yellow darken-1",
  green: "green darken-1",
};
//utility

let idGenerate = function () {
  return "_" + Math.random().toString(36).substr(2, 9);
};

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const Token = class {
  constructor(color, parent, yellow = false) {
    this.color = color;
    this.id = color;
    this.count = yellow ? 5 : 7;
    this.yellow = yellow;
    this.#create(parent);
    this.element = document.getElementById(this.id);
    this.countelement = document.getElementById(this.id + "count");
  }
  changeCount(add) {
    console.log("change Count bir kere");
    if (add) {
      this.countelement.innerText = +this.countelement.innerText + 1;
    } else {
      if (this.count > 0) {
        this.countelement.innerText = +this.countelement.innerText - 1;
      }
    }
  }

  setCount(number) {
    this.count = number;
    this.countelement.innerText = this.count;
  }

  summarytoken(username) {
    let kabuk = document.createElement("div");
    let tokendiv = document.createElement("div");
    tokendiv.className = "tokendiv col s2 row summary-token ";
    let token = document.createElement("img");
    token.className = `token col s12`;
    token.src = "../src/pics/splendor/tokens/" + this.color + ".png";
    token.id = username + "_" + this.id;
    token.style.cursor = "default";
    let stackcount = document.createElement("p");
    stackcount.innerText = 0;
    stackcount.className = "center summary-token-count token-count";
    stackcount.id = username + "_" + this.color + "_token";
    stackcount.disabled = true;
    stackcount.style.cursor = "default";
    stackcount.classList.add("black-text");
    stackcount.style.transform = "scale(0.4)";
    tokendiv.appendChild(token);
    tokendiv.appendChild(stackcount);
    tokendiv.style.transform = "scale(0.8)";
    kabuk.appendChild(tokendiv);
    return kabuk.innerHTML;
  }
  #create(parent) {
    let tokendiv = document.createElement("div");
    tokendiv.className = "tokendiv col s12 row ";
    let token = document.createElement("img");
    token.className = `token col s12 original-token`;
    token.src = "../src/pics/splendor/tokens/" + this.color + ".png";
    token.id = this.id;
    token.style.cursor = "pointer";
    let stackcount = document.createElement("p");
    stackcount.innerText = this.count;
    stackcount.className = "center token-count";
    stackcount.id = this.id + "count";
    stackcount.disabled = true;
    stackcount.style.cursor = "default";
    stackcount.classList.add("black-text");
    tokendiv.appendChild(token);
    tokendiv.appendChild(stackcount);
    if (this.yellow === false) {
      token.addEventListener("click", (e) => {
        e.preventDefault();
        let tokenspace = document.getElementById("token-space");
        let clone = token.cloneNode();
        clone.className = "tokendiv col s4";
        clone.style.transform = "scale(1)";
        clone.style.filter = "grayscale(0%)";
        let tokenChoice = [];
        for (i of tokenspace.childNodes) {
          if (i.id !== "take-token-btn") {
            tokenChoice.push(i.id);
          }
        }
        tokenChoice.push(this.color);
        if (isValidTakeToken(tokenChoice)) {
          takeTokenBtn.style.display = "";
          this.changeCount(false);
          tokenspace.appendChild(clone);
          // Gray Scale
          grayscale(tokenChoice);
        }
        clone.addEventListener("click", (e) => {
          e.preventDefault();
          tokenspace.removeChild(clone);
          this.changeCount(true);
          let tokenChoice = [];
          for (i of tokenspace.childNodes) {
            if (i.id !== "take-token-btn") {
              tokenChoice.push(i.id);
            }
          }
          grayscale(tokenChoice);
          if (tokenChoice.length === 0) {
            document.getElementById("take-token-btn").style.display = "none";
          }
        });
      });
    }
    parent.appendChild(tokendiv);
  }
};

const Card = class {
  constructor(data, id) {
    this.level = data.level;
    this.price = data.price;
    this.points = data.points;
    this.material = data.material;
    this.id = id;
  }

  create(update = false) {
    let parent = document.getElementById("cardlevel" + this.level);
    if (parent.childNodes.length === 0) {
      let levelcard = document.createElement("div");
      levelcard.className = "col s2 container card-div";
      levelcard.id = "level-background" + this.level;
      levelcard.innerHTML = `<img class="responsive-img splendor-card" src="/src/pics/splendor/cards/level${this.level}.png">`;
      parent.appendChild(levelcard);
    }
    let carddiv = document.createElement("div");
    carddiv.className = "col s2 container card-div";
    carddiv.id = this.id;
    carddiv.innerHTML = `<img class="responsive-img splendor-card" src="/src/pics/splendor/cards/${this.id}.png">`;
    carddiv.addEventListener("mouseenter", (e) => {
      e.preventDefault();
      let buttonsdiv = document.createElement("div");
      buttonsdiv.className = "buy-button row";

      let buyButton = document.createElement("a");
      buyButton.className =
        "center-align red accent-4 btn-small waves-effect col s6 offset-s6";
      if (!isValidBuy(this.id)) {
        buyButton.classList.add("disabled");
      }
      buyButton.innerHTML = '<i class="material-icons">shopping_cart</i>';
      buyButton.addEventListener("click", (e) => {
        e.preventDefault();
        // Satın al server'a bildir.
        let turn = {};
        turn.move = { name: "buyCard", body: this.id };
        turn.player = myuser.username;
        game.emit("SplendorTurn", { roomId: myroom, turn: turn });
      });
      buttonsdiv.appendChild(buyButton);

      let reserveButton = document.createElement("a");
      reserveButton.className =
        "center-align yellow accent-4 btn-small waves-effect col s6 offset-s6";
      reserveButton.innerHTML = '<i class="material-icons">folder</i>';
      reserveButton.addEventListener("click", (e) => {
        e.preventDefault();
        console.log(`${this.id} rezerv alındı`);
      });
      buttonsdiv.appendChild(reserveButton);
      carddiv.appendChild(buttonsdiv);
    });
    carddiv.addEventListener("mouseleave", (e) => {
      e.preventDefault();
      for (let i of carddiv.childNodes) {
        if (i.tagName !== "IMG") {
          carddiv.removeChild(i);
        }
      }
    });
    if (update) {
      return carddiv;
    } else {
      parent.appendChild(carddiv);
    }
  }
};

const Noble = class {
  constructor(args) {
    this.id = args.id;
    this.req = args.req;
    this.points = 3;
  }

  create() {
    let parent = document.getElementById("nobles");
    let carddiv = document.createElement("div");
    carddiv.className = "col s3 container noble-card";
    carddiv.id = this.id;
    carddiv.innerHTML = `<img class="responsive-img splendor-card" src="/src/pics/splendor/nobles/${this.id}.png">`;
    parent.appendChild(carddiv);
  }
};

const Player = class {
  constructor(username) {
    this.username = username;
    this.tokens = {
      yellow: 0,
      red: 0,
      blue: 0,
      purple: 0,
      orange: 0,
      green: 0,
    };
    this.cards = { red: 0, blue: 0, purple: 0, orange: 0, green: 0 };
    this.points = 0;
  }
  update(data) {
    this.tokens = data.tokens;
    this.cards = data.cards;
    this.points = data.points;
    this.summary();
  }
  summary() {
    let points = document.getElementById(`${this.username}_points`);
    points.innerText = this.points;
    let tokencolors = ["red", "green", "orange", "purple", "blue", "yellow"];
    for (i of tokencolors) {
      let token_div = document.getElementById(`${this.username}_${i}_token`);
      token_div.innerText = "+" + this.tokens[i];
    }
    let cardcolors = ["red", "green", "orange", "purple", "blue"];
    for (i of cardcolors) {
      let token_div = document.getElementById(`${this.username}_${i}_card`);
      token_div.innerText = "+" + this.cards[i];
    }
  }
};

let alltokensdiv = document.createElement("div");
alltokensdiv.id = "all-tokens";
alltokensdiv.className = "col s2 row yellow lighten-4";
gamediv.appendChild(alltokensdiv);

let token = {
  red: new Token("red", alltokensdiv),
  green: new Token("green", alltokensdiv),
  orange: new Token("orange", alltokensdiv),
  purple: new Token("purple", alltokensdiv),
  blue: new Token("blue", alltokensdiv),
  yellow: new Token("yellow", alltokensdiv, (yellow = true)),
};

let noble_wrapper = document.createElement("div");
noble_wrapper.className = "row head-row";
let noblediv = document.createElement("div");
noblediv.id = "nobles";
noblediv.className = "col s6";
noble_wrapper.append(noblediv);
gamediv.insertBefore(noble_wrapper, gamediv.childNodes[0]);
let allcardsdiv = document.createElement("div");
allcardsdiv.id = "all-cards";
allcardsdiv.className = "col s6";
gamediv.append(allcardsdiv);
["3", "2", "1"].forEach((x) => {
  let div = document.createElement("div");
  div.className = "row center cardrows";
  div.id = "cardlevel" + x;
  allcardsdiv.appendChild(div);
});

let allcards = [
  {
    level: 1,
    points: 0,
    material: "orange",
    price: [
      { material: "purple", value: 1 },
      { material: "blue", value: 1 },
      { material: "red", value: 1 },
      { material: "green", value: 1 },
    ],
  },
  {
    level: 1,
    points: 0,
    material: "orange",
    price: [
      { material: "purple", value: 1 },
      { material: "blue", value: 2 },
      { material: "red", value: 1 },
      { material: "green", value: 1 },
    ],
  },
  {
    level: 1,
    points: 0,
    material: "orange",
    price: [
      { material: "purple", value: 2 },
      { material: "blue", value: 2 },
      { material: "red", value: 1 },
    ],
  },
  {
    level: 1,
    points: 0,
    material: "orange",
    price: [
      { material: "red", value: 3 },
      { material: "orange", value: 1 },
      { material: "green", value: 1 },
    ],
  },
  {
    level: 1,
    points: 0,
    material: "orange",
    price: [
      { material: "red", value: 1 },
      { material: "green", value: 2 },
    ],
  },
  {
    level: 1,
    points: 0,
    material: "orange",
    price: [
      { material: "purple", value: 2 },
      { material: "green", value: 2 },
    ],
  },
  {
    level: 1,
    points: 0,
    material: "orange",
    price: [{ material: "green", value: 3 }],
  },
  {
    level: 1,
    points: 1,
    material: "orange",
    price: [{ material: "blue", value: 4 }],
  },
  {
    level: 1,
    points: 0,
    material: "blue",
    price: [
      { material: "purple", value: 1 },
      { material: "red", value: 1 },
      { material: "orange", value: 1 },
      { material: "green", value: 1 },
    ],
  },
  {
    level: 1,
    points: 0,
    material: "blue",
    price: [
      { material: "purple", value: 1 },
      { material: "red", value: 2 },
      { material: "orange", value: 1 },
      { material: "green", value: 1 },
    ],
  },
  {
    level: 1,
    points: 0,
    material: "blue",
    price: [
      { material: "purple", value: 1 },
      { material: "red", value: 2 },
      { material: "green", value: 2 },
    ],
  },
  {
    level: 1,
    points: 0,
    material: "blue",
    price: [
      { material: "blue", value: 1 },
      { material: "red", value: 1 },
      { material: "green", value: 3 },
    ],
  },
  {
    level: 1,
    points: 0,
    material: "blue",
    price: [
      { material: "purple", value: 1 },
      { material: "orange", value: 2 },
    ],
  },
  {
    level: 1,
    points: 0,
    material: "blue",
    price: [
      { material: "orange", value: 2 },
      { material: "green", value: 2 },
    ],
  },
  {
    level: 1,
    points: 0,
    material: "blue",
    price: [{ material: "orange", value: 3 }],
  },
  {
    level: 1,
    points: 1,
    material: "blue",
    price: [{ material: "red", value: 4 }],
  },
  {
    level: 1,
    points: 0,
    material: "purple",
    price: [
      { material: "blue", value: 1 },
      { material: "red", value: 1 },
      { material: "orange", value: 1 },
      { material: "green", value: 1 },
    ],
  },
  {
    level: 1,
    points: 0,
    material: "purple",
    price: [
      { material: "blue", value: 1 },
      { material: "red", value: 1 },
      { material: "orange", value: 1 },
      { material: "green", value: 2 },
    ],
  },
  {
    level: 1,
    points: 0,
    material: "purple",
    price: [
      { material: "blue", value: 2 },
      { material: "orange", value: 1 },
      { material: "green", value: 2 },
    ],
  },
  {
    level: 1,
    points: 0,
    material: "purple",
    price: [
      { material: "purple", value: 3 },
      { material: "blue", value: 1 },
      { material: "orange", value: 1 },
    ],
  },
  {
    level: 1,
    points: 0,
    material: "purple",
    price: [
      { material: "red", value: 2 },
      { material: "orange", value: 1 },
    ],
  },
  {
    level: 1,
    points: 0,
    material: "purple",
    price: [
      { material: "blue", value: 2 },
      { material: "orange", value: 2 },
    ],
  },
  {
    level: 1,
    points: 0,
    material: "purple",
    price: [{ material: "blue", value: 3 }],
  },
  {
    level: 1,
    points: 1,
    material: "purple",
    price: [{ material: "green", value: 4 }],
  },
  {
    level: 1,
    points: 0,
    material: "green",
    price: [
      { material: "purple", value: 1 },
      { material: "blue", value: 1 },
      { material: "red", value: 1 },
      { material: "orange", value: 1 },
    ],
  },
  {
    level: 1,
    points: 0,
    material: "green",
    price: [
      { material: "purple", value: 1 },
      { material: "blue", value: 1 },
      { material: "red", value: 1 },
      { material: "orange", value: 2 },
    ],
  },
  {
    level: 1,
    points: 0,
    material: "green",
    price: [
      { material: "blue", value: 1 },
      { material: "red", value: 2 },
      { material: "orange", value: 2 },
    ],
  },
  {
    level: 1,
    points: 0,
    material: "green",
    price: [
      { material: "purple", value: 1 },
      { material: "blue", value: 3 },
      { material: "green", value: 1 },
    ],
  },
  {
    level: 1,
    points: 0,
    material: "green",
    price: [
      { material: "purple", value: 2 },
      { material: "blue", value: 1 },
    ],
  },
  {
    level: 1,
    points: 0,
    material: "green",
    price: [
      { material: "blue", value: 2 },
      { material: "red", value: 2 },
    ],
  },
  {
    level: 1,
    points: 0,
    material: "green",
    price: [{ material: "red", value: 3 }],
  },
  {
    level: 1,
    points: 1,
    material: "green",
    price: [{ material: "orange", value: 4 }],
  },
  {
    level: 1,
    points: 0,
    material: "red",
    price: [
      { material: "purple", value: 1 },
      { material: "blue", value: 1 },
      { material: "orange", value: 1 },
      { material: "green", value: 1 },
    ],
  },
  {
    level: 1,
    points: 0,
    material: "red",
    price: [
      { material: "purple", value: 2 },
      { material: "blue", value: 1 },
      { material: "orange", value: 1 },
      { material: "green", value: 1 },
    ],
  },
  {
    level: 1,
    points: 0,
    material: "red",
    price: [
      { material: "purple", value: 2 },
      { material: "orange", value: 2 },
      { material: "green", value: 1 },
    ],
  },
  {
    level: 1,
    points: 0,
    material: "red",
    price: [
      { material: "purple", value: 1 },
      { material: "red", value: 1 },
      { material: "orange", value: 3 },
    ],
  },
  {
    level: 1,
    points: 0,
    material: "red",
    price: [
      { material: "blue", value: 2 },
      { material: "green", value: 1 },
    ],
  },
  {
    level: 1,
    points: 0,
    material: "red",
    price: [
      { material: "purple", value: 2 },
      { material: "red", value: 2 },
    ],
  },
  {
    level: 1,
    points: 0,
    material: "red",
    price: [{ material: "purple", value: 3 }],
  },
  {
    level: 1,
    points: 1,
    material: "red",
    price: [{ material: "purple", value: 4 }],
  },
  {
    level: 2,
    points: 1,
    material: "orange",
    price: [
      { material: "purple", value: 3 },
      { material: "blue", value: 2 },
      { material: "green", value: 2 },
    ],
  },
  {
    level: 2,
    points: 1,
    material: "orange",
    price: [
      { material: "purple", value: 3 },
      { material: "orange", value: 2 },
      { material: "green", value: 3 },
    ],
  },
  {
    level: 2,
    points: 2,
    material: "orange",
    price: [
      { material: "blue", value: 1 },
      { material: "red", value: 2 },
      { material: "green", value: 4 },
    ],
  },
  {
    level: 2,
    points: 2,
    material: "orange",
    price: [
      { material: "red", value: 3 },
      { material: "green", value: 5 },
    ],
  },
  {
    level: 2,
    points: 2,
    material: "orange",
    price: [{ material: "purple", value: 5 }],
  },
  {
    level: 2,
    points: 3,
    material: "orange",
    price: [{ material: "orange", value: 6 }],
  },
  {
    level: 2,
    points: 1,
    material: "blue",
    price: [
      { material: "blue", value: 2 },
      { material: "red", value: 3 },
      { material: "green", value: 2 },
    ],
  },
  {
    level: 2,
    points: 1,
    material: "blue",
    price: [
      { material: "blue", value: 2 },
      { material: "orange", value: 3 },
      { material: "green", value: 3 },
    ],
  },
  {
    level: 2,
    points: 2,
    material: "blue",
    price: [
      { material: "purple", value: 5 },
      { material: "blue", value: 3 },
    ],
  },
  {
    level: 2,
    points: 2,
    material: "blue",
    price: [
      { material: "purple", value: 2 },
      { material: "red", value: 1 },
      { material: "orange", value: 4 },
    ],
  },
  {
    level: 2,
    points: 2,
    material: "blue",
    price: [{ material: "blue", value: 5 }],
  },
  {
    level: 2,
    points: 3,
    material: "blue",
    price: [{ material: "blue", value: 6 }],
  },
  {
    level: 2,
    points: 1,
    material: "purple",
    price: [
      { material: "red", value: 2 },
      { material: "orange", value: 2 },
      { material: "green", value: 3 },
    ],
  },
  {
    level: 2,
    points: 1,
    material: "purple",
    price: [
      { material: "purple", value: 2 },
      { material: "blue", value: 3 },
      { material: "red", value: 3 },
    ],
  },
  {
    level: 2,
    points: 2,
    material: "purple",
    price: [
      { material: "red", value: 4 },
      { material: "orange", value: 2 },
      { material: "green", value: 1 },
    ],
  },
  {
    level: 2,
    points: 2,
    material: "purple",
    price: [
      { material: "red", value: 5 },
      { material: "orange", value: 3 },
    ],
  },
  {
    level: 2,
    points: 2,
    material: "purple",
    price: [{ material: "red", value: 5 }],
  },
  {
    level: 2,
    points: 3,
    material: "purple",
    price: [{ material: "purple", value: 6 }],
  },
  {
    level: 2,
    points: 1,
    material: "green",
    price: [
      { material: "purple", value: 3 },
      { material: "red", value: 3 },
      { material: "green", value: 2 },
    ],
  },
  {
    level: 2,
    points: 1,
    material: "green",
    price: [
      { material: "purple", value: 2 },
      { material: "blue", value: 3 },
      { material: "orange", value: 2 },
    ],
  },
  {
    level: 2,
    points: 2,
    material: "green",
    price: [
      { material: "purple", value: 4 },
      { material: "blue", value: 2 },
      { material: "orange", value: 1 },
    ],
  },
  {
    level: 2,
    points: 2,
    material: "green",
    price: [
      { material: "blue", value: 5 },
      { material: "green", value: 3 },
    ],
  },
  {
    level: 2,
    points: 2,
    material: "green",
    price: [{ material: "green", value: 5 }],
  },
  {
    level: 2,
    points: 3,
    material: "green",
    price: [{ material: "green", value: 6 }],
  },
  {
    level: 2,
    points: 1,
    material: "red",
    price: [
      { material: "purple", value: 2 },
      { material: "red", value: 2 },
      { material: "orange", value: 3 },
    ],
  },
  {
    level: 2,
    points: 1,
    material: "red",
    price: [
      { material: "blue", value: 3 },
      { material: "red", value: 2 },
      { material: "orange", value: 3 },
    ],
  },
  {
    level: 2,
    points: 2,
    material: "red",
    price: [
      { material: "purple", value: 1 },
      { material: "blue", value: 4 },
      { material: "green", value: 2 },
    ],
  },
  {
    level: 2,
    points: 2,
    material: "red",
    price: [
      { material: "purple", value: 3 },
      { material: "orange", value: 5 },
    ],
  },
  {
    level: 2,
    points: 2,
    material: "red",
    price: [{ material: "orange", value: 5 }],
  },
  {
    level: 2,
    points: 3,
    material: "red",
    price: [{ material: "red", value: 6 }],
  },
  {
    level: 3,
    points: 3,
    material: "orange",
    price: [
      { material: "purple", value: 3 },
      { material: "blue", value: 3 },
      { material: "red", value: 3 },
      { material: "green", value: 5 },
    ],
  },
  {
    level: 3,
    points: 4,
    material: "orange",
    price: [{ material: "red", value: 7 }],
  },
  {
    level: 3,
    points: 4,
    material: "orange",
    price: [
      { material: "red", value: 6 },
      { material: "orange", value: 3 },
      { material: "green", value: 3 },
    ],
  },
  {
    level: 3,
    points: 5,
    material: "orange",
    price: [
      { material: "red", value: 7 },
      { material: "orange", value: 3 },
    ],
  },
  {
    level: 3,
    points: 3,
    material: "blue",
    price: [
      { material: "purple", value: 3 },
      { material: "red", value: 3 },
      { material: "orange", value: 5 },
      { material: "green", value: 3 },
    ],
  },
  {
    level: 3,
    points: 4,
    material: "blue",
    price: [{ material: "purple", value: 7 }],
  },
  {
    level: 3,
    points: 4,
    material: "blue",
    price: [
      { material: "purple", value: 6 },
      { material: "blue", value: 3 },
      { material: "orange", value: 3 },
    ],
  },
  {
    level: 3,
    points: 5,
    material: "blue",
    price: [
      { material: "purple", value: 7 },
      { material: "blue", value: 3 },
    ],
  },
  {
    level: 3,
    points: 3,
    material: "purple",
    price: [
      { material: "blue", value: 3 },
      { material: "red", value: 5 },
      { material: "orange", value: 3 },
      { material: "green", value: 3 },
    ],
  },
  {
    level: 3,
    points: 4,
    material: "purple",
    price: [{ material: "orange", value: 7 }],
  },
  {
    level: 3,
    points: 4,
    material: "purple",
    price: [
      { material: "purple", value: 3 },
      { material: "red", value: 3 },
      { material: "orange", value: 6 },
    ],
  },
  {
    level: 3,
    points: 5,
    material: "purple",
    price: [
      { material: "purple", value: 3 },
      { material: "orange", value: 7 },
    ],
  },
  {
    level: 3,
    points: 3,
    material: "green",
    price: [
      { material: "purple", value: 5 },
      { material: "blue", value: 3 },
      { material: "red", value: 3 },
      { material: "orange", value: 3 },
    ],
  },
  {
    level: 3,
    points: 4,
    material: "green",
    price: [{ material: "blue", value: 7 }],
  },
  {
    level: 3,
    points: 4,
    material: "green",
    price: [
      { material: "purple", value: 3 },
      { material: "blue", value: 6 },
      { material: "green", value: 3 },
    ],
  },
  {
    level: 3,
    points: 5,
    material: "green",
    price: [
      { material: "blue", value: 7 },
      { material: "green", value: 3 },
    ],
  },
  {
    level: 3,
    points: 3,
    material: "red",
    price: [
      { material: "purple", value: 3 },
      { material: "blue", value: 5 },
      { material: "orange", value: 3 },
      { material: "green", value: 3 },
    ],
  },
  {
    level: 3,
    points: 4,
    material: "red",
    price: [{ material: "green", value: 7 }],
  },
  {
    level: 3,
    points: 4,
    material: "red",
    price: [
      { material: "blue", value: 3 },
      { material: "red", value: 3 },
      { material: "green", value: 6 },
    ],
  },
  {
    level: 3,
    points: 5,
    material: "red",
    price: [
      { material: "red", value: 3 },
      { material: "green", value: 7 },
    ],
  },
];

let card = {};

let count = 0;

let level_1 = [];
let level_2 = [];
let level_3 = [];

allcards.forEach((x) => {
  let id = "n" + count;
  card[id] = new Card(x, id);
  count++;
  card[id].level === 1
    ? level_1.push(id)
    : card[id].level === 2
    ? level_2.push(id)
    : level_3.push(id);
});

// Player Summary
playerSummaryDiv = document.createElement("div");
playerSummaryDiv.className = "col s4 player-summary-div";

const playerSummaryTemplate = (args) => {
  innerhtml = `<div class="player-summary hoverable ${
    args.color
  } lighten-2 id="summary-${args.username}">
    <div class="player-summary-head ${args.color} lighten-4 z-depth-1 row" >
      <div id="${args.username}_points" class="point-wrapper col s1 ${
    args.color
  } lighten-1 white-text center-align z-depth-1 "> ${args.points}
      </div>
      <div class="username-wrapper col s11 right-align white-text"> ${
        args.username
      }
      </div>

    </div>
  <div class="player-summary-body ${
    args.color
  } darken-1 z-depth-3 center-align">
    <div class="player-summary-token-body row">
      ${token.purple.summarytoken(args.username)}
      ${token.orange.summarytoken(args.username)}
      ${token.blue.summarytoken(args.username)}
      ${token.green.summarytoken(args.username)}
      ${token.red.summarytoken(args.username)}
      ${token.yellow.summarytoken(args.username)}
    </div>
    <div class="player-summary-card-body row center white-text">
      <div id="${
        args.username
      }_purple_card" class="player-summary-card col s2 offset-s1 z-depth-2 deep-purple darken-4">+0</div>
      <div id="${
        args.username
      }_orange_card" class="player-summary-card col s2 z-depth-2 orange darken-4 ">+0</div>
      <div id="${
        args.username
      }_blue_card" class="player-summary-card col s2 z-depth-2 light-blue lighten-1">+0</div>
      <div id="${
        args.username
      }_green_card" class="player-summary-card col s2 z-depth-2 green darken-3">+0</div>
      <div id="${
        args.username
      }_red_card" class="player-summary-card col s2 z-depth-2 red darken-1">+0</div>
    </div>
  </div>
    </div >`;

  let sum = document.createElement("div");
  sum.id = args.username;
  sum.innerHTML = innerhtml;
  playerSummaryDiv.append(sum);
};
const playerSummaryCreate = (turnorder) => {
  let count = 0;
  let colors = ["blue", "red", "green", "yellow"];
  for (let user of turnorder) {
    playerSummaryTemplate({
      color: colors[count],
      username: user,
      points: 0,
    });
    count++;
  }
  gamediv.append(playerSummaryDiv);
};

let nobles = {};
let players = {};
game.on("setup", async (setup) => {
  for (id of setup.card) {
    card[id].create();
  }
  for (noble of setup.noble) {
    nobles[noble.id] = new Noble(noble);
    nobles[noble.id].create();
  }
  for (user of listofusers) {
    players[user.username] = new Player(user.username);
  }
});

game.on("turnOrder", (turnorder) => {
  playerSummaryCreate(turnorder);
});

let onTurn;
let isMyTurn;
game.on("onTurn", (user) => {
  onTurn = user;
  for (let summary of document.getElementsByClassName("player-summary-div")[0]
    .childNodes) {
    if (summary.id === `${user}`) {
      summary.style.transform = "translateX(15%)";
    } else {
      summary.style.transform = "translateX(0%)";
    }
  }
  isMyTurn = onTurn == myuser.username;
  if (isMyTurn) {
    alert("Sıra Sende");
  }
});

// Take Token

let headrow = document.getElementsByClassName("head-row")[0];
let tokenspace = document.createElement("div");
tokenspace.id = "token-space";
tokenspace.className = "col s2 yellow lighten-1 valign-wrapper";
let takeTokenBtn = document.createElement("button");
takeTokenBtn.id = "take-token-btn";
takeTokenBtn.className = "btn green darken-2";
takeTokenBtn.innerText = "Tokenleri Al";
takeTokenBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (isMyTurn) {
    let body = [];
    let killtokens = [];
    for (let i of tokenspace.childNodes) {
      if (i.id !== "take-token-btn") {
        body.push(i.id);
        killtokens.push(i);
      }
    }

    for (let i of killtokens) {
      tokenspace.removeChild(i);
    }
    let turn = {
      move: { name: "takeToken", body: body },
      player: myuser.username,
    };
    game.emit("SplendorTurn", { roomId: myroom, turn: turn });
    takeTokenBtn.style.display = "none";
    let tokenChoice = [];
    for (i of tokenspace.childNodes) {
      if (i.id !== "take-token-btn") {
        tokenChoice.push(i.id);
      }
    }
    grayscale(tokenChoice);
  } else {
    alert("Sıra Sende Değil.");
  }
});
tokenspace.appendChild(takeTokenBtn);
headrow.insertBefore(tokenspace, headrow.childNodes[0]);
takeTokenBtn.style.display = "none";
const isValidTakeToken = (arr) => {
  if (arr.length > 3) {
    return false;
  } else if (arr.length === 2 && arr[0] === arr[1]) {
    if (token[arr[0]].count < 4) {
      return false;
    } else {
      return true;
    }
  } else if (arr.length === 2 && arr[0] !== arr[1]) {
    if (token[arr[0]].count > 0 && token[arr[1]].count > 0) {
      return true;
    } else {
      return false;
    }
  } else if (arr.length === 3) {
    let deleteDuplicate = [...new Set(arr)];
    if (deleteDuplicate.length !== arr.length) {
      return false;
    } else {
      for (let color of arr) {
        if (token[color].count < 1) {
          return false;
        }
      }
    }
    return true;
  } else if (arr.length === 1) {
    if (token[arr[0]].count >= 1) {
      return true;
    } else {
      return false;
    }
  }
};

let refreshdata;
//ValidTurn geldi işle
game.on("refreshStatus", (data) => {
  refreshdata = data;
  console.log(data);
  //Tokens refresh
  let colors = ["red", "green", "orange", "purple", "blue", "yellow"];
  for (i of colors) {
    token[i].setCount(data.tokens[i]);
  }
  let tokenChoice = [];
  for (i of tokenspace.childNodes) {
    if (i.id !== "take-token-btn") {
      tokenChoice.push(i.id);
    }
  }
  grayscale(tokenChoice);

  //players refresh
  for (let player of Object.keys(players)) {
    players[player].update(data.players[player]);
  }

  // card update
  let oldcard;
  let newcard = data.cards;
  for (let i of document.getElementsByClassName("card-div")) {
    if (data.cards.indexOf(i.id) === -1 && i.id[0] !== "l") {
      oldcard = i;
    } else {
      newcard.splice(newcard.indexOf(i.id), 1);
    }
  }
  if (newcard[0]) {
    console.log(newcard);
    console.log(oldcard);
    oldcard.parentElement.replaceChild(
      card[newcard[0]].create((update = true)),
      oldcard
    );
  }
});

let grayscale = (tokenChoice) => {
  let originaltokens = document.getElementsByClassName("original-token");
  for (let i of originaltokens) {
    tokenChoice.push(i.id);
    if (!isValidTakeToken(tokenChoice)) {
      i.style.filter = "grayscale(100%)";
    } else {
      i.style.filter = "grayscale(0%)";
    }
    tokenChoice.pop();
  }
};

const isValidBuy = (cardId) => {
  let purse = players[myuser.username].tokens;
  let bank = players[myuser.username].cards;
  let price = card[cardId].price;
  let myYellow = purse.yellow;
  for (cost of price) {
    let power = purse[cost.material] + bank[cost.material];
    if (power < cost.value) {
      if (power + myYellow >= cost.value) {
        myYellow = myYellow - (cost.value - power);
      } else {
        return false;
      }
    }
  }
  return true;
};
