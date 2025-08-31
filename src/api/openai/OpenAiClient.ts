import OpenAI from 'openai';
import type {
  FileUploadContent,
  Message,
  OpenAiMessage,
  UploadedFile,
} from './types';

const LLM_DEFAULTS = {
  model: 'gpt-4o-mini', // can handle PDF uploads
  // model: "gpt-5",

  // reasoning: { effort: "low" },
  // instructions: "Talk like a pirate.",
};

export class OpenAiClient {
  client: OpenAI;
  history: Message[] = [
    { role: 'system', content: 'You are a helpful assistant.' },
  ];
  currentFile: UploadedFile | null = null;
  lastUploadedFile: FileUploadContent | null = null;
  lastError: string | null = null;

  constructor() {
    // Initialization code here -- import.meta.env.VITE_OPENAI_API_KEY
    this.client = new OpenAI({
      apiKey: import.meta.env.VITE_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true, // Allow usage in browser (not recommended for production)
    });
  }

  async addFile(file: File) {
    // Simulate file processing and add a message to history
    const uploadedFile = await this.client.files.create({
      file: file,
      purpose: 'user_data',
    });
    this.history.push({
      role: 'local',
      content: `File uploaded: ${file.name}`,
    });
    console.log('File added to OpenAiClient:', file, uploadedFile);
    this.lastUploadedFile = {
      type: 'input_file',
      file_id: uploadedFile.id,
    };
    this.currentFile = uploadedFile;
    return true;
  }

  addMessage(message: string) {
    if (this.lastUploadedFile) {
      // Attach file reference to the next user message
      this.history.push({
        role: 'user',
        content: [this.lastUploadedFile, { type: 'input_text', text: message }],
      });
      this.lastUploadedFile = null; // Reset after using
    } else {
      this.history.push({ role: 'user', content: message });
    }
  }

  private async getChatReply() {
    this.lastError = null;
    try {
      const response = await this.client.responses.create({
        ...LLM_DEFAULTS,
        input: this.history.filter(
          (m) => m.role !== 'local'
        ) as OpenAiMessage[],
      });
      const reply = response.output_text;
      return reply;
    } catch (error: unknown) {
      console.error('Error getting chat reply:', error);
      if (typeof error === 'string') {
        this.lastError = error;
      } else if (error instanceof Error) {
        this.lastError = (error as Error).message;
      } else {
        this.lastError = 'An unknown error occurred';
      }
      throw error;
    }
  }

  async sendMessages(): Promise<Message[]> {
    const reply = await this.getChatReply();
    this.history.push({ role: 'assistant', content: reply });
    return this.history;
  }
}
