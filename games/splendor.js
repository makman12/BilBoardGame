const User = require("../models/user");
const Room = require("../models/room");
const { io } = require("../scripts/api");

// utility
function shuffle(array) {
  let clone = [...array];
  var currentIndex = clone.length,
    temporaryValue,
    randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = clone[currentIndex];
    clone[currentIndex] = clone[randomIndex];
    clone[randomIndex] = temporaryValue;
  }

  return clone;
}

// Splendor Card
const Card = class {
  constructor(data, id) {
    this.level = data.level;
    this.price = data.price;
    this.points = data.points;
    this.material = data.material;
    this.id = id;
  }
};
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
// Splendor Game Logic
const Splendor = class {
  constructor(io, roomId) {
    this.io = io;
    this.roomId = roomId;
    this.create();
  }

  async create() {
    let room = await Room.findById(this.roomId);
    this.numPlayers = room.users.length;
    this.createPlayers();
    this.level_1 = shuffle(level_1);
    this.level_2 = shuffle(level_2);
    this.level_3 = shuffle(level_3);
    console.log(this.level_1.length);
    this.nobles = noblesetup(this.numPlayers);
    this.onturn = this.turnorder[0];
    this.tokens =
      this.numPlayers === 4
        ? { yellow: 5, red: 7, blue: 7, purple: 7, orange: 7, green: 7 }
        : this.numPlayers === 3
        ? { yellow: 5, red: 5, blue: 5, purple: 5, orange: 5, green: 5 }
        : { yellow: 5, red: 4, blue: 4, purple: 4, orange: 4, green: 4 };
    this.cardsetup = [];
    this.cardsetup = this.cardsetup.concat(
      this.level_1.splice(0, 4),
      this.level_2.splice(0, 4),
      this.level_3.splice(0, 4)
    );
    console.log(this.level_1.length);

    let setup = { card: this.cardsetup, noble: this.nobles };

    this.sendtoroom("setup", setup);
    this.sendtoroom("turnOrder", this.turnorder);
    this.sendtoroom("onTurn", this.turnorder[0]);
    this.refreshStatus();
  }

  turn(args) {
    let move = args.move;
    let player = args.player;
    if (this.onturn !== player) {
      console.log(`sıra ${player}'da değil, ${this.onturn}'da`);
      return false;
    }
    // 3 types of Moves.
    // Take Token
    let isValid = false;
    if (move.name === "takeToken") {
      isValid = this.takeToken(args);
    } else if (move.name == "buyCard") {
      isValid = this.buyCard(args);
    }

    if (isValid) {
      this.refreshStatus();
      this.nextTurn();
    }
  }

  buyCard(args) {
    let cardId = args.move.body;
    let player = args.player;
    let purse = this.players[player].tokens;
    let bank = this.players[player].cards;
    let price = card[cardId].price;
    let myYellow = purse.yellow;
    for (let cost of price) {
      let power = purse[cost.material] + bank[cost.material];
      if (power < cost.value) {
        if (power + myYellow >= cost.value) {
          myYellow = myYellow - (cost.value - power);
        } else {
          return false;
        }
      }
    }
    // Adam alabiliyor reis.
    let indexCard = this.cardsetup.indexOf(cardId);
    if (indexCard === -1) {
      return false;
    }
    //Kart da doğru, ee ne duruyorsun?.
    //Oyuncuya kartı ekle.
    this.players[player].cards[card[cardId].material]++;
    this.players[player].points += card[cardId].points;
    //oyuncudan parayı al
    for (let cost of price) {
      let pay = cost.value - bank[cost.material];
      if (pay > 0) {
        purse[cost.material] = purse[cost.material] - pay;
        this.tokens[cost.material] = this.tokens[cost.material] + pay;
      }
    }
    let level = card[cardId].level;
    let newCard = this["level_" + level].splice(0, 1)[0];
    this.cardsetup.splice(indexCard, 1, newCard);
    return true;
  }

  takeToken(args) {
    let move = args.move;
    let player = args.player;
    console.log("Take Token Action");
    if (move.body.length > 3) {
      return false;
    }
    if (move.body.length === 1) {
      if (this.tokens[move.body[0]] > 0) {
        //1 tane aldı  stokta var yollaaa
        --this.tokens[move.body[0]];
        this.players[player].tokens[move.body[0]]++;
      } else {
        return false;
      }
    } else if (move.body.length === 2) {
      if (move.body[0] !== move.body[1]) {
        if (this.tokens[move.body[0]] > 0 && this.tokens[move.body[1]] > 0) {
          //İki tane aldı ikisi farklı stokta var yollaaa
          --this.tokens[move.body[0]];
          --this.tokens[move.body[1]];
          this.players[player].tokens[move.body[0]]++;
          this.players[player].tokens[move.body[1]]++;
        } else {
          return false;
        }
      } else {
        let color = move.body[0];
        if (this.tokens[color] < 4) {
          console.log("iki almış ama 4'den az");
          return false;
        } else {
          //kaynaktan azalıyor
          this.tokens[color] = this.tokens[color] - 2;
          // oyuncuya eklendi
          this.players[player].tokens[color] =
            this.players[player].tokens[color] + 2;
          // Aynı renkten iki tane aldı ve Başarılı Bunu dünyaya duyur.
        }
      }
    } else if (move.body.length === 3) {
      let deleteDuplicate = [...new Set(move.body)];
      if (deleteDuplicate.length !== move.body.length) {
        console.log("üç almış ama aynı");
        return false;
      } else {
        for (let token of move.body) {
          if (this.tokens[token] <= 0) {
            console.log("üç almış ama stokta yok");
            return false;
          }
        }
        // Token kaynaktan azalıyor, oyuncuya ekleniyor.
        for (let token of move.body) {
          --this.tokens[token];
          this.players[player].tokens[token]++;
        }
      }
      // 3 Farklı token aldı ve Başarılı Bunu dünyaya duyur.
    }
    return true;
  }

  nextTurn() {
    let index = (this.turnorder.indexOf(this.onturn) + 1) % this.numPlayers;
    this.onturn = this.turnorder[index];
    this.sendtoroom("onTurn", this.onturn);
    console.log(`${this.onturn} de sıra`);
  }

  sendtoroom(command, data) {
    this.io.to(this.roomId).emit(command, data);
  }

  createPlayers = () => {
    let userlist = shuffle(room.users);
    this.players = {};
    this.turnorder = [];
    for (let user of userlist) {
      let username = user.username;
      this.turnorder.push(username);
      this.players[username] = new Player(username);
    }
  };

  refreshStatus = () => {
    let data = {};
    data.players = this.players;
    data.tokens = this.tokens;
    data.cards = this.cardsetup;
    data.nobles = this.nobles;
    this.sendtoroom("refreshStatus", data);
  };
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
};
// Nobles arrangments Class
const Nobles = class {
  constructor(args) {
    this.id = args.id;
    this.req = args.req;
    this.points = 3;
  }
};

nobles = [
  { id: 0, req: ["blue", "red"] },
  { id: 1, req: ["orange", "purple"] },
  { id: 2, req: ["green", "purple"] },
  { id: 3, req: ["green", "red"] },
  { id: 4, req: ["blue", "orange"] },
  { id: 5, req: ["orange", "blue", "red"] },
  { id: 6, req: ["green", "red", "blue"] },
  { id: 7, req: ["purple", "orange", "blue"] },
  { id: 8, req: ["green", "blue", "orange"] },
  { id: 9, req: ["purple", "red", "green"] },
];
allNobles = [];

noblesetup = (numPlayers) => {
  shuffle(nobles);
  let result = nobles.slice(0, numPlayers + 1);
  return result;
};
for (let i in nobles) {
  let name = i;
  let body = nobles[i];
  let obj = { name: new Nobles(body) };
  allNobles.push(obj);
}

module.exports = {
  io: async (io) => {
    currentGames = {};
    io.on("connection", (sock) => {
      sock.on("SplendorNew", async (roomId) => {
        console.log("Splendor New Geldi");
        let currentRoom = await Room.findById(roomId);
        await currentRoom.start();
        io.to(roomId).emit("myroom", currentRoom);
        currentGames[roomId] = new Splendor(io, roomId);
      });

      sock.on("SplendorJoin", (roomId) => {
        sock.join(roomId);
      });

      sock.on("SplendorTurn", (data) => {
        console.log("biri splendor oynuyor");
        currentGames[data.roomId].turn(data.turn);
        console.log(currentGames);
      });
    });
  },
};
