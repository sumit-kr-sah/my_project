// Function to check if the extension is enabled
function checkExtensionStatus(callback) {
    chrome.storage.local.get('extensionEnabled', (data) => {
        callback(data.extensionEnabled || false);
    });
}


checkExtensionStatus((isEnabled) => {
    if (isEnabled) {



const API_KEY = "AIzaSyB374Nsm-mbCwtZS5V0fvR9efQAOll9s9s"; // Use secure storage
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

// Add styles to the document
const style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = `
    * { 
    margin: 0; 
    padding: 0; 
    box-sizing: border-box; 
    font-family: Arial, sans-serif; 
}

body { 
    background-color: #f4f5f7; 
    display: flex; 
    justify-content: center; 
    align-items: center; 
    height: 100vh; 
    color: #333; 
}

/* Chatbot popup styles */
.chatbot-popup { 
    background: #fff;
    Overflow-y: scroll; 
    width: 400px; 
    height: 500px; 
    box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.15); 
    border-radius: 15px; 
    display: flex; 
    flex-direction: column; 
    overflow: hidden; 
    position: fixed; 
    bottom: 20px; 
    right: 20px; 
    z-index: 1000; 
    transition: transform 0.3s ease, opacity 0.3s ease; 
}

.chatbot-popup.hidden {
    transform: translateY(100%);
    opacity: 0;
}

.chat-header { 
    background: linear-gradient(135deg, #05445e, #2575fc); 
    padding: 20px; 
    display: flex; 
    justify-content: space-between; 
    align-items: center; 
    color: #fff; 
    font-weight: bold;
    font-size: 18px;
    border-bottom: 2px solid #05445e; /* Adds a subtle separation line */
}

.chat-header button { 
    background: transparent; 
    border: none; 
    color: #fff; 
    font-size: 20px; 
    cursor: pointer; 
}

.chat-header button:hover {
    opacity: 0.8;
}

.Chat-body { 
    padding: 20px; 
    overflow-y: auto; 
    flex: 1; 
    background: #f9f9f9; 
    font-size: 15px; 
    color: #333; 
    line-height: 1.6; 
}

.message { 
    margin-bottom: 20px; 
    display: flex; 
    align-items: flex-start; 
}

.message .message-text { 
    max-width: 70%; 
    padding: 12px 18px; 
    border-radius: 15px; 
    word-wrap: break-word; 
    line-height: 1.4; 
    font-size: 14px; 
    transition: background-color 0.3s ease; /* Smooth background transition */
}

.user-message .message-text { 
    background: #a4e6ff; 
    color: #000000; 
}

.bot-message .message-text { 
    background: #e0e0e0; 
}

.message:hover .message-text { 
    background-color: rgba(0, 0, 0, 0.05); /* Adds a subtle hover effect */
}

.chat-form { 
    display: flex; 
    align-items: center; 
    padding: 10px; 
    border-top: 1px solid #ddd; 
    background-color: #fff; 
}

.message-input { 
    flex: 1; 
    padding: 12px 15px; 
    border-radius: 25px; 
    border: 1px solid #ddd; 
    resize: none; 
    font-size: 14px; 
    box-shadow: inset 0 0 8px rgba(0, 0, 0, 0.05); /* Subtle inner shadow */
    transition: box-shadow 0.3s ease; /* Smooth focus effect */
}

.message-input:focus {
    outline: none;
    box-shadow: inset 0 0 12px rgba(0, 0, 0, 0.1); /* More prominent focus effect */
}

.chat-form button { 
    background: linear-gradient(135deg, #05445e, #2575fc); 
    color: #fff; 
    border: none; 
    border-radius: 50%; 
    width: 45px; 
    height: 45px; 
    cursor: pointer; 
    transition: transform 0.3s ease; /* Smooth button animation */
}

.chatbot-popup.hidden {
    transform: translateY(100%);
    opacity: 0;
    pointer-events: none;
}


.chat-form button:hover {
    transform: scale(1.1); /* Button enlarges on hover */
}

.chat-form button:active {
    transform: scale(1); /* Resets scale on click */
}

`;
document.head.appendChild(style);

// Add the chatbot button and popup
function addBookmarkButton() {
    const bookmarkButtonContainer = document.createElement('div');
    bookmarkButtonContainer.id = "bookmark-button-container";
    bookmarkButtonContainer.style.cssText = `
        position: relative;
        display: inline-flex;
        align-items: center;
    `;

    const bookmarkButton = document.createElement('img');
    bookmarkButton.id = "add-bookmark-button";
    bookmarkButton.src = chrome.runtime.getURL("assets/icon.png");
    bookmarkButton.style.cssText = `
        height: 40px;
        width: 40px;
        cursor: pointer;
        border-radius: 50%;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        transition: transform 0.2s ease-in-out;
    `;

    const tooltip = document.createElement('div');
    tooltip.id = "bookmark-tooltip";
    tooltip.innerText = "AI Help";
    tooltip.style.cssText = `
        visibility: hidden;
        background-color: #05445e;
        color: #ffffff;
        text-align: center;
        padding: 5px 10px;
        border-radius: 5px;
        position: absolute;
        left: 110%;
        white-space: nowrap;
        opacity: 0;
        transition: opacity 0.3s, transform 0.3s;
        font-size: 14px;
        font-weight: normal;
        z-index: 999;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    `;

    bookmarkButtonContainer.appendChild(bookmarkButton);
    bookmarkButtonContainer.appendChild(tooltip);

    const askDoubtButton = document.getElementsByClassName("coding_ask_doubt_button__FjwXJ")[0];
    askDoubtButton.parentNode.insertAdjacentElement("afterend", bookmarkButtonContainer);

    // Add Event Listeners for Hover Effect
    bookmarkButton.addEventListener('mouseenter', () => {
        tooltip.style.visibility = 'visible';
        tooltip.style.opacity = '1';
        tooltip.style.transform = 'translateX(5px)';
        bookmarkButton.style.transform = 'scale(1.1)';
    });

    bookmarkButton.addEventListener('mouseleave', () => {
        tooltip.style.visibility = 'hidden';
        tooltip.style.opacity = '0';
        tooltip.style.transform = 'translateX(0)';
        bookmarkButton.style.transform = 'scale(1)';
    });

    bookmarkButton.addEventListener('click', toggleChatbot);
}


// Function to get problem description
function getProblemDescription() {
    const problemElement = document.querySelector(".coding_desc__pltWY.problem_paragraph");
    return problemElement ? problemElement.textContent.trim() : "No problem description found.";
}

function toggleChatbot() {
    let chatbotPopup = document.querySelector('.chatbot-popup');

    if (!chatbotPopup) {
        chatbotPopup = document.createElement('div');
        chatbotPopup.className = 'chatbot-popup';
        chatbotPopup.innerHTML = `
            <div class="chat-header">
                <h2>AZ AI Help</h2>
                <button onclick="document.querySelector('.chatbot-popup').classList.add('hidden')">&#10006;</button>
            </div>
            <div class="Chat-body"></div>
            <form class="chat-form">
                <textarea class="message-input" placeholder="Message..." required></textarea>
                <button type="submit">&#10148;</button>
            </form>
        `;
        document.body.appendChild(chatbotPopup);

        const chatBody = chatbotPopup.querySelector(".Chat-body");
        const messageInput = chatbotPopup.querySelector(".message-input");
        const chatForm = chatbotPopup.querySelector(".chat-form");

        const problemDescription = getProblemDescription();

        chatForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const userMessage = messageInput.value.trim();
            if (!userMessage) return;

            // Display user message
            const userMessageDiv = document.createElement("div");
            userMessageDiv.classList.add("message", "user-message");
            userMessageDiv.innerHTML = `<div class="message-text">${userMessage}</div>`;
            chatBody.appendChild(userMessageDiv);
            messageInput.value = "";
            chatBody.scrollTop = chatBody.scrollHeight;

            // Display bot "thinking" message
            const botMessageDiv = document.createElement("div");
            botMessageDiv.classList.add("message", "bot-message");
            botMessageDiv.innerHTML = `<div class="message-text">...</div>`;
            chatBody.appendChild(botMessageDiv);
            chatBody.scrollTop = chatBody.scrollHeight;

            // Fetch bot response
            try {
                const response = await fetch(API_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        contents: [
                            { role: "user", parts: [{ text: `Problem Description: "${problemDescription}"\nUser Query: "${userMessage}"` }] }
                        ],
                    }),
                });
                const data = await response.json();
                if (!response.ok) throw new Error(data.error.message);

                const botResponse = data.candidates[0].content.parts[0].text.trim();
                botMessageDiv.querySelector(".message-text").innerText = botResponse;
            } catch (error) {
                botMessageDiv.querySelector(".message-text").innerText = `Error: ${error.message}`;
                botMessageDiv.querySelector(".message-text").style.color = "red";
            } finally {
                chatBody.scrollTop = chatBody.scrollHeight;
            }
        });
    } else {
        if (chatbotPopup.classList.contains('hidden')) {
            chatbotPopup.classList.remove('hidden');
        } else {
            chatbotPopup.classList.add('hidden');
        }
    }
}

window.addEventListener("load", addBookmarkButton);



} 
});