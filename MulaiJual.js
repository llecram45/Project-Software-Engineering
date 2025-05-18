document.addEventListener("DOMContentLoaded", () => {
  const userProfile = JSON.parse(localStorage.getItem("userProfile")) || {};

  const sidebarUsername = document.getElementById("sidebarUsername");
  const sidebarProfileImage = document.getElementById("sidebarProfileImage");

  // Tampilkan info profil jika tersedia
  if (userProfile.username && sidebarUsername) {
    sidebarUsername.textContent = userProfile.username;
  }

  if (userProfile.image && sidebarProfileImage) {
    sidebarProfileImage.src = userProfile.image;
  }

  // Saat tombol diklik, set user jadi penjual dan redirect ke verifikasi
  const daftarBtn = document.querySelector(".btn-daftar");
  if (daftarBtn) {
    daftarBtn.addEventListener("click", () => {
      userProfile.isSeller = true;
      localStorage.setItem("userProfile", JSON.stringify(userProfile));
      window.location.href = "Verifikasi.html";
    });
  }
});
