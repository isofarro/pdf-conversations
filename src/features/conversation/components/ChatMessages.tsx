import Markdown from 'markdown-to-jsx';
import type { Message } from '../../../api/openai/types';
import { ThreeDot } from 'react-loading-indicators';

type ChatMessagesProps = {
  messages: Message[];
  isBusy: boolean;
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

export const ChatMessages = ({ messages, isBusy }: ChatMessagesProps) => {
  return (
    <>
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <ChatMessage key={index} message={msg} />
        ))}
        {isBusy && (
          <div className="chat-status">
            <ThreeDot color="#32cd32" size="small" />
          </div>
        )}
      </div>
    </>
  );
};
