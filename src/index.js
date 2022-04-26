const path = require('path')
const express = require('express')
const http = require('http')
const socketio = require('socket.io')



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

    socket.emit('chat message', 'Welcome!')

    socket.broadcast.emit('chat message', 'A user has joined!')

    socket.on('sendMessage', (message, callback)=> {
        io.emit('chat message',message)
        callback()
    })

    socket.on('location', (latitude, longitude) => {
        io.emit('location', latitude, longitude)
    })


})

server.listen(port, () => {
    console.log('Example app listening on port: ' + port);
})