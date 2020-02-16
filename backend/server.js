const io = require('socket.io').listen(3000);

io.on('connection', (socket) => {
    console.log("Socket ID: " + socket.id + " A user has connected.");

    socket.on('userLogin', function(data){
        console.log(data.user + " has logged in.")
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