const express = require('express');
const path = require('path');
const app = express();
const socket = require('socket.io');

const messages = [];
let users = [];

app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

app.use(express.static(path.join(__dirname, '/client')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/index.html'));
});  

const server = app.listen(8000, () => {
    console.log('Server is running on port: 8000');
  });

const io = socket(server);

io.on('connection', (socket) => {
    console.log('New client! Its id – ' + socket.id);
    socket.on('newUser', (newUser) => {console.log('We\'ve got a new user:' + socket.id);
    users.push(newUser);
    socket.broadcast.emit('loggedUser', newUser);
    });
    socket.on('message', (message) => { console.log('Oh, I\'ve got something from ' + socket.id);
    messages.push(message);
    socket.broadcast.emit('message', message);
    });   
    socket.on('disconnect', (user) => { console.log('Oh, socket ' + socket.id + ' has left');
    console.log('uzytkownik wychodzący', user)
    socket.broadcast.emit('loggedOutUser', user);
    users = users.filter((user) => user.id !== socket.id);
    });
    console.log('I\'ve added a listener on message and disconnect events \n');
  });
  
