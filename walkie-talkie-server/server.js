const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Jab koi user room join kare
    socket.on('join-channel', (room) => {
        socket.join(room);
        console.log(`User ${socket.id} joined room: ${room}`);
        
        // Room ke baaki users ko notify karo ki naya peer aa gaya hai
        socket.to(room).emit('peer-joined');
    });

    // WebRTC signaling data exchange (Offer, Answer, ICE Candidates)
    socket.on('signal', (data) => {
        socket.to(data.room).emit('signal', data.signal);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

server.listen(3000, () => {
    console.log('Signaling server running on port 3000');
});