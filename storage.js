function getProblemKey() {
    const parts = window.location.pathname.split("/");
    return "leetcode_chat_" + parts[2];
}

function isStorageAvailable() {
    return typeof chrome !== "undefined" && chrome.storage && chrome.storage.local;
}

function saveMessage(role, text) {
    if (!isStorageAvailable()) {
        console.error("chrome.storage not available");
        return;
    }

    const key = getProblemKey();

    chrome.storage.local.get([key], function(result) {

        const history = result[key] || [];

        history.push({
            role: role,
            text: text
        });

        chrome.storage.local.set({
            [key]: history
        });

    });
}


function loadConversation(container) {
    if (!isStorageAvailable()) {
        console.error("chrome.storage not available");
        return;
    }

    const key = getProblemKey();

    chrome.storage.local.get([key], function(result) {

        const history = result[key] || [];

        if (history.length > 0) {
            container.innerHTML = "";
        }

        history.forEach(msg => {

            const div = document.createElement("div");

            if (msg.role === "user") {
                div.innerText = "You: " + msg.text;
                div.style.fontWeight = "bold";
            } else {
                div.innerText = "AI: " + msg.text;
            }

            div.style.marginBottom = "10px";

            container.appendChild(div);

        });

        container.scrollTop = container.scrollHeight;
    });
}


function clearConversation() {
    if (!isStorageAvailable()) {
        console.error("chrome.storage not available");
        return;
    }

    const key = getProblemKey();

    chrome.storage.local.remove(key);

}