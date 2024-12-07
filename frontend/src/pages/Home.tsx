import React, { useState, useEffect } from 'react';
import ChatList from '../components/ChatList';
import ChatWindow from '../components/ChatWindow';
import {Link, useLocation} from 'react-router-dom';
import './Home.css';
import { useUser } from '../context/UserContext';

const Home: React.FC = () => {
    const { userid, setUserid } = useUser();
    const location = useLocation();
    const locationUserid = location.state?.userid;
    const [sessionToken, setSessionToken] = useState<string | null>(null);

    // Set userid from location state if not already set in context
    useEffect(() => {
        if (locationUserid && !userid) {
            setUserid(locationUserid);
        }
    }, [locationUserid, userid, setUserid]);
    
    if (!userid) {
        return <p>Error: User ID is missing. Please log in again.</p>;
    }

    return (
        <div className="home-container">
            {/* Banner Section */}
            <div className="banner">
                <h1>Welcome to the ChatGPT Clone</h1>
            </div>

            {/* Navbar Section */}
            <nav className="navbar">
                <ul>
                    <li><a href="/home">Home</a></li>
                    <li>
                        <Link
                            to={{
                                pathname: "/profile",
                            }}
                            state={{userid}}
                        >
                            Account
                        </Link>
                    </li>
                    <li><a href="/">Log Out</a></li>
                </ul>
            </nav>

            {/* Main Content Section */}
            <div className="main-content">
                <ChatList userId={userid} setSessionToken={setSessionToken}/>
                {sessionToken ? (
                    <ChatWindow sessionToken={sessionToken}/>
                ) : (
                    <div>Please select a session to start chatting.</div>
                )}
            </div>
            
        </div>
    );
};

export default Home;
