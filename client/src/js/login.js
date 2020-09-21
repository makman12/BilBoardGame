let form = document.getElementById("login-form");

let data = new FormData(form);

let loginButton = document.getElementById("login-post");

loginButton.addEventListener("click", (e) => {
  e.preventDefault();
  let userObj = {};
  userObj.username = document.getElementById("username-input").value;
  userObj.password = document.getElementById("password-input").value;
  axios.post("/api/login", userObj).then((data) => {
    login(data.data);
  });
});

function login(event) {
  if (event === "login") {
    window.location.replace("/");
  } else if (event === "wrong_username") {
    document.getElementById("warning").innerText = "Yanlış Kullanıcı Adı";
  } else if (event === "wrong_password") {
    document.getElementById("warning").innerText =
      "Lütfen Şifrenizi Tekrar Giriniz";
  }
}
