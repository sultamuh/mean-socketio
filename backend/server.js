let express = require('express'),
  path = require('path'),
  mongoose = require('mongoose'),
  cors = require('cors'),
  bodyParser = require('body-parser'),
  dataBaseConfig = require('./database/db'),
  socketModel = require('./models/SocketModel'),
  eventModel = require('./models/EventModel'),
  userModel = require('./models/UserModel'),
  msgModel = require('./models/MessageModel');

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

let newEvent, newSocket, newUser, newMsg;

io.on('connection', (socket) => {
    
  //console.log("Socket ID: " + socket.id + " A user has connected.");

    newEvent = new eventModel({ socket_id: socket.id, event_type: "connection", msg: "A user has connected" });
    newEvent.save()

    socket.on('userLogin', function(data){
        
      //console.log(data.user + " has logged in.")

        newEvent = new eventModel({ socket_id: socket.id, event_type: "userLogin", msg: "A user has logged in" });
        newEvent.save()

        newSocket = new socketModel({ socket_id: socket.id, created_by: data.user });
        newSocket.save();

        newUser = new userModel({ username: data.user });
        newUser.save();

    });

    socket.on('typing', (data) => {
        //console.log(data.user, 'typing')
        socket.broadcast.to(data.room).emit('userTyping', {isTyping: true});
    });

    socket.on('message', function(data) {

        newMsg = new msgModel({ socket_id: socket.id, event_type: "message", user_name: data.user , room_name: data.room, msg: data.message});
        newMsg.save();

        io.in(data.room).emit('newMessage', {user:data.user + ": ", message:data.message});
    });

    socket.on('joinRoom', function(data){

        socket.join(data.room);

        //console.log(data.user + ' has joined: ' + data.room);

        socket.emit('meJoin', {message:'You have joined ' + data.room + "."});

        socket.broadcast.to(data.room).emit("newUserJoin", {user:data.user, message:'has joined.'});

        newEvent = new eventModel({ socket_id: socket.id, event_type: "joinRoom", msg: data.user + ' has joined ' + data.room});
        newEvent.save()
    });
    
    socket.on('leaveRoom', function(data){

        //console.log(data.user + ' has left: ' + data.room);

        socket.emit('meLeave', {message:'You have left ' + data.room + "."});

        socket.broadcast.to(data.room).emit("leftRoom", {user:data.user, message:'has left.'});

        newEvent = new eventModel({ socket_id: socket.id, event_type: "leaveRoom", msg: data.user + ' has left ' + data.room});
        newEvent.save()

        socket.leave(data.room);
    });
});