import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import JobPostForm from '../components/JobPostForm';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost/TinderWork/backend';

const MyJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [isPosting, setIsPosting] = useState(false);
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        if (user && user.token) {
            fetchJobs();
        }
    }, [user]);

    const fetchJobs = async () => {
        try {
            console.log('Envoi de la requête avec le token:', user.token);
            const response = await axios.get(`${API_URL}/get_my_jobs.php`, {
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
            console.log('Réponse brute du serveur:', response);
            console.log('Données des annonces:', response.data);
            
            // Vérifier si response.data est un tableau
            if (Array.isArray(response.data)) {
                setJobs(response.data);
            } else if (response.data && Array.isArray(response.data.jobs)) {
                setJobs(response.data.jobs);
            } else {
                console.error('Format de réponse inattendu:', response.data);
                setJobs([]);
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des annonces:', error);
            console.error('Détails de l\'erreur:', error.response?.data);
            setJobs([]);
        }
    };

    const handleDelete = async (jobId) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette annonce ?')) {
            try {
                await axios.post(`${API_URL}/delete_job.php`, {
                    jobId
                }, {
                    withCredentials: true,
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                });
                fetchJobs();
            } catch (error) {
                console.error('Erreur lors de la suppression de l\'annonce:', error);
            }
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Mes annonces</h1>
                    <button
                        onClick={() => setIsPosting(true)}
                        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                    >
                        Publier une nouvelle annonce
                    </button>
                </div>

                {isPosting ? (
                    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Publier une annonce</h2>
                            <button
                                onClick={() => setIsPosting(false)}
                                className="text-gray-600 hover:text-gray-800"
                            >
                                Annuler
                            </button>
                        </div>
                        <JobPostForm onSuccess={() => {
                            setIsPosting(false);
                            fetchJobs();
                        }} />
                    </div>
                ) : (
                    <div className="space-y-6">
                        {jobs.length === 0 ? (
                            <p className="text-center text-gray-600">Vous n'avez pas encore publié d'annonces.</p>
                        ) : (
                            jobs.map(job => (
                                <div key={job.id} className="bg-white rounded-lg shadow-lg p-6">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h2 className="text-xl font-semibold mb-2">{job.title}</h2>
                                            <p className="text-gray-600 mb-4">{job.description}</p>
                                            <div className="grid grid-cols-2 gap-4 mb-4">
                                                <div>
                                                    <span className="font-medium">Localisation :</span> {job.location}
                                                </div>
                                                <div>
                                                    <span className="font-medium">Salaire :</span> {job.salary}
                                                </div>
                                                <div>
                                                    <span className="font-medium">Type de contrat :</span> {job.type}
                                                </div>
                                                <div>
                                                    <span className="font-medium">Entreprise :</span> {job.company}
                                                </div>
                                            </div>
                                            {job.skills && job.skills.length > 0 && (
                                                <div className="mb-4">
                                                    <span className="font-medium">Compétences requises :</span>
                                                    <div className="flex flex-wrap gap-2 mt-2">
                                                        {job.skills.map(skill => (
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
                                        </div>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleDelete(job.id)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                Supprimer
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyJobs; 