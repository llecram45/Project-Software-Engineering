const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(express.static(path.join(__dirname, '.')));

const filePath = path.join(__dirname, 'products.json');

let products = [];

// Load produk dari file JSON saat server start
function loadProducts() {
  if (fs.existsSync(filePath)) {
    try {
      const data = fs.readFileSync(filePath, 'utf8');
      products = JSON.parse(data);
    } catch (err) {
      console.error('❌ Gagal membaca file products.json:', err);
      products = [];
    }
  }
}

// Simpan produk ke file JSON
function saveProducts() {
  try {
    fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
  } catch (err) {
    console.error('❌ Gagal menyimpan ke products.json:', err);
  }
}

loadProducts();

app.get('/products', (req, res) => {
  res.json(products);
});

app.post('/products', (req, res) => {
  const product = req.body;
  if (!product.name || !product.price || !product.image) {
    return res.status(400).send('Data produk tidak lengkap');
  }
  products.push(product);
  saveProducts();
  res.status(201).send('Produk ditambahkan');
});

app.listen(3000, () => {
  console.log('✅ Server berjalan di http://localhost:3000');
});