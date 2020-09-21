document.getElementById("logout").addEventListener("click", (e) => {
  e.preventDefault();
  axios.get("/api/logout").then(() => {
    window.location.reload();
  });
});

// modal materilize
document.addEventListener("DOMContentLoaded", function () {
  var elems = document.querySelectorAll(".modal");
  var instances = M.Modal.init(elems);
});
document.addEventListener("DOMContentLoaded", function () {
  var elems = document.querySelectorAll("select");
  var instances = M.FormSelect.init(elems, options);
});

//socket.io

const sock = io();

sock.on("refreshRoom", () => {
  refreshRooms();
});

// old index

//rooms
function refreshRooms() {
  console.log("yeniledi");
  let Rooms = [];
  axios
    .get("/api/getrooms")
    .then((data) => {
      Rooms = data.data;
    })
    .then(() => {
      // Hiç oda yok.
      if (Rooms.length === 0) {
        let warning = document.createElement("p");
        warning.innerText = "Şuan açık oyun masası yok.";
        document.getElementById("rooms").innerHTML = "";
        document.getElementById("rooms").appendChild(warning);
      }
      // oda var.
      else {
        document.getElementById("rooms").innerHTML = "";
        for (let i = 0; i < Rooms.length; i++) {
          let newroom = document.createElement("div");
          newroom.className = "Room";
          document.getElementById("rooms").appendChild(newroom);
          newroom.innerHTML = `<div class="col s12 m6">
      <div class="card ${Rooms[i].started ? "grey" : "red"} lighten-2">
        <div class="card-content white-text ${
          Rooms[i].started ? "grey" : "red"
        } darken-2">
          <span class="card-title">${Rooms[i].game} : ${Rooms[i].name}</span>
          <p>${Rooms[i].users.length} oyuncu odada.</p>
          <p>${Rooms[i].started ? "Oyun başladı" : ""}</p>
        </div>
        <div class="card-action waves-effect waves-light">
          <a id="${Rooms[i]._id}" class="white-text">Odaya Katıl</a>
        </div>
      </div>
    </div>`;
          //Odaya katılmak
          let joinbutton = document.getElementById(Rooms[i]._id);
          if (Rooms[i].started) {
            joinbutton.style.cursor = "not-allowed";
          } else {
            joinbutton.addEventListener("click", () => {
              axios
                .post("/api/joinroom", { roomid: Rooms[i]._id })
                .then((data) => {
                  console.log(data.data);
                  if (data.data === "OK") {
                    window.location.href = "/room/" + Rooms[i]._id;
                  } else {
                    console.log("failed");
                  }
                });
            });
          }
        }
      }
    });
}

refreshRooms();

// create-room-form

document.getElementById("create-room-form").addEventListener("click", (e) => {
  e.preventDefault();
  let roomName = document.getElementById("room-name").value;
  if (roomName.length < 4) {
    alert("Lütfen oda ismini en az 4 harfli olacak şekilde seçin.");
  } else {
    let roomobj = {};
    roomobj.name = roomName;
    roomobj.game = document.getElementById("game").value;
    axios.post("/api/croom", roomobj).then((data) => {
      window.location.href = "/room/" + data.data;
    });
  }
});

// Utility

function getTime() {
  let nowTime;
  nowTime = new Date().getHours() + ":" + new Date().getMinutes();
  return nowTime;
}
