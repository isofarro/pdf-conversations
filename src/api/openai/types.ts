export type OpenAiMessage = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

export type FileReferenceContent =
  | {
      type: 'input_file';
      file_id: string;
    }
  | {
      type: 'input_text';
      text: string;
    };

export type Message = {
  role: 'user' | 'assistant' | 'system' | 'local';
  content: string | FileReferenceContent[];
};

export type UploadedFile = {
  id: string;
  filename: string;
  purpose: string;
};
