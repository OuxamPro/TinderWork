import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

const RecruiterProfileForm = () => {
    const { user, setUser } = useAuth();
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        companyName: '',
        companyDescription: '',
        companyLocation: '',
        companyWebsite: '',
        companySize: '',
        industry: '',
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

    // Mapping des valeurs du secteur d'activité
    const industryMapping = {
        'tech': 'Technologie',
        'finance': 'Finance',
        'healthcare': 'Santé',
        'education': 'Éducation',
        'retail': 'Commerce',
        'manufacturing': 'Industrie',
        'other': 'Autre'
    };

    // Fonction pour obtenir la valeur d'affichage du secteur
    const getIndustryDisplayValue = (value) => {
        return industryMapping[value] || value;
    };

    // Fonction pour obtenir la valeur de la base de données
    const getIndustryDbValue = (displayValue) => {
        return Object.entries(industryMapping).find(([key, value]) => value === displayValue)?.[0] || displayValue;
    };

    // Fonction pour charger les données du profil
    const loadUserData = useCallback(async () => {
        setLoading(true);
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
                    // Mettre à jour le contexte utilisateur
                    setUser(data.user);
                    
                    // Mettre à jour le formulaire avec les données de la base
                    setFormData(prev => ({
                        ...prev,
                        companyName: data.user.companyName || '',
                        companyDescription: data.user.companyDescription || '',
                        companyLocation: data.user.companyLocation || '',
                        companyWebsite: data.user.companyWebsite || '',
                        companySize: data.user.companySize || '',
                        industry: data.user.industry || '',
                        profilePicture: null,
                        skills: data.user.skills || []
                    }));

                    // Mettre à jour l'image de profil si elle existe
                    if (data.user.profilePicture) {
                        setPreviewImage(`http://localhost/TinderWork/backend/${data.user.profilePicture}`);
                    } else {
                        setPreviewImage(null);
                    }
                }
            }
        } catch (err) {
            console.error('Erreur lors du chargement des données:', err);
            setError('Erreur lors du chargement des données');
        } finally {
            setLoading(false);
        }
    }, [setUser]);

    // Charger les données au montage du composant
    useEffect(() => {
        loadUserData();
    }, [loadUserData]);

    // Recharger les données toutes les 30 secondes seulement si le formulaire n'est pas ouvert
    useEffect(() => {
        if (!showForm) {
            const interval = setInterval(() => {
                loadUserData();
            }, 30000);

            return () => clearInterval(interval);
        }
    }, [loadUserData, showForm]);

    // Charger les compétences au montage du composant
    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const response = await fetch('http://localhost/TinderWork/backend/get_skills.php');
                if (response.ok) {
                    const data = await response.json();
                    setSkills(data.skills);
                }
            } catch (err) {
                console.error('Erreur lors du chargement des compétences:', err);
            }
        };
        fetchSkills();
    }, []);

    // Filtrer les compétences en fonction de la recherche
    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredSkills([]);
            return;
        }

        const filtered = skills.filter(skill =>
            skill.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredSkills(filtered);
    }, [searchTerm, skills]);

    // Fonction pour ajouter une compétence
    const handleAddSkill = (skill) => {
        if (!selectedSkills.find(s => s.id === skill.id)) {
            setSelectedSkills([...selectedSkills, skill]);
            setFormData(prev => ({
                ...prev,
                skills: [...prev.skills, skill.id]
            }));
        }
        setSearchTerm('');
        setFilteredSkills([]);
    };

    // Fonction pour supprimer une compétence
    const handleRemoveSkill = (skillId) => {
        setSelectedSkills(selectedSkills.filter(s => s.id !== skillId));
        setFormData(prev => ({
            ...prev,
            skills: prev.skills.filter(id => id !== skillId)
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                profilePicture: file
            }));
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            const formDataToSend = new FormData();
            const jsonData = {
                companyName: formData.companyName,
                companyDescription: formData.companyDescription,
                companyLocation: formData.companyLocation,
                companyWebsite: formData.companyWebsite,
                companySize: formData.companySize,
                industry: formData.industry,
                skills: formData.skills
            };
            
            formDataToSend.append('data', JSON.stringify(jsonData));

            if (formData.profilePicture) {
                formDataToSend.append('profile_picture', formData.profilePicture);
            }

            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost/TinderWork/backend/update_recruiter_profile.php', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formDataToSend
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Profil mis à jour avec succès !');
                
                // Mettre à jour le contexte utilisateur avec les nouvelles données
                setUser(data.user);

                // Réinitialiser le formulaire
                setFormData({
                    companyName: '',
                    companyDescription: '',
                    companyLocation: '',
                    companyWebsite: '',
                    companySize: '',
                    industry: '',
                    profilePicture: null,
                    skills: []
                });
                setPreviewImage(null);
                
                // Masquer le formulaire
                setShowForm(false);
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
        <div className="bg-white shadow rounded-lg p-6">
            {!showForm ? (
                <div>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Profil Recruteur</h2>
                        <button
                            onClick={() => setShowForm(true)}
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                        >
                            Modifier le profil
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-700">Informations de l'entreprise</h3>
                            <p className="text-gray-600">{user.companyName}</p>
                            <p className="text-gray-600">{user.companyDescription}</p>
                            <p className="text-gray-600">{user.companyLocation}</p>
                            {user.companyWebsite && <p className="text-gray-600">{user.companyWebsite}</p>}
                            {user.companySize && <p className="text-gray-600">Taille: {user.companySize}</p>}
                            {user.industry && <p className="text-gray-600">Secteur: {user.industry}</p>}
                        </div>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Modifier le profil</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nom de l'entreprise</label>
                                <input
                                    type="text"
                                    name="companyName"
                                    value={formData.companyName}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Site web</label>
                                <input
                                    type="url"
                                    name="companyWebsite"
                                    value={formData.companyWebsite}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Localisation</label>
                                <input
                                    type="text"
                                    name="companyLocation"
                                    value={formData.companyLocation}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Taille de l'entreprise</label>
                                <select
                                    name="companySize"
                                    value={formData.companySize}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                >
                                    <option value="">Sélectionner</option>
                                    <option value="1-10">1-10 employés</option>
                                    <option value="11-50">11-50 employés</option>
                                    <option value="51-200">51-200 employés</option>
                                    <option value="201-500">201-500 employés</option>
                                    <option value="501+">501+ employés</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Secteur d'activité</label>
                                <input
                                    type="text"
                                    name="industry"
                                    value={formData.industry}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <div className="mt-6">
                            <label className="block text-sm font-medium text-gray-700">Description de l'entreprise</label>
                            <textarea
                                name="companyDescription"
                                value={formData.companyDescription}
                                onChange={handleChange}
                                rows="4"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div className="mt-6">
                            <label className="block text-sm font-medium text-gray-700">Photo de profil</label>
                            <div className="mt-1 flex items-center">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                    id="profile-picture"
                                />
                                <label
                                    htmlFor="profile-picture"
                                    className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Changer la photo
                                </label>
                                {previewImage && (
                                    <img
                                        src={previewImage}
                                        alt="Aperçu"
                                        className="ml-4 h-12 w-12 rounded-full object-cover"
                                    />
                                )}
                            </div>
                        </div>

                        <div className="mt-6">
                            <label className="block text-sm font-medium text-gray-700">Compétences recherchées</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setSearchTerm(value);
                                        if (value.trim() === '') {
                                            setFilteredSkills([]);
                                            return;
                                        }
                                        const filtered = skills.filter(skill =>
                                            skill.name.toLowerCase().includes(value.toLowerCase())
                                        );
                                        setFilteredSkills(filtered);
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && filteredSkills.length > 0) {
                                            e.preventDefault();
                                            handleAddSkill(filteredSkills[0]);
                                        }
                                    }}
                                    placeholder="Rechercher une compétence..."
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                                {filteredSkills.length > 0 && (
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
                    </div>

                    {message && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
                            {message}
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                            {error}
                        </div>
                    )}

                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={() => setShowForm(false)}
                            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                        >
                            Mettre à jour le profil
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default RecruiterProfileForm; 