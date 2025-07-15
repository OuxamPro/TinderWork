import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ProfileForm from '../components/ProfileForm';

const Profile = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

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
                            <button 
                                className="btn btn-modern btn-secondary-modern me-3"
                                onClick={() => navigate('/dashboard')}
                            >
                                <i className="fas fa-arrow-left"></i>
                            </button>
                            <div>
                                <h1 className="gradient-text mb-1">Mon Profil</h1>
                                <p className="text-muted mb-0">Personnalisez votre profil pour attirer les meilleures opportunités</p>
                            </div>
                        </div>
                        <div className="d-flex align-items-center">
                            <div className="avatar-modern me-3" style={{ width: '60px', height: '60px', fontSize: '1.5rem' }}>
                                {getInitials(user?.firstName, user?.lastName)}
                            </div>
                            <div>
                                <h5 className="mb-1 fw-bold">{user?.firstName} {user?.lastName}</h5>
                                <p className="text-muted mb-0 small">Candidat</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    {/* Informations du profil */}
                    <div className="col-lg-4 mb-4">
                        <div className="modern-card p-4 h-100">
                            <div className="text-center mb-4">
                                <div className="avatar-modern mx-auto mb-3" style={{ width: '120px', height: '120px', fontSize: '3rem' }}>
                                    {user?.profilePicture ? (
                                        <img 
                                            src={`http://localhost/TinderWork/backend/${user.profilePicture}`}
                                            alt="Photo de profil"
                                            className="w-100 h-100 rounded-circle object-fit-cover"
                                        />
                                    ) : null}
                                </div>
                                <h3 className="gradient-text mb-2">{user?.firstName} {user?.lastName}</h3>
                                <p className="text-muted mb-3">{user?.position || 'Poste non précisé'}</p>
                                
                                <div className="d-flex justify-content-center gap-2 mb-4">
                                    <div className="badge-modern">
                                        <i className="fas fa-map-marker-alt me-1"></i>
                                        {user?.location || 'Non précisé'}
                                    </div>
                                    <div className="badge-modern" style={{ background: 'linear-gradient(135deg, #4ecdc4, #6ee7df)' }}>
                                        <i className="fas fa-briefcase me-1"></i>
                                        {user?.experience || '0'} ans
                                    </div>
                                </div>

                                {/* Bio */}
                                {user?.bio && user.bio.trim() !== '' && (
                                    <div className="bio-section mb-4">
                                        <h6 className="fw-bold mb-2">
                                            <i className="fas fa-user me-2"></i>
                                            À propos de moi
                                        </h6>
                                        <p className="text-muted mb-0" style={{ lineHeight: '1.6' }}>
                                            {user.bio}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Statistiques du profil */}
                            <div className="profile-stats">
                                <h6 className="fw-bold mb-3">
                                    <i className="fas fa-chart-line me-2"></i>
                                    Statistiques
                                </h6>
                                
                                <div className="stat-item mb-3">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span className="text-muted">Vues du profil</span>
                                        <span className="fw-bold">24</span>
                                    </div>
                                    <div className="progress mt-1" style={{ height: '6px' }}>
                                        <div className="progress-bar" style={{ 
                                            width: '60%', 
                                            background: 'linear-gradient(135deg, #ff6b6b, #ff8e8e)' 
                                        }}></div>
                                    </div>
                                </div>

                                <div className="stat-item mb-3">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span className="text-muted">Matches</span>
                                        <span className="fw-bold">8</span>
                                    </div>
                                    <div className="progress mt-1" style={{ height: '6px' }}>
                                        <div className="progress-bar" style={{ 
                                            width: '40%', 
                                            background: 'linear-gradient(135deg, #4ecdc4, #6ee7df)' 
                                        }}></div>
                                    </div>
                                </div>

                                <div className="stat-item mb-3">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span className="text-muted">Conversations</span>
                                        <span className="fw-bold">5</span>
                                    </div>
                                    <div className="progress mt-1" style={{ height: '6px' }}>
                                        <div className="progress-bar" style={{ 
                                            width: '80%', 
                                            background: 'linear-gradient(135deg, #667eea, #764ba2)' 
                                        }}></div>
                                    </div>
                                </div>
                            </div>

                            {/* Compétences principales */}
                            {user?.skills && typeof user.skills === 'string' && user.skills.trim() !== '' && (
                                <div className="profile-skills mt-4">
                                    <h6 className="fw-bold mb-3">
                                        <i className="fas fa-tools me-2"></i>
                                        Compétences principales
                                    </h6>
                                    <div className="d-flex flex-wrap gap-2">
                                        {user.skills.split(',').slice(0, 5).map((skill, index) => (
                                            <span 
                                                key={index}
                                                className="skill-badge"
                                                style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}
                                            >
                                                {skill.trim()}
                                            </span>
                                        ))}
                                        {user.skills.split(',').length > 5 && (
                                            <span className="skill-badge-more">
                                                +{user.skills.split(',').length - 5}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Formulaire d'édition */}
                    <div className="col-lg-8">
                        <div className="modern-card p-4">
                            <div className="d-flex align-items-center mb-4">
                                <div className="avatar-modern me-3" style={{ 
                                    width: '50px', 
                                    height: '50px', 
                                    fontSize: '1.2rem',
                                    background: 'linear-gradient(135deg, #667eea, #764ba2)'
                                }}>
                                    <i className="fas fa-edit"></i>
                                </div>
                                <div>
                                    <h4 className="mb-1">Modifier mon profil</h4>
                                    <p className="text-muted mb-0">Mettez à jour vos informations pour améliorer votre visibilité</p>
                                </div>
                            </div>

                            <ProfileForm />
                        </div>

                        {/* Conseils pour optimiser le profil */}
                        <div className="modern-card p-4 mt-4">
                            <div className="d-flex align-items-center mb-4">
                                <div className="avatar-modern me-3" style={{ 
                                    width: '50px', 
                                    height: '50px', 
                                    fontSize: '1.2rem',
                                    background: 'linear-gradient(135deg, #43e97b, #38f9d7)'
                                }}>
                                    <i className="fas fa-lightbulb"></i>
                                </div>
                                <div>
                                    <h4 className="mb-1">Conseils pour optimiser votre profil</h4>
                                    <p className="text-muted mb-0">Augmentez vos chances de match</p>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <div className="tip-item p-3 rounded-3" style={{ background: 'var(--gray-100)' }}>
                                        <div className="d-flex align-items-center mb-2">
                                            <i className="fas fa-camera text-primary me-2"></i>
                                            <h6 className="mb-0 fw-bold">Photo de profil</h6>
                                        </div>
                                        <p className="text-muted small mb-0">Ajoutez une photo professionnelle pour augmenter vos vues de 40%</p>
                                    </div>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <div className="tip-item p-3 rounded-3" style={{ background: 'var(--gray-100)' }}>
                                        <div className="d-flex align-items-center mb-2">
                                            <i className="fas fa-align-left text-primary me-2"></i>
                                            <h6 className="mb-0 fw-bold">Bio complète</h6>
                                        </div>
                                        <p className="text-muted small mb-0">Rédigez une bio détaillée pour montrer votre personnalité</p>
                                    </div>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <div className="tip-item p-3 rounded-3" style={{ background: 'var(--gray-100)' }}>
                                        <div className="d-flex align-items-center mb-2">
                                            <i className="fas fa-tools text-primary me-2"></i>
                                            <h6 className="mb-0 fw-bold">Compétences</h6>
                                        </div>
                                        <p className="text-muted small mb-0">Listez vos compétences clés pour être mieux référencé</p>
                                    </div>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <div className="tip-item p-3 rounded-3" style={{ background: 'var(--gray-100)' }}>
                                        <div className="d-flex align-items-center mb-2">
                                            <i className="fas fa-map-marker-alt text-primary me-2"></i>
                                            <h6 className="mb-0 fw-bold">Localisation</h6>
                                        </div>
                                        <p className="text-muted small mb-0">Précisez votre localisation pour des offres pertinentes</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Floating Action Button */}
                <button 
                    className="fab"
                    onClick={() => navigate('/dashboard')}
                    title="Retour au tableau de bord"
                >
                    <i className="fas fa-home"></i>
                </button>
            </div>
        </div>
    );
};

export default Profile; 