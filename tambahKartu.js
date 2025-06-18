// tambahKartu.js - KODE LENGKAP
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("cardForm");
    const nomorInput = document.getElementById("nomorKartu");
    const masaInput = document.getElementById("masaBerlaku");
    const loggedInEmail = localStorage.getItem("loggedInEmail");

    if (!loggedInEmail) {
        alert("❌ Anda harus login untuk menambahkan kartu.");
        window.location.href = "Login.html";
        return;
    }

    // Format nomor kartu: spasi tiap 4 digit
    nomorInput.addEventListener("input", (e) => {
        let value = e.target.value.replace(/\D/g, "").slice(0, 16);
        value = value.replace(/(.{4})/g, "$1 ").trim();
        e.target.value = value;
    });

    // Format masa berlaku: MM/YY
    masaInput.addEventListener("input", (e) => {
        let value = e.target.value.replace(/\D/g, "").slice(0, 4);
        if (value.length >= 3) {
            value = value.slice(0, 2) + "/" + value.slice(2);
        }
        e.target.value = value;
    });

    // Submit form
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const submitButton = form.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = 'Menyimpan...';

        // DIUBAH: Payload tidak lagi berisi ID atau email
        const cardData = {
            nomorKartu: nomorInput.value.replace(/\s/g, ""),    // simpan tanpa spasi
            masaBerlaku: masaInput.value.replace("/", ""),       // simpan tanpa '/'
            cvv: document.getElementById("cvv").value,
            namaKartu: document.getElementById("namaKartu").value,
            alamat: document.getElementById("alamat").value,
            kodePos: document.getElementById("kodePos").value,
            userEmail: loggedInEmail // Kirim email user untuk asosiasi di backend
        };

        try {
            // DIUBAH: Endpoint menjadi /api/cards
            const response = await fetch("http://localhost:3000/api/cards", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(cardData)
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || "Gagal menambahkan kartu.");
            }
            
            alert("✅ Kartu berhasil ditambahkan!");
            window.location.href = "Kartu.html";

        } catch (err) {
            console.error("❌ Gagal simpan kartu:", err);
            alert(`❌ Gagal menyimpan kartu: ${err.message}`);
            submitButton.disabled = false;
            submitButton.textContent = 'Simpan Kartu';
        }
    });
});