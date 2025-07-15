import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [conversation, setConversation] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState(null);
    const { user, token } = useAuth();
    const navigate = useNavigate();
    const { conversationId } = useParams();
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        if (user && token && conversationId) {
            fetchMessages();
        }
    }, [user, token, conversationId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        // Focus sur l'input quand la page se charge
        if (!loading && inputRef.current) {
            inputRef.current.focus();
        }
    }, [loading]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const fetchMessages = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get(`http://localhost/TinderWork/backend/get_messages.php?conversation_id=${conversationId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                withCredentials: true
            });
            setMessages(response.data.messages);
            setConversation(response.data.conversation);
        } catch (err) {
            setError(err.response?.data?.error || 'Une erreur est survenue lors de la récupération des messages');
        } finally {
            setLoading(false);
        }
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || sending) return;

        const messageToSend = newMessage.trim();
        setNewMessage('');

        // Optimistic update
        const optimisticMessage = {
            id: Date.now(),
            content: messageToSend,
            created_at: new Date().toISOString(),
            sender_id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            is_own_message: true,
            formatted_time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, optimisticMessage]);

        try {
            setSending(true);
            const response = await axios.post('http://localhost/TinderWork/backend/send_message.php', {
                conversation_id: conversationId,
                content: messageToSend
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });

            if (response.data.success) {
                // Remplacer le message optimiste par le vrai message
                setMessages(prev => prev.map(msg => 
                    msg.id === optimisticMessage.id ? response.data.message : msg
                ));
            }
        } catch (err) {
            // Retirer le message optimiste en cas d'erreur
            setMessages(prev => prev.filter(msg => msg.id !== optimisticMessage.id));
            setNewMessage(messageToSend); // Remettre le message dans l'input
            setError(err.response?.data?.error || 'Une erreur est survenue lors de l\'envoi du message');
        } finally {
            setSending(false);
        }
    };

    const formatTime = (timeString) => {
        return new Date(timeString).toLocaleTimeString('fr-FR', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
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
                        <h3 className="gradient-text mb-2">Chargement de la conversation</h3>
                        <p className="text-muted">Nous récupérons vos messages...</p>
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
                                onClick={() => navigate('/matches')}
                            >
                                Retour aux conversations
                            </button>
                            <button 
                                className="btn btn-modern btn-secondary-modern"
                                onClick={fetchMessages}
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
                        <div className="d-flex align-items-center">
                            <button 
                                className="btn btn-modern btn-secondary-modern me-3"
                                onClick={() => navigate('/matches')}
                            >
                                <i className="fas fa-arrow-left"></i>
                            </button>
                            <div>
                                <h1 className="gradient-text mb-1">Conversation</h1>
                                {conversation && (
                                    <p className="text-muted mb-0">
                                        <i className="fas fa-briefcase me-1"></i>
                                        {conversation.job_title} - {conversation.job_company}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="d-flex align-items-center">
                            <div className="avatar-modern me-2">
                                {user?.role === 'candidate' ? 'R' : 'C'}
                            </div>
                            <span className="fw-bold">
                                {user?.role === 'candidate' ? 'Recruteur' : 'Candidat'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Chat Container */}
                <div className="chat-container">
                    {/* Zone des messages */}
                    <div className="chat-messages">
                        {messages.length === 0 ? (
                            <div className="text-center text-muted mt-5 animate-fade-in">
                                <div className="mb-4">
                                    <div className="avatar-modern mx-auto" style={{ width: '80px', height: '80px', fontSize: '2rem' }}>
                                        <i className="fas fa-comment-dots"></i>
                                    </div>
                                </div>
                                <h4 className="gradient-text mb-2">Aucun message pour le moment</h4>
                                <p>Commencez la conversation !</p>
                            </div>
                        ) : (
                            <div className="d-flex flex-column">
                                {messages.map((message, index) => (
                                    <div 
                                        key={message.id}
                                        className={`d-flex ${message.is_own_message ? 'justify-content-end' : 'justify-content-start'} mb-3 animate-fade-in`}
                                        style={{ animationDelay: `${index * 0.1}s` }}
                                    >
                                        {!message.is_own_message && (
                                            <div className="avatar-modern me-2" style={{ width: '40px', height: '40px', fontSize: '1rem' }}>
                                                {getInitials(message.firstName, message.lastName)}
                                            </div>
                                        )}
                                        
                                        <div className="message-bubble ${message.is_own_message ? 'own' : 'other'}">
                                            <div className="message-content">
                                                {message.content}
                                            </div>
                                            <div className={`text-end mt-1 ${message.is_own_message ? 'text-white-50' : 'text-muted'}`} style={{ fontSize: '0.8em' }}>
                                                {formatTime(message.created_at)}
                                            </div>
                                        </div>

                                        {message.is_own_message && (
                                            <div className="avatar-modern ms-2" style={{ width: '40px', height: '40px', fontSize: '1rem' }}>
                                                {getInitials(user.firstName, user.lastName)}
                                            </div>
                                        )}
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>
                        )}
                    </div>

                    {/* Zone de saisie */}
                    <div className="chat-input">
                        <form onSubmit={sendMessage} className="d-flex align-items-center">
                            <div className="flex-grow-1 me-3">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Tapez votre message..."
                                    disabled={sending}
                                    className="input-modern w-100"
                                    maxLength={500}
                                />
                            </div>
                            <button 
                                type="submit" 
                                className="btn btn-modern btn-primary-modern"
                                disabled={!newMessage.trim() || sending}
                            >
                                {sending ? (
                                    <div className="modern-spinner" style={{ width: '20px', height: '20px' }}></div>
                                ) : (
                                    <i className="fas fa-paper-plane"></i>
                                )}
                            </button>
                        </form>
                        
                        {/* Indicateur de frappe */}
                        {sending && (
                            <div className="mt-2 text-muted small animate-pulse">
                                <i className="fas fa-circle me-1"></i>
                                Envoi en cours...
                            </div>
                        )}
                    </div>
                </div>

                {/* Floating Action Button pour retour */}
                <button 
                    className="fab"
                    onClick={() => navigate('/matches')}
                    title="Retour aux conversations"
                    style={{ bottom: '24px', left: '24px', right: 'auto' }}
                >
                    <i className="fas fa-arrow-left"></i>
                </button>
            </div>
        </div>
    );
};

export default Chat; 