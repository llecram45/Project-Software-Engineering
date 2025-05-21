// Fungsi agar tab bisa aktif saat diklik
document.addEventListener("DOMContentLoaded", function () {
  const tabs = document.querySelectorAll(".order-tabs .tab");

  tabs.forEach((tab) => {
    tab.addEventListener("click", function (e) {
      e.preventDefault();
      tabs.forEach((t) => t.classList.remove("active"));
      this.classList.add("active");

      // Optional: logika ubah konten
      const emptyState = document.querySelector(".empty-state");
      if (emptyState) {
        emptyState.querySelector("p").textContent = `Anda Tidak Memiliki Pesanan.`;
      }
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
    const savedProfile = JSON.parse(localStorage.getItem("userProfile")) || {};

    // Atur foto profil di sidebar
    if (savedProfile.image) {
        const sidebarProfileImage = document.getElementById("sidebarProfileImage");
        if (sidebarProfileImage) {
            sidebarProfileImage.src = savedProfile.image;
        }
    }

    // Atur username di sidebar
    const sidebarUsername = document.getElementById("sidebarUsername");
    if (sidebarUsername) {
        sidebarUsername.textContent = savedProfile.username || "Anonim";
    }
});


// Fungsi pencarian dummy
function searchSuggestions() {
  const input = document.getElementById("searchInput");
  const suggestionsBox = document.getElementById("suggestions");
  const query = input.value.trim();

  if (query.length > 0) {
    suggestionsBox.innerHTML = "<div>Hasil pencarian tidak ditemukan</div>";
    suggestionsBox.style.display = "block";
  } else {
    suggestionsBox.style.display = "none";
  }
}

