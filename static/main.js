const messageForm = document.getElementById("message-form");
const messageInput = document.getElementById("message");
const nameInput = document.getElementById("name");
const messagesDiv = document.getElementById("messages");

const roomId = window.location.pathname.slice(1) || generateRoomId();

let selectedModel = "gpt-3.5-turbo";
const maxTokens = selectedModel === "gpt-4" ? 7000 : 3000;


if (window.location.pathname === "/") {
    window.history.pushState({}, "", `/${roomId}`);
}

document.getElementById("model-switch").addEventListener("change", (e) => {
    selectedModel = e.target.checked ? "gpt-4" : "gpt-3.5-turbo";
});

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

let userName = "";

async function getUserName() {
    if (!userName) {
        userName = prompt("Please enter your name:");
    }
}

messageForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    await getUserName();
    const name = userName;
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
            body: JSON.stringify({ prompt, model: selectedModel, max_tokens: maxTokens }),
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

function copyChat() {
    const chatContent = messages.map(message => {
        return `${message.name}: ${message.message} (${message.timestamp})`;
    }).join("\n");

    const textArea = document.createElement("textarea");
    textArea.value = chatContent;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
    alert("Chat copied to clipboard");
}

function saveChat() {
    const chatContent = messages.map(message => {
        return `${message.name}: ${message.message} (${message.timestamp})`;
    }).join("\n");

    const blob = new Blob([chatContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "chat.txt";
    a.click();
    URL.revokeObjectURL(url);
}

document.getElementById("copy-chat-button").addEventListener("click", copyChat);
document.getElementById("save-chat-button").addEventListener("click", saveChat);


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
