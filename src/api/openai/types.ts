export type OpenAiMessage = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

export type FileUploadContent =
  | {
      type: 'input_file';
      file_id: string;
    }
  | {
      type: 'text';
      text: string;
    };

export type Message = {
  role: 'user' | 'assistant' | 'system' | 'local';
  content: string | FileUploadContent[];
};

export type UploadedFile = {
  id: string;
  filename: string;
  purpose: string;
};
