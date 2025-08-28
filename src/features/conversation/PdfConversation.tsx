import { useRef, useState } from "react";
import { SelectFile } from "../documents/SelectFile";
import { OpenAiClient } from "../../api/openai/OpenAiClient";
import { ChatInput } from "./ChatInput";
import { ChatMessages } from "./ChatMessages";


export const PdfConversation = () => {
    const clientRef = useRef(new OpenAiClient())
    const [messages, setMessages] = useState(clientRef.current.history);

    const handleFileSelect = (file: string) => {
        clientRef.current.addFile(file);
    }

    const handleMessage = async (message: string) => {
        setMessages([...clientRef.current.history, { role: 'user', content: message }]);
        const response = await clientRef.current.sendMessage(message);
        console.log("AI Response:", response);
        setMessages([...clientRef.current.history]);
    }
    
    return (
        <>
            <div className="card">
                <ChatMessages messages={messages} />
                <ChatInput onSend={handleMessage} />
                <SelectFile onSelect={handleFileSelect} />
            </div>
        </>
    );
}
