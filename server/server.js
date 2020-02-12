
const express = require('express');
require('dotenv').config();

const app = express();
const bodyParser = require('body-parser');
const sessionMiddleware = require('./modules/session-middleware');
const socket = require('socket.io')

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

const io = socket(server).use(function(socket, next){
  // Wrap the express middleware
  sessionMiddleware(socket.request, {}, next);
})
.on("connection", function(socket){
  var userId = socket.request.session.passport;
  console.log("Your User ID is", userId);
});


// io.on('connection', (socket) => {
//   console.log(socket.id);
//   // io.to(socket.id).emit('SEND_ID')
// })
