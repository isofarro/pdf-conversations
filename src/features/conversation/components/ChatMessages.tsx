import Markdown from 'markdown-to-jsx';
import type {
  FileReferenceContent,
  LocalMessage,
} from '../../../api/openai/types';
import { ThreeDot } from 'react-loading-indicators';

type ChatMessagesProps = {
  messages: LocalMessage[];
  isBusy: boolean;
};

const formatContentArrayAsString = (
  content: FileReferenceContent[]
): string => {
  return content
    .map((item) => {
      if (item.type === 'input_file') {
        // return `[File: ${item.file_id}]`;
        return '';
      } else if (item.type === 'input_text') {
        return item.text;
      }
      return '';
    })
    .join('\n');
};

const formatMessageContentAsString = (
  content: string | FileReferenceContent[]
): string => {
  if (typeof content === 'string') {
    return content as string;
  } else {
    return formatContentArrayAsString(content);
  }
};

const ChatMessage = ({ message }: { message: LocalMessage }) => {
  const text = formatMessageContentAsString(message.content);

  return (
    <div className={`chat-message role-${message.role}`}>
      <strong>
        {message.role === 'user'
          ? 'You: '
          : message.role === 'assistant'
            ? ''
            : 'System: '}
      </strong>
      <Markdown>{text}</Markdown>
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
