const formulario = document.querySelector(".formulario");
const modal = document.querySelector(".modal");
const span = document.querySelector(".close");

formulario.addEventListener("submit", (event) => {
  event.preventDefault();
  modal.style.display = "block";
  document.body.classList.add("modal-active");
});

span.onclick = function () {
  modal.style.display = "none";
  document.body.classList.remove("modal-active");
};

document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector("header");

  document.addEventListener("mousemove", (e) => {
    if (e.clientY <= 80 || header.contains(e.target)) {
      header.classList.add("nav-visible");
    } else {
      header.classList.remove("nav-visible");
    }
  });

  let lastScrollY = window.scrollY;
  window.addEventListener("scroll", () => {
    if (window.matchMedia("(hover: none)").matches) {
      if (window.scrollY < lastScrollY) {
        header.classList.add("nav-visible");
      } else if (window.scrollY > 80) {
        header.classList.remove("nav-visible");
      }
    }
    lastScrollY = window.scrollY;
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const chatToggle = document.getElementById('chatToggle');
  const chatWindow = document.getElementById('chatWindow');
  const chatClose = document.getElementById('chatClose');
  const chatForm = document.getElementById('chatForm');
  const chatInput = document.getElementById('chatInput');
  const chatBody = document.getElementById('chatBody');

  if (chatToggle && chatWindow && chatClose && chatForm && chatInput && chatBody) {
    
    chatToggle.addEventListener('click', () => {
      chatWindow.classList.toggle('d-none');
    });

    chatClose.addEventListener('click', () => {
      chatWindow.classList.add('d-none');
    });

    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const message = chatInput.value.trim();
      if (!message) return;

      const userDiv = document.createElement('div');
      userDiv.className = 'chat-message user-message p-2 rounded-3 mb-2 w-75 small';
      userDiv.textContent = message;
      chatBody.appendChild(userDiv);
      
      chatInput.value = '';
      chatBody.scrollTop = chatBody.scrollHeight;

      setTimeout(() => {
        const botDiv = document.createElement('div');
        botDiv.className = 'chat-message bot-message bg-light p-2 rounded-3 mb-2 w-75 small';
        botDiv.innerHTML = `<strong>Vida:</strong> Gracias por comunicarte. Para recibir una asesoría nutricional completa y acceder a nuestras pautas, te invito a registrarte en nuestro portal. 🍎`;
        
        chatBody.appendChild(botDiv);
        chatBody.scrollTop = chatBody.scrollHeight;
      }, 1200);
    });
  }
});
