
const observer = new MutationObserver(AIHelpButton);
observer.observe(document.body, { childList: true, subtree: true });
AIHelpButton();


function isProblemPage() {
    return window.location.pathname.startsWith("/problems/");
}

function AIHelpButton() {
    console.log("Triggered AIHelpButton");

    if (!isProblemPage() || document.getElementsByClassName("AI-help-button").length > 0) {
        return;
    }
    
    const btnPos = document.getElementsByClassName("relative flex flex-1 items-center justify-end")[0];
    const button = document.createElement("AI-help-button");
    button.className = "AI-help-button";
    btnPos.insertAdjacentElement("beforebegin", button);


    button.innerText = 'AI Help';
    button.style.bottom = '20px';
    button.style.right = '20px';
    button.style.zIndex = '1000';
    button.style.padding = '10px 20px';
    button.style.backgroundColor = '#630a6e4c';
    button.style.color = '#fff';
    button.style.border = 'none';
    button.style.borderRadius = '10px';
    button.style.cursor = 'pointer';

    button.addEventListener('click', AIHelpButtonHandler);
}

function AIHelpButtonHandler() {

    console.log("AI Help button clicked");

    const position = findChatboxPosition();
    if (!position) return;

    if (isChatboxAlreadyPresent()) return;

    const chatbox = createChatbox();
    position.insertAdjacentElement("beforebegin", chatbox);
}


function findChatboxPosition() {
    return document.getElementsByClassName("example")[0];
}

function isChatboxAlreadyPresent() {
    return document.querySelector(".AI-help-chatbox");
}


// Theme observer for dynamic theme updates
function setupThemeObserver(chatbox) {
    const applyTheme = () => {
        // LeetCode can use different methods for theme
        const htmlTheme = document.documentElement.getAttribute("data-theme");
        const bodyTheme = document.body.getAttribute("data-theme");
        const htmlClass = document.documentElement.classList.contains("dark");
        const bodyClass = document.body.classList.contains("dark");
        
        const isDark = htmlTheme === "dark" || bodyTheme === "dark" || htmlClass || bodyClass;
        
        console.log("Theme detected:", isDark ? "dark" : "light");

        // Chatbox
        chatbox.style.background = isDark ? "#262626" : "#ffffff";
        chatbox.style.border = isDark ? "1px solid #3a3a3a" : "1px solid #d4d4d4";
        chatbox.style.color = isDark ? "#e6e6e6" : "#1a1a1a";

        // Header
        const header = chatbox.querySelector("div");
        if (header) {
            header.style.background = isDark ? "#1f1f1f" : "#f5f5f5";
            header.style.borderBottom = isDark ? "1px solid #3a3a3a" : "1px solid #d4d4d4";
            header.style.color = isDark ? "#e6e6e6" : "#1a1a1a";
        }

        // Input container
        const inputContainer = chatbox.querySelector("div:last-child");
        if (inputContainer) {
            inputContainer.style.background = isDark ? "#1f1f1f" : "#f5f5f5";
            inputContainer.style.borderTop = isDark ? "1px solid #3a3a3a" : "1px solid #d4d4d4";
        }

        // Input field
        const input = chatbox.querySelector(".AI-help-input");
        if (input) {
            input.style.background = isDark ? "#1f1f1f" : "#ffffff";
            input.style.color = isDark ? "#e6e6e6" : "#1a1a1a";
        }
    };

    // Apply theme immediately
    applyTheme();

    // Watch for theme changes on documentElement (html)
    const htmlObserver = new MutationObserver(applyTheme);
    htmlObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["data-theme", "class"]
    });

    // Watch for theme changes on body
    const bodyObserver = new MutationObserver(applyTheme);
    bodyObserver.observe(document.body, {
        attributes: true,
        attributeFilter: ["data-theme", "class"]
    });
}


// chatbox creation logic

function createChatbox() {

    const chatbox = document.createElement("div");
    chatbox.className = "AI-help-chatbox";

    applyChatboxStyle(chatbox);

    const header = createHeader(chatbox);
    const messages = createMessageArea();
    loadConversation(messages);
    const inputSection = createInputArea(messages);

    chatbox.appendChild(header);
    chatbox.appendChild(messages);
    chatbox.appendChild(inputSection);

    // Setup theme observer after all elements are added
    setupThemeObserver(chatbox);

    return chatbox;
}

function applyChatboxStyle(chatbox) {
    chatbox.style.width = "100%";
    chatbox.style.maxWidth = "600px";
    chatbox.style.borderRadius = "8px";
    chatbox.style.margin = "20px 0";
    chatbox.style.display = "flex";
    chatbox.style.flexDirection = "column";
}


/* ---------- HEADER ---------- */

function createHeader(chatbox) {

    const header = document.createElement("div");
    header.innerText = "AI Assistant";
    header.style.padding = "10px";
    header.style.fontWeight = "bold";
    header.style.display = "flex";
    header.style.justifyContent = "space-between";

    const closeButton = document.createElement("span");
    closeButton.innerText = "×";
    closeButton.style.float = "right";
    closeButton.style.cursor = "pointer";
    closeButton.style.fontSize = "20px";
    closeButton.style.padding = "0 10px";

    closeButton.onclick = () => chatbox.remove();

    header.appendChild(closeButton);
    // clar conversion from chrome storage

    const clearChat = document.createElement("span");
    clearChat.innerText = "Clear Chat";
    clearChat.style.float = "right";
    clearChat.style.cursor = "pointer";
    clearChat.style.fontSize = "12px";
    clearChat.style.padding = "0 10px";

    clearChat.onclick = () => {
        if (confirm("Are you sure you want to clear the conversation history?")) {
            clearConversation();
            const messages = chatbox.querySelector(".AI-help-messages");
            messages.innerHTML = "";
        }
    };

    header.appendChild(clearChat);

    return header;
}


/* ---------- MESSAGE AREA ---------- */

function createMessageArea() {
    const messages = document.createElement("div");

    messages.className = "AI-help-messages";
    messages.style.height = "200px";
    messages.style.overflowY = "auto";
    messages.style.padding = "10px";
    messages.style.fontSize = "14px";

    messages.innerText = "Ask anything about this problem...";

    return messages;
}


/* ---------- INPUT AREA ---------- */

function createInputArea(messages) {

    const inputContainer = document.createElement("div");
    inputContainer.style.display = "flex";

    const input = createInputField();
    const sendButton = createSendButton(input, messages);

    inputContainer.appendChild(input);
    inputContainer.appendChild(sendButton);

    return inputContainer;
}

function createInputField() {

    const input = document.createElement("input");
    input.type = "text";
    input.className = "AI-help-input";
    input.placeholder = "Ask AI...";
    input.style.flex = "1";
    input.style.padding = "10px";
    input.style.border = "none";
    input.style.outline = "none";

    input.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            e.preventDefault();
            this.nextSibling.click();
        }
    });

    return input;
}

function createSendButton(input, messages) {

    const sendButton = document.createElement("button");

    sendButton.innerText = "Send";
    sendButton.style.background = "#ffa116";
    sendButton.style.border = "none";
    sendButton.style.padding = "10px 15px";
    sendButton.style.cursor = "pointer";
    sendButton.style.borderRadius = "8px 8px 8px 8px";
    sendButton.style.fontWeight = "bold";

    sendButton.onclick = () => handleChatSubmit(input, messages, getCurrentCode());

    return sendButton;
}


/* ---------- MESSAGE LOGIC ---------- */

function handleChatSubmit(input, messages, currentCode) {

    const text = input.value.trim();
    if (!text) return;

    addUserMessage(messages, text, currentCode);

    input.value = "";
}

function addUserMessage(messages, text, currentCode) {

    const msg = document.createElement("div");
    msg.innerText = "You: " + text;
    saveMessage("user", text);
    msg.style.marginBottom = "10px";
    msg.style.fontWeight = "bold";

    messages.appendChild(msg);
    messages.scrollTop = messages.scrollHeight;

    const loading = document.createElement("div");
    loading.innerText = "AI is typing...";
    loading.style.fontStyle = "italic";

    messages.appendChild(loading);

    const description = getProblemDescription();

    chrome.runtime.sendMessage(
        { type: "userMessage", 
          query: text,
          description: description,
          userCode: currentCode
        },
        function (response) {

            loading.remove();

            const aiMsg = document.createElement("div");

            const aiText = response?.answer || "AI did not respond.";
            saveMessage("ai", aiText);
            aiMsg.innerText = "AI: " + aiText;
            aiMsg.style.marginBottom = "10px";

            messages.appendChild(aiMsg);

            messages.scrollTop = messages.scrollHeight;
        }
    );
}