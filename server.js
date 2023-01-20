const express = require('express');
const cors = require('cors')
const PORT = 8000;
const app = express();
const socket = require('socket.io');

app.use(cors())

const server = app.listen(process.env.PORT || PORT, () => {
    console.log('Server is running on Port:', 8000)
});
const io = socket(server);


let tasks = []; // { id: 1, name: `Shopping` }



io.on('connection', (socket) => {
    console.log('New client! Its id – ' + socket.id);

    
    io.to(socket.id).emit('updateData', tasks);

    socket.on(`addTask`, ({ id, name }) => {
        tasks.push({ id: id, name: name })
        socket.broadcast.emit('addTask', { id: id, name: name });
    })

    socket.on(`removeTask`, (id) => {
        tasks = tasks.filter(task => task.id === id ? false : true);
        socket.broadcast.emit('removeTask', id);
    })

    // console.log('New client! Its id – ' + socket.id);
    // socket.on('message', () => { console.log('Oh, I\'ve got something from ' + socket.id) });

    // socket.on('disconnect', () => {
    //     socket.broadcast.emit(`message`, { author: `Chat bot`, content: ` ${getUserByID(socket.id).author} has left the conversation... :(` })
    //     users = users.filter(user => user.id === socket.id ? false : true)
    //     console.log('Oh, socket ' + socket.id + ' has left')
    // });
    // console.log('I\'ve added a listener on message and disconnect events \n');

    // socket.on('message', (message) => {
    //     console.log('Oh, I\'ve got something from ' + socket.id);
    //     messages.push(message);
    //     socket.broadcast.emit('message', message);
    // });

    // socket.on('join', ({ author }) => {
    //     users.push({ author: author, id: socket.id })
    //     socket.broadcast.emit(`message`, { author: `Chat bot`, content: `${author} has joined the conversation!` })
    // })
});