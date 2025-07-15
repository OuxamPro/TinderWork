import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="bg-white shadow-lg">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <Link to="/" className="text-xl font-bold text-gray-800">
                            TinderWork
                        </Link>
                    </div>

                    <div className="flex items-center space-x-4">
                        {user ? (
                            <>
                                <Link to="/dashboard" className="text-gray-600 hover:text-gray-800">
                                    Tableau de bord
                                </Link>
                                <Link to="/profile" className="text-gray-600 hover:text-gray-800">
                                    Profil
                                </Link>
                                <Link to="/faq" className="text-gray-600 hover:text-gray-800">
                                    FAQ
                                </Link>
                                {/* Avatar utilisateur */}
                                <Link to="/profile" className="flex items-center">
                                    {user.profilePicture ? (
                                        <img
                                            src={`http://localhost/TinderWork/backend/${user.profilePicture}`}
                                            alt="Photo de profil"
                                            className="w-10 h-10 rounded-full object-cover border border-gray-300 shadow-sm"
                                            style={{ minWidth: 40, minHeight: 40 }}
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-lg font-bold border border-gray-300 shadow-sm">
                                            <i className="fas fa-user"></i>
                                        </div>
                                    )}
                                </Link>
                                <button
                                    onClick={logout}
                                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                                >
                                    Déconnexion
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="text-gray-600 hover:text-gray-800"
                                >
                                    Se connecter
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                                >
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