-- Vérifier si la colonne token existe
SET @dbname = 'tinderwork';
SET @tablename = 'users';
SET @columnname = 'token';
SET @columntype = 'VARCHAR(255)';

SET @query = IF (
    EXISTS (
        SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = @dbname
        AND TABLE_NAME = @tablename
        AND COLUMN_NAME = @columnname
    ),
    'SELECT "Column token already exists"',
    CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' ', @columntype, ' NULL')
);
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt; 