document.addEventListener("DOMContentLoaded", () => {
  const alamatToko = JSON.parse(localStorage.getItem("alamatToko")) || {};
  const loginData = JSON.parse(localStorage.getItem("loginData")) || {};
  const alamatUser = JSON.parse(localStorage.getItem("alamatUser")) || {};
  const userProfile = JSON.parse(localStorage.getItem("userProfile")) || {};

  // Nama Toko
  const namaTokoInput = document.getElementById("namaToko");
  if (namaTokoInput) {
    namaTokoInput.value = alamatToko.namaToko || "";
    namaTokoInput.readOnly = true; // Buat tidak bisa diubah
  }

  // Email dan Telepon
  const emailInput = document.getElementById("email");
  const teleponInput = document.getElementById("telepon");

  if (emailInput) {
    emailInput.value = loginData.email || "";
    emailInput.readOnly = true;
  }

  if (teleponInput) {
    teleponInput.value = alamatUser.telepon || "";
    teleponInput.readOnly = true;
  }

  // Sidebar profil
  const sidebarUsername = document.getElementById("sidebarUsername");
  const sidebarProfileImage = document.getElementById("sidebarProfileImage");

  if (sidebarUsername) sidebarUsername.textContent = userProfile.username || "Anonim";
  if (sidebarProfileImage) sidebarProfileImage.src = userProfile.image || "https://via.placeholder.com/80";

  // Form submit
  const form = document.getElementById("formInformasiToko");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const tokoData = {
        namaToko: namaTokoInput.value,
        email: emailInput.value,
        telepon: teleponInput.value,
        alamat: alamatToko,
      };

      localStorage.setItem("tokoData", JSON.stringify(tokoData));
      window.location.href = "AddProduct.html";
    });
  }
});
