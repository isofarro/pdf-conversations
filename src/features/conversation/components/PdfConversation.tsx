import { SelectFile } from './SelectFile';
import { ChatInput } from './ChatInput';
import { ChatMessages } from './ChatMessages';
import { useConversation } from '../hooks/useConversation';

export const PdfConversation = () => {
  const { isBusy, messages, currentFileName, error, selectFile, sendMessage } =
    useConversation();

  return (
    <>
      {currentFileName !== undefined && (
        <div className="chat-filename">{`Chatting about file: ${currentFileName}`}</div>
      )}
      {error && <div className="chat-error">Error: {error}</div>}
      <ChatMessages messages={messages} isBusy={isBusy} />
      <SelectFile onSelect={selectFile} isBusy={isBusy} />
      <ChatInput onSend={sendMessage} isBusy={isBusy} />
    </>
  );
};
