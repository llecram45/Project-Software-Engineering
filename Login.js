document.getElementById("registerForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
        alert("Kata sandi tidak cocok!");
        return;
    }

    // Simpan data ke localStorage
    const userData = {
        email: email,
        phone: phone,
        password: password,
    };

    localStorage.setItem("userData", JSON.stringify(userData));
    alert("Pendaftaran berhasil! Silahkan login.");

    window.location.href = "login.html";
});
