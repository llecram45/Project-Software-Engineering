// JasaAlamat.js - KODE LENGKAP
document.addEventListener("DOMContentLoaded", () => {
    const userProfile = JSON.parse(localStorage.getItem("userProfile")) || {};
    const loggedInEmail = localStorage.getItem("loggedInEmail");

    const sidebarUsername = document.getElementById("sidebarUsername");
    const sidebarProfileImage = document.getElementById("sidebarProfileImage");
    if (sidebarUsername) sidebarUsername.textContent = userProfile.username || "Anonim";
    if (sidebarProfileImage) sidebarProfileImage.src = userProfile.image || "https://via.placeholder.com/80";

    const form = document.getElementById("addressForm");
    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            const submitButton = form.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            submitButton.textContent = 'Menyimpan...';

            const namaToko = document.getElementById("storeName").value.trim();
            const jalan = document.getElementById("storeAddress").value.trim();
            const kota = document.getElementById("city").value.trim();
            const provinsi = document.getElementById("province").value.trim();
            const kodePos = document.getElementById("postalCode").value.trim();

            if (!namaToko || !jalan || !kota || !provinsi || !kodePos) {
                alert("Harap lengkapi semua data alamat toko.");
                submitButton.disabled = false;
                submitButton.textContent = 'Simpan & Lanjut';
                return;
            }

            const jasaChecked = Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value);

            if (jasaChecked.length === 0) {
                alert("Pilih minimal satu jasa pengiriman.");
                submitButton.disabled = false;
                submitButton.textContent = 'Simpan & Lanjut';
                return;
            }

            const storeProfileData = {
                name: namaToko,
                address: {
                    street: jalan,
                    city: kota,
                    province: provinsi,
                    postalCode: kodePos
                },
                shippingServices: jasaChecked
            };
            
            try {
                const response = await fetch(`http://localhost:3000/api/users/${loggedInEmail}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ storeProfile: storeProfileData })
                });

                if (!response.ok) throw new Error('Gagal menyimpan informasi toko.');

                // Update localStorage agar InfoToko.js bisa langsung membacanya
                const updatedProfile = { ...userProfile, storeProfile: storeProfileData };
                localStorage.setItem('userProfile', JSON.stringify(updatedProfile));

                alert("Data alamat & jasa kirim berhasil disimpan.");
                window.location.href = "InfoToko.html";

            } catch(error) {
                alert(`Terjadi kesalahan: ${error.message}`);
                submitButton.disabled = false;
                submitButton.textContent = 'Simpan & Lanjut';
            }
        });
    }
});

function handleBack() {
    window.history.back();
}