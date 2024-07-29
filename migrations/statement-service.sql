CREATE TABLE statement (
    id SERIAL PRIMARY KEY,
    userID VARCHAR(255) NOT NULL,
    description TEXT,
    amount DECIMAL NOT NULL,
    date TIMESTAMP NOT NULL,
    type VARCHAR(255) NOT NULL,
    balance DECIMAL NOT NULL
);
