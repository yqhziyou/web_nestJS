import React, { useState } from 'react';
import ChatList from '../components/ChatList';
import ChatWindow from '../components/ChatWindow';
import { useLocation } from 'react-router-dom';
import './Home.css';

const Home: React.FC = () => {
    const location = useLocation();
    const { userid } = location.state || {};
    const [sessionToken, setSessionToken] = useState<string | null>(null);

    return (
        <div className="home-container">
            <ChatList userId={userid} setSessionToken={setSessionToken} />
            {sessionToken ? (
                <ChatWindow sessionToken={sessionToken} />
            ) : (
                <div>Please select a session to start chatting.</div>
            )}
        </div>
    );
};

export default Home;
