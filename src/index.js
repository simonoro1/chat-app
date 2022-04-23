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
    console.log('a user connected')
    socket.emit('chat message', 'Welcome')

    socket.on('sendMessage', (message)=> {
        io.emit('message',message)
    })


})

server.listen(port, () => {
    console.log('Example app listening on port: ' + port);
})