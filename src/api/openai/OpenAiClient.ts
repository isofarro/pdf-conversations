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
    const fileContent: FileUploadContent = {
      type: 'input_file',
      file_id: uploadedFile.id,
    };
    this.currentFile = uploadedFile;
    this.history.push({ role: 'user', content: [fileContent] });
    return true;
  }

  private async getResponse() {
    const response = await this.client.responses.create({
      ...LLM_DEFAULTS,
      input: this.history.filter((m) => m.role !== 'local') as OpenAiMessage[],
    });
    const reply = response.output_text;
    this.history.push({ role: 'assistant', content: reply });
    return reply;
  }

  async sendMessage(message: string) {
    console.log('Message added to OpenAiClient:', message);
    this.history.push({ role: 'user', content: message });
    return this.getResponse();
  }
}
