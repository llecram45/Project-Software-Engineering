document.getElementById("formKartu").addEventListener("submit", function (e) {
  e.preventDefault();

  const userProfile = JSON.parse(localStorage.getItem("userProfile")) || {};
  const username = userProfile.username;
  if (!username) {
    alert("User belum login");
    return;
  }

  const kartuBaru = {
    nama: document.querySelector('input[placeholder="Nama lengkap di kartu"]').value,
    alamat: document.querySelector('textarea').value,
    kodepos: document.querySelector('input[placeholder="12345"]').value
  };

  // Ambil data kartuUser (objek dengan array per user)
  const semuaKartu = JSON.parse(localStorage.getItem("kartuUser")) || {};

  // Ambil array kartu user, jika belum ada buat array kosong
  if (!semuaKartu[username]) {
    semuaKartu[username] = [];
  }

  // Tambahkan kartu baru ke array user
  semuaKartu[username].push(kartuBaru);

  // Simpan ulang ke localStorage
  localStorage.setItem("kartuUser", JSON.stringify(semuaKartu));

  alert("Kartu berhasil ditambahkan!");
  window.location.href = "Kartu.html";
});
