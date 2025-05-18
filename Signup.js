document.addEventListener("DOMContentLoaded", function () {
    const registerForm = document.getElementById("registerForm");

    registerForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const email = document.getElementById("email").value;
        const username = document.getElementById("username").value;
        const phone = document.getElementById("phone").value;
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        if (password !== confirmPassword) {
            alert("Konfirmasi kata sandi tidak cocok!");
            return;
        }

        try {
            const response = await fetch('/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, username, phone, password })
            });

            const result = await response.json();
            if (response.ok) {
                alert("Akun berhasil dibuat! Silakan login.");
                window.location.href = "login.html";
            } else {
                alert(result.message);
            }
        } catch (error) {
            alert("Terjadi kesalahan saat registrasi.");
            console.error(error);
        }
    });

    document.getElementById("loginPage").addEventListener("click", function () {
        window.location.href = "Login.html";
    });
});
