import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();

    console.log('=== PRIVATE ROUTE ===');
    console.log('user:', user);
    console.log('loading:', loading);
    console.log('user existe:', !!user);

    if (loading) {
        console.log('PrivateRoute: Chargement en cours...');
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!user) {
        console.log('PrivateRoute: Utilisateur non connecté, redirection vers /login');
        return <Navigate to="/login" />;
    }

    console.log('PrivateRoute: Utilisateur connecté, affichage du composant');
    return children;
};

export default PrivateRoute; 