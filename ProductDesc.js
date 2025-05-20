document.addEventListener("DOMContentLoaded", () => {
  const product = JSON.parse(localStorage.getItem("selectedProduct"));

  if (!product) {
    document.body.innerHTML = "<p>Produk tidak ditemukan.</p>";
    return;
  }

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

  productImage.src = product.image;
  productImage.alt = product.name;
  productName.textContent = product.name;

  const hargaNumber = parseInt(product.price.toString().replace(/\D/g, ""));
  productPrice.textContent = `Rp ${hargaNumber.toLocaleString("id-ID")}`;

  productRating.textContent = `${product.rating} ★`;
  productDescription.textContent = product.description;

  qtyInput.value = 1;
  qtyInput.min = 1;

  // Tombol "-" untuk kuantitas
  minusBtn.addEventListener("click", () => {
    let currentQty = parseInt(qtyInput.value);
    if (currentQty > 1) qtyInput.value = currentQty - 1;
  });

  // Tombol "+" untuk kuantitas
  plusBtn.addEventListener("click", () => {
    let currentQty = parseInt(qtyInput.value);
    qtyInput.value = currentQty + 1;
  });

  // Tombol "Add to Cart"
  addToCartBtn.addEventListener("click", () => {
    const quantity = parseInt(qtyInput.value);
    if (quantity < 1) {
      alert("Jumlah harus minimal 1.");
      return;
    }

    const productToAdd = {
      ...product,
      price: `Rp ${hargaNumber.toLocaleString("id-ID")}`, // simpan harga terformat
      quantity,
      store: "Kreativa"
    };

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingIndex = cart.findIndex(item => item.id === product.id);

    if (existingIndex !== -1) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push(productToAdd);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${product.name} (${quantity}) berhasil ditambahkan ke keranjang!`);
  });

  // Tombol "Buy Now"
  buyNowBtn.addEventListener("click", () => {
    const quantity = parseInt(qtyInput.value);
    if (quantity < 1) {
      alert("Jumlah harus minimal 1.");
      return;
    }

    const productToBuy = {
      ...product,
      price: `Rp ${hargaNumber.toLocaleString("id-ID")}`,
      quantity,
      store: "Kreativa"
    };

    localStorage.setItem("selectedProduct", JSON.stringify(productToBuy));
    localStorage.removeItem("checkoutItems");

    window.location.href = "CheckOut.html";
  });
});
