import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const JobPostForm = ({ onSuccess }) => {
    const { user } = useAuth();
    const [skills, setSkills] = useState([]);
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredSkills, setFilteredSkills] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
        salary: '',
        contract_type: '',
        required_skills: []
    });

    useEffect(() => {
        // Charger la liste des compétences
        const fetchSkills = async () => {
            try {
                const response = await axios.get('http://localhost/TinderWork/backend/get_skills.php', {
                    withCredentials: true
                });
                setSkills(response.data.skills);
            } catch (error) {
                console.error('Erreur lors du chargement des compétences:', error);
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
                required_skills: [...prev.required_skills, skill.id]
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
            required_skills: prev.required_skills.filter(id => id !== skillId)
        }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Vérifier si l'utilisateur est connecté
        if (!user) {
            alert('Vous devez être connecté pour publier une annonce');
            return;
        }

        // Vérifier si l'utilisateur est un recruteur
        if (user.role !== 'recruiter') {
            alert('Seuls les recruteurs peuvent publier des annonces');
            return;
        }

        // Log pour déboguer
        console.log('Token:', user.token);
        console.log('FormData:', formData);

        try {
            const response = await axios.post('http://localhost/TinderWork/backend/post_job.php', formData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                }
            });

            console.log('Réponse du serveur:', response.data);

            // Vérifier si la réponse contient un message de succès
            if (response.data && response.data.job) {
                alert('Annonce créée avec succès !');
                // Réinitialiser le formulaire
                setFormData({
                    title: '',
                    description: '',
                    location: '',
                    salary: '',
                    contract_type: '',
                    required_skills: []
                });
                setSelectedSkills([]);
                if (onSuccess) {
                    onSuccess();
                }
            } else {
                throw new Error(response.data.error || 'Erreur lors de la création de l\'annonce');
            }
        } catch (error) {
            console.error('Erreur lors de la création de l\'annonce:', error);
            console.error('Détails de l\'erreur:', error.response?.data);
            alert(error.response?.data?.error || 'Erreur lors de la création de l\'annonce');
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6">Publier une annonce</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Titre du poste</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        required
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
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Salaire</label>
                    <input
                        type="text"
                        name="salary"
                        value={formData.salary}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Type de contrat</label>
                    <select
                        name="contract_type"
                        value={formData.contract_type}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                        <option value="">Sélectionner un type de contrat</option>
                        <option value="CDI">CDI</option>
                        <option value="CDD">CDD</option>
                        <option value="Freelance">Freelance</option>
                        <option value="Stage">Stage</option>
                        <option value="Alternance">Alternance</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Compétences requises</label>
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
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
                                className="group relative bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full flex items-center"
                            >
                                {skill.name}
                                <button
                                    type="button"
                                    onClick={() => handleRemoveSkill(skill.id)}
                                    className="ml-2 text-indigo-600 hover:text-indigo-800 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={() => {
                            setFormData({
                                title: '',
                                description: '',
                                location: '',
                                salary: '',
                                contract_type: '',
                                required_skills: []
                            });
                            setSelectedSkills([]);
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Annuler
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                        Publier l'annonce
                    </button>
                </div>
            </form>
        </div>
    );
};

export default JobPostForm; 