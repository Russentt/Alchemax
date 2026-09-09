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
   chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const message = chatInput.value.trim();
  if (!message) return;

  const userDiv = document.createElement('div');
  userDiv.className = 'chat-message user-message p-2 rounded-3 mb-2 w-75 small';
  userDiv.textContent = message;
  chatBody.appendChild(userDiv);
  
  chatInput.value = '';
  chatBody.scrollTop = chatBody.scrollHeight;

  const botDiv = document.createElement('div');
  botDiv.className = 'chat-message bot-message bg-light p-2 rounded-3 mb-2 w-75 small';
  botDiv.innerHTML = `<strong>Vida:</strong> <em>Pensando...</em>`;
  chatBody.appendChild(botDiv);
  chatBody.scrollTop = chatBody.scrollHeight;

  try {
     const apiKey = '__GEMINI_API_KEY__';
     const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
   const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Eres Vida, un asistente virtual experto de la clínica nutricional NutriVida en Temuco. Responde de forma amable, concisa y profesional a esta duda del paciente: "${message}"`
          }]
        }]
      })
    });

    const data = await response.json();
    const botReply = data.candidates[0].content.parts[0].text;

    botDiv.innerHTML = `<strong>Vida:</strong> ${botReply}`;
  } catch (error) {
    botDiv.innerHTML = `<strong>Vida:</strong> Disculpa, en este momento tengo problemas de conexión, pero recuerda que puedes agendar tu cita en el sitio. 🍎`;
  }
  
  chatBody.scrollTop = chatBody.scrollHeight;
});
  }
});
