# Gunakan base image Node.js yang resmi.
# Pilih versi Node.js yang sesuai dengan proyekmu.
FROM node:22-alpine

# Tentukan direktori kerja di dalam container.
WORKDIR /usr/src/app

# Salin package.json dan package-lock.json (jika ada) ke direktori kerja.
COPY package*.json ./

# Instal dependensi proyek.
RUN npm install

# Salin semua file proyek ke direktori kerja.
COPY . .

# Expose port yang digunakan oleh server.js (misalnya 3000).
# Ganti 3000 jika server.js kamu berjalan di port lain.
EXPOSE 3000

# Perintah untuk menjalankan aplikasi saat container dimulai.
CMD [ "node", "server.js" ]