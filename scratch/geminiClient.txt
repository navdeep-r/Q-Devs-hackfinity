const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ✅ This is the right model for content generation in v1
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

async function callGemini(promptText) {
    console.log(promptText)
    const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: promptText }] }],
    });

    const response = await result.response;
    return response.text(); // <- what you'll send to frontend
}

module.exports = { callGemini };
