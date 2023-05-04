const messageForm = document.getElementById("message-form");
const messageInput = document.getElementById("message");
const nameInput = document.getElementById("name");
const messagesDiv = document.getElementById("messages");

const roomId = window.location.pathname.slice(1) || generateRoomId();

if (window.location.pathname === "/") {
    window.history.pushState({}, "", `/${roomId}`);
}

function generateRoomId() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let roomId = "";
    for (let i = 0; i < 4; i++) {
        roomId += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return roomId;
}

document.getElementById("new-chat-button").addEventListener("click", () => {
    const roomId = generateRoomId();
    window.location.href = `/${roomId}`;
});

messageForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = nameInput.value;
    const message = messageInput.value;

    if (message.startsWith("/gpt")) {
        const prompt = message.slice(4).trim();
        const gptCommandMessage = {
            name: name,
            message: `used /gpt: ${prompt}`,
            timestamp: new Date().toISOString().slice(0, 19).replace("T", " "),
        };

        messages.push(gptCommandMessage);
        renderMessages();

        await fetch(`/send_message/${roomId}`, {
            method: "POST",
            body: JSON.stringify(gptCommandMessage),
            headers: {
                "Content-Type": "application/json",
            },
        });

        const thinkingMessage = {
            name: "GPT-4",
            message: "Let me think about that...",
            timestamp: new Date().toISOString().slice(0, 19).replace("T", " "),
        };

        messages.push(thinkingMessage);
        renderMessages();

        const response = await fetch(`/gpt/${roomId}`, {
            method: "POST",
            body: JSON.stringify({ prompt }),
            headers: {
                "Content-Type": "application/json",
            },
        });

        const result = await response.json();
        messages.pop();
        const gptMessage = {
            name: "GPT-4",
            message: result.response.trim(),
            timestamp: new Date().toISOString().slice(0, 19).replace("T", " "),
        };

        messages.push(gptMessage);
        renderMessages();

        await fetch(`/send_gpt_response/${roomId}`, {
            method: "POST",
            body: JSON.stringify(gptMessage),
            headers: {
                "Content-Type": "application/json",
            },
        });
    } else {
        await fetch(`/send_message/${roomId}`, {
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
                <strong>${message.name}</strong>: ${
            message.message.startsWith("used /gpt")
                ? `<em>${message.message}</em>`
                : message.message
        } <br>
                <small>${message.timestamp}</small>
            </div>
        `;
    }

    messagesDiv.innerHTML = html;
}

async function getMessages() {
    const response = await fetch(`/get_messages/${roomId}`);
    messages = await response.json();
    renderMessages();
}

let messages = [];
getMessages();
