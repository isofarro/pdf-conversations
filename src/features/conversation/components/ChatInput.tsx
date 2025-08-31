import { useState } from 'react';

type ChatInputProps = {
  isBusy: boolean;
  onSend: (message: string) => void;
};

export const ChatInput = ({ isBusy, onSend }: ChatInputProps) => {
  const [input, setInput] = useState('');
  const isDisabled = isBusy || input.trim() === '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSend(input.trim());
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="chat-form">
      <label htmlFor="chatInput" className="sr-only">
        Your Message:
      </label>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message..."
        rows={4}
      />
      <button type="submit" disabled={isDisabled}>
        Send
      </button>
    </form>
  );
};
