import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

export class OpenAIClient {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_KEY,
    });
  }

  public async analyzeConversationStream(
    messages: { role: "user" | "assistant"; content: string }[]
  ): Promise<string> {
    const stream = await this.client.chat.completions.create({
      model: "gpt-4o",
      messages,
      stream: true,
    });

    let response = "";

    for await (const chunk of stream) {
      if (chunk.choices[0]?.delta?.content) {
        process.stdout.write(chunk.choices[0].delta.content);
        response += chunk.choices[0].delta.content;
      }
    }

    console.log("\n");
    return response;
  }
}
