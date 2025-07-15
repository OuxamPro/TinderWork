CREATE TABLE IF NOT EXISTS candidate_swipes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    recruiter_id INT NOT NULL,
    candidate_id INT NOT NULL,
    action ENUM('like', 'dislike') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (recruiter_id) REFERENCES users(id),
    FOREIGN KEY (candidate_id) REFERENCES users(id),
    UNIQUE KEY unique_swipe (recruiter_id, candidate_id)
); 