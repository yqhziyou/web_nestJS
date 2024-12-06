import React, { useState, useEffect } from 'react';
import { getUserSessions } from '../api/user';
import { createSession } from '../api/session';
import { List, Button, message } from 'antd';

interface UserSession {
    id: number;
    userId: number;
    sessionToken: string;
    model: string;
    createdAt: string;
    updatedAt: string;
    totalTokenUsage: number;
}

interface ChatListProps {
    userId: number;
    setSessionToken: (token: string) => void;
}

const ChatList: React.FC<ChatListProps> = ({ userId, setSessionToken }) => {
    const [sessions, setSessions] = useState<UserSession[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const response = await getUserSessions(userId);
                setSessions(response);
            } catch (error) {
                console.error('Error fetching sessions:', error);
            }
        };
        fetchSessions();
    }, [userId]);

    const handleCreateSession = async () => {
        setLoading(true);
        try {
            const newSessionDTO = {
                userId,
                model: 'gpt-4o-mini', // Replace with the default model or user-selected model
            };
            const newSession = await createSession(newSessionDTO);
            setSessions((prev) => [...prev, newSession]);
            message.success('New session created successfully!');
        } catch (error) {
            console.error('Error creating new session:', error);
            message.error('Failed to create a new session.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Button
                type="primary"
                onClick={handleCreateSession}
                loading={loading}
                style={{ marginBottom: '20px' }}
            >
                New Session
            </Button>
            <List
                header={<div>User Sessions</div>}
                bordered
                dataSource={sessions}
                renderItem={(session) => (
                    <List.Item
                        actions={[
                            <Button
                                type="primary"
                                onClick={() => setSessionToken(session.sessionToken)}
                            >
                                Select
                            </Button>,
                        ]}
                    >
                        <List.Item.Meta
                            title={`Updated At: ${new Date(session.updatedAt).toLocaleString()}`}
                            description={`Token Usage: ${session.totalTokenUsage}`}
                        />
                    </List.Item>
                )}
            />
        </div>
    );
};

export default ChatList;
