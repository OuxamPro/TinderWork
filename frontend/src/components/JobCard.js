import React from 'react';
import { useAuth } from '../context/AuthContext';

const JobCard = ({ item, userRole }) => {
    const { user } = useAuth();

    const getInitials = (firstName, lastName) => {
        return `${firstName?.charAt(0) || 'U'}${lastName?.charAt(0) || ''}`.toUpperCase();
    };

    const formatSalary = (salary) => {
        if (!salary) return 'Salaire non précisé';
        return `${salary.toLocaleString('fr-FR')}€`;
    };

    const getIndustryColor = (industry) => {
        const colors = {
            'tech': 'linear-gradient(135deg, #667eea, #764ba2)',
            'finance': 'linear-gradient(135deg, #f093fb, #f5576c)',
            'healthcare': 'linear-gradient(135deg, #4facfe, #00f2fe)',
            'education': 'linear-gradient(135deg, #43e97b, #38f9d7)',
            'marketing': 'linear-gradient(135deg, #fa709a, #fee140)',
            'consulting': 'linear-gradient(135deg, #a8edea, #fed6e3)',
            'default': 'linear-gradient(135deg, #ff6b6b, #4ecdc4)'
        };
        return colors[industry?.toLowerCase()] || colors.default;
    };

    if (userRole === 'candidate') {
        // Affichage d'une offre d'emploi pour un candidat
        return (
            <div className="job-card-modern h-100 d-flex flex-column">
                {/* Header avec image de fond */}
                <div 
                    className="job-card-header"
                    style={{
                        background: getIndustryColor(item.industry),
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    <div className="job-card-overlay">
                        <div className="d-flex justify-content-between align-items-start">
                            <div>
                                <h3 className="text-white mb-2 fw-bold">{item.title}</h3>
                                <p className="text-white-75 mb-0">
                                    <i className="fas fa-building me-2"></i>
                                    {item.company}
                                </p>
                            </div>
                            <div className="avatar-modern" style={{ width: '50px', height: '50px', fontSize: '1.2rem' }}>
                                {getInitials(item.recruiter_firstName, item.recruiter_lastName)}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contenu principal */}
                <div className="job-card-content flex-grow-1 p-4">
                    {/* Informations principales */}
                    <div className="mb-4">
                        <div className="d-flex align-items-center mb-3">
                            <div className="badge-modern me-2" style={{ background: getIndustryColor(item.industry) }}>
                                <i className="fas fa-tag me-1"></i>
                                {item.industry || 'Non spécifié'}
                            </div>
                            <div className="badge-modern" style={{ background: 'linear-gradient(135deg, #96ceb4, #a8e6cf)' }}>
                                <i className="fas fa-map-marker-alt me-1"></i>
                                {item.location || 'Non spécifié'}
                            </div>
                        </div>

                        <div className="salary-info mb-3">
                            <div className="d-flex align-items-center">
                                <i className="fas fa-euro-sign text-primary me-2"></i>
                                <span className="fw-bold">{formatSalary(item.salary)}</span>
                            </div>
                        </div>

                        <div className="job-type mb-3">
                            <div className="d-flex align-items-center">
                                <i className="fas fa-clock text-secondary me-2"></i>
                                <span>{item.contractType || 'Type de contrat non précisé'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mb-4">
                        <h6 className="fw-bold mb-2">
                            <i className="fas fa-align-left me-2"></i>
                            Description
                        </h6>
                        <p className="text-muted mb-0">
                            {item.description ? 
                                (item.description.length > 150 ? 
                                    `${item.description.substring(0, 150)}...` : 
                                    item.description
                                ) : 
                                'Aucune description disponible'
                            }
                        </p>
                    </div>

                    {/* Compétences requises */}
                    {item.requiredSkills && (
                        <div className="mb-4">
                            <h6 className="fw-bold mb-2">
                                <i className="fas fa-tools me-2"></i>
                                Compétences requises
                            </h6>
                            <div className="d-flex flex-wrap gap-2">
                                {item.requiredSkills.split(',').slice(0, 3).map((skill, index) => (
                                    <span 
                                        key={index}
                                        className="skill-badge"
                                        style={{ background: getIndustryColor(item.industry) }}
                                    >
                                        {skill.trim()}
                                    </span>
                                ))}
                                {item.requiredSkills.split(',').length > 3 && (
                                    <span className="skill-badge-more">
                                        +{item.requiredSkills.split(',').length - 3}
                                    </span>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Recruteur */}
                    <div className="recruiter-info">
                        <div className="d-flex align-items-center p-3 rounded-3" style={{ background: 'var(--gray-100)' }}>
                            <div className="avatar-modern me-3" style={{ width: '40px', height: '40px', fontSize: '1rem' }}>
                                {getInitials(item.recruiter_firstName, item.recruiter_lastName)}
                            </div>
                            <div>
                                <h6 className="mb-1 fw-bold">
                                    {item.recruiter_firstName} {item.recruiter_lastName}
                                </h6>
                                <p className="text-muted mb-0 small">
                                    <i className="fas fa-user-tie me-1"></i>
                                    Recruteur
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    } else {
        // Affichage d'un candidat pour un recruteur
        return (
            <div className="job-card-modern h-100 d-flex flex-column">
                {/* Header avec photo de profil */}
                <div className="job-card-header candidate-header">
                    <div className="candidate-photo-container">
                        {item.profilePicture ? (
                            <img 
                                                                    src={`http://localhost/TinderWork/backend/${item.profilePicture}`}
                                alt="Photo de profil"
                                className="candidate-photo"
                            />
                        ) : (
                            <div className="avatar-modern candidate-avatar">
                                {getInitials(item.firstName, item.lastName)}
                            </div>
                        )}
                    </div>
                    <div className="candidate-overlay">
                        <h3 className="text-white mb-2 fw-bold">
                            {item.firstName} {item.lastName}
                        </h3>
                        <p className="text-white-75 mb-0">
                            <i className="fas fa-briefcase me-2"></i>
                            {item.position || 'Poste non précisé'}
                        </p>
                    </div>
                </div>

                {/* Contenu principal */}
                <div className="job-card-content flex-grow-1 p-4">
                    {/* Informations principales */}
                    <div className="mb-4">
                        <div className="d-flex align-items-center mb-3">
                            <div className="badge-modern me-2" style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
                                <i className="fas fa-graduation-cap me-1"></i>
                                {item.education || 'Formation non précisée'}
                            </div>
                            <div className="badge-modern" style={{ background: 'linear-gradient(135deg, #96ceb4, #a8e6cf)' }}>
                                <i className="fas fa-map-marker-alt me-1"></i>
                                {item.location || 'Localisation non précisée'}
                            </div>
                        </div>

                        <div className="experience-info mb-3">
                            <div className="d-flex align-items-center">
                                <i className="fas fa-briefcase text-primary me-2"></i>
                                <span className="fw-bold">{item.experience || '0'} ans d'expérience</span>
                            </div>
                        </div>

                        <div className="availability mb-3">
                            <div className="d-flex align-items-center">
                                <i className="fas fa-calendar-check text-secondary me-2"></i>
                                <span>Disponible {item.availability || 'Non précisé'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mb-4">
                        <h6 className="fw-bold mb-2">
                            <i className="fas fa-align-left me-2"></i>
                            À propos
                        </h6>
                        <p className="text-muted mb-0">
                            {item.bio ? 
                                (item.bio.length > 150 ? 
                                    `${item.bio.substring(0, 150)}...` : 
                                    item.bio
                                ) : 
                                'Aucune description disponible'
                            }
                        </p>
                    </div>

                    {/* Compétences */}
                    {item.skills && (
                        <div className="mb-4">
                            <h6 className="fw-bold mb-2">
                                <i className="fas fa-tools me-2"></i>
                                Compétences
                            </h6>
                            <div className="d-flex flex-wrap gap-2">
                                {item.skills.split(',').slice(0, 4).map((skill, index) => (
                                    <span 
                                        key={index}
                                        className="skill-badge"
                                        style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}
                                    >
                                        {skill.trim()}
                                    </span>
                                ))}
                                {item.skills.split(',').length > 4 && (
                                    <span className="skill-badge-more">
                                        +{item.skills.split(',').length - 4}
                                    </span>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Contact */}
                    <div className="contact-info">
                        <div className="d-flex align-items-center p-3 rounded-3" style={{ background: 'var(--gray-100)' }}>
                            <div className="avatar-modern me-3" style={{ width: '40px', height: '40px', fontSize: '1rem' }}>
                                <i className="fas fa-user"></i>
                            </div>
                            <div>
                                <h6 className="mb-1 fw-bold">Candidat</h6>
                                <p className="text-muted mb-0 small">
                                    <i className="fas fa-envelope me-1"></i>
                                    {item.email}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};

export default JobCard; 