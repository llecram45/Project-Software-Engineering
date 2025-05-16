const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();

const PORT = 3000;
const filePath = path.join(__dirname, 'products.json');
const uploadDir = path.join(__dirname, 'uploads');

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, '.')));
app.use('/uploads', express.static(uploadDir)); // Serve gambar yang diupload

// Pastikan folder 'uploads' ada
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Inisialisasi produk dari file
let products = [];

function loadProducts() {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      products = JSON.parse(data);
    }
  } catch (err) {
    console.error('❌ Gagal membaca file products.json:', err);
    products = [];
  }
}

function saveProducts() {
  try {
    fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
  } catch (err) {
    console.error('❌ Gagal menyimpan ke products.json:', err);
  }
}

loadProducts();

// Endpoint: Ambil semua produk
app.get('/products', (req, res) => {
  res.json(products);
});

// Endpoint: Tambahkan produk baru
app.post('/products', (req, res) => {
  const { name, price, image, desc } = req.body; // Tambahkan desc

  if (!name || !price || !image) {
    return res.status(400).send('❌ Data produk tidak lengkap.');
  }

  const matches = image.match(/^data:image\/(\w+);base64,(.+)$/);
  if (!matches) {
    return res.status(400).send('❌ Format gambar tidak valid.');
  }

  const ext = matches[1];
  const base64Data = matches[2];
  const filename = `img-${Date.now()}.${ext}`;
  const filepath = path.join(uploadDir, filename);

  try {
    fs.writeFileSync(filepath, base64Data, 'base64');

    const newProduct = {
      id: Date.now().toString(),
      name,
      price,
      desc: desc || '', // Simpan deskripsi (bisa kosong)
      image: `/uploads/${filename}`
    };

    products.push(newProduct);
    saveProducts();
    res.status(201).json(newProduct);
  } catch (err) {
    console.error('❌ Gagal menyimpan gambar:', err);
    res.status(500).send('❌ Gagal menyimpan gambar.');
  }
});

// Mulai server
app.listen(PORT, () => {
  console.log(`✅ Server berjalan di http://localhost:${PORT}`);
});
