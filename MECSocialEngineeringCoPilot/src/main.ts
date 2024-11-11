import express from "express";
import path from "path";
import bodyParser from "body-parser";
import { OpenAIClient, FileHandler } from "./utils";

const app = express();
const PORT = 3000;

// Paths
const analysisFilePath = path.resolve("src/analysis/analysis.json");
const promptPath = path.resolve("src/prompts/analysisPrompt.txt");
const appPath = path.resolve(__dirname, "../app");

// Middleware to parse JSON
app.use(bodyParser.json());

// Serve static files (like main.html, styles.css, script.js)
app.use(express.static(appPath));

// Handle the root route (/) explicitly
app.get("/", (req, res) => {
    res.sendFile(path.join(appPath, "main.html"));
});

// Serve analysis.json file
app.get("/analysis.json", (req, res) => {
    res.sendFile(analysisFilePath);
});

// Handle text analysis requests
app.post("/analyze", async (req: any, res: any) => {
    const { text } = req.body;

    if (!text) {
        return res.status(400).send({ error: "No text provided for analysis." });
    }

    try {
        const openAIClient = new OpenAIClient();
        const fileHandler = new FileHandler();
        const analysisPrompt = fileHandler.readFile(promptPath);

        const fullPrompt = `${analysisPrompt}\n\nConversation:\n${text}`;
        const aiResponse = await openAIClient.analyzeConversationStream([
            { role: "user", content: fullPrompt },
        ]);

        let analysisData;
        try {
            const cleanedResponse = aiResponse
                .replace(/```json/g, "")
                .replace(/```/g, "")
                .trim();
            analysisData = JSON.parse(cleanedResponse);
        } catch (error) {
            return res.status(500).send({ error: "Failed to parse AI response." });
        }

        // Save analysis data to file
        fileHandler.writeFile(analysisFilePath, JSON.stringify(analysisData, null, 2));

        // Respond with analysis data
        return res.json({
            discrepancies: analysisData.discrepancies || [],
            confirmations: analysisData.confirmations || "No data to confirm.",
        });
    } catch (error: any) {
        console.error("Error during analysis:", error.message);
        return res.status(500).send({ error: "Internal Server Error." });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
