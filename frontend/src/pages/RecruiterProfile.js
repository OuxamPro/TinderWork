import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import JobPostForm from '../components/JobPostForm';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost/TinderWork/backend';

const RecruiterProfile = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        company_name: '',
        industry: '',
        description: '',
        location: '',
        website: '',
        skills: []
    });
    const [skills, setSkills] = useState([]);
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [photo, setPhoto] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);

    useEffect(() => {
        fetchProfile();
        fetchSkills();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await axios.get(`${API_URL}/get_profile.php`, {
                withCredentials: true
            });
            setProfile(response.data);
            setFormData({
                company_name: response.data.company_name || '',
                industry: response.data.industry || '',
                description: response.data.description || '',
                location: response.data.location || '',
                website: response.data.website || '',
                skills: response.data.skills || []
            });
            setSelectedSkills(response.data.skills || []);
            if (response.data.photo) {
                setPhotoPreview(`${API_URL}/uploads/${response.data.photo}`);
            }
        } catch (error) {
            console.error('Erreur lors de la récupération du profil:', error);
        }
    };

    const fetchSkills = async () => {
        try {
            const response = await axios.get(`${API_URL}/get_skills.php`, {
                withCredentials: true
            });
            setSkills(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des compétences:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSkillChange = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
        setSelectedSkills(selectedOptions);
        setFormData(prev => ({
            ...prev,
            skills: selectedOptions
        }));
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPhoto(file);
            setPhotoPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        
        // Ajouter les champs du formulaire
        Object.keys(formData).forEach(key => {
            if (key === 'skills') {
                formDataToSend.append(key, JSON.stringify(formData[key]));
            } else {
                formDataToSend.append(key, formData[key]);
            }
        });

        // Ajouter la photo si elle a été modifiée
        if (photo) {
            formDataToSend.append('photo', photo);
        }

        try {
            await axios.post(`${API_URL}/update_profile.php`, formDataToSend, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setIsEditing(false);
            fetchProfile();
        } catch (error) {
            console.error('Erreur lors de la mise à jour du profil:', error);
        }
    };

    if (!profile) {
        return <div>Chargement...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                    <h1 className="text-2xl font-bold mb-6">Profil Recruteur</h1>
                    
                    {!isEditing ? (
                        <div>
                            <div className="flex items-center mb-6">
                                {photoPreview && (
                                    <img
                                        src={photoPreview}
                                        alt="Photo de profil"
                                        className="w-32 h-32 rounded-full object-cover mr-6"
                                    />
                                )}
                                <div>
                                    <h2 className="text-xl font-semibold">{profile.company_name}</h2>
                                    <p className="text-gray-600">{profile.industry}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6 mb-6">
                                <div>
                                    <h3 className="font-semibold mb-2">Description</h3>
                                    <p className="text-gray-700">{profile.description}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-2">Localisation</h3>
                                    <p className="text-gray-700">{profile.location}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-2">Site web</h3>
                                    <p className="text-gray-700">{profile.website}</p>
                                </div>
                            </div>

                            {profile.skills && profile.skills.length > 0 && (
                                <div className="mb-6">
                                    <h3 className="font-semibold mb-2">Compétences recherchées</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {profile.skills.map(skill => (
                                            <span
                                                key={skill}
                                                className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={() => setIsEditing(true)}
                                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                            >
                                Modifier le profil
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Photo de profil</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handlePhotoChange}
                                    className="mt-1 block w-full"
                                />
                                {photoPreview && (
                                    <img
                                        src={photoPreview}
                                        alt="Aperçu"
                                        className="mt-2 w-32 h-32 rounded-full object-cover"
                                    />
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nom de l'entreprise</label>
                                <input
                                    type="text"
                                    name="company_name"
                                    value={formData.company_name}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Secteur d'activité</label>
                                <input
                                    type="text"
                                    name="industry"
                                    value={formData.industry}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows="4"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Localisation</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Site web</label>
                                <input
                                    type="url"
                                    name="website"
                                    value={formData.website}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Compétences recherchées</label>
                                <select
                                    multiple
                                    value={selectedSkills}
                                    onChange={handleSkillChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                >
                                    {skills.map(skill => (
                                        <option key={skill.id} value={skill.id}>
                                            {skill.name}
                                        </option>
                                    ))}
                                </select>
                                <p className="mt-1 text-sm text-gray-500">
                                    Maintenez Ctrl (ou Cmd sur Mac) pour sélectionner plusieurs compétences
                                </p>
                            </div>

                            <div className="flex justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                                >
                                    Enregistrer
                                </button>
                            </div>
                        </form>
                    )}
                </div>

                {/* Formulaire de publication d'annonce */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-2xl font-bold mb-6">Publier une annonce</h2>
                    <JobPostForm />
                </div>
            </div>
        </div>
    );
};

export default RecruiterProfile; 