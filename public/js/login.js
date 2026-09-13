document.addEventListener("DOMContentLoaded", function () {
  const togglePassword = document.querySelector("#togglePassword");
  const password = document.querySelector("#password");

  if (togglePassword && password) {
    togglePassword.addEventListener("click", function () {
      const visible = password.getAttribute("type") === "text";
      password.setAttribute("type", visible ? "password" : "text");
      this.innerHTML = visible ? '<i class="bi bi-eye"></i>' : '<i class="bi bi-eye-slash"></i>';
    });
  }
});

function switchTab(tab) {
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const tabLogin = document.getElementById("tabLogin");
  const tabRegister = document.getElementById("tabRegister");

  if (tab === "login") {
    loginForm.classList.remove("d-none");
    registerForm.classList.add("d-none");
    tabLogin.classList.add("is-active");
    tabRegister.classList.remove("is-active");
  } else {
    loginForm.classList.add("d-none");
    registerForm.classList.remove("d-none");
    tabLogin.classList.remove("is-active");
    tabRegister.classList.add("is-active");
  }
}
