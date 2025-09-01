export type FileReferenceContent =
  | {
      type: 'input_file';
      file_id: string;
    }
  | {
      type: 'input_text';
      text: string;
    };

// A format that can handle file references.
export type OpenAiMessage = {
  role: 'user' | 'assistant' | 'system';
  content: string | FileReferenceContent[];
};

// Let's keep the local messages simple
export type LocalMessage = {
  role: 'user' | 'assistant' | 'system' | 'local';
  content: string;
};

export type UploadedFile = {
  id: string;
  filename: string;
  purpose: string;
};
