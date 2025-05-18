document.addEventListener("DOMContentLoaded", () => {
  // Ambil data profil user untuk sidebar (opsional)
  const userProfile = JSON.parse(localStorage.getItem("userProfile")) || {};

  const sidebarUsername = document.getElementById("sidebarUsername");
  if (sidebarUsername && userProfile.username) {
    sidebarUsername.textContent = userProfile.username;
  }

  const sidebarProfileImage = document.getElementById("sidebarProfileImage");
  if (sidebarProfileImage && userProfile.image) {
    sidebarProfileImage.src = userProfile.image;
  }

  // Ambil data alamat pembeli dari localStorage
  const alamatList = JSON.parse(localStorage.getItem("alamatUser")) || [];
  const container = document.getElementById("addressContainer");

  // Fungsi untuk menampilkan alamat-alamat yang sudah disimpan
  function tampilkanAlamat(dataList) {
    container.innerHTML = "";

    if (dataList.length === 0) {
      container.classList.add("address-empty");
      container.innerHTML = `<p>Kamu belum memiliki alamat.</p>`;
      return;
    }

    container.classList.remove("address-empty");

    dataList.forEach((data, index) => {
      const alamatBox = document.createElement("div");
      alamatBox.classList.add("address-box");
      alamatBox.style.cssText =
        "border: 1px solid #ccc; padding: 20px; border-radius: 10px; margin-top: 15px;";

      alamatBox.innerHTML = `
        <p><strong>Nama:</strong> ${data.nama}</p>
        <p><strong>Telepon:</strong> ${data.telepon}</p>
        <p><strong>Provinsi, Kota, Kode Pos:</strong> ${data.lokasi}</p>
        <p><strong>Jalan:</strong> ${data.jalan}</p>
        <p><strong>Detail:</strong> ${data.detail}</p>
      `;

      container.appendChild(alamatBox);
    });
  }

  tampilkanAlamat(alamatList);

  // Fungsi untuk navigasi ke halaman tambah alamat
  window.handleAddAddress = function () {
    window.location.href = "tambahAlamat.html";
  };
});
