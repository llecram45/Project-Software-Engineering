// Alamat.js - KODE LENGKAP
document.addEventListener("DOMContentLoaded", async () => {
    // Ambil data profil user untuk sidebar (tetap dari localStorage untuk kecepatan UI)
    const userProfile = JSON.parse(localStorage.getItem("userProfile")) || {};
    const loggedInEmail = localStorage.getItem("loggedInEmail");

    const sidebarUsername = document.getElementById("sidebarUsername");
    if (sidebarUsername && userProfile.username) {
        sidebarUsername.textContent = userProfile.username;
    }

    const sidebarProfileImage = document.getElementById("sidebarProfileImage");
    if (sidebarProfileImage && userProfile.image) {
        sidebarProfileImage.src = userProfile.image;
    }

    const container = document.getElementById("addressContainer");

    // Jika tidak login, tampilkan pesan dan berhenti.
    if (!loggedInEmail) {
        container.innerHTML = `<p>Anda harus <a href="Login.html">login</a> untuk mengelola alamat.</p>`;
        container.classList.add("address-empty");
        return;
    }

    // Fungsi untuk menampilkan alamat-alamat yang sudah disimpan
    function tampilkanAlamat(dataList) {
        container.innerHTML = "";

        if (!dataList || dataList.length === 0) {
            container.classList.add("address-empty");
            container.innerHTML = `<p>Kamu belum memiliki alamat.</p>`;
            return;
        }

        container.classList.remove("address-empty");

        dataList.forEach((data) => {
            const alamatBox = document.createElement("div");
            alamatBox.classList.add("address-box");
            alamatBox.style.cssText =
                "border: 1px solid #ccc; padding: 20px; border-radius: 10px; margin-top: 15px;";

            alamatBox.innerHTML = `
                <p><strong>Nama:</strong> ${data.nama}</p>
                <p><strong>Telepon:</strong> ${data.telepon}</p>
                <p><strong>Provinsi, Kota, Kode Pos:</strong> ${data.lokasi}</p>
                <p><strong>Jalan:</strong> ${data.jalan}</p>
                <p><strong>Detail:</strong> ${data.detail || '-'}</p>
            `;
            container.appendChild(alamatBox);
        });
    }

    // DIUBAH: Ambil data alamat dari server, bukan localStorage
    try {
        container.innerHTML = `<p>Memuat alamat...</p>`;
        const response = await fetch(`http://localhost:3000/api/addresses/${loggedInEmail}`);
        if (!response.ok) {
            throw new Error(`Gagal mengambil alamat: ${response.statusText}`);
        }
        const alamatList = await response.json();
        tampilkanAlamat(alamatList);
    } catch (error) {
        console.error("Gagal fetch alamat:", error);
        container.innerHTML = `<p>Terjadi kesalahan saat memuat alamat.</p>`;
        container.classList.add("address-empty");
    }
});

// Fungsi untuk navigasi ke halaman tambah alamat (bisa diletakkan di luar jika dipanggil dari HTML)
function handleAddAddress() {
    window.location.href = "tambahAlamat.html";
}