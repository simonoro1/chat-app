const path = require('path')
const express = require('express')
const http = require('http')
const socketio = require('socket.io')
const { generateMessage, generateLocation} = require('./utils/message')
const {addUser, removeUser, getUser, getUserInRoom} = require("./utils/users")


const app = express()
const server = http.createServer(app)
const io = new socketio.Server(server)

const port = 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))
// app.get('/', (req, res) => {
//     res.send("Hello World")
// })

io.on('connection', (socket) => {
    console.log('A user connected')

    
    
    socket.on('join', ({username, room}, callback) => {
        const {error, user} = addUser({
            id: socket.id,
            username,
            room
        })

        if(error){
            callback(error)
        }


        socket.join(user.room)
        socket.emit('chat message', generateMessage('Welcome!'))
        socket.broadcast.to(user.room).emit('chat message', generateMessage(`${user.username} has joined!`))

    })

    socket.on('sendMessage', (message, callback)=> {
        const user = getUser(socket.id)
        io.to(user.room).emit('chat message',generateMessage(message))
        callback()
    })

    socket.on('location', (cords, callback) => {
        const user = getUser(socket.id)
        io.to(user.room).emit('location message', generateLocation(`https://google.com/maps?q=${cords.latitude},${cords.longitude}`))
        callback()
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)

        if(user) {
            io.to(user.room).emit('chat message', generateMessage(`${user.username} has left!`))
        }
    })


})

server.listen(port, () => {
    console.log('Example app listening on port: ' + port);
})
