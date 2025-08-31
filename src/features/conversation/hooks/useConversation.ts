import { useRef, useState } from 'react';
import { OpenAiClient } from '../../../api/openai/OpenAiClient';
import type { Message } from '../../../api/openai/types';

type UseConversationResponse = {
  currentFileName?: string;
  messages: Message[];

  selectFile: (file: File) => Promise<void>;
  sendMessage: (message: string) => Promise<void>;
};

export const useConversation = (): UseConversationResponse => {
  const clientRef = useRef(new OpenAiClient());
  const [messages, setMessages] = useState<Message[]>(
    clientRef.current.history
  );

  const selectFile = async (file: File) => {
    await clientRef.current.addFile(file);
    setMessages([...clientRef.current.history]);
  };

  const sendMessage = async (message: string) => {
    setMessages([
      ...clientRef.current.history,
      { role: 'user', content: message },
    ]);
    const response = await clientRef.current.sendMessage(message);
    console.log('AI Response:', response);
    setMessages([...clientRef.current.history]);
  };

  return {
    messages,
    currentFileName: clientRef.current.currentFile?.filename,

    selectFile,
    sendMessage,
  };
};
