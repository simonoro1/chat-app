const socket = io() 

socket.on('message', (message) => {
    console.log(message) 
})

document.querySelector('#message-form').addEventListener('submit', (e) => {
    e.preventDefault()
    socket.emit('sendMessage', message)
    console.log(message)
})