
const express = require('express');
require('dotenv').config();

const app = express();
const bodyParser = require('body-parser');
const sessionMiddleware = require('./modules/session-middleware');
const socket = require('socket.io')
const pool = require('./modules/pool');


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
  let userId = socket.request.session.passport.user;
  getChats(socket);
  console.log("Your Passport is", userId);


});

const getChats = (socket) => {
  let userId = socket.request.session.passport.user;


  let queryText = `SELECT * FROM "chat"
                    JOIN "messages" ON "messages".chat_id = "chat".id
                    WHERE "chat".user1 = $1 OR "chat".user2=$1`

  pool.query(queryText, [Number(userId)])
    .then(response => {
      console.log(response.rows);
      sendChats(response.rows, socket.id)
    }).catch(error => {
      console.log(error);
    })
}


const sendChats = (chats, socketID) => {
  io.to(socketID).emit('RECEIVE_ALL_CHATS', chats)
}
