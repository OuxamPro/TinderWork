-- Création de la base de données
CREATE DATABASE IF NOT EXISTS tinderwork;
USE tinderwork;

-- Table des utilisateurs
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    firstName VARCHAR(100) NOT NULL,
    lastName VARCHAR(100) NOT NULL,
    role ENUM('candidate', 'recruiter') NOT NULL,
    company VARCHAR(255),
    position VARCHAR(255),
    bio TEXT,
    location VARCHAR(255),
    profilePicture VARCHAR(255),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table des offres d'emploi
CREATE TABLE IF NOT EXISTS jobs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    recruiterId INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    company VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    salary VARCHAR(100),
    type ENUM('CDI', 'CDD', 'Freelance', 'Stage', 'Alternance') NOT NULL,
    requirements TEXT,
    benefits TEXT,
    status ENUM('active', 'closed') DEFAULT 'active',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (recruiterId) REFERENCES users(id) ON DELETE CASCADE
);

-- Table des matchs
CREATE TABLE IF NOT EXISTS matches (
    id INT PRIMARY KEY AUTO_INCREMENT,
    candidateId INT NOT NULL,
    jobId INT NOT NULL,
    status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (candidateId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (jobId) REFERENCES jobs(id) ON DELETE CASCADE
);

-- Table des compétences
CREATE TABLE IF NOT EXISTS skills (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) UNIQUE NOT NULL
);

-- Table de liaison entre utilisateurs et compétences
CREATE TABLE IF NOT EXISTS user_skills (
    userId INT NOT NULL,
    skillId INT NOT NULL,
    level ENUM('débutant', 'intermédiaire', 'avancé', 'expert') NOT NULL,
    PRIMARY KEY (userId, skillId),
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (skillId) REFERENCES skills(id) ON DELETE CASCADE
);

-- Table de liaison entre offres d'emploi et compétences
CREATE TABLE IF NOT EXISTS job_skills (
    jobId INT NOT NULL,
    skillId INT NOT NULL,
    level ENUM('débutant', 'intermédiaire', 'avancé', 'expert') NOT NULL,
    PRIMARY KEY (jobId, skillId),
    FOREIGN KEY (jobId) REFERENCES jobs(id) ON DELETE CASCADE,
    FOREIGN KEY (skillId) REFERENCES skills(id) ON DELETE CASCADE
);

-- Insertion de quelques compétences de base
INSERT INTO skills (name) VALUES
('JavaScript'),
('Python'),
('Java'),
('PHP'),
('React'),
('Node.js'),
('SQL'),
('MongoDB'),
('HTML'),
('CSS'),
('TypeScript'),
('Angular'),
('Vue.js'),
('Docker'),
('AWS'),
('Git'),
('DevOps'),
('UI/UX Design'),
('Agile'),
('Scrum'); 