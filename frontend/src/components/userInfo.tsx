import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getUserInfo, updateUser } from '../api/user';
import { useUser } from '../context/UserContext';
import styles from './UserInfo.module.css';

interface User {
    id: number;
    username: string;
    email: string;
    createdAt: string;
    updatedAt: string;
}

const UserProfile: React.FC = () => {
    const { userid: paramUserId } = useParams<{ userid: string }>(); 
    const context = useUser();
    const effectiveUserId = Number(paramUserId) || context.userid; 
    const [user, setUser] = useState<User | null>(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    console.log("Effective user ID:", effectiveUserId);

    // Fetch user info
    useEffect(() => {
        if (!effectiveUserId) {
            setError('User ID is not available');
            setLoading(false);
            return;
        }

        const fetchUserInfoData = async () => {
            try {
                setLoading(true);
                const response = await getUserInfo(effectiveUserId);
                setUser(response);
                setFormData({
                    username: response.username,
                    email: response.email,
                    password: '' 
                });
            } catch (err) {
                setError('Failed to fetch user information');
            } finally {
                setLoading(false);
            }
        };

        fetchUserInfoData();
    }, [effectiveUserId]);

    // Handle input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle form submission
    const handleUpdateUser = async () => {
        try {
            setLoading(true);
            if (!effectiveUserId) throw new Error('User ID is not available');
            const response = await updateUser(effectiveUserId, formData);
            setUser(response);
            setEditMode(false);
        } catch (err) {
            setError('Failed to update user information');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div id="user-profile-container" className={styles['user-profile-container']}>
            <h1>User Profile</h1>
            {user ? (
                <div>
                    {editMode ? (
                        <div>
                            <label className={styles.label}>
                                Username:
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    className={styles.input}
                                />
                            </label>
                            <label className={styles.label}>
                                Email:
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className={styles.input}
                                />
                            </label>
                            <label className={styles.label}>
                                Password:
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className={styles.input}
                                />
                            </label>
                            <button className={styles.button} onClick={handleUpdateUser}>Save</button>
                            <button className={styles.button} onClick={() => setEditMode(false)}>Cancel</button>
                        </div>
                    ) : (
                        <div>
                            <p><strong>Username:</strong> {user.username}</p>
                            <p><strong>Email:</strong> {user.email}</p>
                            <p><strong>Created At:</strong> {new Date(user.createdAt).toLocaleString()}</p>
                            <p><strong>Updated At:</strong> {new Date(user.updatedAt).toLocaleString()}</p>
                            <button className={styles.button} onClick={() => setEditMode(true)}>Update</button>
                        </div>
                    )}
                </div>
            ) : (
                <p>User not found</p>
            )}
        </div>
    );
};

export default UserProfile;
