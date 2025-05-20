document.addEventListener("DOMContentLoaded", () => {
  const alamatTampil = document.getElementById("alamat-terpilih");
  const produkDiv = document.getElementById("produk-terpilih");
  const totalProduk = document.getElementById("totalProduk");
  const totalHarga = document.getElementById("totalHarga");
  const tipePembayaranSelect = document.getElementById("tipePembayaran");
  const metodePembayaranSelect = document.getElementById("metodePembayaran");
  const buatPesananBtn = document.getElementById("buatPesanan");
  const jasaKirimSelect = document.getElementById("jasaKirim");

  // Ambil alamat
  const alamat = JSON.parse(localStorage.getItem("alamatTersimpan"));
  alamatTampil.textContent = alamat
    ? `${alamat.nama}, ${alamat.lengkap}`
    : "Belum ada alamat.";

  // Ambil produk dari keranjang atau Buy Now
  let checkedItems = JSON.parse(localStorage.getItem("checkoutItems"));
  const buyNow = JSON.parse(localStorage.getItem("selectedProduct"));

  if (!checkedItems || checkedItems.length === 0) {
    if (buyNow) {
      checkedItems = [buyNow];
    } else {
      checkedItems = [];
    }
  }

  // Format harga ke Rupiah
  function formatRupiah(num) {
    return "Rp " + Number(num).toLocaleString("id-ID");
  }

  // Tampilkan produk
  let total = 0;
  produkDiv.innerHTML = "";

  checkedItems.forEach((item) => {
    const hargaNumber = parseInt(item.price.replace(/\D/g, "")) || 0;
    const quantity = parseInt(item.quantity) || 1;
    const subtotal = hargaNumber * quantity;
    total += subtotal;

    const produkItem = document.createElement("div");
    produkItem.classList.add("produk-item");
    produkItem.style.display = "flex";
    produkItem.style.alignItems = "center";
    produkItem.style.gap = "10px";
    produkItem.style.marginBottom = "10px";

    produkItem.innerHTML = `
      <img src="${item.image}" alt="${item.name}" style="width:60px; height:60px; object-fit:cover; border-radius:5px;">
      <div>
        <div><strong>${item.store || "Toko"}</strong></div>
        <div>${item.name} (${quantity} pcs)</div>
        <div>${item.price}</div>
      </div>
    `;

    produkDiv.appendChild(produkItem);
  });

  totalProduk.textContent = checkedItems.length;
  totalHarga.textContent = formatRupiah(total);

  // Metode Pembayaran
  const kartu = JSON.parse(localStorage.getItem("kartu")) || [];
  const bankOptions = [
    { value: "transfer-BCA", text: "BCA" },
    { value: "transfer-BNI", text: "BNI" },
    { value: "transfer-Mandiri", text: "Mandiri" },
    { value: "transfer-BRI", text: "BRI" },
  ];

  function clearMetodeOptions() {
    metodePembayaranSelect.innerHTML = '<option value="">-- Pilih Metode Pembayaran --</option>';
  }

  function isiMetodePembayaran(tipe) {
    clearMetodeOptions();

    if (tipe === "kartu") {
      kartu.forEach((k) => {
        const opt = document.createElement("option");
        opt.value = `kartu-${k.nomor}`;
        opt.textContent = `${k.nama} - **** **** **** ${k.nomor.slice(-4)}`;
        metodePembayaranSelect.appendChild(opt);
      });
      metodePembayaranSelect.disabled = kartu.length === 0;
    } else if (tipe === "transfer") {
      bankOptions.forEach((b) => {
        const opt = document.createElement("option");
        opt.value = b.value;
        opt.textContent = b.text;
        metodePembayaranSelect.appendChild(opt);
      });
      metodePembayaranSelect.disabled = false;
    } else {
      metodePembayaranSelect.disabled = true;
    }
  }

  // Validasi sebelum mengaktifkan tombol
  function validasi() {
    const jasa = jasaKirimSelect.value;
    const tipe = tipePembayaranSelect.value;
    const metode = metodePembayaranSelect.value;

    if (alamat && checkedItems.length && jasa && tipe && metode) {
      buatPesananBtn.disabled = false;
    } else {
      buatPesananBtn.disabled = true;
    }
  }

  // Event listeners
  tipePembayaranSelect.addEventListener("change", (e) => {
    isiMetodePembayaran(e.target.value);
    validasi();
  });

  metodePembayaranSelect.addEventListener("change", validasi);
  jasaKirimSelect.addEventListener("change", validasi);

  metodePembayaranSelect.disabled = true;
  validasi();

  // Tombol buat pesanan
  buatPesananBtn.addEventListener("click", () => {
    alert("Pesanan berhasil dibuat!");

    // Hapus data checkout
    localStorage.removeItem("checkoutItems");
    localStorage.removeItem("selectedProduct");

    // Tunda redirect
    setTimeout(() => {
      window.location.href = "OrderSuccess.html";
    }, 500); // 0.5 detik delay
  });
});
