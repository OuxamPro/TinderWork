import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// Configuration d'axios
const api = axios.create({
    baseURL: 'http://localhost/TinderWork/backend',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    withCredentials: true
});

// Intercepteur pour les requêtes
api.interceptors.request.use(
    config => {
        console.log('Requête envoyée:', config);
        return config;
    },
    error => {
        console.error('Erreur de requête:', error);
        return Promise.reject(error);
    }
);

// Intercepteur pour les réponses
api.interceptors.response.use(
    response => {
        console.log('Réponse reçue:', response);
        return response;
    },
    error => {
        console.error('Erreur de réponse:', error);
        if (error.response) {
            console.error('Détails de l\'erreur:', error.response.data);
        }
        return Promise.reject(error);
    }
);

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        // Vérifier si l'utilisateur est déjà connecté
        if (token) {
            // Vérifier la validité du token
            checkAuth(token);
        } else {
            setLoading(false);
        }
    }, [token]);

    const checkAuth = async (currentToken) => {
        try {
            const response = await api.get('/check_auth.php', {
                headers: {
                    'Authorization': `Bearer ${currentToken}`
                }
            });
            if (response.data.user) {
                setUser(response.data.user);
            } else {
                logout();
                window.location.reload();
            }
        } catch (error) {
            console.error('Erreur lors de la vérification de l\'authentification:', error);
            logout();
            window.location.reload();
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            console.log('Tentative de connexion avec:', { email, password });
            const response = await api.post('/login.php', {
                email,
                password
            });
            console.log('Réponse du serveur:', response.data);

            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                setToken(response.data.token);
                setUser(response.data.user);
                return { success: true };
            } else {
                throw new Error('Token manquant dans la réponse');
            }
        } catch (error) {
            console.error('Erreur lors de la connexion:', error);
            return {
                success: false,
                error: error.response?.data?.message || 'Erreur lors de la connexion'
            };
        }
    };

    const register = async (userData) => {
        try {
            console.log('Tentative d\'inscription avec les données:', userData);
            const response = await api.post('/register.php', userData);
            console.log('Réponse du serveur:', response.data);

            if (response.data.message === 'Utilisateur créé avec succès.') {
                // Connexion automatique après l'inscription
                return await login(userData.email, userData.password);
            } else {
                throw new Error(response.data.message || 'Erreur lors de l\'inscription');
            }
        } catch (error) {
            console.error('Erreur lors de l\'inscription:', error);
            return {
                success: false,
                error: error.response?.data?.message || 'Erreur lors de l\'inscription'
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    const value = {
        user,
        setUser,
        loading,
        token,
        login,
        register,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
    }
    return context;
}; 