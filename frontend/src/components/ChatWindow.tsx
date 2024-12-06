import React, { useState, useEffect } from 'react';
import { getMessageList, getMessageReply } from '../api/session';
import { Input, Button, List, Typography } from 'antd';
import './ChatWindow.css';

interface Message {
    id: number;
    sessionId: number;
    content: string;
    role: 'user' | 'assistant';
    tokenUsage: number;
    createdAt: string;
}

interface ChatWindowProps {
    sessionToken: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ sessionToken }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [userInput, setUserInput] = useState<string>('');

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await getMessageList(sessionToken);
                setMessages(response);
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };
        fetchMessages();
    }, [sessionToken]);

    const handleSendMessage = async () => {
        if (!userInput.trim()) return;

        const userMessage: Message = {
            id: messages.length + 1,
            sessionId: messages.length > 0 ? messages[0].sessionId : 0,
            content: userInput,
            role: 'user',
            tokenUsage: 0,
            createdAt: new Date().toISOString(),
        };

        setMessages((prevMessages) => [...prevMessages, userMessage]);

        try {
            const response = await getMessageReply(sessionToken, userInput);
            const assistantMessage: Message = {
                id: userMessage.id + 1,
                sessionId: userMessage.sessionId,
                content: response.content,
                role: 'assistant',
                tokenUsage: response.tokenUsage,
                createdAt: new Date().toISOString(),
            };

            setMessages((prevMessages) => [...prevMessages, assistantMessage]);
        } catch (error) {
            console.error('Error sending message:', error);
        }

        setUserInput('');
    };

    return (
        <div className="chat-window">
            <List
                className="message-list"
                dataSource={messages}
                renderItem={(message) => (
                    <List.Item
                        className={`message-item ${message.role}`}
                    >
                        <div className={`message-content ${message.role}`}>
                            <Typography.Text>
                                {message.role === 'user' ? 'User' : 'Assistant'}: {message.content}
                            </Typography.Text>
                        </div>
                    </List.Item>
                )}
            />
            <div className="input-container">
                <Input.TextArea
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    rows={2}
                    placeholder="Type your message..."
                />
                <Button type="primary" onClick={handleSendMessage}>
                    Send
                </Button>
            </div>
        </div>
    );
};

export default ChatWindow;
