const path = require('path')
const express = require('express')
const http = require('http')
const socketio = require('socket.io')
const { generateMessage, generateLocation} = require('./utils/message')


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

    
    
    socket.on('join', ({username, room}) => {
        socket.join(room)
        socket.emit('chat message', generateMessage('Welcome!'))
        socket.broadcast.to(room).emit('chat message', generateMessage(`${username} has joined!`))

    })

    socket.on('sendMessage', (message, callback)=> {
        io.emit('chat message',generateMessage(message))
        callback()
    })

    socket.on('location', (cords, callback) => {
        io.emit('location message', generateLocation(`https://google.com/maps?q=${cords.latitude},${cords.longitude}`))
        callback()
    })


})

server.listen(port, () => {
    console.log('Example app listening on port: ' + port);
})
