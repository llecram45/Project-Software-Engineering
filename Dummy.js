const products = [
  {
    id: 1,
    name: "Magnet Kulkas",
    image: "asset customify/magnet kulkas.jpg",
    price: "Rp 30.000",
    rating: 4.7,
    description: "Desain nama atau karakter favoritmu jadi hiasan kulkas yang unik dan personal"
  },
  {
    id: 2,
    name: "Pin Peniti",
    image: "asset customify/pin badge.jpeg",
    price: "Rp 18.000",
    rating: 4.8,
    description: "Pin dengan desain karakter favoritmu, cocok untuk tas dan baju."
  },
  {
    id: 3,
    name: "Kustom Keyboards",
    image: "asset customify/keyboards.jpg",
    price: "Rp 780.000",
    rating: 4.9,
    description: "Rakit keyboard impianmu dengan kombinasi warna sesuai selera. Stylish dan personal!"
  },
  {
    id: 4,
    name: "Hippers",
    image: "asset customify/electronic hippers.jpg",
    price: "Rp 34.000",
    rating: 4.9,
    description: "Tampilkan karakter favoritmu dari anime dalam bentuk hippers lucu dan menggemaskan!"
  },
  {
    id: 5,
    name: "Buvet TV Kayu Jati",
    image: "asset customify/buvet tv jati.jpg",
    price: "Rp 5.670.000",
    rating: 5.0,
    description: "Desain simpel dan elegan, cocok untuk ruang tamu modern dengan sentuhan natural."
  },
  {
    id: 6,
    name: "Kursi Rotan",
    image: "asset customify/kursi rotan.jpg",
    price: "Rp 1.890.000",
    rating: 4.8,
    description: "Anyaman tangan dengan bahan rotan asli — nyaman dan estetis"
  },
  {
    id: 7,
    name: "Meja Kursi Lipat Piknik",
    image:  "asset customify/meja kursi lipat.jpg",
    price: "Rp 8.900.000",
    rating: 4.9,
    description: "Ringan tapi kuat — mudah dibawa dan cepat dipasang."
  },
  {
    id: 8,
    name: "Kalender Meja Kustom",
    image:  "asset customify/kalender.jpeg",
    price: "Rp 80.000",
    rating: 4.8,
    description: "Kalender dengan desain dan foto favoritmu untuk menemani hari-hari di kantor."
  },
  {
    id: 9,
    name: "Kustom Sablon Kaos",
    image:  "asset customify/SablonBaju.jpeg",
    price: "Rp 75.000",
    rating: 4.8,
    description: "Cocok untuk tim, organisasi, atau event — tampil kompak dengan kaos custom."
  },
  {
    id: 10,
    name: "Hoodie",
    image:  "asset customify/hoodie.jpg",
    price: "Rp 320.000",
    rating: 4.9,
    description: "Tetap hangat dan tampil beda dengan hoodie berdesain khusus sesuai selera"
  },
  {
    id: 11,
    name: "Mug Kustom",
    image:  "asset customify/custom mug.png",
    price: "Rp 35.000",
    rating: 4.8,
    description: "Hadiah spesial dengan sentuhan personal — mug bergambar foto atau nama"
  },
  {
    id: 12,
    name: "Varsity",
    image:  "asset customify/black varsity.jpg",
    price: "Rp 378.000",
    rating: 5.0,
    description: "Pas untuk seragam angkatan, kelas, atau tim olahraga kampus."
  },
];

const productGrid = document.getElementById("productGrid");

products.forEach(product => {
  const card = document.createElement("a");
  card.href = "ProductDesc.html";
  card.className = "product-card";
  card.dataset.id = product.id;

  const image = document.createElement("img");
  image.src = product.image;
  image.alt = product.name;

  const text = document.createElement("div");
  text.className = "product-text";
  text.innerHTML = `
    <p class="product-name">${product.name}</p>
    <p class="product-price">${product.price}</p>
    <p class="rating">⭐ <span>${product.rating}</span></p>
    <p class="desc">${product.description}</p>
  `;

  card.appendChild(image);
  card.appendChild(text);
  card.addEventListener("click", () => {
    localStorage.setItem("selectedProduct", JSON.stringify(product));
  });

  productGrid.appendChild(card);
});
