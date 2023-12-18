DROP TABLE IF EXISTS companies;
CREATE TABLE companies (
    id BIGINT AUTO_INCREMENT NOT NULL,
    name TEXT NOT NULL,
    PRIMARY KEY (id)
);

DROP TABLE IF EXISTS users;
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT NOT NULL,
    companies_id BIGINT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    admin BOOLEAN NOT NULL DEFAULT FALSE,
    firstname TEXT NOT NULL,
    name TEXT NOT NULL,
    birthdate DATE NOT NULL,
    phone TEXT NOT NULL,
    adress TEXT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (companies_id) REFERENCES companies(id)
);

DROP TABLE IF EXISTS advertisements;
CREATE TABLE advertisements (
    id BIGINT AUTO_INCREMENT NOT NULL,
    users_id BIGINT NOT NULL,
    name TEXT NOT NULL,
    short_descriptions TEXT NOT NULL,
    descriptions TEXT NOT NULL,
    wages INT NOT NULL,
    location TEXT NOT NULL,
    worktime TEXT NOT NULL,
    creation_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (users_id) REFERENCES users (id)
);

DROP TABLE IF EXISTS applications;
CREATE TABLE applications (
    id BIGINT AUTO_INCREMENT NOT NULL,
    users_id BIGINT NOT NULL,
    advertisements_id BIGINT NOT NULL,
    creation_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    message TEXT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (advertisements_id) REFERENCES advertisements (id),
    FOREIGN KEY (users_id) REFERENCES users (id)
);

-- False data

INSERT INTO companies (name) VALUES
('Company 1'),
('Company 2'),
('Company 3'),
('Company 4'),
('Company 5');


INSERT INTO users (companies_id, email, password,firstname,name,birthdate,phone,adress) VALUES
(1, 'user1@example.com', '0b14d501a594442a01c6859541bcb3e8164d183d32937b851835442f69d5c94e','firstanme1','name1','2008-11-11','17','Paris'),
(2, 'user2@example.com', '6cf615d5bcaac778352a8f1f3360d23f02f34ec182e259897fd6ce485d7870d4','firstanme2','name2','2008-11-11','17','Rouen'),
(3, 'user3@example.com', '5906ac361a137e2d286465cd6588ebb5ac3f5ae955001100bc41577c3d751764','firstanme3','name3','1986-05-26','17','Chernobyl'),
(4, 'user4@example.com', 'b97873a40f73abedd8d685a7cd5e5f85e4a9cfb83eac26886640a0813850122b','firstanme4','name4','1945-08-9','17','hiroshima'),
(5, 'user5@example.com', '8b2c86ea9cf2ea4eb517fd1e06b74f399e7fec0fef92e3b482a6cf2e2b092023','firstanme5','name5','1945-08-6','17','Nagasaki');

-- Add admin user
INSERT INTO users (email, password,admin,firstname,name,birthdate,phone,adress) VALUES
('admin@example.com', '4813494d137e1631bba301d5acab6e7bb7aa74ce1185d456565ef51d737677b2',TRUE,'admin','admin','2001-09-11','18','New-York');


INSERT INTO advertisements (users_id, name,short_descriptions, descriptions,wages,location,worktime) VALUES
(1, 'Ad 1', 'Short description 1','Description for Ad 1',100,'location 1','100 h par jour'),
(2, 'Ad 2', 'Short description 2','Description for Ad 2',100,'location 2','100 h par jour'),
(3, 'Ad 3', 'Short description 3','Description for Ad 3',100,'location 3','100 h par jour'),
(4, 'Ad 4', 'Short description 4','Description for Ad 4',100,'location 4','100 h par jour'),
(5, 'Ad 5', 'Short description 5','Description for Ad 5',100,'location 5','100 h par jour');

INSERT INTO applications (users_id, advertisements_id, message) VALUES
(1, 1, 'Application message 1'),
(2, 2, 'Application message 2'),
(3, 3, 'Application message 3'),
(4, 4, 'Application message 4'),
(5, 5, 'Application message 5');
