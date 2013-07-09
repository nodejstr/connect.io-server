var express = require('express')
  , app = express()
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server);

server.listen(8080);


  io.sockets.on('connection', function (socket) {

        socket.on('listen', function (data)
        {

            switch (data.listenType)
            {
                case 'ROOM':
                    socket.join(data.roomName);
					console.log("joined to room:"+data.roomName)
                    break;
            }
        });

        socket.on('socketEvent', function (data) {

            switch(data.eventType)
            {
                case 'SEND':
                    socket.emit(data.eventName, data.data);
                    break;
                case 'BROADCAST':
                    socket.broadcast.emit(data.eventName, data.data);
                    break;
                case 'SEND_ALL':
                    io.sockets.emit(data.eventName, data.data);
                    break;
                case 'SEND_TO_ROOM':
                    io.sockets.in(data.roomName).emit(data.eventName, data.data);
					console.log(data.roomName+","+data.eventName+","+data.data);
                    break;
                case 'BROADCAST_TO_ROOM':
                    socket.broadcast.to(data.roomName).emit(data.eventName, data.data);
                    break;

            }

        });
    });