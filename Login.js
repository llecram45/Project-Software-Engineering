// ✅ Ini untuk form login
document.getElementById("loginForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        const result = await response.json();

        if (response.ok && result.success) {
            alert("Login berhasil!");

            // Ambil data user lengkap dari server
            const userResponse = await fetch(`http://localhost:3000/api/users/${email}`);
            const userData = await userResponse.json();

            // Simpan ke localStorage
            localStorage.setItem("userProfile", JSON.stringify(userData));
            localStorage.setItem("loggedInEmail", email);

            window.location.href = "Home.html";
        } else {
            alert(result.message || "Login gagal!");
        }
    } catch (err) {
        alert("Terjadi kesalahan saat login.");
        console.error(err);
    }
});

// ✅ Ini untuk tombol "Daftar sekarang?"
document.getElementById("registerPage").addEventListener("click", function () {
    window.location.href = "Signup.html";
});