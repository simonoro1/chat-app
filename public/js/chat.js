const socket = io() 

socket.on('chat message', (message) => {
    console.log(message) 
})


document.querySelector('#message-form').addEventListener('submit', (e) => {
    e.preventDefault()
    const message = e.target.message.value
    socket.emit('sendMessage', message)
    console.log(message)
})





socket.on('location', (latitude, longitude) => {
            console.log(latitude, longitude)
        })

document.querySelector('#location').addEventListener('click', (e) => {
    e.preventDefault()
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition((position) => {
            socket.emit('location', position.coords.latitude, position.coords.longitude)
        })
    }
    else{
        console.log('Geolocation is not Aviable')
    }
    // socket.emit('sendMessage', message)
})
//commit