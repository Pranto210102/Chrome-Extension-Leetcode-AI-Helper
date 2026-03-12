// This section for keeping user's API key for Groq AI
// Use chrome.storage.local which is accessible from both popup and background scripts

document.addEventListener("DOMContentLoaded", () => {
    // Check if chrome.storage is available
    if (typeof chrome === "undefined" || !chrome.storage) {
        document.getElementById("status").innerText = "Error: Extension not loaded properly. Please load via chrome://extensions";
        return;
    }

    // Load existing API key
    chrome.storage.local.get(["groqApiKey"], (result) => {
        if (result.groqApiKey) {
            document.getElementById("apiKeyInput").value = result.groqApiKey;
        }
    });

    document.getElementById("saveApiKeyButton").addEventListener("click", () => {
        const apiKey = document.getElementById("apiKeyInput").value.trim();
        chrome.storage.local.set({ groqApiKey: apiKey }, () => {
            document.getElementById("status").innerText = "API Key saved!";
            setTimeout(() => {
                document.getElementById("status").innerText = "";
            }, 2000);
        });
    });
});

