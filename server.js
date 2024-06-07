const http = require('http');
const express = require('express');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"]
    }
  });

app.use(express.static('public'));


io.on('connection', (socket) => {
    console.log('A user connected');


    socket.on('playerCoordinates', (coordinates) => {

        socket.broadcast.emit('otherPlayerCoordinates', coordinates);
    });


    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});