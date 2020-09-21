let gamediv = document.getElementById("game");
async function azul() {
  await sleep(1000);
  let title = document.createElement("h1");
  title.innerText = "Azul";
  gamediv.appendChild(title);
  let user = document.createElement("p");
  user.innerText = myuser.username;
  game.appendChild(user);
}

azul();

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
