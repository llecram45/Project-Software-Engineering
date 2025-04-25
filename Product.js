document.addEventListener("DOMContentLoaded", function() {
    const filterForm = document.querySelector(".sidebar");
    const products = document.querySelectorAll(".product");

    function applyFilters() {
        let selectedLocations = Array.from(document.querySelectorAll(".sidebar input[type=checkbox]:checked"))
            .map(cb => cb.nextSibling.textContent.trim());
        let minPrice = document.querySelector(".sidebar input[placeholder='Rp Min']").value;
        let maxPrice = document.querySelector(".sidebar input[placeholder='Rp Max']").value;
        let minRating = document.querySelector(".stars").textContent.length; 

        products.forEach(product => {
            let productName = product.querySelector("p").textContent.toLowerCase();
            let productPrice = parseInt(product.querySelector("p:nth-of-type(2)").textContent.replace(/[^0-9]/g, ""));
            let productRating = parseFloat(product.querySelector("span").textContent.replace("⭐", ""));

            let matchesLocation = selectedLocations.length === 0 || selectedLocations.some(loc => productName.includes(loc.toLowerCase()));
            let matchesPrice = (!minPrice || productPrice >= parseInt(minPrice)) && (!maxPrice || productPrice <= parseInt(maxPrice));
            let matchesRating = productRating >= minRating;

            if (matchesLocation && matchesPrice && matchesRating) {
                product.style.display = "block";
            } else {
                product.style.display = "none";
            }
        });
    }

    filterForm.addEventListener("input", applyFilters);
});
