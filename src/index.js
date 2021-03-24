const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const filter = require('bad-words');
const { generateMessage, generateLocationMessage } = require('./utils/messages');
const { addUser, removeUser, getUser, getUsersInChatRoom, getAllActiveRooms } = require('./utils/users')

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.static(publicDirectoryPath));

io.on('connection', (socket) => {
    console.log('new socket');


    socket.on('join', ({ username, room }, callback) => {
        const { error, user } = addUser({ id: socket.id, username, room });

        if (error) {
            return callback(error);
        }

        socket.join(user.room);
        socket.emit('message', generateMessage('Admin', `Welcome! ${user.username}`));
        socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has Joined`));
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInChatRoom(user.room),
        });
        callback();
    })

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id);
        const filterMsg = new filter();
        if (filterMsg.isProfane(message)) {
            return callback('Profanity is not allowed!!')
        }

        io.to(user.room).emit('message', generateMessage(user.username, message));
        callback();
    });

    socket.on('disconnect', () => {
        const user = removeUser(socket.id);

        if (user) {
            io.to(user.room).emit('message', generateMessage('Admin', `${user.username} Has left`));
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInChatRoom(user.room),
            })
        }
    });

    socket.on('sendLocation', (coords, callback) => {
        const user = getUser(socket.id);
        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, `https://google.com/maps?q=${coords.lattitude},${coords.longitude}`));
        callback();
    })
})

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server on port ${PORT}.`));