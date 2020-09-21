const sock = io();
let myuser;
let url = window.location.href.split("/");
let myroom = url[url.length - 1];

axios.get("/api/mydata").then((data) => {
  myuser = data.data;
  console.log(myuser);
});

sock.emit("joinroom", myroom);

let listofusers;
let roomData;
sock.on("myroom", (data) => {
  let parent = document.getElementById("user-list");
  parent.innerHTML = "";
  listofusers = data.users;
  roomData = data;
  for (i of data.users) {
    let child = document.createElement("p");
    child.innerText = i.username;
    parent.appendChild(child);
  }
});

// chat al
sock.on("takechat", (data) => {
  let parent = document.getElementById("chat-display");
  let divparent = document.createElement("div");
  divparent.className = "row";
  let child = document.createElement("li");
  let time = document.createElement("span");
  time.innerText = getTime();
  time.className = "right-align grey-text chat-time";
  let text = document.createElement("span");
  if (data.user == myuser.username) {
    child.className = "card-panel lime lighten-5 right chat-box";
    text.innerText = data.chat;
  } else {
    child.className = "card-panel lime lighten-5 left chat-box";
    let usernamebox = document.createElement("span");
    usernamebox.innerText = data.user;
    usernamebox.className = "left pink-text text-darken-4 username-box";
    child.appendChild(usernamebox);
    text.innerText = data.chat;
  }
  text.className = "left-align black-text chat-text ";
  child.appendChild(text);
  child.appendChild(time);
  divparent.appendChild(child);
  parent.appendChild(divparent);
});

// chat gönder
document.getElementById("chat-send").addEventListener("click", (e) => {
  e.preventDefault;
  let text = document.getElementById("chat-input").value;
  text = text;
  sock.emit("sendchat", { chat: text, room: myroom, user: myuser.username });
  document.getElementById("chat-input").value = "";
});

document
  .getElementById("chat-input")
  .addEventListener("keyup", function (event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.key === "Enter") {
      // Cancel the default action, if needed
      event.preventDefault();
      // Trigger the button element with a click
      document.getElementById("chat-send").click();
    }
  });

// odadan çıkış
window.addEventListener("beforeunload", function (e) {
  e.preventDefault();
  sock.emit("leaveroom", { user: myuser.session, room: myroom });
});
// Utility

function getTime() {
  let nowTime;
  nowTime = new Date().getHours() + ":" + new Date().getMinutes();
  return nowTime;
}
