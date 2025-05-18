document.addEventListener("DOMContentLoaded", () => {
  const userProfile = JSON.parse(localStorage.getItem("userProfile")) || {};
  const username = userProfile.username;

  const sidebarUsername = document.getElementById("sidebarUsername");
  if (sidebarUsername && username) {
    sidebarUsername.textContent = username;
  }

  const sidebarProfileImage = document.getElementById("sidebarProfileImage");
  if (sidebarProfileImage && userProfile.image) {
    sidebarProfileImage.src = userProfile.image;
  }

  const container = document.getElementById("cardsContainer");

  // Ambil semua kartu user dari localStorage, bentuknya objek {username: [array kartu]}
  const semuaKartu = JSON.parse(localStorage.getItem("kartuUser")) || {};

  // Ambil array kartu milik user saat ini, default kosong array
  const kartuArray = semuaKartu[username] || [];

  function tampilkanKartu(arrayData) {
    if (arrayData.length > 0) {
      container.classList.remove("cards-empty");
      container.innerHTML = ""; // kosongkan dulu container

      // Loop untuk render setiap kartu
      arrayData.forEach(data => {
        const cardHTML = `
          <div class="card-box" style="border: 1px solid #ccc; padding: 20px; border-radius: 10px; margin-top: 15px;">
            <p><strong>Nama di Kartu:</strong> ${data.nama}</p>
            <p><strong>Alamat Tagihan:</strong> ${data.alamat}</p>
            <p><strong>Kode Pos:</strong> ${data.kodepos}</p>
          </div>
        `;
        container.innerHTML += cardHTML;
      });
    } else {
      container.classList.add("cards-empty");
      container.innerHTML = `<p>You don’t have cards yet.</p>`;
    }
  }

  tampilkanKartu(kartuArray);
});

// Fungsi untuk tambah kartu
function handleAddCards() {
  window.location.href = "tambahKartu.html";
}
