import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation
import { login, createUser } from '../api/user';
import './LoginComponent.css';
import { useUser } from '../context/UserContext';

const LoginComponent: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [isRegistering, setIsRegistering] = useState<boolean>(false);
    const { setUserid } = useUser();

    const navigate = useNavigate(); // Initialize navigate

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        const LoginDTO = { username, password };
        try {
            const response = await login(LoginDTO);
            setUserid(response.id);
            alert('Login successful! Redirecting to the HomePage...');
            console.log('Login successful:', response);
           
            navigate('/home', { state: { userid: response.id } });
        } catch (error) {
            console.error('Login failed:', error);
            alert('Login failed. Please check your credentials and try again.');
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        const CreateUserDTO = { username, email, password };
        try {
            const response = await createUser(CreateUserDTO);
            alert('Registration successful! Redirecting to login page...');
            console.log('Registration successful:', response);
            setIsRegistering(false); // Switch to log mode after registration
        } catch (error) {
            console.error('Registration failed:', error);
            alert('Registration failed. Please try again.');
        }
    };

    return (
        <div className="login-container">
            <div className="login-form">
                <h2>{isRegistering ? 'Register' : 'Login'}</h2>
                <form onSubmit={isRegistering ? handleRegister : handleLogin}>
                    {isRegistering && (
                        <div className="form-group">
                            <label htmlFor="email">Email:</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    )}
                    <div className="form-group">
                        <label htmlFor="username">Username:</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {isRegistering && (
                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm Password:</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                    )}
                    <button type="submit">{isRegistering ? 'Register' : 'Login'}</button>
                </form>
                <button className="toggle-button" onClick={() => setIsRegistering(!isRegistering)}>
                    {isRegistering ? 'Already have an account? Login' : 'Don\'t have an account? Register'}
                </button>
            </div>
            <div className="login-image">
                <img src="/img.png" alt="Login Illustration" />
            </div>
        </div>
    );
};

export default LoginComponent;
