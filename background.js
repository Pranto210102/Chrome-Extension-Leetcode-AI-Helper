const API_URL = "https://api.groq.com/openai/v1/chat/completions";
let SYSTEM_PROMPT = "";

/* Load prompt.txt once when extension starts */
async function loadPrompt() {
    try {
        const url = chrome.runtime.getURL("prompt.txt");
        const res = await fetch(url);
        SYSTEM_PROMPT = await res.text();
        console.log("Prompt loaded.");
    } catch (err) {
        console.error("Prompt load error:", err);
    }
}

/* Get API key from chrome.storage */
async function getApiKey() {
    return new Promise((resolve) => {
        if (typeof chrome === "undefined" || !chrome.storage) {
            console.error("chrome.storage not available");
            resolve("");
            return;
        }
        chrome.storage.local.get(["groqApiKey"], (result) => {
            resolve(result.groqApiKey || "");
        });
    });
}

loadPrompt();


/* Listen for messages from content.js */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

    if (request.type === "userMessage") {

        callGroqAPI(request.query, request.description, request.userCode)
            .then(reply => sendResponse({ answer: reply }))
            .catch(err => {
                console.error(err);
                sendResponse({ answer: "Error contacting AI API." });
            });

        return true; 
    }
});


/* Call Groq AI */
async function callGroqAPI(userMessage, description, userCode) {
    const API_KEY = await getApiKey();
    
    if (!API_KEY) {
        return "Please set your Groq API key in the extension popup first.";
    }

    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "llama-3.1-8b-instant",
            messages: [
                {
                    role: "system",
                    content: SYSTEM_PROMPT
                },
                {
                    role: "user",
                    content: `
                    LeetCode Problem Description, Examples, Constraints and Hints:
                    ${description}

                    User Question:
                    ${userMessage}
                    
                    User Code:
                    ${userCode}
                    `
                }
            ],
            temperature: 0.2,
            max_tokens: 600
        })
    });

    const data = await response.json();

    console.log("Groq Response:", data);

    if (!data.choices || data.choices.length === 0) {
        return "No response from AI.";
    }

    return data.choices[0].message.content;
}