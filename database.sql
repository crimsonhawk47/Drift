
-- USER is a reserved keyword with Postgres
-- You must use double quotes in every query that user is in:
-- ex. SELECT * FROM "user";
-- Otherwise you will have errors!
CREATE TABLE "user" (
    "id" SERIAL PRIMARY KEY,
    "username" VARCHAR (80) UNIQUE NOT NULL,
    "password" VARCHAR (1000) NOT NULL
);

--DELETING THE TABLES
DROP TABLE "messages";
DROP TABLE "chat";
DROP TABLE "reports";
DROP TABLE "user";

--CREATING TABLES
CREATE TABLE "user"
("id" SERIAL PRIMARY KEY, "username" VARCHAR(60), "password" VARCHAR(60), "email" VARCHAR(180), "image" VARCHAR(1000));

CREATE TABLE "chat"
("id" SERIAL PRIMARY KEY, "user1" INT REFERENCES "user", "user2" INT REFERENCES "user", "active" BOOLEAN, "expiration" DATE, "user1_letter" VARCHAR(1000), "user2_letter" VARCHAR(1000));

CREATE TABLE "messages"
("id" SERIAL PRIMARY KEY, "message" VARCHAR(255), "date" TIMESTAMP WITH TIME ZONE, "chat_id" INT REFERENCES "chat", "user_id" INT REFERENCES "user");

CREATE TABLE "reports"
("id" SERIAL PRIMARY KEY, "user_id" INT REFERENCES "user", "description" VARCHAR(1000), "category" VARCHAR(100));

--DUMMY DATA
----Users
INSERT INTO "user" ("username", "password", "email")
VALUES('crimsonhawk47', 'c', 'crimsonhawk47@gmail.com');

INSERT INTO "user" ("username", "password", "email")
VALUES('akimbojesus', 'a', 'akimbojesus@gmail.com');

INSERT INTO "user" ("username", "password", "email")
VALUES('amber', 'a', 'ambervolkmann@gmail.com');

----Chats
INSERT INTO "chat" ("user1", "user2", "active", "user1_letter", "user2_letter")
VALUES (2, 3, TRUE, 'For the night is dark and full of terrors', 'I dont actually like game of thrones');

INSERT INTO "chat" ("user1", "user2", "active", "user1_letter", "user2_letter")
VALUES (1, 2, TRUE, 'We had such a bad time', 'I know right?');

----Messages
INSERT INTO "messages" ("message", "chat_id", "user_id", "date")
VALUES ('Hi', 1, 1, NOW()), 
('Thats not a very good start to a conversation', 1, 2, NOW()),
('I was just saying hello', 1, 1, NOW()),
('But that puts the pressure on me to come up with an actual thing to say', 1, 2, NOW()),
('Wow this is going to be a fun conversation', 1, 1, NOW()),
('It isnt if youre gonna be an asshole', 1, 2, NOW()),
('You must be fun at parties', 1, 1, NOW()),
('/s', 1, 1, NOW()),
('Hey', 2, 2, NOW()), 
('Sup bro', 2, 3, NOW()),
('I gotta go', 2, 2, NOW()),
('Ok?', 2, 3, NOW());