-- Vérifier et ajouter la colonne companyName si elle n'existe pas
SET @dbname = 'tinderwork';
SET @tablename = 'users';
SET @columnname = 'companyName';
SET @columntype = 'VARCHAR(255)';
SET @columncomment = 'Nom de l\'entreprise du recruteur';

SET @query = IF (
    EXISTS (
        SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = @dbname
        AND TABLE_NAME = @tablename
        AND COLUMN_NAME = @columnname
    ),
    'SELECT "Column companyName already exists"',
    CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' ', @columntype, ' NULL COMMENT "', @columncomment, '"')
);
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Vérifier et ajouter la colonne companyDescription si elle n'existe pas
SET @columnname = 'companyDescription';
SET @columntype = 'TEXT';
SET @columncomment = 'Description de l\'entreprise';

SET @query = IF (
    EXISTS (
        SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = @dbname
        AND TABLE_NAME = @tablename
        AND COLUMN_NAME = @columnname
    ),
    'SELECT "Column companyDescription already exists"',
    CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' ', @columntype, ' NULL COMMENT "', @columncomment, '"')
);
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Vérifier et ajouter la colonne companyLocation si elle n'existe pas
SET @columnname = 'companyLocation';
SET @columntype = 'VARCHAR(255)';
SET @columncomment = 'Adresse de l\'entreprise';

SET @query = IF (
    EXISTS (
        SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = @dbname
        AND TABLE_NAME = @tablename
        AND COLUMN_NAME = @columnname
    ),
    'SELECT "Column companyLocation already exists"',
    CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' ', @columntype, ' NULL COMMENT "', @columncomment, '"')
);
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Vérifier et ajouter la colonne companyWebsite si elle n'existe pas
SET @columnname = 'companyWebsite';
SET @columntype = 'VARCHAR(255)';
SET @columncomment = 'Site web de l\'entreprise';

SET @query = IF (
    EXISTS (
        SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = @dbname
        AND TABLE_NAME = @tablename
        AND COLUMN_NAME = @columnname
    ),
    'SELECT "Column companyWebsite already exists"',
    CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' ', @columntype, ' NULL COMMENT "', @columncomment, '"')
);
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Vérifier et ajouter la colonne companySize si elle n'existe pas
SET @columnname = 'companySize';
SET @columntype = 'VARCHAR(50)';
SET @columncomment = 'Taille de l\'entreprise (nombre d\'employés)';

SET @query = IF (
    EXISTS (
        SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = @dbname
        AND TABLE_NAME = @tablename
        AND COLUMN_NAME = @columnname
    ),
    'SELECT "Column companySize already exists"',
    CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' ', @columntype, ' NULL COMMENT "', @columncomment, '"')
);
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Vérifier et ajouter la colonne industry si elle n'existe pas
SET @columnname = 'industry';
SET @columntype = 'VARCHAR(100)';
SET @columncomment = 'Secteur d\'activité de l\'entreprise';

SET @query = IF (
    EXISTS (
        SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = @dbname
        AND TABLE_NAME = @tablename
        AND COLUMN_NAME = @columnname
    ),
    'SELECT "Column industry already exists"',
    CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' ', @columntype, ' NULL COMMENT "', @columncomment, '"')
);
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt; 