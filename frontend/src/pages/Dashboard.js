import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        // Gérer la déconnexion
        navigate('/login');
    };

    const getInitials = (firstName, lastName) => {
        return `${firstName?.charAt(0) || 'U'}${lastName?.charAt(0) || ''}`.toUpperCase();
    };

    return (
        <div className="main-container">
            <div className="container">
                {/* Header moderne */}
                <div className="modern-header mb-5">
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                            <div className="avatar-modern me-4" style={{ width: '80px', height: '80px', fontSize: '2rem' }}>
                                {user?.profilePicture ? (
                                    <img
                                        src={`http://localhost/TinderWork/backend/${user.profilePicture}`}
                                        alt="Photo de profil"
                                        className="w-100 h-100 rounded-circle object-fit-cover"
                                    />
                                ) : (
                                    <i className="fas fa-user"></i>
                                )}
                            </div>
                            <div>
                                <h1 className="gradient-text mb-1">Bonjour, {user?.firstName} !</h1>
                                <p className="text-muted mb-0">
                                    {user?.role === 'candidate' ? 'Candidat' : 'Recruteur'} • Prêt à découvrir de nouvelles opportunités
                                </p>
                            </div>
                        </div>
                        <button 
                            className="btn btn-modern btn-secondary-modern"
                            onClick={handleLogout}
                        >
                            <i className="fas fa-sign-out-alt me-2"></i>
                            Déconnexion
                        </button>
                    </div>
                </div>

                {/* Statistiques rapides */}
                <div className="row mb-5">
                    <div className="col-md-4 mb-3">
                        <div 
                            className="modern-card hover-lift p-4 text-center"
                            style={{ cursor: 'pointer' }}
                            onClick={() => navigate('/matches')}
                        >
                            <div className="mb-3">
                                <div className="avatar-modern mx-auto" style={{ 
                                    width: '60px', 
                                    height: '60px', 
                                    fontSize: '1.5rem',
                                    background: 'linear-gradient(135deg, #ff6b6b, #ff8e8e)'
                                }}>
                                    <i className="fas fa-heart"></i>
                                </div>
                            </div>
                            <h4 className="gradient-text mb-2">Matches</h4>
                            <p className="text-muted mb-0">Découvrez vos connexions</p>
                        </div>
                    </div>
                    <div className="col-md-4 mb-3">
                        <div 
                            className="modern-card hover-lift p-4 text-center"
                            style={{ cursor: 'pointer' }}
                            onClick={() => navigate('/swipe')}
                        >
                            <div className="mb-3">
                                <div className="avatar-modern mx-auto" style={{ 
                                    width: '60px', 
                                    height: '60px', 
                                    fontSize: '1.5rem',
                                    background: 'linear-gradient(135deg, #4ecdc4, #6ee7df)'
                                }}>
                                    <i className="fas fa-briefcase"></i>
                                </div>
                            </div>
                            <h4 className="gradient-text mb-2">Opportunités</h4>
                            <p className="text-muted mb-0">Trouvez votre prochain défi</p>
                        </div>
                    </div>
                    <div className="col-md-4 mb-3">
                        <div 
                            className="modern-card hover-lift p-4 text-center"
                            style={{ cursor: 'pointer' }}
                            onClick={() => navigate('/profile')}
                        >
                            <div className="mb-3">
                                <div className="avatar-modern mx-auto" style={{ 
                                    width: '60px', 
                                    height: '60px', 
                                    fontSize: '1.5rem',
                                    background: 'linear-gradient(135deg, #667eea, #764ba2)'
                                }}>
                                    <i className="fas fa-user-edit"></i>
                                </div>
                            </div>
                            <h4 className="gradient-text mb-2">Profil</h4>
                            <p className="text-muted mb-0">Optimisez votre présence</p>
                        </div>
                    </div>
                </div>

                {/* Actions principales */}
                <div className="row">
                    {user?.role === 'recruiter' && (
                        // Actions spécifiques aux recruteurs
                        <>
                            <div className="col-lg-6 mb-4">
                                <div className="modern-card hover-lift p-4 h-100">
                                    <div className="d-flex align-items-center mb-3">
                                        <div className="avatar-modern me-3" style={{ 
                                            width: '50px', 
                                            height: '50px', 
                                            fontSize: '1.2rem',
                                            background: 'linear-gradient(135deg, #fa709a, #fee140)'
                                        }}>
                                            <i className="fas fa-plus"></i>
                                        </div>
                                        <div>
                                            <h4 className="mb-1">Publier une annonce</h4>
                                            <p className="text-muted mb-0">Créez une nouvelle offre d'emploi</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => navigate('/post-job')}
                                        className="btn btn-modern btn-primary-modern w-100"
                                    >
                                        <i className="fas fa-plus me-2"></i>
                                        Créer une offre
                                    </button>
                                </div>
                            </div>

                            <div className="col-lg-6 mb-4">
                                <div className="modern-card hover-lift p-4 h-100">
                                    <div className="d-flex align-items-center mb-3">
                                        <div className="avatar-modern me-3" style={{ 
                                            width: '50px', 
                                            height: '50px', 
                                            fontSize: '1.2rem',
                                            background: 'linear-gradient(135deg, #667eea, #764ba2)'
                                        }}>
                                            <i className="fas fa-list"></i>
                                        </div>
                                        <div>
                                            <h4 className="mb-1">Mes annonces</h4>
                                            <p className="text-muted mb-0">Gérez vos offres d'emploi publiées</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => navigate('/my-jobs')}
                                        className="btn btn-modern btn-secondary-modern w-100"
                                    >
                                        <i className="fas fa-list me-2"></i>
                                        Voir mes annonces
                                    </button>
                                </div>
                            </div>

                            <div className="col-lg-6 mb-4">
                                <div className="modern-card hover-lift p-4 h-100">
                                    <div className="d-flex align-items-center mb-3">
                                        <div className="avatar-modern me-3" style={{ 
                                            width: '50px', 
                                            height: '50px', 
                                            fontSize: '1.2rem',
                                            background: 'linear-gradient(135deg, #43e97b, #38f9d7)'
                                        }}>
                                            <i className="fas fa-building"></i>
                                        </div>
                                        <div>
                                            <h4 className="mb-1">Profil entreprise</h4>
                                            <p className="text-muted mb-0">Mettez à jour les informations de votre entreprise</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => navigate('/recruiter-profile')}
                                        className="btn btn-modern btn-success-modern w-100"
                                    >
                                        <i className="fas fa-building me-2"></i>
                                        Éditer l'entreprise
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Section d'aide */}
                <div className="row mt-5">
                    <div className="col-12">
                        <div className="modern-card p-4">
                            <div className="text-center">
                                <h4 className="gradient-text mb-3">Besoin d'aide ?</h4>
                                <p className="text-muted mb-4">
                                    Notre équipe est là pour vous accompagner dans votre recherche d'emploi ou de talents
                                </p>
                                <div className="d-flex justify-content-center gap-3">
                                    <button className="btn btn-modern btn-secondary-modern">
                                        <i className="fas fa-question-circle me-2"></i>
                                        FAQ
                                    </button>
                                    <button className="btn btn-modern btn-primary-modern">
                                        <i className="fas fa-envelope me-2"></i>
                                        Contact
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard; 