# TinderWork 🚀

Une plateforme de matching entre candidats et recruteurs inspirée de Tinder, développée avec React.js et PHP/MySQL.

## 🎯 Fonctionnalités

### Pour les Candidats
- **Swipe** sur les offres d'emploi
- **Match** avec les recruteurs
- **Chat** en temps réel avec les employeurs
- **Profil** personnalisable avec photo et bio
- **Gestion des compétences** et expériences

### Pour les Recruteurs
- **Publier** des offres d'emploi
- **Swipe** sur les candidats
- **Match** avec les talents
- **Chat** avec les candidats
- **Gestion** des annonces publiées

## 🛠️ Technologies Utilisées

### Frontend
- **React.js** - Framework JavaScript
- **Bootstrap** - Framework CSS
- **Font Awesome** - Icônes
- **React Router** - Navigation

### Backend
- **PHP** - Langage serveur
- **MySQL** - Base de données
- **XAMPP** - Serveur local

## 📦 Installation

### Prérequis
- XAMPP installé
- Node.js et npm
- Git

### Étapes d'installation

1. **Cloner le repository**
```bash
git clone https://github.com/OuxamPro/TinderWork.git
cd TinderWork
```

2. **Configurer la base de données**
- Ouvrir phpMyAdmin (http://localhost/phpmyadmin)
- Créer une base de données `tinderwork`
- Importer le fichier SQL (à créer selon votre structure)

3. **Configurer le backend**
- Copier le dossier `backend` dans `htdocs/TinderWork/`
- Modifier `backend/config.php` avec vos paramètres de base de données

4. **Installer les dépendances frontend**
```bash
cd frontend
npm install
```

5. **Construire l'application**
```bash
npm run build
```

6. **Déployer sur XAMPP**
```bash
cp -r build/* ../
```

## 🚀 Utilisation

1. **Démarrer XAMPP**
   - Apache et MySQL

2. **Accéder à l'application**
   - http://localhost/TinderWork/

3. **Créer un compte**
   - Candidat ou Recruteur

4. **Commencer à swiper !**

## 📁 Structure du Projet

```
TinderWork/
├── frontend/                 # Application React
│   ├── src/
│   │   ├── components/      # Composants réutilisables
│   │   ├── pages/          # Pages de l'application
│   │   ├── context/        # Context React
│   │   └── styles/         # Styles CSS
│   ├── public/             # Fichiers publics
│   └── package.json        # Dépendances
├── backend/                # API PHP
│   ├── config.php         # Configuration DB
│   ├── uploads/           # Photos de profil
│   └── *.php              # Endpoints API
├── htdocs/                # Fichiers déployés
└── README.md              # Documentation
```

## 🔧 Configuration

### Variables d'environnement
Créer un fichier `.env` dans le dossier frontend :
```env
REACT_APP_API_URL=http://localhost/TinderWork/backend
```

### Base de données
Modifier `backend/config.php` :
```php
$host = 'localhost';
$dbname = 'tinderwork';
$username = 'root';
$password = '';
```

## 📱 Fonctionnalités Principales

### Système de Matching
- Algorithme de matching basé sur les compétences
- Système de swipe intuitif
- Notifications de match en temps réel

### Chat en Temps Réel
- Messages instantanés
- Interface moderne et responsive
- Historique des conversations

### Gestion des Profils
- Photos de profil
- Bio personnalisée
- Compétences et expériences
- Statistiques de profil

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👨‍💻 Auteur

**OuxamPro**
- GitHub: [@OuxamPro](https://github.com/OuxamPro)

## 🙏 Remerciements

- Inspiration: Tinder
- Framework: React.js
- Serveur: XAMPP
- Design: Bootstrap

---

⭐ N'oubliez pas de donner une étoile si ce projet vous a aidé ! 