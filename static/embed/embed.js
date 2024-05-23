let llm = ConfigBot.Llm !== undefined ? `&llm=${ConfigBot.Llm}` : '';

const Url =  `${ConfigBot.BotLink}?botName=${ConfigBot.BotName}${llm}&apiKey=${ConfigBot.ApiKey}`;
function toggleChatbot() {
    if (window.innerWidth < 768) {
        return window.open(Url, "_blank");
    }
    const container = document.querySelector("#chatbot-container");
    container.classList.toggle("chatbot-container-closed");
}

document.addEventListener("DOMContentLoaded", function () {
    const head = document.querySelector("head");
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://navai.trocdigital.net/embed/style.css";
    head.appendChild(link);

    const chatBotContainer = document.createElement("div");
    chatBotContainer.id = "chatbot-container";
    chatBotContainer.classList.add("chatbot-container-closed");

    chatBotName = ConfigBot.BotName;
    const chatBotIframe = document.createElement("iframe");
    chatBotIframe.src = Url;

    chatBotIframe.id = "chatbot-iframe";
    chatBotContainer.appendChild(chatBotIframe);


    document.body.appendChild(chatBotContainer);

    const chatBotFab = document.createElement("button");
    chatBotFab.id = "chatbot-fab";
    chatBotFab.classList.add("button-hidden");

    const chatBotFabIcon = document.createElement("img");
    chatBotFabIcon.src = ConfigBot.Logo;
    
    chatBotFabIcon.id = "chatbot-picture";
    chatBotFab.appendChild(chatBotFabIcon);

    chatBotFab.addEventListener("click", toggleChatbot);
    document.body.appendChild(chatBotFab);

    chatBotFab.classList.remove("button-hidden");


});
