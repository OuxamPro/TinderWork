import React, { useState, useEffect, useCallback } from 'react';
import JobCard from '../components/JobCard';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Swipe = () => {
    console.log('=== SWIPE COMPONENT LOADED ===');
    
    const [items, setItems] = useState([]);
    const [currentItem, setCurrentItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [noMoreItems, setNoMoreItems] = useState(false);
    const [swipeDirection, setSwipeDirection] = useState(null);
    const [showMatch, setShowMatch] = useState(false);
    const { user, token, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    
    console.log('Swipe - user:', user);
    console.log('Swipe - token:', token);
    console.log('Swipe - authLoading:', authLoading);

    const fetchJobs = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get('http://localhost/TinderWork/backend/get_jobs.php', {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                withCredentials: true
            });
            if (response.data.length === 0) {
                setNoMoreItems(true);
                setCurrentItem(null);
            } else {
                setItems(response.data);
                setCurrentItem(response.data[0]);
                setNoMoreItems(false);
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Une erreur est survenue lors de la récupération des offres');
        } finally {
            setLoading(false);
        }
    }, [token]);

    const fetchCandidates = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('Fetching candidates...');
            const response = await axios.get('http://localhost/TinderWork/backend/get_candidates.php', {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                withCredentials: true
            });
            console.log('Candidates response:', response.data);
            console.log('Candidates length:', response.data.length);
            
            if (response.data.length === 0) {
                console.log('No candidates found');
                setNoMoreItems(true);
                setCurrentItem(null);
            } else {
                console.log('Setting candidates:', response.data);
                setItems(response.data);
                setCurrentItem(response.data[0]);
                setNoMoreItems(false);
            }
        } catch (err) {
            console.error('Error fetching candidates:', err);
            setError(err.response?.data?.error || 'Une erreur est survenue lors de la récupération des candidats');
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        console.log('Swipe useEffect - user:', user);
        console.log('Swipe useEffect - user.role:', user?.role);
        console.log('Swipe useEffect - authLoading:', authLoading);
        
        if (!authLoading && user && token) {
            if (user.role === 'candidate') {
                console.log('Fetching jobs for candidate');
                fetchJobs();
            } else if (user.role === 'recruiter') {
                console.log('Fetching candidates for recruiter');
                fetchCandidates();
            } else {
                console.log('Unknown role:', user.role);
                setLoading(false);
                setError('Rôle d\'utilisateur non reconnu.');
            }
        }
    }, [user, token, authLoading, fetchCandidates, fetchJobs]);

    const handleSwipe = async (action) => {
        if (!user || !token || !currentItem) {
            setError('Vous devez être connecté pour accéder à cette page');
            return;
        }

        setSwipeDirection(action);

        try {
            let response;
            if (user.role === 'candidate') {
                // Swipe sur une offre d'emploi
                response = await axios.post(
                    'http://localhost/TinderWork/backend/job_swipe.php',
                    {
                        jobId: currentItem.id,
                        action: action
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                        withCredentials: true
                    }
                );
            } else if (user.role === 'recruiter') {
                // Swipe sur un candidat
                response = await axios.post(
                    'http://localhost/TinderWork/backend/candidate_swipe.php',
                    {
                        candidateId: currentItem.id,
                        action: action
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                        withCredentials: true
                    }
                );
            }

            if (response.data.match) {
                setShowMatch(true);
                setTimeout(() => {
                    setShowMatch(false);
                    navigate('/matches');
                }, 2000);
            }
            
            // Animation de swipe
            setTimeout(() => {
                const newItems = items.slice(1);
                if (newItems.length === 0) {
                    setNoMoreItems(true);
                    setCurrentItem(null);
                } else {
                    setItems(newItems);
                    setCurrentItem(newItems[0]);
                }
                setSwipeDirection(null);
            }, 300);
        } catch (err) {
            setError(err.response?.data?.error || 'Une erreur est survenue lors du swipe');
            setSwipeDirection(null);
        }
    };

    if (authLoading) {
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

    if (loading) {
        return (
            <div className="main-container">
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
                    <div className="text-center">
                        <div className="modern-spinner mx-auto mb-4"></div>
                        <h3 className="gradient-text mb-2">
                            {user?.role === 'candidate' 
                                ? 'Chargement des offres d\'emploi' 
                                : 'Chargement des candidats'
                            }
                        </h3>
                        <p className="text-muted">Nous préparons les meilleures opportunités pour vous...</p>
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
                                onClick={() => window.location.reload()}
                            >
                                Réessayer
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (noMoreItems) {
        return (
            <div className="main-container">
                <div className="container">
                    <div className="modern-card animate-fade-in">
                        <div className="text-center p-5">
                            <div className="mb-4">
                                <div className="avatar-modern mx-auto" style={{ width: '100px', height: '100px', fontSize: '3rem' }}>
                                    <i className="fas fa-check-circle"></i>
                                </div>
                            </div>
                            <h3 className="gradient-text mb-3">Vous avez tout vu !</h3>
                            <p className="text-muted mb-4">
                                {user?.role === 'candidate' 
                                    ? 'Vous avez parcouru toutes les offres disponibles. Revenez plus tard pour de nouvelles opportunités !'
                                    : 'Vous avez parcouru tous les candidats disponibles. Revenez plus tard pour de nouveaux profils !'
                                }
                            </p>
                            <div className="d-flex justify-content-center gap-3">
                                <button 
                                    className="btn btn-modern btn-primary-modern"
                                    onClick={() => navigate('/dashboard')}
                                >
                                    <i className="fas fa-home me-2"></i>
                                    Tableau de bord
                                </button>
                                <button 
                                    className="btn btn-modern btn-secondary-modern"
                                    onClick={() => {
                                        if (user?.role === 'candidate') {
                                            fetchJobs();
                                        } else if (user?.role === 'recruiter') {
                                            fetchCandidates();
                                        }
                                    }}
                                >
                                    <i className="fas fa-refresh me-2"></i>
                                    Actualiser
                                </button>
                            </div>
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
                            <h1 className="gradient-text mb-1">
                                {user?.role === 'candidate' ? 'Découvrir des offres' : 'Découvrir des candidats'}
                            </h1>
                            <p className="text-muted mb-0">
                                {items.length} {user?.role === 'candidate' ? 'offre' : 'candidat'}{items.length > 1 ? 's' : ''} restante{items.length > 1 ? 's' : ''}
                            </p>
                        </div>
                        <button 
                            className="btn btn-modern btn-secondary-modern"
                            onClick={() => navigate('/dashboard')}
                        >
                            <i className="fas fa-arrow-left me-2"></i>
                            Retour
                        </button>
                    </div>
                </div>

                {/* Zone de swipe */}
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
                    <div className="position-relative">
                        {/* Carte principale */}
                        <div 
                            className={`modern-card hover-lift ${swipeDirection ? `swipe-${swipeDirection}` : ''}`}
                            style={{ 
                                width: '350px', 
                                height: '500px',
                                transform: swipeDirection === 'like' ? 'translateX(100px) rotate(15deg)' : 
                                          swipeDirection === 'dislike' ? 'translateX(-100px) rotate(-15deg)' : 'none',
                                transition: 'all 0.3s ease',
                                opacity: swipeDirection ? 0 : 1
                            }}
                        >
                            <div className="p-4 h-100 d-flex flex-column">
                                <JobCard item={currentItem} userRole={user?.role} />
                            </div>
                        </div>

                        {/* Boutons d'action */}
                        <div className="d-flex justify-content-center gap-4 mt-4">
                            <button 
                                className="btn btn-modern btn-secondary-modern"
                                onClick={() => handleSwipe('dislike')}
                                disabled={swipeDirection !== null}
                                style={{ 
                                    width: '60px', 
                                    height: '60px', 
                                    borderRadius: '50%',
                                    padding: 0,
                                    fontSize: '1.5rem'
                                }}
                            >
                                <i className="fas fa-times"></i>
                            </button>
                            
                            <button 
                                className="btn btn-modern btn-primary-modern"
                                onClick={() => handleSwipe('like')}
                                disabled={swipeDirection !== null}
                                style={{ 
                                    width: '60px', 
                                    height: '60px', 
                                    borderRadius: '50%',
                                    padding: 0,
                                    fontSize: '1.5rem'
                                }}
                            >
                                <i className="fas fa-heart"></i>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Notification de match */}
                {showMatch && (
                    <div className="position-fixed top-50 start-50 translate-middle" style={{ zIndex: 9999 }}>
                        <div className="modern-card animate-bounce" style={{ background: 'linear-gradient(135deg, #ff6b6b, #4ecdc4)' }}>
                            <div className="text-center text-white p-4">
                                <div className="mb-3">
                                    <i className="fas fa-heart" style={{ fontSize: '3rem' }}></i>
                                </div>
                                <h3 className="mb-2">Match !</h3>
                                <p className="mb-0">Vous pouvez maintenant discuter !</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Floating Action Button */}
                <button 
                    className="fab"
                    onClick={() => navigate('/matches')}
                    title="Voir mes conversations"
                >
                    <i className="fas fa-comments"></i>
                </button>
            </div>
        </div>
    );
};

export default Swipe; 