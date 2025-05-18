document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formAlamat");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const inputs = form.querySelectorAll("input");
    const nama = inputs[0].value.trim();
    const telepon = inputs[1].value.trim();
    const lokasi = inputs[2].value.trim();
    const jalan = inputs[3].value.trim();
    const detail = inputs[4].value.trim();

    // Validasi input agar tidak kosong
    if (!nama || !telepon || !lokasi || !jalan || !detail) {
      alert("Mohon lengkapi semua kolom alamat.");
      return;
    }

    const alamatBaru = { nama, telepon, lokasi, jalan, detail };

    // Ambil data lama dari localStorage
    const alamatList = JSON.parse(localStorage.getItem("alamatUser")) || [];

    // Tambahkan alamat baru
    alamatList.push(alamatBaru);

    // Simpan kembali ke localStorage
    localStorage.setItem("alamatUser", JSON.stringify(alamatList));

    // Redirect ke halaman Alamat.html
    window.location.href = "Alamat.html";
  });
});
