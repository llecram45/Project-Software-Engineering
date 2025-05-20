const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
const cartTable = document.getElementById("cartItems");
const itemCount = document.getElementById("itemCount");
const totalPriceEl = document.getElementById("totalPrice");
const selectAllTop = document.getElementById("selectAll");
const selectAllBottom = document.getElementById("selectAllBottom");
const checkoutBtn = document.getElementById("checkoutBtn");

function formatRupiah(numStr) {
  const num = parseInt(numStr.replace(/\D/g, ""));
  return "Rp " + num.toLocaleString("id-ID");
}

function updateTotal() {
  let total = 0;
  let count = 0;
  document.querySelectorAll(".item-checkbox:checked").forEach((cb) => {
    const row = cb.closest("tr");
    const subtotal = parseInt(row.querySelector(".subtotal").dataset.raw);
    total += subtotal;
    count++;
  });

  itemCount.textContent = count;
  totalPriceEl.textContent = "Rp " + total.toLocaleString("id-ID");
}

function renderCart() {
  cartTable.innerHTML = "";

  const groupedByStore = {};
  cartItems.forEach((item, index) => {
    const storeName = item.store || "Toko Tidak Dikenal";
    if (!groupedByStore[storeName]) {
      groupedByStore[storeName] = [];
    }
    groupedByStore[storeName].push({ item, index });
  });

  for (const storeName in groupedByStore) {
    const storeRow = document.createElement("tr");
    storeRow.innerHTML = `
      <td colspan="6" style="font-weight: bold; font-size: 18px; background: #f0f0f0;">
        Toko: ${storeName}
      </td>
    `;
    cartTable.appendChild(storeRow);

    groupedByStore[storeName].forEach(({ item, index }) => {
      const subtotalRaw = parseInt(item.price.replace(/\D/g, '')) * item.quantity;

      const row = document.createElement("tr");
      row.innerHTML = `
        <td><input type="checkbox" class="item-checkbox" /></td>
        <td>
          <div style="display:flex; gap:10px; align-items:center;">
            <img src="${item.image}" alt="${item.name}" />
            <div>
              <strong>${item.name}</strong><br/>
              <small>${item.description}</small>
            </div>
          </div>
        </td>
        <td>${item.price}</td>
        <td>
          <button onclick="updateQty(${index}, -1)">-</button>
          <span style="margin: 0 5px;">${item.quantity}</span>
          <button onclick="updateQty(${index}, 1)">+</button>
        </td>
        <td class="subtotal" data-raw="${subtotalRaw}">
          ${formatRupiah(subtotalRaw.toString())}
        </td>
        <td><a href="#" onclick="removeItem(${index})">Hapus produk</a></td>
      `;
      cartTable.appendChild(row);
    });
  }
}

function updateQty(index, delta) {
  cartItems[index].quantity += delta;
  if (cartItems[index].quantity < 1) cartItems[index].quantity = 1;
  localStorage.setItem("cart", JSON.stringify(cartItems));
  renderCart();
  updateTotal();
}

function removeItem(index) {
  cartItems.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cartItems));
  renderCart();
  updateTotal();
}

selectAllTop.addEventListener("change", () => {
  const check = selectAllTop.checked;
  document.querySelectorAll(".item-checkbox").forEach(cb => cb.checked = check);
  selectAllBottom.checked = check;
  updateTotal();
});

selectAllBottom.addEventListener("change", () => {
  const check = selectAllBottom.checked;
  document.querySelectorAll(".item-checkbox").forEach(cb => cb.checked = check);
  selectAllTop.checked = check;
  updateTotal();
});

document.addEventListener("change", function (e) {
  if (e.target.classList.contains("item-checkbox")) {
    updateTotal();
  }
});

checkoutBtn.addEventListener("click", () => {
  const selectedItems = [];

  const checkboxes = document.querySelectorAll(".item-checkbox:checked");
  checkboxes.forEach((cb) => {
    const row = cb.closest("tr");
    const name = row.querySelector("strong").textContent;
    const description = row.querySelector("small").textContent;
    const image = row.querySelector("img").src;
    const price = row.children[2].textContent;
    const quantity = parseInt(row.children[3].querySelector("span").textContent);

    let pointer = row;
    let store = "Toko Tidak Dikenal";
    while (pointer && !pointer.textContent.includes("Toko:")) {
      pointer = pointer.previousElementSibling;
    }
    if (pointer && pointer.textContent.includes("Toko:")) {
      store = pointer.textContent.replace("Toko: ", "").trim();
    }

    const index = [...document.querySelectorAll(".item-checkbox")].indexOf(cb);
    const id = cartItems[index]?.id || Date.now();

    selectedItems.push({ id, name, description, image, price, quantity, store });
  });

  if (selectedItems.length === 0) {
    alert("Pilih setidaknya satu produk untuk checkout.");
    return;
  }

  localStorage.setItem("checkoutItems", JSON.stringify(selectedItems));
  localStorage.removeItem("selectedProduct");
  window.location.href = "CheckOut.html";
});

renderCart();
updateTotal();
