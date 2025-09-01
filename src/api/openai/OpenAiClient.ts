import OpenAI from 'openai';
import type {
  FileReferenceContent,
  UploadedFile,
  LocalMessage,
  OpenAiMessage,
} from './types';

const LLM_DEFAULTS = {
  model: 'gpt-4o-mini', // can handle PDF uploads
  // model: "gpt-5",

  // reasoning: { effort: "low" },
  // instructions: "Talk like a pirate.",
};

const clone = (obj: any) => {
  return JSON.parse(JSON.stringify(obj));
};

const DEFAULT_SYSTEM_PROMPT =
  'You are a helpful assistant in answering questions based on a selected PDF file';

export class OpenAiClient {
  client: OpenAI;

  files: UploadedFile[] = [];
  fileConversations = new Map<string, LocalMessage[]>();
  currentFileId: string | null = null;

  history: LocalMessage[] = [
    { role: 'system', content: DEFAULT_SYSTEM_PROMPT },
  ];
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

    this.files.push(uploadedFile);
    this.currentFileId = uploadedFile.id;
    return true;
  }

  async selectFileById(fileId: string): Promise<UploadedFile | null> {
    const file = this.files.find((f) => f.id === fileId) || null;
    if (file) {
      this.currentFileId = fileId;
    } else {
      throw new Error(`File not found with id: ${fileId}`);
    }
    return file;
  }

  getCurrentFileName(): string | undefined {
    const currentFile = this.files.find((f) => f.id === this.currentFileId);
    return currentFile?.filename;
  }

  getCurrentFileConversation(): LocalMessage[] {
    if (this.currentFileId) {
      return this.fileConversations.get(this.currentFileId) || [];
    }
    return [];
  }

  private addMessageToCurrentFileConversation(message: LocalMessage) {
    if (!this.currentFileId) {
      console.warn(
        'No file selected; cannot add message to file conversation.'
      );
      return;
    }

    this.fileConversations.set(this.currentFileId, [
      ...(this.fileConversations.get(this.currentFileId) || []),
      message,
    ]);
  }

  addMessage(message: string) {
    const newMessage: LocalMessage = { role: 'user', content: message };
    this.history.push(newMessage);

    // Add to file-specific conversation if a file is selected
    this.addMessageToCurrentFileConversation(newMessage);
  }

  private filterOutLocalMessages(messages: LocalMessage[]): OpenAiMessage[] {
    return messages.filter((m) => m.role !== 'local') as OpenAiMessage[];
  }

  private createFileInputMessages(): OpenAiMessage[] {
    if (this.currentFileId) {
      const fileConversation =
        this.fileConversations.get(this.currentFileId) || [];
      const messages = this.filterOutLocalMessages(fileConversation);

      // Include a reference to the selected file on the first user message
      const firstUserMessageId = messages.findIndex((m) => m.role === 'user');
      if (firstUserMessageId !== -1) {
        const firstUserMessage = clone(messages[firstUserMessageId]);

        const fileReference: FileReferenceContent = {
          type: 'input_file',
          file_id: this.currentFileId,
        };
        const fileMessage: FileReferenceContent = {
          type: 'input_text',
          text: firstUserMessage.content as string,
        };
        firstUserMessage.content = [fileReference, fileMessage];

        messages[firstUserMessageId] = firstUserMessage || messages[0];
      }

      return messages;
    }

    // no file messages, use the main history
    return this.filterOutLocalMessages(this.history);
  }

  private async getChatReply(): Promise<LocalMessage> {
    this.lastError = null;
    try {
      const messages = this.createFileInputMessages();
      console.log('Sending messages to OpenAI:', messages);

      const response = await this.client.responses.create({
        ...LLM_DEFAULTS,
        input: messages,
      });
      const reply = response.output_text;
      return { role: 'assistant', content: reply };
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

  async sendMessages(): Promise<LocalMessage[]> {
    const replyMessage = await this.getChatReply();
    this.history.push(replyMessage);

    if (this.currentFileId) {
      // Save the conversation for the current file
      this.addMessageToCurrentFileConversation(replyMessage);
      return this.fileConversations.get(this.currentFileId) || [];
    }

    // No current file, just update main history
    return this.history;
  }

  getCurrentMessages(): LocalMessage[] {
    if (this.currentFileId) {
      return this.getCurrentFileConversation();
    }
    return this.history;
  }
}
