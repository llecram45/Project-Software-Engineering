const alamat = JSON.parse(localStorage.getItem("alamatUser"));
const container = document.getElementById("addressContainer");

function tampilkanAlamat(data) {
  if (data) {
    container.classList.remove("address-empty"); 
    container.innerHTML = `
      <div class="address-box" style="border: 1px solid #ccc; padding: 20px; border-radius: 10px; margin-top: 15px;">
        <p><strong>Nama:</strong> ${data.nama}</p>
        <p><strong>Telepon:</strong> ${data.telepon}</p>
        <p><strong>Provinsi, Kota, Kode Pos:</strong> ${data.lokasi}</p>
        <p><strong>Jalan:</strong> ${data.jalan}</p>
        <p><strong>Detail:</strong> ${data.detail}</p>
      </div>
    `;
  }
}

tampilkanAlamat(alamat);

function handleAddAddress() {
  window.location.href = "TambahAlamat.html"; 
}

