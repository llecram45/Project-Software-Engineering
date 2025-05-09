const modal = document.getElementById('uploadModal');
const openBtn = document.createElement('div');
openBtn.className = 'product-card';
openBtn.innerHTML = '<div style="font-size: 24px; padding-top: 40px;">➕</div><p>Tambah Produk</p>';
openBtn.onclick = () => modal.style.display = 'block';

const productContainer = document.getElementById('productContainer');
const form = document.getElementById('uploadForm');
const closeBtn = document.getElementById('closeModalBtn');
const notification = document.getElementById('notification');
const loading = document.getElementById('loading');

let products = JSON.parse(localStorage.getItem('products')) || [];

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
    productContainer.appendChild(card);
  });

  productContainer.appendChild(openBtn);
}

form.onsubmit = function (e) {
  e.preventDefault();
  loading.style.display = 'block';

  const name = document.getElementById('productName').value;
  const price = document.getElementById('productPrice').value;
  const imageInput = document.getElementById('productImage').files[0];

  if (imageInput) {
    // Validasi ukuran maksimal 1MB (1.048.576 bytes)
    if (imageInput.size > 1048576) {
      loading.style.display = 'none';
      notification.innerHTML = '❌ Ukuran gambar melebihi 1 MB!';
      notification.style.display = 'block';
      setTimeout(() => notification.style.display = 'none', 3000);
      return;
    }

    const reader = new FileReader();

    reader.onload = function () {
      const imageURL = reader.result;
      const product = { name, price, image: imageURL };
      products.push(product);
      localStorage.setItem('products', JSON.stringify(products));
      renderProducts();

      loading.style.display = 'none';
      modal.style.display = 'none';
      form.reset();

      notification.innerHTML = '✅ Produk berhasil ditambahkan!';
      notification.style.display = 'block';
      setTimeout(() => notification.style.display = 'none', 3000);
    };

    reader.readAsDataURL(imageInput);
  }
};


closeBtn.onclick = () => modal.style.display = 'none';
window.onclick = (e) => {
  if (e.target == modal) modal.style.display = 'none';
};

// Initial load
renderProducts();
