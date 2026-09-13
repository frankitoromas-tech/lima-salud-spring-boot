document.addEventListener("DOMContentLoaded", function() {
    
    const togglePassword = document.querySelector("#togglePassword");
    const password = document.querySelector("#password");

    if(togglePassword && password) {
        togglePassword.addEventListener("click", function () {
            const type = password.getAttribute("type") === "password" ? "text" : "password";
            password.setAttribute("type", type);
            this.textContent = type === "password" ? "👁" : "🙈";
        });
    }

    const loginForm = document.getElementById('loginForm');
    
    if(loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault(); 
            const user = document.getElementById('username').value;
            const pass = document.getElementById('password').value;

            const usuarioCorrecto = "admin";
            const passwordCorrecto = "1234";
            const usuarioCorrecto2 = "JGUERRA";
            const passwordCorrecto2 = "1234";

            if((user === usuarioCorrecto && pass === passwordCorrecto) || (user === usuarioCorrecto2 && pass === passwordCorrecto2)) {
                alert("¡Bienvenido, acceso concedido!");
                window.location.href = "agenda_Medico.html"; 
            } else {
                alert("Usuario o contraseña incorrectos. Por favor, inténtalo de nuevo.");
            }
        });
    }
});


function switchTab(tab) {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const tabLogin = document.getElementById('tabLogin');
    const tabRegister = document.getElementById('tabRegister');

    if (tab === 'login') {
        loginForm.classList.remove('d-none');
        registerForm.classList.add('d-none');
        tabLogin.classList.add('is-active');
        tabRegister.classList.remove('is-active');
    } else {
        loginForm.classList.add('d-none');
        registerForm.classList.remove('d-none');
        tabLogin.classList.remove('is-active');
        tabRegister.classList.add('is-active');
    }
}