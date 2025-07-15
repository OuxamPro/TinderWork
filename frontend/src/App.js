import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import RecruiterProfile from './pages/RecruiterProfile';
import Swipe from './pages/Swipe';
import Matches from './pages/Matches';
import Chat from './pages/Chat';
import JobPostForm from './components/JobPostForm';
import MyJobs from './pages/MyJobs';
import PrivateRoute from './components/PrivateRoute';
import FAQ from './pages/FAQ';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/CustomStyles.css';

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="min-h-screen bg-gray-100">
                    <Navbar />
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/faq" element={<FAQ />} />
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                        <Route
                            path="/dashboard"
                            element={
                                <PrivateRoute>
                                    <Dashboard />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/profile"
                            element={
                                <PrivateRoute>
                                    <Profile />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/recruiter-profile"
                            element={
                                <PrivateRoute>
                                    <RecruiterProfile />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/swipe"
                            element={
                                <PrivateRoute>
                                    <Swipe />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/matches"
                            element={
                                <PrivateRoute>
                                    <Matches />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/chat/:conversationId"
                            element={
                                <PrivateRoute>
                                    <Chat />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/post-job"
                            element={
                                <PrivateRoute>
                                    <JobPostForm />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/my-jobs"
                            element={
                                <PrivateRoute>
                                    <MyJobs />
                                </PrivateRoute>
                            }
                        />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App; 