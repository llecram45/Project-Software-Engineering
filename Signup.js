document.addEventListener("DOMContentLoaded", function () {
    const registerForm = document.getElementById("registerForm");

    registerForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const email = document.getElementById("email").value;
        const phone = document.getElementById("phone").value;
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        // cek input password & konfirmasi password sama
        if (password !== confirmPassword) {
            alert("Konfirmasi kata sandi tidak cocok!");
            return;
        }

        // simpan inputan
        const userData = {
            email: email,
            phone: phone,
            password: password,
        };

        localStorage.setItem("user", JSON.stringify(userData));
        alert("Akun berhasil dibuat! Silakan login.");
        window.location.href = "login.html"; //redirect ke halaman login
    });

    document.getElementById("loginPage").addEventListener("click", function () {
        window.location.href = "login.html";
    });
});
