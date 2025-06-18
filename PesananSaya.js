document.addEventListener("DOMContentLoaded", function () {
    
    // --- Mengambil Elemen DOM ---
    const sidebarProfileImage = document.getElementById("sidebarProfileImage");
    const sidebarUsername = document.getElementById("sidebarUsername");
    const orderListContainer = document.getElementById("order-list-container"); // Menggunakan wadah baru
    const emptyStateDiv = document.querySelector(".empty-state");
    const searchInput = document.getElementById("searchInput");
    const tabs = document.querySelectorAll(".order-tabs .tab");
    const mainContent = document.querySelector("main .main-content");

    // --- State & Data ---
    const loggedInEmail = localStorage.getItem("loggedInEmail");
    let allFetchedOrders = []; // Cache untuk menyimpan pesanan dari server

    // --- Fungsi Helper ---
    function formatHargaRupiah(hargaStr) {
        if (typeof hargaStr === 'string' && hargaStr.startsWith('Rp')) return hargaStr;
        const angka = parseInt(String(hargaStr).replace(/\D/g, ''));
        return "Rp " + (isNaN(angka) ? 0 : angka.toLocaleString('id-ID'));
    }

    function formatTanggalIso(isoDateString) {
        if (!isoDateString) return "N/A";
        const date = new Date(isoDateString);
        return date.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    }

    // --- Fungsi Render ---
    function createOrderItemHTML(item) {
        return `
            <div class="order-item">
                <img src="${item.image || 'https://via.placeholder.com/60'}" alt="${item.name}" class="order-item-image">
                <div class="order-item-details">
                    <p class="item-name"><strong>${item.name || 'Nama Produk Tidak Tersedia'}</strong></p>
                    <p class="item-store">Toko: ${item.store || 'Tidak Diketahui'}</p>
                    <p class="item-quantity">Jumlah: ${item.quantity || 0}</p>
                </div>
                <p class="item-price">${formatHargaRupiah(item.price || '0')}</p>
            </div>
        `;
    }

    function createOrderCardHTML(order) {
        const itemsHTML = order.items && Array.isArray(order.items) ? order.items.map(createOrderItemHTML).join('') : '<p>Tidak ada item dalam pesanan ini.</p>';
        let actionButtonHTML = '';

        if (order.statusPesanan === "Belum Bayar") {
            actionButtonHTML = `<button class="btn-action btn-bayar" data-order-id="${order.idPesanan}">Bayar Sekarang</button>`;
        } else if (order.statusPesanan === "Dikirim") {
            actionButtonHTML = `<button class="btn-action btn-lacak" data-order-id="${order.idPesanan}">Lacak</button><button class="btn-action btn-diterima" data-order-id="${order.idPesanan}">Pesanan Diterima</button>`;
        } else if (order.statusPesanan === "Dikemas") {
            actionButtonHTML = `<button class="btn-action btn-info-pengiriman" data-order-id="${order.idPesanan}">Info Pengiriman</button>`;
        }
        actionButtonHTML += `<button class="btn-action btn-detail" data-order-id="${order.idPesanan}">Detail Pesanan</button>`;

        return `
            <div class="order-card" data-order-id="${order.idPesanan}">
                <div class="order-card-header">
                    <div>
                        <span class="order-id">ID Pesanan: ${order.idPesanan || 'N/A'}</span>
                        <span class="order-date">Tanggal: ${formatTanggalIso(order.tanggalPesanan)}</span>
                    </div>
                    <span class="order-status status-${(order.statusPesanan || 'status-tidak-diketahui').toLowerCase().replace(/\s+/g, '-')}">${order.statusPesanan || 'Status Tidak Diketahui'}</span>
                </div>
                <div class="order-card-body">${itemsHTML}</div>
                <div class="order-card-summary">
                    <p>Jasa Kirim: <strong>${order.jasaKirim || 'N/A'}</strong></p>
                    <p>Metode Bayar: <strong>${order.metodePembayaranDetail || 'N/A'}</strong></p>
                    <p>Total Pesanan: <strong class="total-harga-pesanan">${formatHargaRupiah(order.totalHargaKeseluruhan || '0')}</strong></p>
                </div>
                <div class="order-card-actions">${actionButtonHTML}</div>
            </div>
        `;
    }
    
    // --- FUNGSI UTAMA: MENGAMBIL DAN MENAMPILKAN PESANAN ---
    async function loadAndDisplayOrders(statusFilter = "Semua", searchTerm = "") {
        if (!loggedInEmail) return;

        orderListContainer.innerHTML = '<p style="text-align:center;">Memuat pesanan...</p>';
        emptyStateDiv.style.display = 'none';

        try {
            // Selalu fetch dari awal agar data fresh, cache sederhana bisa diimplementasikan nanti
            const response = await fetch(`http://localhost:3000/pesanan/${loggedInEmail}`);
            if (!response.ok) throw new Error(`Gagal mengambil pesanan (Status: ${response.status})`);
            allFetchedOrders = await response.json();

            // Filter berdasarkan status
            let filteredByStatus = (statusFilter === "Semua")
                ? allFetchedOrders
                : allFetchedOrders.filter(order => (order.statusPesanan || "").toLowerCase() === statusFilter.toLowerCase());

            // Filter berdasarkan pencarian
            let ordersToDisplay = searchTerm
                ? filteredByStatus.filter(order => {
                    const lowerSearchTerm = searchTerm.toLowerCase();
                    const matchId = (order.idPesanan || "").toLowerCase().includes(lowerSearchTerm);
                    const matchProduct = order.items?.some(item => (item.name || "").toLowerCase().includes(lowerSearchTerm));
                    return matchId || matchProduct;
                  })
                : filteredByStatus;

            // Logika render yang jauh lebih sederhana dan aman
            if (ordersToDisplay.length > 0) {
                orderListContainer.innerHTML = ordersToDisplay.map(createOrderCardHTML).join('');
            } else {
                orderListContainer.innerHTML = ''; // Kosongkan jika tidak ada hasil
                emptyStateDiv.querySelector("p").textContent = `Belum ada pesanan di tab "${statusFilter}".`;
                emptyStateDiv.style.display = 'block';
            }

        } catch (error) {
            console.error("Error memuat pesanan:", error);
            orderListContainer.innerHTML = `<p style="text-align:center; color: red;">Terjadi kesalahan saat memuat pesanan.</p>`;
        }
    }

    // --- INISIALISASI HALAMAN & EVENT LISTENERS ---
    
    // Inisialisasi Profil Sidebar
    const userProfile = JSON.parse(localStorage.getItem("userProfile")) || {};
    if (loggedInEmail && userProfile.username) {
        if (sidebarUsername) sidebarUsername.textContent = userProfile.username;
        if (sidebarProfileImage) sidebarProfileImage.src = userProfile.image || 'https://via.placeholder.com/80';
    } else {
        if (sidebarUsername) sidebarUsername.textContent = "Tamu";
    }

    // Event Listeners untuk Tab
    tabs.forEach((tab) => {
        tab.addEventListener("click", function (e) {
            e.preventDefault();
            tabs.forEach((t) => t.classList.remove("active"));
            this.classList.add("active");
            const statusFilter = this.dataset.status;
            if (searchInput) searchInput.value = "";
            loadAndDisplayOrders(statusFilter, "");
        });
    });

    // Event Listener untuk Pencarian (jika ada)
    if (searchInput) {
        let debounceTimer;
        searchInput.addEventListener('keyup', () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                const searchTerm = searchInput.value.trim();
                const activeTab = document.querySelector(".order-tabs .tab.active");
                const statusFilter = activeTab ? activeTab.dataset.status : "Semua";
                loadAndDisplayOrders(statusFilter, searchTerm);
            }, 500);
        });
    }
    
    // Event delegation untuk tombol-tombol aksi
    if (mainContent) {
        mainContent.addEventListener('click', function(event) {
            const target = event.target;
            if (target.classList.contains('btn-action')) {
                const orderId = target.dataset.orderId;
                if (target.classList.contains('btn-bayar')) {
                    alert(`Fungsionalitas pembayaran untuk pesanan ${orderId} belum diimplementasikan.`);
                } else if (target.classList.contains('btn-lacak')) {
                    alert(`Fungsionalitas pelacakan untuk pesanan ${orderId} belum diimplementasikan.`);
                } else if (target.classList.contains('btn-diterima')) {
                    if(confirm(`Anda yakin pesanan ${orderId} telah diterima?`)){
                        alert(`Fungsionalitas konfirmasi pesanan ${orderId} diterima belum diimplementasikan.`);
                    }
                } else if (target.classList.contains('btn-detail')) {
                    alert(`Fungsionalitas detail pesanan untuk ${orderId} belum diimplementasikan.`);
                } else if (target.classList.contains('btn-info-pengiriman')) {
                    alert(`Info pengiriman untuk pesanan ${orderId} belum diimplementasikan.`);
                }
            }
        });
    }

    // Panggil fungsi utama untuk memuat data saat halaman dibuka
    if(loggedInEmail) {
        loadAndDisplayOrders();
    } else {
        if(emptyStateDiv) {
            emptyStateDiv.querySelector('p').textContent = "Silakan login untuk melihat riwayat pesanan Anda.";
            emptyStateDiv.style.display = 'block';
        }
    }
});

// Fungsi searchSuggestions harus ada di scope global jika dipanggil dari `onkeyup` di HTML
function searchSuggestions() {
    const event = new Event('keyup');
    document.getElementById('searchInput').dispatchEvent(event);
}