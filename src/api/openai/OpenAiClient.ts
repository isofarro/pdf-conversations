import OpenAI from "openai";
import type { Message } from "./types";

const LLM_DEFAULTS = {
    model: "gpt-4o-mini",
    // model: "gpt-5",
    // reasoning: { effort: "low" },
    // instructions: "Talk like a pirate.",
}

export class OpenAiClient {
    client: OpenAI;
    history: Message[] = [
        { role: 'system', content: 'You are a helpful assistant.' }
    ];

    constructor() {
        // Initialization code here -- import.meta.env.VITE_OPENAI_API_KEY
        this.client = new OpenAI({
            apiKey: import.meta.env.VITE_OPENAI_API_KEY,
            dangerouslyAllowBrowser: true, // Allow usage in browser (not recommended for production)
        });
    }

    addFile(file: File) {
        console.log("File added to OpenAiClient:", file);
    }

    private async getResponse() {
        const response = await this.client.responses.create({
            ...LLM_DEFAULTS,
            input: this.history,
        });
        const reply = response.output_text;
        this.history.push({ role: 'assistant', content: reply });
        return reply;
    }

    async sendMessage(message: string) {
        console.log("Message added to OpenAiClient:", message);
        this.history.push({ role: 'user', content: message });
        return this.getResponse();
    }
}
