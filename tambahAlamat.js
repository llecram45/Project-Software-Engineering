// tambahAlamat.js - KODE LENGKAP
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formAlamat");
    const loggedInEmail = localStorage.getItem("loggedInEmail");

    if (!loggedInEmail) {
        alert("Sesi Anda telah berakhir. Silakan login kembali.");
        window.location.href = "Login.html";
        return;
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const submitButton = form.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = 'Menyimpan...';

        const inputs = form.querySelectorAll("input");
        const nama = inputs[0].value.trim();
        const telepon = inputs[1].value.trim();
        const lokasi = inputs[2].value.trim();
        const jalan = inputs[3].value.trim();
        const detail = inputs[4].value.trim();

        if (!nama || !telepon || !lokasi || !jalan) {
            alert("Mohon lengkapi semua kolom alamat.");
            submitButton.disabled = false;
            submitButton.textContent = 'Simpan';
            return;
        }

        const alamatBaru = { userEmail: loggedInEmail, nama, telepon, lokasi, jalan, detail };

        // DIUBAH: Kirim data ke server
        try {
            const response = await fetch("http://localhost:3000/api/addresses", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(alamatBaru),
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || "Gagal menyimpan alamat di server.");
            }

            alert("Alamat baru berhasil disimpan!");
            window.location.href = "Alamat.html";

        } catch (error) {
            console.error("Error saat menyimpan alamat:", error);
            alert(`Terjadi kesalahan: ${error.message}`);
            submitButton.disabled = false;
            submitButton.textContent = 'Simpan';
        }
    });
});