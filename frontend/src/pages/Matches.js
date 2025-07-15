import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Matches = () => {
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const { user, token } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user && token) {
            fetchConversations();
        }
    }, [user, token]);

    const fetchConversations = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get('http://localhost/TinderWork/backend/get_conversations.php', {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                withCredentials: true
            });
            setConversations(response.data);
        } catch (err) {
            setError(err.response?.data?.error || 'Une erreur est survenue lors de la récupération des conversations');
        } finally {
            setLoading(false);
        }
    };

    const handleConversationClick = (conversation) => {
        setSelectedConversation(conversation);
        // Animation de transition
        setTimeout(() => {
            navigate(`/chat/${conversation.conversation_id}`);
        }, 300);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
            return 'Aujourd\'hui';
        } else if (diffDays === 2) {
            return 'Hier';
        } else if (diffDays <= 7) {
            return `Il y a ${diffDays - 1} jours`;
        } else {
            return date.toLocaleDateString('fr-FR');
        }
    };

    const getInitials = (firstName, lastName) => {
        return `${firstName?.charAt(0) || 'U'}${lastName?.charAt(0) || ''}`.toUpperCase();
    };

    if (loading) {
        return (
            <div className="main-container">
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
                    <div className="text-center">
                        <div className="modern-spinner mx-auto mb-4"></div>
                        <h3 className="gradient-text mb-2">Chargement de vos conversations</h3>
                        <p className="text-muted">Nous préparons tout pour vous...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="main-container">
                <div className="container">
                    <div className="toast-modern">
                        <div className="d-flex align-items-center">
                            <div className="flex-shrink-0">
                                <div className="bg-danger rounded-circle d-flex align-items-center justify-content-center" 
                                     style={{ width: '40px', height: '40px' }}>
                                    <i className="fas fa-exclamation-triangle text-white"></i>
                                </div>
                            </div>
                            <div className="flex-grow-1 ms-3">
                                <h6 className="mb-1">Erreur</h6>
                                <p className="mb-0">{error}</p>
                            </div>
                        </div>
                        <div className="mt-3">
                            <button 
                                className="btn btn-modern btn-primary-modern me-2"
                                onClick={() => navigate('/dashboard')}
                            >
                                Retour au tableau de bord
                            </button>
                            <button 
                                className="btn btn-modern btn-secondary-modern"
                                onClick={fetchConversations}
                            >
                                Réessayer
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="main-container">
            <div className="container">
                {/* Header moderne */}
                <div className="modern-header mb-4">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <h1 className="gradient-text mb-1">Mes Conversations</h1>
                            <p className="text-muted mb-0">
                                {conversations.length} conversation{conversations.length > 1 ? 's' : ''} active{conversations.length > 1 ? 's' : ''}
                            </p>
                        </div>
                        <div className="d-flex gap-2">
                            <button 
                                className="btn btn-modern btn-secondary-modern"
                                onClick={() => navigate('/dashboard')}
                            >
                                <i className="fas fa-arrow-left me-2"></i>
                                Retour
                            </button>
                            <button 
                                className="btn btn-modern btn-primary-modern"
                                onClick={() => navigate('/swipe')}
                            >
                                <i className="fas fa-plus me-2"></i>
                                Nouveau Match
                            </button>
                        </div>
                    </div>
                </div>

                {conversations.length === 0 ? (
                    <div className="modern-card animate-fade-in">
                        <div className="text-center p-5">
                            <div className="mb-4">
                                <div className="avatar-modern mx-auto" style={{ width: '100px', height: '100px', fontSize: '3rem' }}>
                                    <i className="fas fa-comments"></i>
                                </div>
                            </div>
                            <h3 className="gradient-text mb-3">Aucune conversation pour le moment</h3>
                            <p className="text-muted mb-4">
                                {user?.role === 'candidate' 
                                    ? 'Vous n\'avez pas encore de match avec des recruteurs. Commencez à swiper pour découvrir des opportunités !'
                                    : 'Vous n\'avez pas encore de match avec des candidats. Continuez à swiper pour trouver des talents !'
                                }
                            </p>
                            <button 
                                className="btn btn-modern btn-primary-modern animate-pulse"
                                onClick={() => navigate('/swipe')}
                            >
                                <i className="fas fa-heart me-2"></i>
                                Commencer à swiper
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="row">
                        {conversations.map((conversation, index) => (
                            <div 
                                key={conversation.conversation_id} 
                                className="col-12 mb-3"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div 
                                    className={`conversation-item animate-fade-in hover-lift ${selectedConversation?.conversation_id === conversation.conversation_id ? 'active' : ''}`}
                                    onClick={() => handleConversationClick(conversation)}
                                >
                                    <div className="d-flex align-items-center">
                                        {/* Avatar */}
                                        <div className="me-3">
                                            {user?.role === 'candidate' ? (
                                                <div className="avatar-modern">
                                                    {conversation.recruiter_photo ? (
                                                        <img 
                                                            src={conversation.recruiter_photo} 
                                                            alt="Photo de profil"
                                                            className="w-100 h-100 rounded-circle object-fit-cover"
                                                        />
                                                    ) : (
                                                        getInitials(conversation.recruiter_firstName, conversation.recruiter_lastName)
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="avatar-modern">
                                                    {conversation.candidate_photo ? (
                                                        <img 
                                                            src={conversation.candidate_photo} 
                                                            alt="Photo de profil"
                                                            className="w-100 h-100 rounded-circle object-fit-cover"
                                                        />
                                                    ) : (
                                                        getInitials(conversation.candidate_firstName, conversation.candidate_lastName)
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {/* Contenu */}
                                        <div className="flex-grow-1">
                                            <div className="d-flex justify-content-between align-items-start mb-2">
                                                <div>
                                                    <h5 className="mb-1 fw-bold">
                                                        {user?.role === 'candidate' 
                                                            ? `${conversation.recruiter_firstName} ${conversation.recruiter_lastName}`
                                                            : `${conversation.candidate_firstName} ${conversation.candidate_lastName}`
                                                        }
                                                    </h5>
                                                    <p className="text-muted mb-1 small">
                                                        <i className="fas fa-briefcase me-1"></i>
                                                        {conversation.job_title} - {conversation.job_company}
                                                    </p>
                                                </div>
                                                <div className="text-end">
                                                    <small className="text-muted d-block">
                                                        {formatDate(conversation.updated_at)}
                                                    </small>
                                                    {conversation.message_count > 0 && (
                                                        <span className="badge-modern">
                                                            {conversation.message_count}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            {conversation.last_message && (
                                                <p className="text-muted mb-0 small">
                                                    <i className="fas fa-comment me-1"></i>
                                                    {conversation.last_message}
                                                </p>
                                            )}
                                        </div>

                                        {/* Indicateur de statut */}
                                        <div className="ms-3">
                                            <div className="bg-success rounded-circle" style={{ width: '12px', height: '12px' }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Floating Action Button */}
                <button 
                    className="fab animate-bounce"
                    onClick={() => navigate('/swipe')}
                    title="Nouveau match"
                >
                    <i className="fas fa-heart"></i>
                </button>
            </div>
        </div>
    );
};

export default Matches; 