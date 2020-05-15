
const express = require('express');
require('dotenv').config();

const app = express();
const bodyParser = require('body-parser');
const sessionMiddleware = require('./modules/session-middleware');
const socket = require('socket.io')
const pool = require('./modules/pool');
const attachSocketMethods = require('./socket/attachSocketMethods')
const cron = require('node-cron')
const moment = require('moment')
const serverMethods = require('./modules/serverMethods/`serverMethods')


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

//We need this to use request.user in a socket
const io = socket(server).use(function (socket, next) {
  // Wrap the express middleware
  sessionMiddleware(socket.request, {}, next);
})



io.on("connection", function (socket) {
  console.log(`New socket connection with id: ${socket.id}`);
  let userId = socket.request.session
    && socket.request.session.passport
    && socket.request.session.passport.user;

  //If the user is authenticated
  if (userId) {

    //Run the method that has that socket get all its chats
    serverMethods.getChats(socket)

    //We are putting all our socket events in an external file.
    //We pass a function everything it needs to attach those events
    attachSocketMethods(socket, io, serverMethods)

    //Get all of the chats in SQL that the user appears to be in
    let queryText = `SELECT "id" from "chat"
                      WHERE "user1" = $1 OR "user2" = $1`

    //
    pool.query(queryText, [userId])
      .then(result => {

        for (row of result.rows) {
          //For each of the chats the user is in, join them to a
          //room with the name of that chat ID
          socket.join(row.id)
        }

        //As a test, each time any socket connects, we are telling Room1 someone connected

      })
      .catch(err => {
        console.log(err);
      })
  }
  else {
    console.log(`[SECURITY ISSUE] Socket Connection was attempted before user was authorized`);
    socket.disconnect();
  }

});



cron.schedule('* * * * * ', () => {
  pool.query(`SELECT * FROM "chat"
            WHERE "active" = true`)
    .then(async result => {
      for (chat of result.rows) {
        let chatDate = Number(moment(chat.start_date).format('X')) / 60 / 60 / 24
        let currentDate = moment().format('X') / 60 / 60 / 24
        if (currentDate - chatDate > 1) {
          try {
            await pool.query(`UPDATE "chat"
                  SET "active" = false
                  WHERE "id" = $1`, [chat.id])
            io.to(chat.id).emit('GET_MESSAGES')
          } catch (err) {
            console.log(err);
          }
        }
      }
    })
});



