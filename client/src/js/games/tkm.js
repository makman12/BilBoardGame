const game = io();
let gamediv = document.getElementById("game");
let varmyturn = false;
let varyourturn = false;

async function tkm() {
  await sleep(500);
  let title = document.createElement("h3");
  title.innerText = "Taş Kağıt Makas";
  gamediv.appendChild(title);

  ["Taş", "Kağıt", "Makas"].forEach((x) => {
    let but = document.createElement("button");
    but.innerText = x;
    but.id = x;
    but.addEventListener("click", (e) => {
      e.preventDefault;
      turnobj = { turn: x, user: myuser._id };
      game.emit("game", turnobj);
      ["Taş", "Kağıt", "Makas"].forEach((x) => {
        document.getElementById(x).disabled = true;
      });
      varmyturn = x;
      if (varyourturn) {
        gamelogic(varmyturn, varyourturn);
      }
    });
    gamediv.appendChild(but);
  });
}

game.on("game", (e) => {
  if (e.user !== myuser._id) {
    varyourturn = e.turn;
    if (varmyturn) {
      gamelogic(varmyturn, varyourturn);
    }
  }
});

tkm();

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

sonuc = document.createElement("p");
sonuc.id = "sonuc";
gamediv.insertBefore(sonuc, document.getElementById("Taş"));
function gamelogic(myturn, yourturn) {
  let turns = ["Taş", "Kağıt", "Makas"];
  myturn = turns.indexOf(myturn);
  yourturn = turns.indexOf(yourturn);
  let actualturns = [myturn, yourturn];
  actualturns.sort();
  console.log(actualturns);
  if (actualturns == "" + [0, 2]) {
    console.log("o durum");
    if (myturn < yourturn) {
      document.getElementById("sonuc").innerText = "Kazandın";
    } else {
      document.getElementById("sonuc").innerText = "Kaybettin";
    }
  } else {
    if (myturn == yourturn) {
      document.getElementById("sonuc").innerText = "Berabere";
    } else if (myturn > yourturn) {
      document.getElementById("sonuc").innerText = "Kazandın";
    } else {
      document.getElementById("sonuc").innerText = "Kaybettin";
    }
  }
  ["Taş", "Kağıt", "Makas"].forEach((x) => {
    document.getElementById(x).disabled = false;
  });
  varmyturn = false;
  varyourturn = false;
}
