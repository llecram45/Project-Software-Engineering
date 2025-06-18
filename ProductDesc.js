document.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');

    // Ambil semua elemen DOM yang akan kita manipulasi
    const container = document.querySelector('.product-card');
    const productImage = document.getElementById("product-image");
    const productName = document.getElementById("product-name");
    const productPrice = document.getElementById("product-price");
    const productRating = document.getElementById("product-rating");
    const productDescription = document.getElementById("product-description");
    const qtyInput = document.getElementById("quantity");
    const addToCartBtn = document.getElementById("add-to-cart");
    const buyNowBtn = document.getElementById("buy-now");
    const minusBtn = document.getElementById("minus");
    const plusBtn = document.getElementById("plus");

    if (!productId) {
        // Jika tidak ada ID, tampilkan pesan error di elemen utama
        container.innerHTML = "<h1>ID produk tidak valid atau tidak ditemukan.</h1>";
        return;
    }

    let product; // Variabel untuk menyimpan data produk

    // --- FUNGSI UNTUK MENGISI DATA PRODUK KE HTML ---
    function populateProductData(p) {
        productImage.src = p.image;
        productImage.alt = p.name;
        productName.textContent = p.name;
        productDescription.textContent = p.desc || 'Tidak ada deskripsi untuk produk ini.';
        
        const hargaNumber = parseInt(p.price.toString().replace(/\D/g, ""));
        productPrice.textContent = `Rp ${hargaNumber.toLocaleString("id-ID")}`;
        
        // Asumsi 'rating' belum ada di data produk, jadi kita beri nilai default
        productRating.textContent = p.rating || 'N/A'; 
    }

    // --- PROSES MENGAMBIL DATA DARI SERVER ---
    try {
        // Tampilkan status loading langsung di elemen yang ada
        productName.textContent = "Memuat...";
        productDescription.textContent = "Sedang mengambil data dari server...";

        const response = await fetch(`http://localhost:3000/api/products/${productId}`);
        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.message || 'Produk tidak ditemukan.');
        }
        product = await response.json();
        
        // Panggil fungsi untuk mengisi data setelah berhasil di-fetch
        populateProductData(product);

    } catch (error) {
        // Jika error, tampilkan pesan error di elemen utama
        console.error(error);
        container.innerHTML = `<h1>Terjadi Kesalahan</h1><p>${error.message}</p><a href="Home.html">Kembali ke Beranda</a>`;
        return; // Hentikan eksekusi script lebih lanjut
    }

    // --- EVENT LISTENER UNTUK TOMBOL-TOMBOL (Tidak berubah) ---
    qtyInput.value = 1;
    qtyInput.min = 1;

    minusBtn.addEventListener("click", () => {
        let currentQty = parseInt(qtyInput.value);
        if (currentQty > 1) qtyInput.value = currentQty - 1;
    });

    plusBtn.addEventListener("click", () => {
        let currentQty = parseInt(qtyInput.value);
        qtyInput.value = currentQty + 1;
    });

    addToCartBtn.addEventListener("click", async () => {
        const quantity = parseInt(qtyInput.value);
        const loggedInEmail = localStorage.getItem("loggedInEmail");

        if (!loggedInEmail) {
            alert("Anda harus login untuk menambahkan item ke keranjang.");
            window.location.href = 'Login.html';
            return;
        }
        if (quantity < 1) {
            alert("Jumlah harus minimal 1.");
            return;
        }

        addToCartBtn.disabled = true;
        addToCartBtn.textContent = 'Menambahkan...';

        try {
            const response = await fetch(`http://localhost:3000/api/cart/${loggedInEmail}/items`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId: product._id, quantity: quantity })
            });
            if (!response.ok) throw new Error('Gagal menambahkan produk ke keranjang.');
            alert(`${product.name} (${quantity}) berhasil ditambahkan ke keranjang!`);
        } catch (error) {
            console.error(error);
            alert(`Terjadi kesalahan: ${error.message}`);
        } finally {
            addToCartBtn.disabled = false;
            addToCartBtn.textContent = 'Add to Cart';
        }
    });

    buyNowBtn.addEventListener("click", () => {
        const quantity = parseInt(qtyInput.value);
        if (quantity < 1) {
            alert("Jumlah harus minimal 1.");
            return;
        }
        const productToBuy = {
            productId: product._id,
            name: product.name,
            price: product.price,
            image: product.image,
            store: product.store || "Kreativa",
            quantity,
        };
        localStorage.setItem("checkoutItems", JSON.stringify([productToBuy]));
        window.location.href = "CheckOut.html";
    });
});