
export type OpenAiMessage = {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

export type Message = {
    role: 'user' | 'assistant' | 'system' | 'local';
    content: string;
}
