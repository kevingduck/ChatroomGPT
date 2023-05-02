const messageForm = document.getElementById("message-form");
const messageInput = document.getElementById("message");
const nameInput = document.getElementById("name");
const messagesDiv = document.getElementById("messages");

messageForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = nameInput.value;
    const message = messageInput.value;

    if (message.startsWith("/gpt")) {
        const prompt = message.slice(4).trim();
        const thinkingMessage = {
            name: "GPT-4",
            message: "thinking...",
            timestamp: new Date().toISOString().slice(0, 19).replace("T", " "),
        };

        messages.push(thinkingMessage);
        renderMessages();

        const response = await fetch("/gpt", {
            method: "POST",
            body: JSON.stringify({ prompt }),
            headers: {
                "Content-Type": "application/json",
            },
        });

        const result = await response.json();
        messages.pop();
        messages.push({
            name: "GPT-4",
            message: result.response.trim(),
            timestamp: new Date().toISOString().slice(0, 19).replace("T", " "),
        });

        renderMessages();
    } else {
        await fetch("/send_message", {
            method: "POST",
            body: JSON.stringify({ name, message }),
            headers: {
                "Content-Type": "application/json",
            },
        });

        await getMessages();
    }

    messageInput.value = "";
});

function renderMessages() {
    let html = "";

    for (let message of messages) {
        html += `
            <div class="message">
                <strong>${message.name}</strong>: ${message.message} <br>
                <small>${message.timestamp}</small>
            </div>
        `;
    }

    messagesDiv.innerHTML = html;
}

async function getMessages() {
    const response = await fetch("/get_messages");
    messages = await response.json();
    renderMessages();
}

let messages = [];
getMessages();
