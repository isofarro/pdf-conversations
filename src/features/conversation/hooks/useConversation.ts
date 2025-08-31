import { useRef, useState } from 'react';
import { OpenAiClient } from '../../../api/openai/OpenAiClient';
import type { Message } from '../../../api/openai/types';
import { StatusEnum } from '../types';

type UseConversationResponse = {
  status: StatusEnum;
  isBusy: boolean;
  currentFileName?: string;
  messages: Message[];
  error: string | undefined;

  selectFile: (file: File) => Promise<void>;
  sendMessage: (message: string) => Promise<void>;
};

export const useConversation = (): UseConversationResponse => {
  const [status, setStatus] = useState<StatusEnum>(StatusEnum.INIT);
  const clientRef = useRef(new OpenAiClient());
  const [messages, setMessages] = useState<Message[]>(
    clientRef.current.history
  );

  const isBusy = [StatusEnum.UPLOADING, StatusEnum.WAITING].includes(status);

  const selectFile = async (file: File) => {
    try {
      setStatus(StatusEnum.UPLOADING);
      await clientRef.current.addFile(file);
      setMessages([...clientRef.current.history]);
      setStatus(StatusEnum.IDLE);
    } catch (error) {
      console.error('Error uploading file:', error);
      setStatus(StatusEnum.ERROR);
    }
  };

  const sendMessage = async (message: string) => {
    try {
      setStatus(StatusEnum.WAITING);

      clientRef.current.addMessage(message);
      setMessages([...clientRef.current.history]);

      const messages = await clientRef.current.sendMessages();
      setMessages([...messages]);

      setStatus(StatusEnum.IDLE);
    } catch (error) {
      console.error('Error sending message:', error);
      setStatus(StatusEnum.ERROR);
      return;
    }
  };

  return {
    status,
    isBusy,
    messages,
    currentFileName: clientRef.current.currentFile?.filename,
    error: clientRef.current.lastError || undefined,

    selectFile,
    sendMessage,
  };
};
