const login = async (email, password) => {
    try {
        console.log('Tentative de connexion avec:', { email, password });
        const response = await axios({
            method: 'post',
            url: '/backend/login.php',
            data: { email, password },
            withCredentials: true
        });
        console.log('Réponse du serveur:', response.data);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        throw error;
    }
};

const register = async (userData) => {
    try {
        const response = await axios({
            method: 'post',
            url: '/backend/register.php',
            data: userData,
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error('Erreur lors de l\'inscription:', error);
        throw error;
    }
}; 