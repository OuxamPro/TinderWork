import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // Si l'utilisateur est connecté et que le chargement est terminé, rediriger vers le dashboard
        if (!loading && user) {
            navigate('/dashboard', { replace: true });
        }
    }, [user, loading, navigate]);

    // Si en cours de chargement, afficher un spinner
    if (loading) {
        return (
            <div className="main-container">
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
                    <div className="text-center">
                        <div className="modern-spinner mx-auto mb-4"></div>
                        <h3 className="gradient-text mb-2">Chargement...</h3>
                        <p className="text-muted">Vérification de votre session</p>
                    </div>
                </div>
            </div>
        );
    }

    // Si l'utilisateur n'est pas connecté, afficher la page d'accueil
    return (
        <div className="main-container">
            <div className="container">
                {/* Hero Section */}
                <div className="hero-section fade-in-up">
                    <div className="text-center position-relative">
                        <h1 className="gradient-text mb-4" style={{ fontSize: '3.5rem', fontWeight: '800' }}>
                            Bienvenue sur TinderWork
                        </h1>
                        <p className="lead text-muted mb-4" style={{ fontSize: '1.25rem' }}>
                            La plateforme de recrutement qui révolutionne la recherche d'emploi
                        </p>
                        <div className="d-flex justify-content-center gap-3 flex-wrap">
                            <button 
                                className="btn btn-modern btn-primary-modern btn-lg"
                                onClick={() => navigate('/register')}
                            >
                                <i className="fas fa-rocket me-2"></i>
                                Commencer maintenant
                            </button>
                            <button 
                                className="btn btn-modern btn-secondary-modern btn-lg"
                                onClick={() => navigate('/login')}
                            >
                                <i className="fas fa-sign-in-alt me-2"></i>
                                Se connecter
                            </button>
                        </div>
                    </div>
                </div>

                {/* Features Section */}
                <div className="row mb-5">
                    <div className="col-md-4 mb-4 stagger-animation">
                        <div className="feature-card">
                            <div className="feature-icon" style={{ background: 'linear-gradient(135deg, #ff6b6b, #ff8e8e)' }}>
                                <i className="fas fa-heart"></i>
                            </div>
                            <h4 className="gradient-text mb-3">Swipe pour Matcher</h4>
                            <p className="text-muted">
                                Découvrez des offres d'emploi ou des candidats en swipant, 
                                comme sur les applications de rencontre populaires.
                            </p>
                        </div>
                    </div>

                    <div className="col-md-4 mb-4 stagger-animation">
                        <div className="feature-card">
                            <div className="feature-icon" style={{ background: 'linear-gradient(135deg, #4ecdc4, #6ee7df)' }}>
                                <i className="fas fa-comments"></i>
                            </div>
                            <h4 className="gradient-text mb-3">Chat en Temps Réel</h4>
                            <p className="text-muted">
                                Communiquez directement avec vos matches grâce à notre 
                                système de chat instantané.
                            </p>
                        </div>
                    </div>

                    <div className="col-md-4 mb-4 stagger-animation">
                        <div className="feature-card">
                            <div className="feature-icon" style={{ background: 'linear-gradient(135deg, #45b7d1, #6bc5d8)' }}>
                                <i className="fas fa-briefcase"></i>
                            </div>
                            <h4 className="gradient-text mb-3">Matching Intelligent</h4>
                            <p className="text-muted">
                                Notre algorithme vous propose les meilleures opportunités 
                                basées sur vos compétences et préférences.
                            </p>
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="cta-section fade-in-up">
                    <h2 className="gradient-text mb-4" style={{ fontSize: '2.5rem', fontWeight: '700' }}>
                        Prêt à révolutionner votre recrutement ?
                    </h2>
                    <p className="lead text-muted mb-4" style={{ fontSize: '1.2rem' }}>
                        Rejoignez des milliers de candidats et recruteurs qui ont déjà trouvé leur match parfait.
                    </p>
                    <div className="d-flex justify-content-center gap-3 flex-wrap">
                        <button 
                            className="btn btn-modern btn-primary-modern btn-lg"
                            onClick={() => navigate('/register')}
                        >
                            <i className="fas fa-rocket me-2"></i>
                            Créer mon compte
                        </button>
                        <button 
                            className="btn btn-modern btn-secondary-modern btn-lg"
                            onClick={() => navigate('/faq')}
                        >
                            <i className="fas fa-question-circle me-2"></i>
                            En savoir plus
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage; 