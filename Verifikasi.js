// Verifikasi.js - KODE LENGKAP
document.addEventListener("DOMContentLoaded", () => {
    const userProfile = JSON.parse(localStorage.getItem("userProfile")) || {};
    const loggedInEmail = localStorage.getItem("loggedInEmail");

    const sidebarUsername = document.getElementById("sidebarUsername");
    const sidebarProfileImage = document.getElementById("sidebarProfileImage");

    if (sidebarUsername) {
        sidebarUsername.textContent = userProfile.username || "Pengguna";
    }
    if (sidebarProfileImage) {
        sidebarProfileImage.src = userProfile.image || "https://via.placeholder.com/80";
    }

    const form = document.getElementById("formVerifikasi");
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();

            const submitButton = form.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            submitButton.textContent = 'Mengunggah...';

            const verifNama = document.getElementById("nama").value.trim();
            const nik = document.getElementById("nik").value.trim();
            const fileInput = document.getElementById("fotoKTP");
            const syaratDisetujui = document.getElementById("syarat").checked;

            if (!verifNama || !nik || !syaratDisetujui || fileInput.files.length === 0) {
                alert("Silakan lengkapi semua data dan setujui syarat & ketentuan.");
                submitButton.disabled = false;
                submitButton.textContent = 'Verifikasi & Lanjut';
                return;
            }

            const file = fileInput.files[0];
            const reader = new FileReader();

            reader.onload = async () => {
                const fotoKTPBase64 = reader.result;

                const verificationData = {
                    namaLengkap: verifNama,
                    nik: nik,
                    ktpImage: fotoKTPBase64,
                    status: 'pending' // Status awal verifikasi
                };

                try {
                    const response = await fetch(`http://localhost:3000/api/users/${loggedInEmail}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ verification: verificationData })
                    });

                    if (!response.ok) throw new Error('Gagal mengirim data verifikasi ke server.');
                    
                    const updatedProfile = { ...userProfile, verification: verificationData };
                    localStorage.setItem("userProfile", JSON.stringify(updatedProfile));
                    
                    alert("Data verifikasi berhasil dikirim!");
                    window.location.href = "JasaAlamat.html"; // Arahkan ke halaman pengaturan toko

                } catch (error) {
                    alert(`Terjadi kesalahan: ${error.message}`);
                    submitButton.disabled = false;
                    submitButton.textContent = 'Verifikasi & Lanjut';
                }
            };

            reader.onerror = () => {
                alert("Gagal membaca file gambar.");
                submitButton.disabled = false;
                submitButton.textContent = 'Verifikasi & Lanjut';
            };

            reader.readAsDataURL(file);
        });
    }
});