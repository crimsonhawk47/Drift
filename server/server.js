
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
  console.log(`New connection with id: ${socket.id}`);
  let userId = socket.request.session
    && socket.request.session.passport
    && socket.request.session.passport.user;

  //If the user is authenticated
  if (userId) {

    //Run the method that has that socket get all its chats
    getChats(socket)

    //We are putting all our socket events in an external file.
    //We pass a function everything it needs to attach those events
    let serverMethods = { getChats: getChats }
    attachSocketMethods(socket, io, serverMethods)

    //Get all of the chats in SQL that the user appears to be in
    let queryText = `SELECT "id" from "chat"
                      WHERE "user1" = $1 OR "user2" = $1`

    //
    pool.query(queryText, [userId])
      .then(result => {
        console.log(`----------------------------`);

        for (row of result.rows) {
          //For each of the chats the user is in, join them to a
          //room with the name of that chat ID
          socket.join(row.id)
          console.log(`socket is joining ${row.id}`);
        }

        //As a test, each time any socket connects, we are telling Room1 someone connected
        console.log(`----------------------------`);

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



function getChats(socket) {
  let userId = socket.request.session.passport.user;

  //Selects messages and their users by chat and groups them into an array in one column
  let combineMessagesText = `SELECT "chat".id as "chat_id", jsonb_build_object('id', "messages".id, 'message', "messages".message, 'username', "user".username, 'date', "messages".date, 'img', "user".image) as message_details, "messages".id as "message_id" FROM "chat"
  JOIN "messages" ON "chat".id = "messages".chat_id
  JOIN "user" ON "user".id = "messages".user_id
  WHERE ("chat".user1 = $1 OR "chat".user2=$1)
  ORDER BY "messages".id`

  //Creates an array of chat objects with four properties: 
  //The chat id, an array of messages, and the user ID's of both participants
  let combineMessagesByChat = `SELECT "chat_id", "chat".start_date as "chat_date", jsonb_agg("foo".message_details ORDER BY foo."message_id") as chat_messages, "chat".user1, "chat".user2, "chat".active from (${combineMessagesText})
                              as foo
                              JOIN "chat" ON "chat_id" = "chat".id
                              GROUP BY "chat_id", "chat".user1, "chat".user2, "chat".active, "chat".start_date
                              `
  //Replaces the User ID's of both participants (in the last query) with their actual usernames
  //Also places both usernames in a single array
  let fillUsernames = `SELECT "chat_id", "chat_date", "chat_messages", array_agg("user".username) as participants, "goo".active FROM (${combineMessagesByChat})
                      as goo
                      JOIN "user" ON "user".id = "user1" OR "user".id = "user2"
                      GROUP BY "chat_id", "chat_messages", "goo".active, "goo".chat_date
                      ORDER BY "goo".active DESC, "goo".chat_date
                      `

  pool.query(fillUsernames, [Number(userId)])
    .then(response => {



      //RECEIVE_ALL_CHATS is a socket event on the client that will put data into the chats reducer
      socket.emit('RECEIVE_ALL_CHATS', response.rows)
    }).catch(error => {
      console.log(error);
    })
}



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



