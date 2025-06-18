const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Konfigurasi koneksi MongoDB
const MONGO_URI = "mongodb://localhost:27017";
const DB_NAME = "CustomifyDB"; // Pastikan nama ini sudah benar
const client = new MongoClient(MONGO_URI);

// Variabel untuk menampung koneksi ke collection
let productsCollection, usersCollection, kartuCollection, pesananCollection, cartCollection, addressCollection;

// Direktori untuk upload gambar
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Penting untuk menerima data gambar
app.use(express.static(path.join(__dirname, '.')));
app.use('/uploads', express.static(uploadDir));

app.get('/', (req, res) => {
    res.redirect('/Login.html');
});

// --- ENDPOINTS API ---

// =================================
// Produk
// =================================
app.get('/products', async (req, res) => {
    try {
        const products = await productsCollection.find({}).toArray();
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: '❌ Gagal mengambil data produk.' });
    }
});

app.get('/api/products/:id', async (req, res) => {
    try {
        const id = req.params.id;
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'ID produk tidak valid.' });
        }
        const product = await productsCollection.findOne({ _id: new ObjectId(id) });
        if (!product) {
            return res.status(404).json({ message: 'Produk tidak ditemukan.' });
        }
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: '❌ Gagal mengambil detail produk.' });
    }
});

// Endpoint untuk mengambil detail beberapa produk berdasarkan array of IDs
app.post('/api/products/by-ids', async (req, res) => {
    try {
        const { ids } = req.body;
        if (!ids || !Array.isArray(ids)) {
            return res.status(400).json({ message: 'Input IDs tidak valid.' });
        }
        // Ubah string IDs menjadi ObjectId
        const objectIds = ids.map(id => new ObjectId(id));
        
        const products = await productsCollection.find({ _id: { $in: objectIds } }).toArray();
        res.json(products);
    } catch (err) {
        console.error("Error fetching products by IDs:", err);
        res.status(500).json({ message: 'Gagal mengambil data produk.' });
    }
});

app.post('/products', async (req, res) => {
    const { name, price, image, desc } = req.body;
    if (!name || !price || !image) return res.status(400).send('❌ Data produk tidak lengkap.');

    const matches = image.match(/^data:image\/(\w+);base64,(.+)$/);
    if (!matches) return res.status(400).send('❌ Format gambar tidak valid.');
    
    const ext = matches[1];
    const base64Data = matches[2];
    const filename = `img-${Date.now()}.${ext}`;
    const filepath = path.join(uploadDir, filename);

    try {
        fs.writeFileSync(filepath, base64Data, 'base64');
        
        const newProduct = { name, price, desc: desc || '', image: `/uploads/${filename}` };
        const result = await productsCollection.insertOne(newProduct);
        res.status(201).json({ ...newProduct, _id: result.insertedId });
    } catch (err) {
        console.error('❌ Gagal menyimpan produk:', err);
        res.status(500).send('❌ Gagal menyimpan produk.');
    }
});

// =================================
// Register & Login
// =================================
app.post('/register', async (req, res) => {
    const { email, username, phone, password } = req.body;
    if (!email || !username || !phone || !password)
        return res.status(400).json({ message: '❌ Semua field harus diisi.' });

    try {
        const existingUser = await usersCollection.findOne({ email: email });
        if (existingUser)
            return res.status(400).json({ message: '❌ Email sudah digunakan.' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = { email, username, phone, password: hashedPassword, image: '', isSeller: false };
        await usersCollection.insertOne(newUser);
        res.status(201).json({ message: '✅ Akun berhasil dibuat!' });
    } catch (err) {
        res.status(500).send('❌ Terjadi kesalahan pada server.');
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await usersCollection.findOne({ email: email });
        if (!user)
            return res.status(401).json({ success: false, message: '❌ Email atau password salah.' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(401).json({ success: false, message: '❌ Email atau password salah.' });
        
        const { password: _, ...userData } = user;
        res.status(200).json({ success: true, message: '✅ Login berhasil!', user: userData });
    } catch (err) {
        res.status(500).send('❌ Terjadi kesalahan pada server.');
    }
});

// =================================
// User Profile
// =================================
app.get('/api/users/:email', async (req, res) => {
    const email = req.params.email;
    try {
        const user = await usersCollection.findOne({ email: email }, { projection: { password: 0 } });
        if (!user) return res.status(404).json({ message: '❌ Pengguna tidak ditemukan.' });
        res.json(user);
    } catch (err) {
        res.status(500).send('❌ Terjadi kesalahan pada server.');
    }
});

app.put('/api/users/:email', async (req, res) => {
    const email = req.params.email;
    const { password, ...updatedData } = req.body;

    try {
        const result = await usersCollection.updateOne({ email: email }, { $set: updatedData });
        if (result.matchedCount === 0) return res.status(404).json({ message: '❌ Pengguna tidak ditemukan.' });
        
        const updatedUser = await usersCollection.findOne({ email: email }, { projection: { password: 0 } });
        res.json({ message: '✅ Profil berhasil diperbarui.', user: updatedUser });
    } catch (err) {
        res.status(500).send('❌ Terjadi kesalahan pada server.');
    }
});

// =================================
// Kartu Pembayaran
// =================================
app.post('/api/cards', async (req, res) => {
    const { userEmail, nomorKartu, masaBerlaku, cvv, namaKartu, alamat, kodePos } = req.body;
    if (!userEmail || !nomorKartu || !masaBerlaku || !cvv || !namaKartu || !alamat || !kodePos) {
        return res.status(400).json({ message: '❌ Data kartu tidak lengkap.' });
    }
    
    const kartuBaru = { userEmail, nomorKartu, masaBerlaku, cvv, namaKartu, alamat, kodePos, createdAt: new Date() };
    try {
        const result = await kartuCollection.insertOne(kartuBaru);
        res.status(201).json({ message: '✅ Kartu berhasil ditambahkan.', card: { ...kartuBaru, _id: result.insertedId } });
    } catch (err) {
        res.status(500).send('❌ Gagal menambah kartu.');
    }
});

app.get('/kartu/:email', async (req, res) => {
    const email = req.params.email;
    try {
        const userCards = await kartuCollection.find({ userEmail: email }).toArray();
        if (!userCards || userCards.length === 0) {
            return res.status(404).json([]);
        }
        res.json(userCards);
    } catch (err) {
        res.status(500).send('❌ Gagal mengambil data kartu.');
    }
});

app.delete("/kartu/:id", async (req, res) => {
    const cardId = req.params.id;
    if (!ObjectId.isValid(cardId)) return res.status(400).json({ message: "ID Kartu tidak valid." });

    try {
        const result = await kartuCollection.deleteOne({ _id: new ObjectId(cardId) });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Kartu tidak ditemukan" });
        }
        res.json({ message: "Kartu berhasil dihapus" });
    } catch (err) {
        res.status(500).send('❌ Gagal menghapus kartu.');
    }
});

// =================================
// Keranjang Belanja
// =================================
app.get('/api/cart/:email', async (req, res) => {
    try {
        const email = req.params.email;
        const cart = await cartCollection.findOne({ userEmail: email });
        if (!cart) {
            return res.json({ userEmail: email, items: [] });
        }
        res.json(cart);
    } catch (err) {
        res.status(500).json({ message: 'Gagal mengambil keranjang.' });
    }
});

app.post('/api/cart/:email/items', async (req, res) => {
    const email = req.params.email;
    const { productId, quantity } = req.body;

    if (!ObjectId.isValid(productId)) {
        return res.status(400).json({ message: 'Product ID tidak valid' });
    }

    try {
        const product = await productsCollection.findOne({ _id: new ObjectId(productId) });
        if (!product) return res.status(404).json({ message: 'Produk tidak ditemukan.' });

        const cart = await cartCollection.findOne({ userEmail: email });
        const cartItem = {
            productId: new ObjectId(product._id),
            name: product.name,
            price: product.price,
            image: product.image,
            store: product.store || 'Kreativa',
            quantity: quantity
        };
        
        if (cart) {
            const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
            if (itemIndex > -1) {
                await cartCollection.updateOne(
                    { userEmail: email, "items.productId": new ObjectId(productId) },
                    { $set: { "items.$.quantity": quantity } }
                );
            } else {
                await cartCollection.updateOne({ userEmail: email }, { $push: { items: cartItem } });
            }
        } else {
            await cartCollection.insertOne({ userEmail: email, items: [cartItem], createdAt: new Date() });
        }
        res.status(200).json({ message: 'Keranjang berhasil diperbarui.' });
    } catch (err) {
        console.error("Error updating cart:", err);
        res.status(500).json({ message: 'Gagal memperbarui keranjang.' });
    }
});

app.delete('/api/cart/:email/items/:productId', async (req, res) => {
    const { email, productId } = req.params;
    if (!ObjectId.isValid(productId)) {
        return res.status(400).json({ message: 'Product ID tidak valid' });
    }
    try {
        await cartCollection.updateOne(
            { userEmail: email },
            { $pull: { items: { productId: new ObjectId(productId) } } }
        );
        res.status(200).json({ message: 'Item berhasil dihapus dari keranjang.' });
    } catch (err) {
        res.status(500).json({ message: 'Gagal menghapus item.' });
    }
});

// Endpoint untuk membersihkan beberapa item dari keranjang setelah checkout
app.post('/api/cart/:email/clear-items', async (req, res) => {
    const { email } = req.params;
    const { ids } = req.body; // Array of product IDs to remove

    if (!ids || !Array.isArray(ids)) {
        return res.status(400).json({ message: 'Input IDs tidak valid.' });
    }

    try {
        const objectIdsToRemove = ids.map(id => new ObjectId(id));
        await cartCollection.updateOne(
            { userEmail: email },
            { $pull: { items: { productId: { $in: objectIdsToRemove } } } }
        );
        res.status(200).json({ message: 'Item yang di-checkout berhasil dihapus dari keranjang.' });
    } catch (err) {
        console.error("Error clearing cart items:", err);
        res.status(500).json({ message: 'Gagal membersihkan keranjang.' });
    }
});

// =================================
// Alamat
// =================================
app.get('/api/addresses/:email', async (req, res) => {
    try {
        const addresses = await addressCollection.find({ userEmail: req.params.email }).toArray();
        res.json(addresses);
    } catch(err) {
        res.status(500).json({ message: 'Gagal mengambil alamat.' });
    }
});

app.post('/api/addresses', async (req, res) => {
    try {
        const newAddress = req.body;
        if (!newAddress.userEmail || !newAddress.nama || !newAddress.telepon || !newAddress.jalan) {
            return res.status(400).json({ message: 'Data alamat tidak lengkap.'});
        }
        const result = await addressCollection.insertOne(newAddress);
        res.status(201).json({ message: 'Alamat berhasil disimpan', _id: result.insertedId });
    } catch (err) {
        res.status(500).json({ message: 'Gagal menyimpan alamat.' });
    }
});

// =================================
// Pesanan
// =================================
app.post('/pesanan', async (req, res) => {
    const pesananBaru = req.body;
    if (!pesananBaru || !pesananBaru.idPesanan || !pesananBaru.emailPengguna || !pesananBaru.items) {
        return res.status(400).json({ message: 'Data pesanan tidak lengkap.' });
    }
    try {
        const result = await pesananCollection.insertOne(pesananBaru);
        res.status(201).json({ message: 'Pesanan berhasil disimpan.', data: { ...pesananBaru, _id: result.insertedId } });
    } catch (error) {
        console.error("Gagal menyimpan pesanan:", error);
        res.status(500).json({ message: 'Gagal menyimpan pesanan di server.' });
    }
});

app.get('/pesanan/:email', async (req, res) => {
    const emailPengguna = req.params.email;
    try {
        const pesananMilikPengguna = await pesananCollection
            .find({ emailPengguna: emailPengguna })
            .sort({ tanggalPesanan: -1 })
            .toArray();
        res.json(pesananMilikPengguna);
    } catch (error) {
        console.error("Gagal mengambil pesanan:", error);
        res.status(500).json({ message: 'Gagal mengambil data pesanan dari server.' });
    }
});

// =================================
// Fungsi untuk Menjalankan Server
// =================================
async function startServer() {
    try {
        // Log debugging untuk memastikan target koneksi sudah benar
        console.log("\n--- LAPORAN KONEKSI SERVER ---");
        console.log("TARGET URI:", MONGO_URI);
        console.log("TARGET DB:", DB_NAME);
        console.log("------------------------------\n");

        await client.connect();
        console.log("✅ Terhubung ke database MongoDB!");
        
        const db = client.db(DB_NAME);
        
        // Hubungkan semua variabel collection ke collection di database
        productsCollection = db.collection('products');
        usersCollection = db.collection('users');
        kartuCollection = db.collection('cards');
        pesananCollection = db.collection('orders');
        cartCollection = db.collection('carts');
        addressCollection = db.collection('addresses');

        // Jalankan server Express setelah koneksi DB berhasil
        app.listen(PORT, () => {
            console.log(`✅ Server berjalan di http://localhost:${PORT}/Login.html`);
        });

    } catch (err) {
        console.error("❌ Gagal terhubung ke database", err);
        process.exit(1);
    }
}

startServer();

module.exports = app;