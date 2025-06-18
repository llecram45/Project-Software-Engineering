const request = require('supertest');
const fs = require('fs');
const path = require('path');
const app = require('./server');

const usersFile = path.join(__dirname, 'users.json');
const productsFile = path.join(__dirname, 'products.json');

// Helper untuk reset file JSON
const resetFile = (filePath, data = []) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

describe('Auth API', () => {
  beforeEach(() => resetFile(usersFile));

  describe('POST /register', () => {
    it('berhasil register user baru', async () => {
      const res = await request(app).post('/register').send({
        email: 'test@example.com',
        username: 'TestUser',
        phone: '08123456789',
        password: 'password123'
      });

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toMatch(/berhasil/i);
    });

    it('gagal register jika field kosong', async () => {
      const res = await request(app).post('/register').send({
        email: '',
        username: '',
        phone: '',
        password: ''
      });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toMatch(/harus diisi/i);
    });
  });

  describe('POST /login', () => {
    beforeEach(() => {
      const users = [{
        email: 'login@example.com',
        username: 'LoginUser',
        phone: '08123456789',
        password: 'rahasia'
      }];
      resetFile(usersFile, users);
    });

    it('berhasil login dengan data benar', async () => {
      const res = await request(app).post('/login').send({
        email: 'login@example.com',
        password: 'rahasia'
      });

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toMatch(/login berhasil/i);
    });

    it('gagal login dengan password salah', async () => {
      const res = await request(app).post('/login').send({
        email: 'login@example.com',
        password: 'salah'
      });

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toMatch(/password salah/i);
    });

    it('gagal login jika email tidak ditemukan', async () => {
      const res = await request(app).post('/login').send({
        email: 'gaada@example.com',
        password: 'apaaja'
      });

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toMatch(/tidak terdaftar/i);
    });
  });
});

describe('Produk API', () => {
  beforeEach(() => resetFile(productsFile));

  describe('POST /products', () => {
    it('berhasil tambah produk baru', async () => {
      const res = await request(app).post('/products').send({
        name: 'Produk Baru',
        price: 15000,
        desc: 'Deskripsi produk',
        image: 'data:image/png;base64,xyz'
      });

      expect(res.statusCode).toBe(201);
      expect(res.body.name).toBe('Produk Baru');
    });
  });
});