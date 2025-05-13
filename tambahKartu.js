document.getElementById("formKartu").addEventListener("submit", function (e) {
  e.preventDefault();

  alert("Kartu berhasil ditambahkan!");

  const kartu = {
    nama: document.querySelector('input[placeholder="Nama lengkap di kartu"]').value,
    alamat: document.querySelector('textarea').value,
    kodepos: document.querySelector('input[placeholder="12345"]').value
  };

  localStorage.setItem("kartuUser", JSON.stringify(kartu));

  window.location.href = "Kartu.html";
});
