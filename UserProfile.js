document.addEventListener("DOMContentLoaded", () => {
  const email = localStorage.getItem("loggedInEmail");
  if (!email) {
    alert("❌ Anda belum login.");
    window.location.href = "Login.html";
    return;
  }

  fetch(`http://localhost:3000/api/users/${email}`)
    .then(res => res.json())
    .then(user => {
      document.getElementById("email").value = user.email || "";
      document.getElementById("password").value = "********";
      document.getElementById("username").value = user.username || "";
      document.getElementById("nama").value = user.nama || "";
      document.getElementById("toko").value = user.toko || "";
      document.getElementById("tanggalLahir").value = user.tanggalLahir || "";

      if (user.gender) {
        const genderInput = document.querySelector(`input[name="gender"][value="${user.gender}"]`);
        if (genderInput) genderInput.checked = true;
      }

      if (user.image) {
        document.getElementById("previewImage").src = user.image;
        document.getElementById("sidebarProfileImage").src = user.image;
      }

      document.getElementById("sidebarUsername").textContent = user.username || "Anonim";
    })
    .catch(err => {
      console.error("Gagal mengambil data user:", err);
    });

  let profileImageBase64 = null;

  document.getElementById("profileImage").addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (file && file.size < 1024 * 1024) {
      const reader = new FileReader();
      reader.onload = function (e) {
        profileImageBase64 = e.target.result;
        document.getElementById("previewImage").src = profileImageBase64;
        document.getElementById("sidebarProfileImage").src = profileImageBase64;
      };
      reader.readAsDataURL(file);
    } else {
      alert("Ukuran file terlalu besar! Maksimum 1MB.");
      e.target.value = "";
    }
  });

  document.getElementById("profileForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const updatedProfile = {
        username: document.getElementById("username").value,
        nama: document.getElementById("nama").value,
        gender: document.querySelector('input[name="gender"]:checked')?.value || "",
        tanggalLahir: document.getElementById("tanggalLahir").value,
        image: profileImageBase64 || document.getElementById("previewImage").src
    };

    const passwordInput = document.getElementById("password").value;
    if (passwordInput) updatedProfile.password = passwordInput;


    fetch(`http://localhost:3000/api/users/${email}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedProfile)
    })
    .then(res => res.json())
    .then(data => {
      alert("✅ Profil berhasil diperbarui.");
      document.getElementById("sidebarUsername").textContent = updatedProfile.username;

      localStorage.setItem("userProfile", JSON.stringify({
      username: updatedProfile.username,
      image: updatedProfile.image
     }));
    })
    .catch(err => {
      console.error("❌ Gagal memperbarui profil:", err);
      alert("❌ Gagal memperbarui profil.");
    });
  });
});