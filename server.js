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
      desc: desc || '',
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

// ---------- USER REGISTER ----------
const usersFile = path.join(__dirname, 'users.json');

// Pastikan file users.json ada
if (!fs.existsSync(usersFile)) {
  fs.writeFileSync(usersFile, '[]');
}

app.post('/register', (req, res) => {
  const { email, username, phone, password } = req.body;

  if (!email || !username || !phone || !password) {
    return res.status(400).json({ message: '❌ Semua field harus diisi.' });
  }

  const users = JSON.parse(fs.readFileSync(usersFile, 'utf8'));

  // Cek apakah email sudah terdaftar
  const existingUser = users.find(user => user.email === email);
  if (existingUser) {
    return res.status(400).json({ message: '❌ Email sudah digunakan.' });
  }

  users.push({ email, username, phone, password });

  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
  res.status(200).json({ message: '✅ Akun berhasil dibuat!' });
});

// ---------- USER LOGIN ----------
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: '❌ Email dan password harus diisi.' });
  }

  const users = JSON.parse(fs.readFileSync(usersFile, 'utf8'));

  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(401).json({ success: false, message: '❌ Email tidak terdaftar.' });
  }

  if (user.password !== password) {
    return res.status(401).json({ success: false, message: '❌ Password salah.' });
  }

  return res.status(200).json({ success: true, message: '✅ Login berhasil!' });
});

// ---------- CART HANDLING ----------
const cartFile = path.join(__dirname, 'cart.json');

// Pastikan file cart.json ada
if (!fs.existsSync(cartFile)) {
  fs.writeFileSync(cartFile, '[]');
}

// Endpoint: Tambahkan item ke cart
app.post('/cart', (req, res) => {
  const { id, name, price, image, quantity } = req.body;

  if (!id || !name || !price || !image || !quantity) {
    return res.status(400).json({ message: '❌ Data cart tidak lengkap.' });
  }

  let cart = [];
  try {
    cart = JSON.parse(fs.readFileSync(cartFile, 'utf8'));
  } catch (err) {
    console.error('❌ Gagal membaca cart.json:', err);
  }

  const existingIndex = cart.findIndex(item => item.id === id);
  if (existingIndex !== -1) {
    cart[existingIndex].quantity += quantity;
  } else {
    cart.push({ id, name, price, image, quantity });
  }

  try {
    fs.writeFileSync(cartFile, JSON.stringify(cart, null, 2));
    res.status(200).json({ message: '✅ Produk ditambahkan ke cart.' });
  } catch (err) {
    console.error('❌ Gagal menyimpan cart.json:', err);
    res.status(500).json({ message: '❌ Gagal menyimpan cart.' });
  }
});

// Endpoint: Ambil semua item dari cart
app.get('/cart', (req, res) => {
  try {
    const cart = JSON.parse(fs.readFileSync(cartFile, 'utf8'));
    res.json(cart);
  } catch (err) {
    console.error('❌ Gagal membaca cart.json:', err);
    res.status(500).json({ message: '❌ Gagal membaca cart.' });
  }
});

// Mulai server
app.listen(PORT, () => {
  console.log(`✅ Server berjalan di http://localhost:${PORT}`);
});
