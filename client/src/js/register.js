const sock = io();

const passwordValidate = () => {
  let password = document.getElementById("password-input").value;
  let rePassword = document.getElementById("re-password-input").value;
  if (password !== rePassword) {
    document.querySelector("#register-post").disabled = true;
    document.getElementById("warning").innerText = "Şifreler Uyuşmuyor";
    document.getElementById("re-password-input").className = "invalid";
  } else {
    document.getElementById("warning").innerText = "";
    if (rePassword.length > 7) {
      document.getElementById("re-password-input").className = "valid";
      document.querySelector("#register-post").disabled = false;
    }
  }
};

["password-input", "re-password-input"].forEach((item) => {
  document.getElementById(item).addEventListener("input", () => {
    passwordValidate();
  });
});

//send form

function mali() {
  registerobj = {};
  registerobj.username = document.getElementById("username-input").value;
  registerobj.email = document.getElementById("email-input").value;
  registerobj.password = document.getElementById("password-input").value;
  axios.post("/api/register", registerobj).then((data) => {
    let res = data.data;
    if (res === "done") {
      window.location.href = "/login";
    } else if (res === "username_taken") {
      document.getElementById("warning").innerText =
        "Bu kullanıcı ismi daha önce alınmış.";
    } else if (res === "email_taken") {
      document.getElementById("warning").innerText =
        "Bu email daha önce kayıt edilmiş.";
    }
  });
}
