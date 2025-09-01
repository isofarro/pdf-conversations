import { useEffect, useRef, useState } from 'react';
import { OpenAiClient } from '../../../api/openai/OpenAiClient';
import type { LocalMessage, UploadedFile } from '../../../api/openai/types';
import { StatusEnum } from '../types';

type UseConversationResponse = {
  status: StatusEnum;
  isBusy: boolean;

  files: UploadedFile[];
  currentFile?: UploadedFile;

  messages: LocalMessage[];

  error: string | undefined;

  uploadFile: (file: File) => Promise<void>;
  selectFile: (fileId: string) => Promise<void>;
  sendMessage: (message: string) => Promise<void>;
};

export const useConversation = (): UseConversationResponse => {
  const [status, setStatus] = useState<StatusEnum>(StatusEnum.INIT);
  const clientRef = useRef(new OpenAiClient());
  const [messages, setMessages] = useState<LocalMessage[]>(
    clientRef.current.getCurrentMessages()
  );
  const [files, setFiles] = useState<UploadedFile[]>(clientRef.current.files);
  const [currentFile, setCurrentFile] = useState<UploadedFile | undefined>(
    clientRef.current.getCurrentFile()
  );

  const isBusy = [
    StatusEnum.LOADING,
    StatusEnum.UPLOADING,
    StatusEnum.WAITING,
  ].includes(status);

  const uploadFile = async (file: File) => {
    if (isBusy) return;
    try {
      setStatus(StatusEnum.UPLOADING);
      await clientRef.current.addFile(file);
      setMessages([...clientRef.current.getCurrentMessages()]);
      setFiles([...clientRef.current.files]);
      setCurrentFile(clientRef.current.getCurrentFile());
      setStatus(StatusEnum.IDLE);
    } catch (error) {
      console.error('Error uploading file:', error);
      setStatus(StatusEnum.ERROR);
    }
  };

  const selectFile = async (fileId: string) => {
    if (isBusy) return;
    try {
      setStatus(StatusEnum.WAITING);
      await clientRef.current.selectFileById(fileId);
      setMessages([...clientRef.current.getCurrentMessages()]);
      setStatus(StatusEnum.IDLE);
    } catch (error) {
      console.error('Error selecting file:', error);
      setStatus(StatusEnum.ERROR);
      return;
    }
  };

  const sendMessage = async (message: string) => {
    if (isBusy) return;
    try {
      setStatus(StatusEnum.WAITING);

      clientRef.current.addMessage(message);
      setMessages([...clientRef.current.getCurrentMessages()]);

      const messages = await clientRef.current.sendMessages();
      setMessages([...messages]);

      setStatus(StatusEnum.IDLE);
    } catch (error) {
      console.error('Error sending message:', error);
      setStatus(StatusEnum.ERROR);
      return;
    }
  };

  useEffect(() => {
    if (isBusy) return;
    setStatus(StatusEnum.LOADING);
    clientRef.current
      .loadFiles()
      .then(() => {
        setFiles([...clientRef.current.files]);
      })
      .catch((error) => {
        console.error('Error loading files:', error);
      });
    setStatus(StatusEnum.IDLE);
  }, []);

  return {
    status,
    isBusy,

    files,
    currentFile,

    messages,

    error: clientRef.current.lastError || undefined,

    uploadFile,
    selectFile,
    sendMessage,
  };
};
