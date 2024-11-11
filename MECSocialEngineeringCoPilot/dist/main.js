"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const body_parser_1 = __importDefault(require("body-parser"));
const utils_1 = require("./utils");
const app = (0, express_1.default)();
const PORT = 3000;
// Paths
const analysisFilePath = path_1.default.resolve("src/analysis/analysis.json");
const promptPath = path_1.default.resolve("src/prompts/analysisPrompt.txt");
const appPath = path_1.default.resolve(__dirname, "../app");
// Middleware to parse JSON
app.use(body_parser_1.default.json());
// Serve static files (like main.html, styles.css, script.js)
app.use(express_1.default.static(appPath));
// Handle the root route (/) explicitly
app.get("/", (req, res) => {
    res.sendFile(path_1.default.join(appPath, "main.html"));
});
// Serve analysis.json file
app.get("/analysis.json", (req, res) => {
    res.sendFile(analysisFilePath);
});
// Handle text analysis requests
app.post("/analyze", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { text } = req.body;
    if (!text) {
        return res.status(400).send({ error: "No text provided for analysis." });
    }
    try {
        const openAIClient = new utils_1.OpenAIClient();
        const fileHandler = new utils_1.FileHandler();
        const analysisPrompt = fileHandler.readFile(promptPath);
        const fullPrompt = `${analysisPrompt}\n\nConversation:\n${text}`;
        const aiResponse = yield openAIClient.analyzeConversationStream([
            { role: "user", content: fullPrompt },
        ]);
        let analysisData;
        try {
            const cleanedResponse = aiResponse
                .replace(/```json/g, "")
                .replace(/```/g, "")
                .trim();
            analysisData = JSON.parse(cleanedResponse);
        }
        catch (error) {
            return res.status(500).send({ error: "Failed to parse AI response." });
        }
        // Save analysis data to file
        fileHandler.writeFile(analysisFilePath, JSON.stringify(analysisData, null, 2));
        // Respond with analysis data
        return res.json({
            discrepancies: analysisData.discrepancies || [],
            confirmations: analysisData.confirmations || "No data to confirm.",
        });
    }
    catch (error) {
        console.error("Error during analysis:", error.message);
        return res.status(500).send({ error: "Internal Server Error." });
    }
}));
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
