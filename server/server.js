
const express = require('express');
require('dotenv').config();

const app = express();
const bodyParser = require('body-parser');
const sessionMiddleware = require('./modules/session-middleware');
const socket = require('socket.io')
const pool = require('./modules/pool');
const attachSocketMethods = require('./socket/attachSocketMethods')


const passport = require('./strategies/user.strategy');

// Route includes
const userRouter = require('./routes/user.router');

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Passport Session Configuration //
app.use(sessionMiddleware);

// start up passport sessions
app.use(passport.initialize());
app.use(passport.session());

/* Routes */
app.use('/api/user', userRouter);

// Serve static files
app.use(express.static('build'));

// App Set //
const PORT = process.env.PORT || 5000;

/** Listen * */
const server = app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});

//SOCKET IO

const io = socket(server).use(function (socket, next) {
  // Wrap the express middleware
  sessionMiddleware(socket.request, {}, next);
})



io.on("connection", function (socket) {
  console.log(`New connection with id: ${socket.id}`);
  let userId = socket.request.session 
  && socket.request.session.passport
  && socket.request.session.passport.user;

  if (userId) {
    getChats(socket)
    attachSocketMethods(socket)
    // console.log("Your Passport is", userId);
  }
  else {
    console.log(`[SECURITY ISSUE] Socket Connection was attempted before user was authorized`);
    socket.disconnect();
  }

});



function getChats(socket){
  let userId = socket.request.session.passport.user;

  //Selects messages and their users by chat and groups them into an array in one column
  let combineMessagesText = `SELECT "chat".id as "chat_id", ARRAY["messages".message, "user".username] as message_details FROM "chat"
  JOIN "messages" ON "chat".id = "messages".chat_id
  JOIN "user" ON "user".id = "messages".user_id
  WHERE "chat".user1 = $1 OR "chat".user2=$1`

  //Creates an array of chat objects with four properties: 
  //The chat id, an array of messages, and the user ID's of both participants
  let combineMessagesByChat = `SELECT "chat_id", array_agg("message_details") as chat_messages, "chat".user1, "chat".user2 from (${combineMessagesText})
                    as foo
                    JOIN "chat" ON "chat_id" = "chat".id
                    GROUP BY "chat_id", "chat".user1, "chat".user2
                    `
  //Replaces the User ID's of both participants (in the last query) with their actual usernames
  //Also places both usernames in a single array
  let fillUsernames = `SELECT "chat_id", "chat_messages", array_agg("user".username) as participants FROM (${combineMessagesByChat})
                        as foo
                        JOIN "user" ON "user".id = "user1" OR "user".id = "user2"
                        GROUP BY "chat_id", "chat_messages";
                        `

  pool.query(fillUsernames, [Number(userId)])
    .then(response => {
      console.log(response.rows);
      
      io.to(socket.id).emit('RECEIVE_ALL_CHATS', response.rows)
    }).catch(error => {
      console.log(error);
    })
}


