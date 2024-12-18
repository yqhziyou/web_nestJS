// App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import Home from './pages/Home';
import { UserProvider } from './context/UserContext';
import UserProfile from "./components/userInfo.tsx";




function App() {
    return (
        <UserProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<LoginPage />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/profile" element={<UserProfile />} />
                </Routes>
            </Router>
        </UserProvider>
    );
}

export default App;
