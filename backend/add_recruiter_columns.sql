-- Ajout des colonnes pour les recruteurs
ALTER TABLE users
ADD COLUMN companyName VARCHAR(255) NULL,
ADD COLUMN companyDescription TEXT NULL,
ADD COLUMN companyLocation VARCHAR(255) NULL,
ADD COLUMN companyWebsite VARCHAR(255) NULL,
ADD COLUMN companySize VARCHAR(50) NULL,
ADD COLUMN industry VARCHAR(100) NULL; 