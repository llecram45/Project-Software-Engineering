// chat.js

// Fungsi untuk toggle popup
function toggleChatPopup() {
  const popup = document.getElementById('chat-popup');
  if (popup) {
    popup.style.display = (popup.style.display === 'none' || popup.style.display === '') ? 'block' : 'none';
  }
}

// Muat chat.html ke Home.html
document.addEventListener('DOMContentLoaded', () => {
  fetch('chat.html')
    .then(res => res.text())
    .then(html => {
      const wrapper = document.createElement('div');
      wrapper.innerHTML = html;
      document.body.appendChild(wrapper);

      // Tambahkan event untuk tombol close
      const closeBtn = document.getElementById('close-chat');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => {
          document.getElementById('chat-popup').style.display = 'none';
        });
      }
    });

  // Tambahkan stylesheet chat.css
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'chat.css';
  document.head.appendChild(link);
});

