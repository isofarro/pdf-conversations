import { useState } from 'react';

type ChatInputProps = {
  onSend: (message: string) => void;
};

export const ChatInput = ({ onSend }: ChatInputProps) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSend(input.trim());
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="chat-form">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message..."
        rows={4}
      />
      <button type="submit" disabled={input === ''}>
        Send
      </button>
    </form>
  );
};
