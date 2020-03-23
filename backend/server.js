let express = require('express'),
  path = require('path'),
  mongoose = require('mongoose'),
  cors = require('cors'),
  bodyParser = require('body-parser'),
  dataBaseConfig = require('./database/db'),
  socketModel = require('./models/SocketModel'),
  eventModel = require('./models/EventModel'),
  userModel = require('./models/UserModel');
// Connecting mongoDB
mongoose.Promise = global.Promise;
mongoose.connect(dataBaseConfig.db, {
  useNewUrlParser: true
}).then(() => {
    console.log('Database connected sucessfully ')
  },
  error => {
    console.log('Could not connected to database : ' + error)
  }
)

// Set up express js port
// const socketRoute = require('./routes/socket.route')
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cors());
app.use(express.static(path.join(__dirname, 'dist')));
app.use('/', express.static(path.join(__dirname, 'dist')));
// app.use('/api', socketRoute)


// Create port
const port =  3000;
const server = app.listen(port, () => {
  console.log('Connected to port ' + port)
})

const socket = require('socket.io');

const io = socket(server);

let newEvent;

io.on('connection', (socket) => {
    console.log("Socket ID: " + socket.id + " A user has connected.");

    newEvent = new eventModel({ _id: socket.id, event_type: "connection", msg: "A user has connected" });
    newEvent.save()

    socket.on('userLogin', function(data){
        console.log(data.user + " has logged in.")

        newEvent = new eventModel({ _id: socket.id, event_type: "userLogin", msg: "A user has connected" });
        newEvent.save()

        let newSocket = new socketModel({ _id: socket.id, created_by: data.user });
        newSocket.save();

        let newUser = new userModel({ username: data.user });
        newUser.save();

    });

    socket.on('typing', (data) => {
        console.log(data.user, 'typing')
        socket.broadcast.to(data.room).emit('userTyping', {isTyping: true});
    });

    socket.on('message', function(data) {
        io.in(data.room).emit('newMessage', {user:data.user + ": ", message:data.message});
    });

    socket.on('disconnect', function () {
        socket.broadcast.emit('usergone', {
            'left_user' : socket.username
        });
    });

    socket.on('joinRoom', function(data){

        socket.join(data.room);

        console.log(data.user + ' has joined: ' + data.room);

        socket.emit('meJoin', {message:'You have joined ' + data.room + "."});

        socket.broadcast.to(data.room).emit("newUserJoin", {user:data.user, message:'has joined.'});

    });
    
    socket.on('leaveRoom', function(data){

        console.log(data.user + ' has left: ' + data.room);

        socket.emit('meLeave', {message:'You have left ' + data.room + "."});

        socket.broadcast.to(data.room).emit("leftRoom", {user:data.user, message:'has left.'});

        socket.leave(data.room);

    });
});