const fs = require('fs');
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function main() {
    let apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;

    // Attempt to read from .env.local if not in env
    if (!apiKey && fs.existsSync('.env.local')) {
        const content = fs.readFileSync('.env.local', 'utf-8');
        // Simple regex to find the key
        const match = content.match(/(?:VITE_)?GEMINI_API_KEY\s*=\s*(.+)/) || content.match(/(?:VITE_)?API_KEY\s*=\s*(.+)/);
        if (match) {
            apiKey = match[1].trim();
            // Remove quotes if present
            apiKey = apiKey.replace(/^["']|["']$/g, '');
        }
    }

    if (!apiKey) {
        console.error("❌ No API Key found. Make sure .env.local has GEMINI_API_KEY defined.");
        return;
    }

    console.log(`Using API Key: ${apiKey.substring(0, 5)}...`);
    const genAI = new GoogleGenerativeAI(apiKey);

    const modelsToTest = [
        "gemini-1.5-flash",
        "gemini-1.5-flash-001",
        "gemini-1.5-pro",
        "gemini-pro",
        "gemini-1.0-pro"
    ];

    console.log("\nTesting Models:");
    for (const modelName of modelsToTest) {
        try {
            process.stdout.write(`- ${modelName}: `);
            const model = genAI.getGenerativeModel({ model: modelName });
            await model.generateContent("Test");
            console.log("AVAILABLE ✅");
        } catch (error) {
            let msg = error.message;
            if (msg.includes("404")) msg = "NOT FOUND (404)";
            else if (msg.includes("403")) msg = "FORBIDDEN (403)";
            else if (msg.includes("400")) msg = "BAD REQUEST (400) - " + msg.split(']')[1]?.substring(0, 50);

            console.log(`FAILED ❌ [${msg}]`);
            fs.appendFileSync('debug_output.txt', `- ${modelName}: FAILED [${msg}]\n`);
        }
    }
}
fs.writeFileSync('debug_output.txt', 'Debug Results:\n');
main();
