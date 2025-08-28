import Markdown from 'markdown-to-jsx';
import type { Message } from '../../api/openai/types';

type ChatMessagesProps = {
  messages: Message[];
  filename?: string;
};

const ChatMessage = ({ message }: { message: Message }) => {
  const isStringContent = typeof message.content === 'string';
  if (!isStringContent) {
    return null;
  } // Only render string content for now
  return (
    <div className={`chat-message role-${message.role}`}>
      <strong>
        {message.role === 'user'
          ? 'You: '
          : message.role === 'assistant'
            ? ''
            : 'System: '}
      </strong>
      <Markdown>{message.content as string}</Markdown>
    </div>
  );
};

export const ChatMessages = ({ messages, filename }: ChatMessagesProps) => {
  return (
    <>
      {!!filename && (
        <div className="chat-filename">{`Chatting about file: ${filename}`}</div>
      )}
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <ChatMessage key={index} message={msg} />
        ))}
      </div>
    </>
  );
};
