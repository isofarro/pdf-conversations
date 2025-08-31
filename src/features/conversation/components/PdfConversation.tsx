import { UploadFile } from './UploadFile';
import { ChatInput } from './ChatInput';
import { ChatMessages } from './ChatMessages';
import { useConversation } from '../hooks/useConversation';
import { SelectFile } from './SelectFile';

export const PdfConversation = () => {
  const {
    isBusy,
    messages,
    files,
    currentFileName,
    error,
    uploadFile,
    selectFile,
    sendMessage,
  } = useConversation();

  return (
    <>
      {currentFileName !== undefined && (
        <div className="chat-filename">{`Chatting about file: ${currentFileName}`}</div>
      )}
      {error && <div className="chat-error">Error: {error}</div>}
      <ChatMessages messages={messages} isBusy={isBusy} />
      <div className="file-controls">
        <SelectFile files={files} onSelect={selectFile} isBusy={isBusy} />
        <UploadFile onUpload={uploadFile} isBusy={isBusy} />
      </div>
      <ChatInput onSend={sendMessage} isBusy={isBusy} />
    </>
  );
};
