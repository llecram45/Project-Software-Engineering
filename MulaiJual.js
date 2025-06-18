// MulaiJual.js - KODE LENGKAP
document.addEventListener("DOMContentLoaded", () => {
    // Data ini diambil dari localStorage untuk kecepatan tampilan UI
    const userProfile = JSON.parse(localStorage.getItem("userProfile")) || {};
    const loggedInEmail = localStorage.getItem("loggedInEmail");

    const sidebarUsername = document.getElementById("sidebarUsername");
    const sidebarProfileImage = document.getElementById("sidebarProfileImage");

    if (userProfile.username && sidebarUsername) {
        sidebarUsername.textContent = userProfile.username;
    }
    if (userProfile.image && sidebarProfileImage) {
        sidebarProfileImage.src = userProfile.image;
    }

    const daftarBtn = document.querySelector(".btn-daftar");
    if (daftarBtn) {
        daftarBtn.addEventListener("click", async () => {
            if (!loggedInEmail) {
                alert("Anda harus login untuk bisa menjadi penjual.");
                window.location.href = 'Login.html';
                return;
            }

            // Nonaktifkan tombol untuk mencegah klik ganda
            daftarBtn.disabled = true;
            daftarBtn.textContent = "Memproses...";

            try {
                // Kirim perubahan status ke server terlebih dahulu
                const response = await fetch(`http://localhost:3000/api/users/${loggedInEmail}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ isSeller: true }) // Data yang ingin diupdate
                });

                if (!response.ok) {
                    const errData = await response.json();
                    throw new Error(errData.message || 'Gagal memperbarui status di server.');
                }
                
                // BARU: Update localStorage HANYA SETELAH server berhasil
                const updatedProfile = { ...userProfile, isSeller: true };
                localStorage.setItem("userProfile", JSON.stringify(updatedProfile));
                
                alert("Selamat! Anda sekarang terdaftar sebagai penjual. Silakan lanjutkan ke tahap verifikasi.");
                window.location.href = "Verifikasi.html"; // Arahkan ke langkah selanjutnya

            } catch(error) {
                console.error("Gagal mendaftar sebagai penjual:", error);
                alert(`Terjadi kesalahan: ${error.message}`);
                // Aktifkan kembali tombol jika gagal
                daftarBtn.disabled = false;
                daftarBtn.textContent = 'Daftar Jadi Penjual';
            }
        });
    }
});