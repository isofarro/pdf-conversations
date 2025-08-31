import { SelectFile } from '../documents/SelectFile';
import { ChatInput } from './ChatInput';
import { ChatMessages } from './ChatMessages';
import { useConversation } from './hooks/useConversation';

export const PdfConversation = () => {
  const { messages, currentFileName, selectFile, sendMessage } =
    useConversation();

  return (
    <>
      <ChatMessages messages={messages} filename={currentFileName} />
      <SelectFile onSelect={selectFile} />
      <ChatInput onSend={sendMessage} />
    </>
  );
};
