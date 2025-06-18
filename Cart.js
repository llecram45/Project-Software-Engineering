// Cart.js - KODE LENGKAP (Copy & Paste)
document.addEventListener("DOMContentLoaded", () => {
    // --- MENGAMBIL ELEMEN DARI HTML ---
    const cartTable = document.getElementById("cartItems");
    const itemCount = document.getElementById("itemCount");
    const totalPriceEl = document.getElementById("totalPrice");
    const selectAllTop = document.getElementById("selectAll");
    const selectAllBottom = document.getElementById("selectAllBottom");
    const checkoutBtn = document.getElementById("checkoutBtn");
    const loggedInEmail = localStorage.getItem("loggedInEmail");

    // Variabel untuk menyimpan state keranjang saat ini dari server
    let localCartState = [];

    // --- FUNGSI API UNTUK KOMUNIKASI DENGAN SERVER ---
    async function fetchCartAPI() {
        if (!loggedInEmail) return [];
        try {
            const response = await fetch(`http://localhost:3000/api/cart/${loggedInEmail}`);
            if (!response.ok) return []; // Jika ada error seperti 404, anggap keranjang kosong
            const cartData = await response.json();
            return cartData.items || [];
        } catch (error) {
            console.error("Error fetching cart:", error);
            return [];
        }
    }

    async function updateItemAPI(productId, quantity) {
        if (!loggedInEmail) return;
        return fetch(`http://localhost:3000/api/cart/${loggedInEmail}/items`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId, quantity }),
        });
    }

    async function removeItemAPI(productId) {
        if (!loggedInEmail) return;
        return fetch(`http://localhost:3000/api/cart/${loggedInEmail}/items/${productId}`, {
            method: 'DELETE'
        });
    }

    // --- FUNGSI HELPER & RENDER TAMPILAN ---
    function formatRupiah(numStr) {
        const num = parseInt(String(numStr).replace(/\D/g, ""));
        return "Rp " + num.toLocaleString("id-ID");
    }

    function updateTotal() {
        let total = 0;
        let count = 0;
        document.querySelectorAll(".item-checkbox:checked").forEach((cb) => {
            const row = cb.closest("tr");
            if (row) {
                const subtotalEl = row.querySelector(".subtotal");
                if (subtotalEl) {
                    total += parseInt(subtotalEl.dataset.raw) || 0;
                }
                // Hitung jumlah item berdasarkan kuantitas
                const qtySpan = row.querySelector('.quantity-value');
                if (qtySpan) {
                     count += parseInt(qtySpan.textContent) || 0;
                }
            }
        });

        itemCount.textContent = count;
        totalPriceEl.textContent = formatRupiah(total.toString());
        checkoutBtn.disabled = count === 0;
    }

    function renderCart(cartItems) {
        localCartState = cartItems;
        cartTable.innerHTML = "";

        if (!cartItems || cartItems.length === 0) {
            cartTable.innerHTML = '<tr><td colspan="6" style="text-align:center; padding: 20px;">Keranjang Anda kosong.</td></tr>';
            updateTotal();
            return;
        }

        cartItems.forEach((item) => {
            const hargaSatuan = parseInt(String(item.price).replace(/\D/g, ''));
            const subtotalRaw = hargaSatuan * item.quantity;
            const row = document.createElement("tr");
            row.dataset.itemId = item.productId;

            // Struktur <td> ini sudah disesuaikan dengan <th> di HTML Anda
            row.innerHTML = `
                <td><input type="checkbox" class="item-checkbox" data-item-id="${item.productId}" /></td>
                <td>
                    <div class="product-info">
                        <img src="${item.image}" alt="${item.name}" class="product-image" />
                        <div>
                            <p class="product-name"><strong>${item.name}</strong></p>
                            <small class="product-store">Toko: ${item.store || 'N/A'}</small>
                        </div>
                    </div>
                </td>
                <td>${formatRupiah(item.price)}</td>
                <td>
                    <div class="quantity-controls">
                        <button class="qty-btn" data-action="decrease" data-item-id="${item.productId}">-</button>
                        <span class="quantity-value">${item.quantity}</span>
                        <button class="qty-btn" data-action="increase" data-item-id="${item.productId}">+</button>
                    </div>
                </td>
                <td class="subtotal" data-raw="${subtotalRaw}">${formatRupiah(subtotalRaw.toString())}</td>
                <td><a href="#" class="remove-item-btn" data-item-id="${item.productId}">Hapus</a></td>
            `;
            cartTable.appendChild(row);
        });
        
        attachCartActionListeners();
        updateTotal();
    }

    // --- FUNGSI AKSI & EVENT LISTENER ---
    async function handleQtyChange(productId, delta) {
        const item = localCartState.find(i => i.productId.toString() === productId);
        if (item) {
            const newQuantity = item.quantity + delta;
            if (newQuantity > 0) {
                await updateItemAPI(productId, newQuantity);
                initializeCart(); // Muat ulang seluruh keranjang dari server
            }
        }
    }

    async function handleRemoveItem(productId) {
        if (confirm("Anda yakin ingin menghapus produk ini dari keranjang?")) {
            await removeItemAPI(productId);
            initializeCart(); // Muat ulang seluruh keranjang
        }
    }

    function attachCartActionListeners() {
        document.querySelectorAll('.qty-btn').forEach(button => {
            button.addEventListener('click', function() { handleQtyChange(this.dataset.itemId, this.dataset.action === 'increase' ? 1 : -1); });
        });
        document.querySelectorAll('.remove-item-btn').forEach(button => {
            button.addEventListener('click', function(e) { e.preventDefault(); handleRemoveItem(this.dataset.itemId); });
        });
        document.querySelectorAll(".item-checkbox").forEach(cb => {
            cb.addEventListener('change', updateTotal);
        });
    }

    selectAllTop.addEventListener("change", () => {
        const isChecked = selectAllTop.checked;
        document.querySelectorAll(".item-checkbox").forEach(cb => cb.checked = isChecked);
        selectAllBottom.checked = isChecked;
        updateTotal();
    });
    
    selectAllBottom.addEventListener("change", () => {
        const isChecked = selectAllBottom.checked;
        document.querySelectorAll(".item-checkbox").forEach(cb => cb.checked = isChecked);
        selectAllTop.checked = isChecked;
        updateTotal();
    });

    checkoutBtn.addEventListener("click", () => {
        const selectedIds = [];
        document.querySelectorAll(".item-checkbox:checked").forEach((cb) => {
            selectedIds.push(cb.dataset.itemId);
        });

        if (selectedIds.length === 0) {
            alert("Pilih setidaknya satu produk untuk checkout.");
            return;
        }

        // Mengirim ID produk via parameter URL
        const idParams = selectedIds.join(',');
        window.location.href = `CheckOut.html?items=${idParams}`;
    });

    // --- INISIALISASI HALAMAN ---
    async function initializeCart() {
        if (!loggedInEmail) {
            cartTable.innerHTML = '<tr><td colspan="6" style="text-align:center; padding: 20px;">Silakan <a href="Login.html">login</a> untuk melihat keranjang Anda.</td></tr>';
            checkoutBtn.disabled = true;
            return;
        }
        cartTable.innerHTML = '<tr><td colspan="6" style="text-align:center; padding: 20px;">Memuat keranjang...</td></tr>';
        const cartData = await fetchCartAPI();
        renderCart(cartData);
    }

    // Panggil fungsi utama saat halaman dimuat
    initializeCart();
});