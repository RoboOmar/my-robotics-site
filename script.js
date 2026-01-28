document.addEventListener('DOMContentLoaded', () => {
    const chatBox = document.getElementById('chat-box');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');

    // Bot Responses
    const responses = {
        "humanoid": "Humanoid robots are robots designed to look and act like humans. Famous examples include Ameca, Atlas, and Optimus.",
        "industrial": "Industrial robots are used in factories for tasks like welding, painting, and assembly. They are strong, precise, and tireless.",
        "ameca": "Ameca is known as the world's most advanced humanoid robot for human-robot interaction.",
        "atlas": "Atlas is a bipedal humanoid robot developed by Boston Dynamics, capable of parkour and gymnastics.",
        "optimus": "Tesla Optimus is a general-purpose humanoid robot designed to perform unsafe or boring tasks.",
        "future": "The future of robotics involves more collaboration between humans and robots (Cobots), and smarter AI integration.",
        "hello": "Hello! Ask me anything about robots.",
        "hi": "Hi there! Curious about robotics?",
        "who are you": "I am the Robots World AI chatbot, designed to answer your questions about our website content.",
        "default": "I'm not sure about that. Try asking about 'humanoid robots', 'industrial robots', or specific examples like 'Ameca' or 'Atlas'."
    };

    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('chat-message', `${sender}-message`);
        messageDiv.innerText = text;
        chatBox.appendChild(messageDiv);
        messageDiv.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }

    function getBotResponse(input) {
        input = input.toLowerCase();
        for (const key in responses) {
            if (input.includes(key)) {
                return responses[key];
            }
        }
        return responses["default"];
    }

    function handleChat() {
        const text = userInput.value.trim();
        if (text === "") return;

        addMessage(text, 'user');
        userInput.value = "";

        setTimeout(() => {
            const botResponse = getBotResponse(text);
            addMessage(botResponse, 'bot');
        }, 500);
    }

    sendBtn.addEventListener('click', handleChat);

    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleChat();
        }
    });
});
