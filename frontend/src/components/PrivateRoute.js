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
            <div className="main-container">
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
                    <div className="text-center">
                        <div className="modern-spinner mx-auto mb-4"></div>
                        <h3 className="gradient-text mb-2">Vérification de votre session</h3>
                        <p className="text-muted">Nous sécurisons votre connexion...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!user) {
        console.log('PrivateRoute: Utilisateur non connecté, redirection vers /login');
        return <Navigate to="/login" replace />;
    }

    console.log('PrivateRoute: Utilisateur connecté, affichage du composant');
    return children;
};

export default PrivateRoute; 