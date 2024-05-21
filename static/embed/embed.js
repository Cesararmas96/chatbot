function toggleChatbot() {
    console.log(window.innerWidth);
    if (window.innerWidth < 768) {
        return window.open(Troc.BotURL, "_blank");
    }
    const container = document.querySelector("#chatbot-container");
    container.classList.toggle("chatbot-container-closed");
}

document.addEventListener("DOMContentLoaded", function () {
    const head = document.querySelector("head");
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "http://localhost:5173/embed/style.css";
    head.appendChild(link);

    const chatBotContainer = document.createElement("div");
    chatBotContainer.id = "chatbot-container";
    chatBotContainer.classList.add("chatbot-container-closed");

    chatBotName = Troc.NameBot;
    console.log(chatBotName)
    const chatBotIframe = document.createElement("iframe");
    chatBotIframe.src = `${Troc.BotURL}?nameBot=${encodeURIComponent(chatBotName)}`;

    chatBotIframe.id = "chatbot-iframe";
    chatBotContainer.appendChild(chatBotIframe);


    document.body.appendChild(chatBotContainer);

    // Crear y agregar el botón del chatbot
    const chatBotFab = document.createElement("button");
    chatBotFab.id = "chatbot-fab";
    chatBotFab.classList.add("button-hidden");

    // Añadir icono al botón del chatbot
    const chatBotFabIcon = document.createElement("img");
    chatBotFabIcon.src = Troc.Logo; // URL de la imagen del icono
    
    chatBotFabIcon.id = "chatbot-picture";
    chatBotFab.appendChild(chatBotFabIcon);

    chatBotFab.addEventListener("click", toggleChatbot);
    document.body.appendChild(chatBotFab);

    // Mostrar el botón del chatbot (chatbot-fab) siempre
    chatBotFab.classList.remove("button-hidden");
});
