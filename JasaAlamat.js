document.addEventListener("DOMContentLoaded", () => {
  // Sidebar (jika ingin tampilkan profil)
  const sidebarUsername = document.getElementById("sidebarUsername");
  const sidebarProfileImage = document.getElementById("sidebarProfileImage");
  const userProfile = JSON.parse(localStorage.getItem("userProfile")) || {};

  if (sidebarUsername) sidebarUsername.textContent = userProfile.username || "Anonim";
  if (sidebarProfileImage) sidebarProfileImage.src = userProfile.image || "https://via.placeholder.com/80";

  // Form alamat & jasa kirim
  const form = document.getElementById("addressForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const namaToko = document.getElementById("storeName").value.trim();
      const jalan = document.getElementById("storeAddress").value.trim();
      const kota = document.getElementById("city").value.trim();
      const provinsi = document.getElementById("province").value.trim();
      const kodePos = document.getElementById("postalCode").value.trim();

      if (!namaToko || !jalan || !kota || !provinsi || !kodePos) {
        alert("Harap lengkapi semua data alamat.");
        return;
      }

      // Ambil jasa pengiriman yang dicentang
      const jasaChecked = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
        .map(cb => cb.value);

      if (jasaChecked.length === 0) {
        alert("Pilih minimal satu jasa pengiriman.");
        return;
      }

      // Simpan alamat & nama toko
      const alamatTokoData = {
        namaToko: namaToko,
        jalan: jalan,
        lokasi: `${kota}, ${provinsi}`,
        detail: `Kode Pos: ${kodePos}`
      };

      localStorage.setItem("alamatToko", JSON.stringify(alamatTokoData));
      localStorage.setItem("jasaPengirimanDipilih", JSON.stringify(jasaChecked));

      alert("Data alamat & jasa kirim berhasil disimpan.");
      window.location.href = "InfoToko.html";
    });
  }
});

// Fungsi tombol kembali
function handleBack() {
  window.history.back();
}
