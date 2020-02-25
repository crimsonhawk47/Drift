--Empty Tables
DELETE FROM "reports"

DELETE FROM "messages";
DELETE FROM "chat";

DELETE FROM "user";

--DELETING THE TABLES
DROP TABLE "messages";
DROP TABLE "chat";

DROP TABLE "reports";
DROP TABLE "user";

--CREATING TABLES
CREATE TABLE "user"
("id" SERIAL PRIMARY KEY, "username" VARCHAR(60), "password" VARCHAR(60), "email" VARCHAR(180), "image" VARCHAR(1000) DEFAULT './profileIcon.png');

CREATE TABLE "chat"
("id" SERIAL PRIMARY KEY, "user1" INT REFERENCES "user", "user2" INT REFERENCES "user", "active" BOOLEAN, "start_date" TIMESTAMP WITH TIME ZONE, "user1_letter" VARCHAR(1000), "user2_letter" VARCHAR(1000));
CREATE TABLE "messages"
("id" SERIAL PRIMARY KEY, "message" VARCHAR(255), "date" TIMESTAMP WITH TIME ZONE, "chat_id" INT REFERENCES "chat", "user_id" INT REFERENCES "user");

CREATE TABLE "reports"
("id" SERIAL PRIMARY KEY, "user_id" INT REFERENCES "user", "description" VARCHAR(1000), "category" VARCHAR(100));

--DUMMY DATA

----Chats
INSERT INTO "chat" ("user1", "user2", "active", "start_date",  "user1_letter", "user2_letter")
VALUES (2, 3, TRUE, NOW(), 'For the night is dark and full of terrors', 'I dont actually like game of thrones');

INSERT INTO "chat" ("user1", "user2", "active", "start_date",  "user1_letter", "user2_letter")
VALUES (2, 4, TRUE, NOW(), 'We had such a bad time', 'I know right?');

----Messages
INSERT INTO "messages" ("message", "chat_id", "user_id", "date")
VALUES ('Hello Peter', 1, 2, NOW());
INSERT INTO "messages" ("message", "chat_id", "user_id", "date")
VALUES ('Hi Luke! Are you watching Riverdale?', 1, 3, NOW());
INSERT INTO "messages" ("message", "chat_id", "user_id", "date")
VALUES ('If by watching it, you mean am I on the third season already, then yes', 1, 2, NOW());
INSERT INTO "messages" ("message", "chat_id", "user_id", "date")
VALUES ('Have you gotten to the part where Jughead dies yet?', 1, 3, NOW());
INSERT INTO "messages" ("message", "chat_id", "user_id", "date")
VALUES ('NOOOOOOOOOOOOOOO!', 1, 2, NOW());


INSERT INTO "messages" ("message", "chat_id", "user_id", "date")
VALUES ('Hey', 2, 2, NOW());
INSERT INTO "messages" ("message", "chat_id", "user_id", "date")
VALUES ('Sup bro', 2, 4, NOW());
INSERT INTO "messages" ("message", "chat_id", "user_id", "date")
VALUES ('I gotta go', 2, 2, NOW());
