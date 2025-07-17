// utils/callTogether.js
const Together = require("together-ai");
const together = new Together(); // Uses process.env.TOGETHER_API_KEY

/**
 * Sends a prompt to Together AI and returns the generated response.
 * @param {string} systemPrompt - System message defining LLM's persona/role.
 * @param {string} userPrompt - Actual task and file metadata.
 * @returns {Promise<string>} LLM-generated output.
 */
async function callTogether(systemPrompt, userPrompt) {
    try {
        const payload = {
            model: "moonshotai/Kimi-K2-Instruct",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ]
        };

        console.log("Sending prompt to Together AI:", JSON.stringify(payload, null, 2));
        const response = await together.chat.completions.create(payload);

        return response.choices[0].message.content;
    } catch (error) {
        console.error("Error calling Together AI:", error);
        throw error;
    }
}

module.exports = { callTogether };