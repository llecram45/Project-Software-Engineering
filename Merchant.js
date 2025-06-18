// --- MENGAMBIL ELEMEN DARI HTML ---
const modal = document.getElementById('uploadModal');
const productContainer = document.getElementById('productContainer');
const form = document.getElementById('uploadForm');
const closeBtn = document.getElementById('closeModalBtn');
const notification = document.getElementById('notification');
const loading = document.getElementById('loading');

// Membuat tombol "Tambah Produk" secara dinamis
const openBtn = document.createElement('div');
openBtn.className = 'product-card';
openBtn.innerHTML = '<div style="font-size: 24px; padding-top: 40px;">➕</div><p>Tambah Produk</p>';
openBtn.onclick = () => modal.style.display = 'block';

// Variabel global untuk menyimpan daftar produk
let products = [];

// --- FUNGSI BARU: MENGAMBIL & MENAMPILKAN PROFIL TOKO ---
async function fetchAndRenderMerchantProfile() {
    const loggedInEmail = localStorage.getItem("loggedInEmail");
    if (!loggedInEmail) {
        alert("Sesi tidak ditemukan. Silakan login kembali.");
        window.location.href = "Login.html";
        return;
    }

    // Ambil elemen profil dari HTML
    const merchantNameEl = document.getElementById("merchantName");
    const merchantLogoEl = document.getElementById("merchantLogo");
    const merchantJoinDateEl = document.getElementById("merchantJoinDate");
    
    try {
        const response = await fetch(`http://localhost:3000/api/users/${loggedInEmail}`);
        if (!response.ok) throw new Error('Gagal memuat profil merchant.');
        const user = await response.json();

        // Mengisi nama toko dari data user
        if (user.storeProfile && user.storeProfile.name) {
            merchantNameEl.textContent = user.storeProfile.name;
        } else {
            merchantNameEl.textContent = "Nama Toko Belum Diatur";
        }
        
        // Mengisi logo toko (menggunakan foto profil user)
        if (user.image) {
            merchantLogoEl.src = user.image;
        }

        // Mengisi tanggal bergabung (asumsi field 'createdAt' ada saat user registrasi)
        if (user.createdAt) {
             const joinDate = new Date(user.createdAt);
             const yearsAgo = new Date().getFullYear() - joinDate.getFullYear();
             if (yearsAgo > 0) {
                 merchantJoinDateEl.textContent = `${yearsAgo} Tahun Lalu`;
             } else {
                 merchantJoinDateEl.textContent = "Tahun Ini";
             }
        } else {
            merchantJoinDateEl.textContent = 'N/A';
        }

    } catch (error) {
        console.error("Error fetching merchant profile:", error);
        merchantNameEl.textContent = "Gagal Memuat Toko";
    }
}


// --- FUNGSI-FUNGSI YANG SUDAH ADA (DENGAN PENYESUAIAN) ---

function formatRupiah(number) {
    return Number(number).toLocaleString('id-ID');
}

function renderProducts() {
    productContainer.innerHTML = '';
    products.forEach(p => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${p.image}" alt="${p.name}" style="width: 100%; height: 150px; object-fit: cover; border-radius: 8px;">
            <p><strong>${p.name}</strong></p>
            <p>Rp ${formatRupiah(p.price)}</p>
        `;
        // DIUBAH: Menggunakan p._id dari MongoDB untuk link
        card.onclick = () => {
            window.location.href = `ProductDesc.html?id=${p._id}`;
        };
        productContainer.appendChild(card);
    });
    
    // Update jumlah produk di bagian profil
    const merchantProductCountEl = document.getElementById("merchantProductCount");
    if(merchantProductCountEl) {
        merchantProductCountEl.textContent = products.length;
    }

    // Selalu tambahkan tombol "Tambah Produk" di akhir
    productContainer.appendChild(openBtn);
}

async function fetchProductsFromServer() {
    try {
        const res = await fetch(`http://localhost:3000/products`);
        if (!res.ok) throw new Error('Gagal memuat produk dari server');
        products = await res.json();
    } catch (err) {
        console.error('Gagal memuat produk:', err);
        products = []; // Jika gagal, pastikan products adalah array kosong
    } finally {
        renderProducts(); // Selalu panggil renderProducts setelah fetch selesai (baik berhasil maupun gagal)
    }
}

function saveProductToServer(product) {
    return fetch('http://localhost:3000/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
    });
}

// Logika untuk form tambah produk (tidak diubah)
form.onsubmit = function (e) {
    e.preventDefault();
    loading.style.display = 'block';

    const name = document.getElementById('productName').value;
    const price = document.getElementById('productPrice').value;
    const desc = document.getElementById('productDesc').value;
    const imageInput = document.getElementById('productImage').files[0];

    if (imageInput) {
        if (imageInput.size > 1048576) { // 1 MB limit
            loading.style.display = 'none';
            notification.innerHTML = '❌ Ukuran gambar melebihi 1 MB!';
            notification.style.display = 'block';
            setTimeout(() => notification.style.display = 'none', 3000);
            return;
        }

        const reader = new FileReader();
        reader.onload = function () {
            const imageURL = reader.result;
            const product = { name, price, desc, image: imageURL };

            saveProductToServer(product).then(async (res) => {
                if (!res.ok) { // Cek jika server merespon dengan error
                    const errData = await res.text();
                    throw new Error(errData || 'Gagal menyimpan produk.');
                }
                const savedProduct = await res.json();
                products.push(savedProduct);
                renderProducts(); // Re-render daftar produk dengan produk baru

                loading.style.display = 'none';
                modal.style.display = 'none';
                form.reset();

                notification.innerHTML = '✅ Produk berhasil ditambahkan!';
                notification.style.display = 'block';
                setTimeout(() => notification.style.display = 'none', 3000);
            }).catch((err) => {
                loading.style.display = 'none';
                notification.innerHTML = `❌ Gagal menyimpan produk: ${err.message}`;
                notification.style.display = 'block';
                setTimeout(() => notification.style.display = 'none', 3000);
            });
        };
        reader.readAsDataURL(imageInput);
    }
};

// Logika untuk menutup modal (tidak diubah)
closeBtn.onclick = () => modal.style.display = 'none';
window.onclick = (e) => {
    if (e.target == modal) modal.style.display = 'none';
};

// --- INISIALISASI HALAMAN ---
// Fungsi gabungan untuk memuat semua data yang dibutuhkan halaman ini
async function initializePage() {
    await fetchAndRenderMerchantProfile();
    await fetchProductsFromServer();
}

// Panggil fungsi inisialisasi saat halaman pertama kali dimuat
initializePage();