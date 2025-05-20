document.addEventListener("DOMContentLoaded", () => {
  const chatBtn = document.getElementById("chat-product");
  const chatPopup = document.getElementById("chatPopup");
  const closeBtn = document.querySelector(".close-btn");

  // Elemen DOM
  const shopImg = document.querySelector(".shop-img");
  const shopName = document.querySelector(".shop-info h4");
  const shopStatus = document.querySelector(".shop-info .status");
  const productImg = document.querySelector(".product-preview img");
  const productName = document.querySelector(".prod-name");
  const productPrice = document.querySelector(".prod-price");

  const inputText = document.querySelector(".chat-input-area input[type='text']");
  const inputFile = document.getElementById("uploadImage");
  const sendBtn = document.querySelector(".chat-input-area button");
  const chatContainer = document.getElementById("chatMessages");

  // Buka popup & isi data
  chatBtn.addEventListener("click", () => {
    const product = JSON.parse(localStorage.getItem("selectedProduct"));
    if (!product) return;

    // Ganti foto profil toko (pastikan kamu punya gambar, gunakan default jika tidak)
    shopImg.src = "/path/to/toko-profile.png"; // Ganti dengan file real atau default
    shopName.textContent = product.store || "Toko Kreativa";
    shopStatus.textContent = "Online 1 menit lalu";

    productImg.src = product.image;
    productName.textContent = product.name;
    productPrice.textContent = product.price;

    chatPopup.style.display = "flex";
  });

  closeBtn.addEventListener("click", () => {
    chatPopup.style.display = "none";
  });

  // Kirim pesan (teks atau gambar)
  sendBtn.addEventListener("click", () => {
    const text = inputText.value.trim();
    const file = inputFile.files[0];

    if (!text && !file) return;

    const bubble = document.createElement("div");
    bubble.className = "chat-bubble user";

    if (file) {
      const img = document.createElement("img");
      img.className = "chat-image";
      img.src = URL.createObjectURL(file);
      bubble.appendChild(img);
      inputFile.value = ""; // Reset file input
    }

    if (text) {
      const p = document.createElement("p");
      p.textContent = text;
      bubble.appendChild(p);
    }

    chatContainer.appendChild(bubble);
    inputText.value = "";
    chatContainer.scrollTop = chatContainer.scrollHeight;
  });
});
