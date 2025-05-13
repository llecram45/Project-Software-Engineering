document.getElementById("formAlamat").addEventListener("submit", function (e) {
  e.preventDefault();

  const formElements = e.target.elements;
  const alamatData = {
    nama: formElements[0].value,
    telepon: formElements[1].value,
    lokasi: formElements[2].value,
    jalan: formElements[3].value,
    detail: formElements[4].value,
  };

  localStorage.setItem("alamatUser", JSON.stringify(alamatData));

  window.location.href = "Alamat.html";
});

