document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get('id');

  if (!productId) {
    alert('ID produk tidak ditemukan di URL.');
    return;
  }

  try {
    const res = await fetch('http://localhost:3000/products');
    if (!res.ok) throw new Error('Gagal mengambil data produk dari server');

    const products = await res.json();
    const product = products.find(p => p.id === productId);

    if (!product) {
      alert('Produk tidak ditemukan.');
      return;
    }

    // Gambar
    document.getElementById('productImage').src = product.image;

    // Nama
    document.getElementById('productName').textContent = product.name;

    // Harga
    document.getElementById('productPrice').textContent = 'Rp ' + Number(product.price).toLocaleString('id-ID');

    // Rating
    document.getElementById('productRating').innerHTML = `⭐ ${product.rating ?? '4.9'} | ${product.sold ?? '0'} Sold`;

    // Variants
    const variantsContainer = document.getElementById('productVariants');
    variantsContainer.innerHTML = '';
    (product.variants || []).forEach(variant => {
      const button = document.createElement('button');
      button.textContent = variant;
      variantsContainer.appendChild(button);
    });

    // Quantity
    let quantity = 1;
    const qtySpan = document.getElementById('productQuantity');
    const minusBtn = document.getElementById('qtyMinus');
    const plusBtn = document.getElementById('qtyPlus');

    minusBtn.onclick = () => {
      if (quantity > 1) {
        quantity--;
        qtySpan.textContent = quantity;
      }
    };

    plusBtn.onclick = () => {
      quantity++;
      qtySpan.textContent = quantity;
    };

    // Deskripsi (gunakan <br> untuk baris baru)
    document.getElementById('productDesc').innerHTML = (product.desc || 'Deskripsi belum tersedia.').replace(/\n/g, '<br>');

  } catch (error) {
    console.error(error);
    alert('Terjadi kesalahan saat memuat produk.');
  }
});