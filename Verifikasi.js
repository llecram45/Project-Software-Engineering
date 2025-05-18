document.addEventListener("DOMContentLoaded", () => {
  // Ambil data user dari localStorage
  const userProfile = JSON.parse(localStorage.getItem("userProfile")) || {};

  // Dapatkan elemen username dan foto di sidebar
  const sidebarUsername = document.getElementById("sidebarUsername");
  const sidebarProfileImage = document.getElementById("sidebarProfileImage");

  // Tampilkan username dan foto jika ada
  if (sidebarUsername) {
    sidebarUsername.textContent = userProfile.username || "Pengguna";
  }

  if (sidebarProfileImage) {
    sidebarProfileImage.src = userProfile.image || "https://via.placeholder.com/80";
  }

  // Tangani submit form verifikasi
  const form = document.getElementById("formVerifikasi");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const verifNama = document.getElementById("nama").value.trim();
      const nik = document.getElementById("nik").value.trim();
      const fileInput = document.getElementById("fotoKTP");
      const syaratDisetujui = document.getElementById("syarat").checked;

      // Validasi
      if (!verifNama || !nik || !syaratDisetujui || fileInput.files.length === 0) {
        alert("Silakan lengkapi semua data dan setujui syarat & ketentuan.");
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const fotoKTPBase64 = reader.result;

        // Simpan data verifikasi ke userProfile
        userProfile.verifikasi = {
          nama: verifNama,
          nik: nik,
          ktpImage: fotoKTPBase64,
        };

        userProfile.isSeller = true;

        // Simpan kembali ke localStorage
        localStorage.setItem("userProfile", JSON.stringify(userProfile));

        // Redirect ke halaman Toko
        window.location.href = "InfoToko.html";
      };

      reader.readAsDataURL(fileInput.files[0]);
    });
  }
});
