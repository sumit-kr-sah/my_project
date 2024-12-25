const API_KEY = "AIzaSyARuftwOxzBXSI-wFUageH7vXh717GU4YU"; // Use environment variables or secure storage for production

window.addEventListener("load", addBookmarkButton);

function addBookmarkButton() {
    const bookmarkButton = document.createElement('img');
    bookmarkButton.id = "add-bookmark-button";
    bookmarkButton.src = chrome.runtime.getURL("assets/icon.png");
    bookmarkButton.style.height = "30px";
    bookmarkButton.style.width = "30px";
    bookmarkButton.style.cursor = "pointer";

    const askDoubtButton = document.getElementsByClassName("coding_ask_doubt_button__FjwXJ")[0];
    askDoubtButton.parentNode.insertAdjacentElement("afterend", bookmarkButton);

    bookmarkButton.addEventListener('click', toggleChatbot);
}

function toggleChatbot() {
    let chatbot = document.getElementById('chatbot-container');

    if (!chatbot) {
        chatbot = document.createElement('div');
        chatbot.id = "chatbot-container";
        chatbot.innerHTML = `
            <div id="chatbot-header">
                <span>Chatbot</span>
                <button id="close-chatbot">X</button>
            </div>
            <div id="chatbot-messages"></div>
            <div id="chatbot-input">
                <input type="text" id="user-input" placeholder="Type your question..."/>
                <button id="send-message">Send</button>
            </div>
        `;
        document.body.appendChild(chatbot);

        document.getElementById('close-chatbot').addEventListener('click', () => chatbot.remove());
        document.getElementById('send-message').addEventListener('click', handleUserInput);
    } else {
        chatbot.remove();
    }
}

function handleUserInput() {
    const userInput = document.getElementById('user-input');
    const messages = document.getElementById('chatbot-messages');

    // Fetch the question from the webpage
    const webpageQuestion = getQuestionFromWebPage();

    if (webpageQuestion || userInput.value.trim()) {
        const userMessage = document.createElement('div');
        userMessage.className = 'message user-message';
        userMessage.textContent = userInput.value.trim() || webpageQuestion;
        messages.appendChild(userMessage);

        fetchAIResponse(userInput.value.trim() || webpageQuestion).then((response) => {
            const botMessage = document.createElement('div');
            botMessage.className = 'message bot-message';
            botMessage.textContent = response;
            messages.appendChild(botMessage);

            messages.scrollTop = messages.scrollHeight;
        });

        userInput.value = "";
    } else {
        alert("Please type a question or ensure there's a question on the page.");
    }
}

function getQuestionFromWebPage() {
    // Fetch the question element using its class
    const questionElement = document.querySelector('.coding_desc__pltWY.problem_paragraph');

    // Return the question text or null if not found
    return questionElement ? questionElement.textContent.trim() : null;
}

async function fetchAIResponse(question) {
    try {
        const response = await fetch("https://api.gemini.com/v1/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                prompt: question,
                model: "gpt-4", // Adjust based on the Gemini API's documentation
                max_tokens: 150
            })
        });

        const data = await response.json();
        return data.choices[0]?.text || "No response from the AI.";
    } catch (error) {
        console.error("Error fetching AI response:", error);
        return "Something went wrong. Please try again later.";
    }
}
