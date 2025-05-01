function searchSuggestions() {
    const input = document.getElementById('searchInput');
    const suggestionsBox = document.getElementById('suggestions');
    if (input.value.length > 0) {
      suggestionsBox.style.display = 'block';
      suggestionsBox.innerHTML = `<div>Hasil untuk "${input.value}"</div>`;
    } else {
      suggestionsBox.style.display = 'none';
    }
  }  