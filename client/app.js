const loginForm = document.getElementById('welcome-form');
const messagesSection = document.getElementById('messages-section');
const messagesList = document.getElementById('messages-list');
const addMessageForm = document.getElementById('add-messages-form');
const userNameInput = document.getElementById('username');
const messageContentInput = document.getElementById('message-content');
var userName = '';
const socket = io();

socket.on('message', ({ author, content }) => addMessage(author, content));

socket.on('loggedUser', (newUser) => {addMessage('Chat bot', `${newUser.author} has joined the conversation!`)
//console.log('kim jest user', newUser)
})

socket.on('loggedOutUser', (user) => {addMessage('Chat bot', `${user} has left the conversation :( `) ;
console.log ('kim jest user', user);
})

const login = function (event) {
    event.preventDefault();
    if (!userNameInput.value.length) {
      alert('Please enter your username');
    } else {
      userName = userNameInput.value;
      loginForm.classList.remove('show');
      messagesSection.classList.add('show');
      socket.emit('newUser', {author: userName, id: socket.id} )
    }
  };

loginForm.addEventListener('submit', login);

const addMessage = function (author, content) {
    const message = document.createElement('li');
    message.classList.add('message');
    message.classList.add('message--received');
    if (author === userName) {
        message.classList.add('message--self');
    }
    message.innerHTML = 
    `<h3 class="message__author">${userName === author ? 'You' : author}</h3>
        <div class="message__content">${content}</div>`;
        messagesList.appendChild(message);
};

const sendMessage = function (event) {
    event.preventDefault();
    let messageContent = messageContentInput.value
    if (!messageContent.length) {
      alert('Please add your message');
    } else {
      addMessage(userName, messageContent);
      socket.emit('message', { author: userName, content: messageContent });
      messageContentInput.value = '';
    }
  };

addMessageForm.addEventListener('submit', sendMessage);

