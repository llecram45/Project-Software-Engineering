document.addEventListener("DOMContentLoaded", () => {
    const savedProfile = JSON.parse(localStorage.getItem("userProfile")) || {};
    const loginData = JSON.parse(localStorage.getItem("loginData")) || {};

    // Pre-fill form fields
    document.getElementById("email").value = loginData.email || "";
    document.getElementById("password").value = loginData.password || "";
    document.getElementById("username").value = savedProfile.username || "";
    document.getElementById("nama").value = savedProfile.nama || "";
    document.getElementById("tanggalLahir").value = savedProfile.tanggalLahir || "";

    // Gender
    if (savedProfile.gender) {
        const genderInput = document.querySelector(`input[name="gender"][value="${savedProfile.gender}"]`);
        if (genderInput) genderInput.checked = true;
    }

    // Profile image
    if (savedProfile.image) {
        document.getElementById("previewImage").src = savedProfile.image;
        document.getElementById("sidebarProfileImage").src = savedProfile.image;
    }

    // Sidebar username
    document.getElementById("sidebarUsername").textContent = savedProfile.username || "Anonim";

    // Upload image
    document.getElementById("profileImage").addEventListener("change", function (e) {
        const file = e.target.files[0];
        if (file && file.size < 1024 * 1024) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const imageData = e.target.result;
                document.getElementById("previewImage").src = imageData;
                document.getElementById("sidebarProfileImage").src = imageData;
                savedProfile.image = imageData;
            };
            reader.readAsDataURL(file);
        } else {
            alert("Ukuran file terlalu besar! Maksimum 1MB.");
            e.target.value = ""; 
        }
    });

    // Submit form
    document.getElementById("profileForm").addEventListener("submit", function (e) {
        e.preventDefault();

        // Simpan ke userProfile
        savedProfile.username = document.getElementById("username").value;
        savedProfile.nama = document.getElementById("nama").value;
        savedProfile.gender = document.querySelector('input[name="gender"]:checked')?.value || "";
        savedProfile.tanggalLahir = document.getElementById("tanggalLahir").value;
        savedProfile.image = document.getElementById("previewImage").src;

        localStorage.setItem("userProfile", JSON.stringify(savedProfile));

        // Simpan ke loginData juga kalau password/email diubah
        loginData.email = document.getElementById("email").value;
        loginData.password = document.getElementById("password").value;
        localStorage.setItem("loginData", JSON.stringify(loginData));

        // Update sidebar
        document.getElementById("sidebarUsername").textContent = savedProfile.username;

        alert("Profil berhasil disimpan!");
    });
});
