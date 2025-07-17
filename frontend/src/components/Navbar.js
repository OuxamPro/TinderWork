import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="navbar-modern">
            <div className="navbar-container">
                <div className="navbar-content">
                    {/* Logo */}
                    <div className="navbar-brand">
                        <Link to="/" className="navbar-logo">
                            <div className="logo-icon">
                                <i className="fas fa-briefcase"></i>
                            </div>
                            <span className="logo-text">TinderWork</span>
                        </Link>
                    </div>

                    {/* Navigation Links */}
                    <div className="navbar-links">
                        {user ? (
                            <>
                                <Link to="/dashboard" className="nav-link-modern">
                                    <i className="fas fa-home me-2"></i>
                                    Tableau de bord
                                </Link>
                                <Link to="/swipe" className="nav-link-modern">
                                    <i className="fas fa-heart me-2"></i>
                                    Découvrir
                                </Link>
                                <Link to="/matches" className="nav-link-modern">
                                    <i className="fas fa-comments me-2"></i>
                                    Conversations
                                </Link>
                                <Link to="/profile" className="nav-link-modern">
                                    <i className="fas fa-user me-2"></i>
                                    Profil
                                </Link>
                                <Link to="/faq" className="nav-link-modern">
                                    <i className="fas fa-question-circle me-2"></i>
                                    FAQ
                                </Link>
                            </>
                        ) : null}
                    </div>

                    {/* User Section */}
                    <div className="navbar-user">
                        {user ? (
                            <>
                                {/* Avatar utilisateur */}
                                <Link to="/profile" className="user-avatar-container">
                                    {user.profilePicture ? (
                                        <img
                                            src={`http://localhost/TinderWork/backend/${user.profilePicture}`}
                                            alt="Photo de profil"
                                            className="user-avatar"
                                        />
                                    ) : (
                                        <div className="user-avatar-placeholder">
                                            <i className="fas fa-user"></i>
                                        </div>
                                    )}
                                    <div className="user-info">
                                        <span className="user-name">{user.firstName}</span>
                                        <span className="user-role">{user.role === 'candidate' ? 'Candidat' : 'Recruteur'}</span>
                                    </div>
                                </Link>
                                
                                {/* Bouton déconnexion */}
                                <button
                                    onClick={logout}
                                    className="logout-btn"
                                >
                                    <i className="fas fa-sign-out-alt me-2"></i>
                                    Déconnexion
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="login-btn"
                                >
                                    <i className="fas fa-sign-in-alt me-2"></i>
                                    Se connecter
                                </Link>
                                <Link
                                    to="/register"
                                    className="register-btn"
                                >
                                    <i className="fas fa-user-plus me-2"></i>
                                    S'inscrire
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar; 