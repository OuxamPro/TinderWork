import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

const ProfileForm = () => {
    const { user, setUser } = useAuth();
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        bio: '',
        location: '',
        position: '',
        profilePicture: null,
        skills: []
    });
    const [previewImage, setPreviewImage] = useState(null);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [skills, setSkills] = useState([]);
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredSkills, setFilteredSkills] = useState([]);

    // Charger les compétences disponibles
    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const response = await fetch('http://localhost/TinderWork/backend/get_skills.php');
                if (response.ok) {
                    const data = await response.json();
                    setSkills(data.skills || []);
                }
            } catch (err) {
                console.error('Erreur lors du chargement des compétences:', err);
            }
        };
        fetchSkills();
    }, []);

    // Charger les données du profil
    useEffect(() => {
        const loadUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const response = await fetch('http://localhost/TinderWork/backend/check_auth.php', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.user) {
                        setUser(data.user);
                        setFormData({
                            bio: data.user.bio || '',
                            location: data.user.location || '',
                            position: data.user.position || '',
                            profilePicture: null,
                            skills: data.user.skills || []
                        });
                        setSelectedSkills(data.user.skills || []);
                        
                        if (data.user.profilePicture) {
                            setPreviewImage(`http://localhost/TinderWork/backend/${data.user.profilePicture}`);
                        }
                    }
                }
            } catch (err) {
                console.error('Erreur lors du chargement des données:', err);
            } finally {
                setLoading(false);
            }
        };
        loadUserData();
    }, [setUser]);

    // Filtrer les compétences en fonction de la recherche
    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredSkills([]);
        } else {
            const filtered = skills.filter(skill =>
                skill.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
                !selectedSkills.some(selected => selected.id === skill.id)
            );
            setFilteredSkills(filtered);
        }
    }, [searchTerm, skills, selectedSkills]);

    // Fonction pour ajouter une compétence
    const handleAddSkill = (skill) => {
        setSelectedSkills(prev => [...prev, skill]);
        setSearchTerm('');
    };

    // Fonction pour supprimer une compétence
    const handleRemoveSkill = (skillId) => {
        setSelectedSkills(prev => prev.filter(s => s.id !== skillId));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Vous devez être connecté pour mettre à jour votre profil');
                return;
            }

            const formDataToSend = new FormData();
            
            const jsonData = {
                bio: formData.bio,
                location: formData.location,
                position: formData.position,
                skills: selectedSkills
            };
            
            if (formData.profilePicture) {
                formDataToSend.append('profile_picture', formData.profilePicture);
            }

            formDataToSend.append('data', JSON.stringify(jsonData));

            const response = await fetch('http://localhost/TinderWork/backend/update_profile.php', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formDataToSend
            });

            const data = await response.json();

            if (data.user) {
                setMessage('Profil mis à jour avec succès !');
                setUser(data.user);
                setSelectedSkills(data.user.skills || []);
                
                // Vider le formulaire
                setFormData({
                    bio: data.user.bio || '',
                    location: data.user.location || '',
                    position: data.user.position || '',
                    profilePicture: null,
                    skills: data.user.skills || []
                });
                
                // Mettre à jour la prévisualisation de l'image
                if (data.user.profilePicture) {
                    setPreviewImage(`http://localhost/TinderWork/backend/${data.user.profilePicture}`);
                } else {
                    setPreviewImage(null);
                }
                
                setShowForm(false);
                
                // Effacer le message de succès après 3 secondes
                setTimeout(() => {
                    setMessage('');
                }, 3000);
            } else {
                setError(data.message || 'Une erreur est survenue');
            }
        } catch (err) {
            console.error('Erreur détaillée:', err);
            setError('Erreur lors de la mise à jour du profil: ' + err.message);
        }
    };

    if (loading) {
        return <div>Chargement du profil...</div>;
    }

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
            {!showForm ? (
                <button
                    onClick={() => setShowForm(true)}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    Modifier mon profil
                </button>
            ) : (
                <>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2 className="text-2xl font-bold text-gray-800 mb-0">Mettre à jour votre profil</h2>
                        <button
                            type="button"
                            onClick={() => setShowForm(false)}
                            className="btn btn-outline-secondary btn-sm"
                        >
                            <i className="fas fa-times me-1"></i>
                            Fermer
                        </button>
                    </div>
                    
                    {message && (
                        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">
                            {message}
                        </div>
                    )}
                    
                    {error && (
                        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Photo de profil
                            </label>
                            <div className="flex items-center space-x-4">
                                {previewImage && (
                                    <img 
                                        src={previewImage} 
                                        alt="Preview" 
                                        className="w-20 h-20 rounded-full object-cover"
                                    />
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            console.log('Fichier sélectionné:', file);
                                            // Vérifier la taille du fichier (5MB max)
                                            if (file.size > 5 * 1024 * 1024) {
                                                setError('Le fichier est trop volumineux. Taille maximale : 5MB');
                                                return;
                                            }
                                            // Vérifier le type de fichier
                                            if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
                                                setError('Type de fichier non autorisé. Utilisez JPG, PNG ou GIF');
                                                return;
                                            }
                                            setFormData(prev => ({
                                                ...prev,
                                                profilePicture: file
                                            }));
                                            setPreviewImage(URL.createObjectURL(file));
                                        }
                                    }}
                                    className="block w-full text-sm text-gray-500
                                        file:mr-4 file:py-2 file:px-4
                                        file:rounded-full file:border-0
                                        file:text-sm file:font-semibold
                                        file:bg-blue-50 file:text-blue-700
                                        hover:file:bg-blue-100"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Bio
                            </label>
                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    [e.target.name]: e.target.value
                                }))}
                                rows="4"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Parlez-nous de vous..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Localisation
                            </label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    [e.target.name]: e.target.value
                                }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Votre ville"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Poste actuel
                            </label>
                            <select
                                name="position"
                                value={formData.position}
                                onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    [e.target.name]: e.target.value
                                }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Sélectionnez votre poste</option>
                                <option value="chomeur">Chômeur</option>
                                <option value="etudiant">Étudiant</option>
                                <option value="developpeur">Développeur</option>
                                <option value="chef_projet">Chef de projet</option>
                                <option value="designer">Designer</option>
                                <option value="autre">Autre</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Compétences
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Rechercher une compétence..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {searchTerm && filteredSkills.length > 0 && (
                                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                                        {filteredSkills.map(skill => (
                                            <div
                                                key={skill.id}
                                                onClick={() => handleAddSkill(skill)}
                                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                            >
                                                {skill.name}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="mt-2 flex flex-wrap gap-2">
                                {selectedSkills.map(skill => (
                                    <div
                                        key={skill.id}
                                        className="group relative bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center"
                                    >
                                        {skill.name}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveSkill(skill.id)}
                                            className="ml-2 text-blue-600 hover:text-blue-800 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex space-x-4">
                            <button
                                type="submit"
                                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                Mettre à jour le profil
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowForm(false);
                                    setFormData({
                                        bio: '',
                                        location: '',
                                        position: '',
                                        profilePicture: null,
                                        skills: []
                                    });
                                    setPreviewImage(null);
                                    setMessage('');
                                    setError('');
                                }}
                                className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                            >
                                Annuler
                            </button>
                        </div>
                    </form>
                </>
            )}
        </div>
    );
};

export default ProfileForm; 