// CheckOut.js - KODE LENGKAP (Copy & Paste)
document.addEventListener("DOMContentLoaded", () => {
    // --- MENGAMBIL ELEMEN DARI HTML ---
    const alamatTampil = document.getElementById("alamat-terpilih");
    const produkDiv = document.getElementById("produk-terpilih");
    const totalProduk = document.getElementById("totalProduk");
    const totalHarga = document.getElementById("totalHarga");
    const tipePembayaranSelect = document.getElementById("tipePembayaran");
    const metodePembayaranSelect = document.getElementById("metodePembayaran");
    const buatPesananBtn = document.getElementById("buatPesanan");
    const jasaKirimSelect = document.getElementById("jasaKirim");
    const pesanTextarea = document.getElementById("pesan");
    const loggedInEmail = localStorage.getItem("loggedInEmail");

    // Variabel state untuk menyimpan data yang di-fetch
    let itemsToCheckout = [];
    let alamatPengiriman = null;
    let daftarKartuPengguna = [];

    // --- FUNGSI-FUNGSI UNTUK MENGAMBIL DATA DARI SERVER ---

    async function fetchAlamat() {
        if (!loggedInEmail) return;
        alamatTampil.textContent = "Memuat alamat...";
        try {
            const response = await fetch(`http://localhost:3000/api/addresses/${loggedInEmail}`);
            if (!response.ok) throw new Error("Gagal memuat alamat.");
            const alamatList = await response.json();

            if (alamatList && alamatList.length > 0) {
                alamatPengiriman = alamatList[alamatList.length - 1]; // Ambil alamat terbaru
                alamatTampil.innerHTML = `
                    <strong>${alamatPengiriman.nama}</strong> (${alamatPengiriman.telepon})<br>
                    ${alamatPengiriman.jalan}, ${alamatPengiriman.lokasi}<br>
                    ${alamatPengiriman.detail || ''}
                `;
            } else {
                alamatTampil.innerHTML = `Alamat belum diatur. <a href="Alamat.html">Tambah Alamat</a>`;
                alamatPengiriman = null;
            }
        } catch (error) {
            alamatTampil.textContent = "Gagal memuat alamat.";
        }
    }

    async function fetchProduk() {
        const params = new URLSearchParams(window.location.search);
        const itemIdsParam = params.get('items');
        
        // Handle "Buy Now" dari ProductDesc.js yang masih pakai localStorage
        let checkoutItemsFromStorage = JSON.parse(localStorage.getItem("checkoutItems"));

        const itemIds = itemIdsParam ? itemIdsParam.split(',') : null;

        if (!itemIds && checkoutItemsFromStorage) {
            // Logika fallback untuk "Buy Now"
            itemsToCheckout = checkoutItemsFromStorage;
            renderProduk();
        } else if (itemIds) {
            // Logika utama untuk item dari keranjang
            produkDiv.innerHTML = "<p>Memuat produk...</p>";
            try {
                const response = await fetch(`http://localhost:3000/api/products/by-ids`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ids: itemIds })
                });
                if (!response.ok) throw new Error("Gagal memuat detail produk.");

                const productsFromServer = await response.json();
                
                const cartResponse = await fetch(`http://localhost:3000/api/cart/${loggedInEmail}`);
                const cartData = await cartResponse.json();
                const cartItems = cartData.items || [];
                
                itemsToCheckout = productsFromServer.map(product => {
                    const itemInCart = cartItems.find(item => item.productId === product._id);
                    return { ...product, quantity: itemInCart ? itemInCart.quantity : 1 };
                });
                renderProduk();

            } catch (error) {
                produkDiv.innerHTML = "<p>Gagal memuat detail produk.</p>";
            }
        } else {
             produkDiv.innerHTML = "<p>Tidak ada produk yang dipilih untuk checkout.</p>";
        }
    }

    // --- FUNGSI RENDER & HELPER ---
    function formatRupiah(numInput) {
        if (typeof numInput === 'string' && numInput.startsWith('Rp')) return numInput;
        const number = parseInt(String(numInput).replace(/\D/g, ""));
        return "Rp " + (Number.isNaN(number) ? 0 : number.toLocaleString("id-ID"));
    }

    function renderProduk() {
        let calculatedTotalHarga = 0;
        produkDiv.innerHTML = "";
        if (itemsToCheckout && itemsToCheckout.length > 0) {
            itemsToCheckout.forEach((item) => {
                const hargaNumber = parseInt(String(item.price).replace(/\D/g, "")) || 0;
                const quantity = parseInt(item.quantity) || 1;
                calculatedTotalHarga += hargaNumber * quantity;
                const produkItem = document.createElement("div");
                produkItem.className = "produk-item";
                produkItem.innerHTML = `
                    <img src="${item.image}" alt="${item.name}" style="width:60px; height:60px; object-fit:cover; border-radius:5px;">
                    <div>
                        <p><strong>${item.name}</strong> (${quantity} pcs)</p>
                        <p>${formatRupiah(hargaNumber)}</p>
                    </div>`;
                produkDiv.appendChild(produkItem);
            });
        }
        totalProduk.textContent = itemsToCheckout.reduce((acc, item) => acc + item.quantity, 0);
        totalHarga.textContent = formatRupiah(calculatedTotalHarga);
        validasi();
    }
    
    const bankOptions = [
        { value: "transfer-BCA", text: "Transfer Bank BCA" },
        { value: "transfer-BNI", text: "Transfer Bank BNI" },
        { value: "transfer-Mandiri", text: "Transfer Bank Mandiri" },
        { value: "transfer-BRI", text: "Transfer Bank BRI" },
    ];

    function clearMetodeOptions() {
        metodePembayaranSelect.innerHTML = '<option value="">-- Pilih Metode Pembayaran --</option>';
    }

    function isiMetodePembayaran(tipe) {
        clearMetodeOptions();
        if (tipe === "kartu") {
            if (daftarKartuPengguna && daftarKartuPengguna.length > 0) {
                daftarKartuPengguna.forEach((k) => {
                    const opt = document.createElement("option");
                    // Gunakan _id yang unik sebagai value
                    opt.value = `kartu-${k._id}`; 
                    opt.textContent = `${k.namaKartu} - **** **** **** ${k.nomorKartu.slice(-4)}`;
                    metodePembayaranSelect.appendChild(opt);
                });
                metodePembayaranSelect.disabled = false;
            } else {
                const opt = document.createElement("option");
                opt.value = "";
                opt.textContent = "Tidak ada kartu tersimpan";
                metodePembayaranSelect.appendChild(opt);
                metodePembayaranSelect.disabled = true;
            }
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
        validasi();
    }

    function fetchKartuDanIsiPembayaran(tipe) {
        if (!loggedInEmail) {
            console.warn("Email pengguna tidak ditemukan.");
            return;
        }

        if (tipe === "kartu") {
            metodePembayaranSelect.disabled = true;
            metodePembayaranSelect.innerHTML = '<option value="">Memuat kartu...</option>';
            // Gunakan endpoint yang benar
            fetch(`http://localhost:3000/kartu/${loggedInEmail}`)
                .then(res => {
                    if (res.status === 404) return [];
                    if (!res.ok) throw new Error('Gagal mengambil data kartu');
                    return res.json();
                })
                .then(kartuArray => {
                    daftarKartuPengguna = kartuArray;
                    isiMetodePembayaran(tipe);
                })
                .catch(err => {
                    console.error("Error saat fetch kartu:", err);
                    daftarKartuPengguna = [];
                    isiMetodePembayaran(tipe); // Tetap panggil untuk menampilkan pesan error
                });
        } else {
            isiMetodePembayaran(tipe);
        }
    }

    function validasi() {
        const alamatValid = !!alamatPengiriman;
        const itemAda = itemsToCheckout && itemsToCheckout.length > 0;
        const jasaTerpilih = jasaKirimSelect.value;
        const metodePembayaranTerpilih = metodePembayaranSelect.value;
        buatPesananBtn.disabled = !(alamatValid && itemAda && jasaTerpilih && metodePembayaranTerpilih && !metodePembayaranSelect.disabled);
    }

    // --- FUNGSI UTAMA: BUAT PESANAN ---
    buatPesananBtn.addEventListener("click", async () => {
        const submitButton = buatPesananBtn;
        submitButton.disabled = true;
        submitButton.textContent = "Memproses...";

        if (!alamatPengiriman) {
            alert("Alamat pengiriman belum diatur.");
            submitButton.disabled = false;
            submitButton.textContent = "Buat Pesanan";
            return;
        }

        const pesananData = {
            idPesanan: `ORD-${Date.now()}`,
            emailPengguna: loggedInEmail,
            tanggalPesanan: new Date().toISOString(),
            statusPesanan: "Belum Bayar",
            alamatPengiriman: alamatPengiriman,
            jasaKirim: jasaKirimSelect.value,
            metodePembayaranDetail: metodePembayaranSelect.options[metodePembayaranSelect.selectedIndex].text,
            items: itemsToCheckout.map(item => ({
                productId: item._id, name: item.name, image: item.image, price: item.price, quantity: item.quantity, store: item.store
            })),
            pesanUntukPenjual: pesanTextarea.value,
            totalHargaKeseluruhan: totalHarga.textContent
        };

        try {
            const response = await fetch('http://localhost:3000/pesanan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(pesananData),
            });
            if (!response.ok) throw new Error("Gagal membuat pesanan.");

            const itemIdsToRemove = itemsToCheckout.map(item => item._id);
            await fetch(`http://localhost:3000/api/cart/${loggedInEmail}/clear-items`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ids: itemIdsToRemove })
            });
            
            alert("Pesanan berhasil dibuat!");
            localStorage.removeItem("checkoutItems");
            localStorage.removeItem("selectedProduct");
            window.location.href = "PesananSaya.html";

        } catch (error) {
            console.error('Error saat membuat pesanan:', error);
            alert(`Terjadi kesalahan: ${error.message}`);
            submitButton.disabled = false;
            submitButton.textContent = "Buat Pesanan";
        }
    });

    // --- INISIALISASI HALAMAN ---
    async function initializePage() {
        if (!loggedInEmail) {
            document.body.innerHTML = "<h1>Sesi tidak ditemukan. Silakan <a href='Login.html'>login</a> kembali.</h1>";
            return;
        }
        await fetchAlamat();
        await fetchProduk();
        tipePembayaranSelect.addEventListener("change", (e) => fetchKartuDanIsiPembayaran(e.target.value));
        metodePembayaranSelect.addEventListener("change", validasi);
        jasaKirimSelect.addEventListener("change", validasi);
    }

    initializePage();
});