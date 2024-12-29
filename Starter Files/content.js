const API_KEY = "AIzaSyB374Nsm-mbCwtZS5V0fvR9efQAOll9s9s"; // Use secure storage
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

// Add styles to the document
const style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = `
    * { margin: 0; padding: 0; box-sizing: border-box; font-family: Arial, sans-serif; }
    body { background-color: #f4f5f7; display: flex; justify-content: center; align-items: center; height: 100vh; color: #333; }

    /* Chatbot popup styles */
    .chatbot-popup { 
        background: #fff; 
        width: 400px; 
        height: 500px; 
        box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1); 
        border-radius: 10px; 
        display: flex; 
        flex-direction: column; 
        overflow: hidden; 
        position: fixed; 
        bottom: 20px; 
        right: 20px; 
        z-index: 1000; 
    }
    
    .chat-header { 
        background: linear-gradient(135deg, #05445e, #2575fc); 
        padding: 15px; 
        display: flex; 
        justify-content: space-between; 
        align-items: center; 
        color: #fff; 
    }
    
    .Chat-body { 
        padding: 15px; 
        overflow-y: auto; 
        flex: 1; 
        background: #f9f9f9; 
    }
    
    .message { 
        margin-bottom: 15px; 
        display: flex; 
        align-items: flex-start; 
    }

    .message .message-text { 
        max-width: 70%; 
        padding: 10px 15px; 
        border-radius: 10px; 
        word-wrap: break-word; 
        line-height: 1.4; 
        font-size: 14px; 
    }

    .user-message .message-text { 
        background: #a4e6ff; 
        color: #000000; 
    }
    
    .bot-message .message-text { 
        background: #e0e0e0; 
    }

    .chat-form { 
        display: flex; 
        align-items: center; 
        padding: 10px; 
        border-top: 1px solid #ddd; 
    }

    .message-input { 
        flex: 1; 
        padding: 10px; 
        border-radius: 20px; 
        border: 1px solid #ddd; 
        resize: none; 
    }

    .chat-form button { 
        background: linear-gradient(135deg, #05445e, #2575fc); 
        color: #fff; 
        border: none; 
        border-radius: 50%; 
        width: 40px; 
        height: 40px; 
        cursor: pointer; 
    }
`;
document.head.appendChild(style);

// Add the chatbot button and popup
function addBookmarkButton() {
    const bookmarkButton = document.createElement('img');
    bookmarkButton.id = "add-bookmark-button";
    bookmarkButton.src = chrome.runtime.getURL("assets/icon.png");
    bookmarkButton.style.cssText = "height: 30px; width: 30px; cursor: pointer;";

    const askDoubtButton = document.getElementsByClassName("coding_ask_doubt_button__FjwXJ")[0];
    askDoubtButton.parentNode.insertAdjacentElement("afterend", bookmarkButton);

    bookmarkButton.addEventListener('click', toggleChatbot);
}

// Function to get problem description
function getProblemDescription() {
    const problemElement = document.querySelector(".coding_desc__pltWY.problem_paragraph");
    return problemElement ? problemElement.textContent.trim() : "No problem description found.";
}

// Toggle Chatbot
function toggleChatbot() {
    let chatbotPopup = document.querySelector('.chatbot-popup');

    if (!chatbotPopup) {
        chatbotPopup = document.createElement('div');
        chatbotPopup.className = 'chatbot-popup';
        chatbotPopup.innerHTML = `
            <div class="chat-header">
                <h2>ChatBot</h2>
                <button onclick="document.querySelector('.chatbot-popup').style.display='none'">&#10006;</button>
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
        chatbotPopup.style.display = chatbotPopup.style.display === "none" ? "block" : "none";
    }
}

window.addEventListener("load", addBookmarkButton);
