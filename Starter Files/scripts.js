document.getElementById('sendMessage').addEventListener('click', function() {
    const userMessage = document.getElementById('userMessage').value;
    if (userMessage.trim() !== '') {
        displayMessage(userMessage, 'user-message');
        document.getElementById('userMessage').value = '';

        // Simulate a bot response after 1 second (you can integrate the chatbot's logic here)
        setTimeout(() => {
            displayMessage('Thanks for your message. I will get back to you shortly!', 'bot-message');
        }, 1000);
    }
});

function displayMessage(message, messageType) {
    const chatBody = document.getElementById('chatBody');
    const messageDiv = document.createElement('div');
    messageDiv.classList.add(messageType);
    const messageContent = document.createElement('p');
    messageContent.textContent = message;
    messageDiv.appendChild(messageContent);
    chatBody.appendChild(messageDiv);
    chatBody.scrollTop = chatBody.scrollHeight;  // Scroll to the bottom of chat
}
