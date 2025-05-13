document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("cardsContainer");
  const data = localStorage.getItem("kartuUser");

  if (data) {
    const kartu = JSON.parse(data);

    container.classList.remove("cards-empty");
    container.innerHTML = `
      <div class="card-box">
        <p><strong>Nama di Kartu:</strong> ${kartu.nama}</p>
        <p><strong>Alamat Tagihan:</strong> ${kartu.alamat}</p>
        <p><strong>Kode Pos:</strong> ${kartu.kodepos}</p>
      </div>
    `;
  } else {
    container.innerHTML = `<p>You don’t have cards yet.</p>`;
  }
});

function handleAddCards() {
  window.location.href = "tambahKartu.html";
}
