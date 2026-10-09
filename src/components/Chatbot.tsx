import React, { useState, useEffect, useRef, type JSX } from "react";
import { Link } from "react-router";

interface Message {
  id: number;
  sender: "user" | "bot";
  text: React.ReactNode;
}

export default function Chatbot(): JSX.Element {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "bot",
      text: "¡Hola! Soy Vida 🌱. ¿En qué puedo ayudarte hoy con tu nutrición o agendamiento?",
    },
  ]);

  const chatBodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages, isTyping, isOpen]);

  const toggleChat = () => setIsOpen(!isOpen);

  const generateBotResponse = (userInput: string): React.ReactNode => {
    const normalizedInput = userInput
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    if (/(precio|valor|cuesta|cobran|pagar|plan)/i.test(normalizedInput)) {
      return (
        <>
          Nuestros planes van desde los <strong>$45.000</strong> (Plan
          Deportivo) hasta planes integrales con controles quincenales. Puedes
          ver el detalle en nuestra{" "}
          <Link to="/metodologia" onClick={() => setIsOpen(false)}>
            sección de Servicios
          </Link>
          .
        </>
      );
    }

    if (
      /(donde|ubicacion|direccion|temuco|santiago|ciudad|region|telemedicina|online)/i.test(
        normalizedInput,
      )
    ) {
      return "Nuestra clínica presencial está ubicada en Temuco. Sin embargo, si eres de otra región, contamos con un excelente sistema de Telemedicina 100% online con la misma rigurosidad clínica.";
    }

    if (/(hora|agendar|cita|reserva|turno|evaluacion)/i.test(normalizedInput)) {
      return "Para agendar tu evaluación inicial, puedes dejar tus datos en el formulario de la página principal, o registrarte directamente en el Portal del Paciente.";
    }

    if (
      /(dieta|peso|engordar|adelgazar|grasa|musculo|ansiedad|ayuno)/i.test(
        normalizedInput,
      )
    ) {
      return "En NutriVida no usamos dietas restrictivas. Realizamos un escáner InBody para conocer tu composición corporal y diseñamos una pauta que se ajuste a tu metabolismo basal y estilo de vida.";
    }

    if (
      /(hola|buenas|buenos dias|buenas tardes|que tal|saludos)/i.test(
        normalizedInput,
      )
    ) {
      return "¡Hola! ¿Cómo estás? Dime, ¿buscas información sobre agendamiento, precios o cómo funciona nuestra metodología?";
    }

    if (
      /(quien eres|eres un bot|ia|humano|inteligencia artificial)/i.test(
        normalizedInput,
      )
    ) {
      return "Soy Vida, el asistente virtual de NutriVida. Fui diseñada para ayudarte a resolver dudas rápidas sobre la clínica. ¡Aunque no soy humana, conozco muy bien nuestros planes!";
    }

    return "Entiendo. Como asistente virtual aún estoy aprendiendo algunas cosas. ¿Te gustaría dejarle un mensaje a nuestro equipo a través del formulario de contacto?";
  };

  const handleChatSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newUserMessage: Message = {
      id: Date.now(),
      sender: "user",
      text: inputValue,
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInputValue("");
    setIsTyping(true);

    const typingDelay = Math.floor(Math.random() * 700) + 800;

    setTimeout(() => {
      const responseText = generateBotResponse(newUserMessage.text as string);

      const newBotMessage: Message = {
        id: Date.now() + 1,
        sender: "bot",
        text: responseText,
      };

      setMessages((prev) => [...prev, newBotMessage]);
      setIsTyping(false);
    }, typingDelay);
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        zIndex: 1050,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
      }}
    >
      <div
        className={`bg-white shadow-lg rounded-4 overflow-hidden transition-all ${isOpen ? "d-flex" : "d-none"}`}
        style={{
          width: "calc(100vw - 40px)",
          maxWidth: "350px",
          height: "calc(100vh - 120px)",
          maxHeight: "450px",
          flexDirection: "column",
          marginBottom: "15px",
        }}
      >
        <div className="bg-success text-white p-3 d-flex justify-content-between align-items-center shadow-sm">
          <div className="d-flex align-items-center gap-2">
            <div
              className="bg-white text-success rounded-circle d-flex justify-content-center align-items-center fw-bold"
              style={{ width: "32px", height: "32px" }}
            >
              V
            </div>
            <div>
              <span className="fw-bold d-block lh-1">Vida</span>
              <small className="opacity-75" style={{ fontSize: "0.75rem" }}>
                Asistente Virtual
              </small>
            </div>
          </div>
          <button
            className="btn-close btn-close-white"
            onClick={toggleChat}
            aria-label="Cerrar"
          ></button>
        </div>

        <div
          className="p-3 flex-grow-1 bg-light d-flex flex-column gap-2"
          style={{ overflowY: "auto" }}
          ref={chatBodyRef}
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-2 rounded-3 shadow-sm small border ${
                msg.sender === "bot"
                  ? "bg-white align-self-start"
                  : "bg-success text-white border-success align-self-end"
              }`}
              style={{ maxWidth: "85%", wordWrap: "break-word" }}
            >
              {msg.text}
            </div>
          ))}

          {isTyping && (
            <div
              className="bg-white p-2 rounded-3 shadow-sm small border align-self-start d-flex align-items-center gap-1"
              style={{ width: "fit-content" }}
            >
              <span
                className="spinner-grow spinner-grow-sm text-success opacity-50"
                style={{ width: "0.4rem", height: "0.4rem" }}
                role="status"
              ></span>
              <span
                className="spinner-grow spinner-grow-sm text-success opacity-75"
                style={{
                  width: "0.4rem",
                  height: "0.4rem",
                  animationDelay: "0.2s",
                }}
                role="status"
              ></span>
              <span
                className="spinner-grow spinner-grow-sm text-success"
                style={{
                  width: "0.4rem",
                  height: "0.4rem",
                  animationDelay: "0.4s",
                }}
                role="status"
              ></span>
            </div>
          )}
        </div>

        <div className="p-3 border-top bg-white">
          <form className="d-flex gap-2 m-0" onSubmit={handleChatSubmit}>
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Escribe tu mensaje..."
              autoComplete="off"
              value={inputValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setInputValue(e.target.value)
              }
              disabled={isTyping}
            />
            <button
              type="submit"
              className="btn btn-success btn-sm fw-bold px-3"
              disabled={isTyping || !inputValue.trim()}
            >
              Enviar
            </button>
          </form>
        </div>
      </div>

      <button
        className="btn btn-success rounded-circle shadow-lg d-flex justify-content-center align-items-center border-0"
        onClick={toggleChat}
        aria-label={isOpen ? "Cerrar chat" : "Abrir chat"}
        style={{
          width: "60px",
          height: "60px",
          transition: "transform 0.2s ease-in-out",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        <span className="fs-3" style={{ lineHeight: 1 }}>
          {isOpen ? "✖" : "💬"}
        </span>
      </button>
    </div>
  );
}
