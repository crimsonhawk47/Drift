
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
  let userId = socket.request.session.passport.user;

  if (userId) {
    getChats(userId, socket.id);
    attachSocketMethods(socket)
    // console.log("Your Passport is", userId);
  }
  else {
    console.log(`[SECURITY ISSUE] Socket Connection was attempted before user was authorized`);
    socket.disconnect();
  }

});



const getChats = (userId, socketId) => {

  let queryText = `SELECT "messages".message, "user".username, "messages".user_id FROM "chat"
                    JOIN "messages" ON "messages".chat_id = "chat".id
                    JOIN "user" ON "messages".user_id = "user".id
                    WHERE "chat".user1 = $1 OR "chat".user2=$1`

  pool.query(queryText, [Number(userId)])
    .then(response => {
      // console.log(response.rows);
      if (response.rows) {
        io.to(socketId).emit('RECEIVE_ALL_CHATS', response.rows)
      }
      else {
        console.log(`No Chats were Found`);

      }
    }).catch(error => {
      console.log(error);
      return false;
    })
}


