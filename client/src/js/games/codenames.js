const game = io();
let gamediv = document.getElementById("game");
let board = document.createElement("div");
board.id = "board";
board.className = "container white-text blue darken-1";
gamediv.appendChild(board);
let host = false;
async function codenames() {
  await sleep(1000);
  if (myuser.username == listofusers[0].username) {
    host = true;
  }

  //Host oyun kurulumu
  if (host) {
    }
    
  let kelimeler = [
    "Araba",
    "Kedi",
    "Dinazor",
    "Bilgisayar",
    "Perde",
    "Tuvalet Kağıdı",
    "Plaj",
    "Orman",
    "Elbise",
    "Fare",
    "Renk",
    "Kaşkol",
    "Gengiz Han",
    "Telefon",
    "Havlu",
    "Bina",
    "İlçe",
    "Üniversite",
    "Kutu Oyunu",
    "Yazılım",
    "Müzik",
    "Keman",
    "Hayat",
    "Paris",
    "Şapka",
  ];
  let count = 0;
  let kelimeboard = document.createElement("div");
  kelimeboard.className = "parent container";
  kelimeler.forEach((kelime) => {
    count++;
    let wordcard = document.createElement("div");
    wordcard.id = kelime;
    wordcard.className = "card black-text yellow lighten-5";
    wordcard.classList.add = `div${count}`;
    wordcard.innerHTML = `<div  class="card-content black-text center">
          <span class=" flow-text">${kelime}</span>
        </div>`;
    kelimeboard.appendChild(wordcard);
  });
  board.appendChild(kelimeboard);
}

codenames();
//utility
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
