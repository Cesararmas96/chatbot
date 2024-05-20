function toggleChatbot() {
    console.log(window.innerWidth);
    const container = document.querySelector("#chatbot-container");
    container.classList.toggle("chatbot-container-closed");

    
}

document.addEventListener("DOMContentLoaded", function () {
    const head = document.querySelector("head");
    const link = document.createElement("link");
    const link2 = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "http://localhost:5173/embed2/style.css"; 
    link2.rel  = "stylesheet";
    link2.href = "https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css";

    head.appendChild(link);
    head.appendChild(link2);
    
    const chatBotContainer = document.createElement("div");
    chatBotContainer.id = "chatbot-container";
    chatBotContainer.classList.add("fixed", "flex", "flex-col" ,"bottom-0", "right-0", "w-full", "max-w-xs", "bg-white", "rounded-xl", "shadow-lg", "chatbot-container-closed");

    // Crear el contenedor de mensajes del chat
    const messagesContainer = document.createElement("div");
    messagesContainer.id = "messages-container";
    messagesContainer.classList.add( "space-y-2", "overflow-y-auto", "h-full", "border-b");
   
    // Crear el div del chat
    const chatBox = document.createElement("div");
    chatBox.id = "chat-box";
    chatBox.classList.add("p-4", "flex", "items-center", "space-x-2", "mt-auto" );


    const chatInput = document.createElement("input");
    chatInput.type = "text";
    chatInput.id = "chat-input";
    chatInput.placeholder = "Send a message...";
    chatInput.classList.add("flex-grow", "border", "rounded-lg", "px-3", "py-2", "text-gray-800", 'text-sm');

    const chatButton = document.createElement("button");
    chatButton.classList.add(
        'p-2',
        'ml-2',
        'bg-red-400',
        'text-sm',
        'bg-pink-500',
        'text-white',
        'rounded-lg',
        'hover:bg-pink-600',
        'focus:outline-none',
        'focus:ring-2',
        'focus:ring-gray-200',
       
    );
    chatButton.id = "chat-button";
    chatButton.textContent = "Send";

    chatBox.appendChild(chatInput);
    chatBox.appendChild(chatButton);
    chatBotContainer.appendChild(messagesContainer);
    chatBotContainer.appendChild(chatBox);

    document.body.appendChild(chatBotContainer);
    
    // Crear y agregar el botón del chatbot
    const chatBotFab = document.createElement("button");
    chatBotFab.id = "chatbot-fab";


    // Añadir icono al botón del chatbot
    const chatBotFabIcon = document.createElement("img");
    chatBotFabIcon.src = "http://localhost:5173/troc.png"; // URL de la imagen del icono
    chatBotFabIcon.id = "chatbot-picture";
    chatBotFabIcon.classList.add("w-6", "h-6");
    chatBotFab.appendChild(chatBotFabIcon);

    chatBotFab.addEventListener("click", toggleChatbot);
    document.body.appendChild(chatBotFab);

    // Mostrar el botón del chatbot (chatbot-fab) siempre
    chatBotFab.classList.remove("button-hidden");

    // Manejar el envío de mensajes
    chatButton.addEventListener("click", function() {
        const messageText = chatInput.value.trim();
        if (messageText) {
            const messageElement = document.createElement("div");
            messageElement.textContent = messageText;
            messageElement.classList.add("bg-blue-100", 'text-sm', 'm-2', 'w-5/6' ,"p-2", "rounded-lg", "self-end");
            messagesContainer.appendChild(messageElement);
            chatInput.value = "";
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    });

    // Permitir envío de mensajes con Enter
    chatInput.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            chatButton.click();
        }
    });
});
