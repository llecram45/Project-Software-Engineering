// Kartu.js - KODE LENGKAP
document.addEventListener("DOMContentLoaded", () => {
    const email = localStorage.getItem("loggedInEmail");
    const userProfile = JSON.parse(localStorage.getItem("userProfile")) || {};

    const sidebarUsername = document.getElementById("sidebarUsername");
    const sidebarProfileImage = document.getElementById("sidebarProfileImage");
    const cardsContainer = document.getElementById("cardsContainer");

    if (!email) {
        alert("❌ Anda belum login.");
        window.location.href = "Login.html";
        return;
    }

    // Tampilkan profil dari localStorage untuk kecepatan
    sidebarUsername.textContent = userProfile.username || "Anonim";
    sidebarProfileImage.src = userProfile.image || "https://via.placeholder.com/80";

    // Fungsi untuk mengambil dan merender kartu dari server
    function fetchAndRenderCards() {
        cardsContainer.innerHTML = "<p>Memuat kartu...</p>";
        fetch(`http://localhost:3000/kartu/${email}`)
            .then(res => {
                if (!res.ok) {
                    // Jika 404, artinya tidak ada kartu, kembalikan array kosong
                    if (res.status === 404) return [];
                    throw new Error("Gagal mengambil data kartu");
                }
                return res.json();
            })
            .then(kartuArray => {
                if (!Array.isArray(kartuArray) || kartuArray.length === 0) {
                    cardsContainer.innerHTML = "<p>🔍 Belum ada kartu tersimpan.</p>";
                    return;
                }

                cardsContainer.classList.remove("cards-empty");
                cardsContainer.innerHTML = "";

                kartuArray.forEach(data => {
                    const card = document.createElement("div");
                    card.className = "cardItem";
                    card.innerHTML = `
                        <p><strong>Nama di Kartu:</strong> ${data.namaKartu}</p>
                        <p><strong>Nomor Kartu:</strong> **** **** **** ${data.nomorKartu.slice(-4)}</p>
                        <p><strong>Alamat:</strong> ${data.alamat}</p>
                        <button class="deleteCardBtn" data-id="${data._id}">🗑️ Hapus Kartu</button>
                    `;
                    cardsContainer.appendChild(card);
                });
            })
            .catch(err => {
                console.error("❌ Error saat mengambil kartu:", err);
                cardsContainer.innerHTML = "<p>❌ Gagal memuat kartu.</p>";
            });
    }

    // Event listener untuk tombol hapus
    cardsContainer.addEventListener("click", (e) => {
        if (e.target.classList.contains("deleteCardBtn")) {
            const cardId = e.target.getAttribute("data-id"); // DIUBAH

            if (confirm("Apakah Anda yakin ingin menghapus kartu ini?")) {
                e.target.disabled = true;
                e.target.textContent = 'Menghapus...';

                // DIUBAH: URL fetch disesuaikan dengan endpoint baru di server.js
                fetch(`http://localhost:3000/kartu/${cardId}`, {
                    method: "DELETE"
                })
                .then(res => {
                    if (!res.ok) throw new Error("Gagal menghapus kartu dari server");
                    return res.json();
                })
                .then(data => {
                    alert(data.message);
                    fetchAndRenderCards(); // Muat ulang daftar kartu
                })
                .catch(err => {
                    console.error("❌ Gagal menghapus kartu:", err);
                    alert("Gagal menghapus kartu.");
                    e.target.disabled = false;
                    e.target.textContent = '🗑️ Hapus Kartu';
                });
            }
        }
    });

    // Panggil fungsi saat halaman pertama kali dimuat
    fetchAndRenderCards();
});

// Fungsi untuk navigasi
function handleAddCards() {
    window.location.href = "tambahKartu.html";
}