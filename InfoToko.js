// InfoToko.js - KODE LENGKAP (VERSI DIPERBAIKI)
document.addEventListener("DOMContentLoaded", async () => {
    const userProfileFromStorage = JSON.parse(localStorage.getItem("userProfile")) || {};
    const loggedInEmail = localStorage.getItem("loggedInEmail");

    // Elemen UI
    const namaTokoInput = document.getElementById("namaToko");
    const emailInput = document.getElementById("email");
    const teleponInput = document.getElementById("telepon");
    const sidebarUsername = document.getElementById("sidebarUsername");
    const sidebarProfileImage = document.getElementById("sidebarProfileImage");
    const form = document.getElementById("formInformasiToko");

    // Tampilkan data dari localStorage dulu untuk UI cepat
    if (sidebarUsername) sidebarUsername.textContent = userProfileFromStorage.username || "Anonim";
    if (sidebarProfileImage) sidebarProfileImage.src = userProfileFromStorage.image || "https://via.placeholder.com/80";
    if (emailInput) emailInput.value = loggedInEmail || "";

    if (!loggedInEmail) {
        alert("Sesi tidak ditemukan, silakan login kembali.");
        window.location.href = 'Login.html';
        return;
    }

    // Ambil data lengkap dan terbaru dari server untuk memastikan data akurat
    try {
        const response = await fetch(`http://localhost:3000/api/users/${loggedInEmail}`);
        if (!response.ok) throw new Error('Gagal memuat data toko.');
        
        const user = await response.json();

        // Update localStorage dengan data terbaru jika perlu
        localStorage.setItem('userProfile', JSON.stringify(user));

        // Isi form dengan data dari server
        if (namaTokoInput && user.storeProfile && user.storeProfile.name) {
            namaTokoInput.value = user.storeProfile.name;
        } else if (namaTokoInput) {
            namaTokoInput.placeholder = "Nama toko belum diatur";
        }
        
        if (teleponInput) {
            teleponInput.value = user.phone || "";
        }

    } catch (error) {
        console.error("Gagal fetch info toko:", error);
        alert(`Gagal memuat data toko dari server.`);
    }
    
    // DIUBAH: Logika tombol 'Lanjut' sekarang HANYA untuk navigasi
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            // Tidak ada proses simpan data, langsung arahkan ke halaman merchant
            window.location.href = "Merchant.html";
        });
    }
});