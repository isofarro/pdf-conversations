import OpenAI from 'openai';
import type {
  FileReferenceContent,
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
  files: UploadedFile[] = [];
  history: Message[] = [
    { role: 'system', content: 'You are a helpful assistant.' },
  ];
  currentFile: UploadedFile | null = null;
  lastSelectedFile: FileReferenceContent | null = null;
  lastError: string | null = null;

  constructor() {
    // Initialization code here -- import.meta.env.VITE_OPENAI_API_KEY
    this.client = new OpenAI({
      apiKey: import.meta.env.VITE_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true, // Allow usage in browser (not recommended for production)
    });
  }

  async loadFiles() {
    try {
      const files = await this.client.files.list();
      if (files.data.length > 0) {
        this.files = files.data;
        console.log('Loaded existing file:', this.files);
      }
    } catch (error) {
      console.error('Error loading files:', error);
    }
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
    this.lastSelectedFile = {
      type: 'input_file',
      file_id: uploadedFile.id,
    };
    this.currentFile = uploadedFile;
    return true;
  }

  async selectFileById(fileId: string): Promise<UploadedFile | null> {
    const file = this.files.find((f) => f.id === fileId) || null;
    if (file) {
      this.lastSelectedFile = {
        type: 'input_file',
        file_id: fileId,
      };
      this.currentFile = file;
    }
    return file;
  }

  addMessage(message: string) {
    if (this.lastSelectedFile) {
      // Attach file reference to the next user message
      this.history.push({
        role: 'user',
        content: [this.lastSelectedFile, { type: 'input_text', text: message }],
      });
      this.lastSelectedFile = null; // Reset after using
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
