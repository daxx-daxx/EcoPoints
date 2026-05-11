USE ecopoints;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS redemptions;
DROP TABLE IF EXISTS recycling_history;
DROP TABLE IF EXISTS tickets;
DROP TABLE IF EXISTS rewards;
DROP TABLE IF EXISTS bins;
DROP TABLE IF EXISTS users;

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    points INT NOT NULL DEFAULT 0,
    recycled_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE bins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    park_id VARCHAR(50) NOT NULL,
    map_zone INT NOT NULL,
    active TINYINT(1) NOT NULL DEFAULT 1
);

CREATE TABLE tickets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    park_id VARCHAR(50) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    points INT NOT NULL,
    used TINYINT(1) NOT NULL DEFAULT 0,
    used_by INT NULL,
    used_at DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (used_by) REFERENCES users(id)
);

CREATE TABLE rewards (
    id INT AUTO_INCREMENT PRIMARY KEY,
    park_id VARCHAR(50) NOT NULL,
    discount_percent INT NOT NULL,
    cost INT NOT NULL,
    active TINYINT(1) NOT NULL DEFAULT 1
);

CREATE TABLE recycling_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    ticket_id INT NOT NULL,
    bin_id INT NOT NULL,
    points_earned INT NOT NULL,
    recycled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (ticket_id) REFERENCES tickets(id),
    FOREIGN KEY (bin_id) REFERENCES bins(id)
);

CREATE TABLE redemptions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    reward_id INT NOT NULL,
    points_spent INT NOT NULL,
    discount_code VARCHAR(50) NOT NULL UNIQUE,
    redeemed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (reward_id) REFERENCES rewards(id)
);

INSERT INTO bins (code, park_id, map_zone, active) VALUES
('FAUNIA-BIN-001', 'faunia', 1, 1),
('FAUNIA-BIN-002', 'faunia', 2, 1),
('FAUNIA-BIN-003', 'faunia', 3, 1),
('FAUNIA-BIN-004', 'faunia', 4, 1),
('FAUNIA-BIN-005', 'faunia', 5, 1),
('FAUNIA-BIN-006', 'faunia', 6, 1),
('FAUNIA-BIN-007', 'faunia', 7, 1),
('FAUNIA-BIN-008', 'faunia', 8, 1),
('FAUNIA-BIN-009', 'faunia', 9, 1),
('FAUNIA-BIN-010', 'faunia', 10, 1),
('FAUNIA-BIN-011', 'faunia', 11, 1),
('FAUNIA-BIN-012', 'faunia', 12, 1),
('FAUNIA-BIN-013', 'faunia', 13, 1),
('FAUNIA-BIN-014', 'faunia', 14, 1),
('FAUNIA-BIN-015', 'faunia', 15, 1),
('FAUNIA-BIN-016', 'faunia', 16, 1),
('FAUNIA-BIN-017', 'faunia', 17, 1),
('FAUNIA-BIN-018', 'faunia', 18, 1),
('FAUNIA-BIN-019', 'faunia', 19, 1),
('FAUNIA-BIN-020', 'faunia', 20, 1),
('FAUNIA-BIN-021', 'faunia', 21, 1),
('FAUNIA-BIN-022', 'faunia', 22, 1),
('FAUNIA-BIN-023', 'faunia', 23, 1),
('FAUNIA-BIN-024', 'faunia', 24, 1),
('FAUNIA-BIN-025', 'faunia', 25, 1),
('FAUNIA-BIN-026', 'faunia', 26, 1),
('FAUNIA-BIN-027', 'faunia', 27, 1),
('FAUNIA-BIN-028', 'faunia', 28, 1),
('FAUNIA-BIN-029', 'faunia', 29, 1),
('FAUNIA-BIN-030', 'faunia', 30, 1);

INSERT INTO tickets (code, park_id, amount, points, used) VALUES
('FNA-0350-X8K2Q', 'faunia', 3.50, 35, 0),
('FNA-0500-M4P7A', 'faunia', 5.00, 50, 0),
('FNA-0850-K9L3D', 'faunia', 8.50, 85, 0),
('FNA-1200-Z8L2M', 'faunia', 12.00, 120, 0),
('FNA-1500-Q5R9T', 'faunia', 15.00, 150, 0),
('FNA-1850-B2N6V', 'faunia', 18.50, 185, 0),
('FNA-2200-H7C4X', 'faunia', 22.00, 220, 0),
('FNA-3000-X7A4C', 'faunia', 30.00, 300, 0),
('FNA-4500-P9W2J', 'faunia', 45.00, 450, 0),
('FNA-6000-L3D8S', 'faunia', 60.00, 600, 0);

INSERT INTO rewards (park_id, discount_percent, cost, active) VALUES
('faunia', 5, 100, 1),
('faunia', 10, 200, 1),
('faunia', 15, 350, 1),
('faunia', 20, 500, 1),
('faunia', 30, 900, 1);