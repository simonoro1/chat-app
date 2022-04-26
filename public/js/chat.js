const socket = io() 

//Elements

const $messageForm =   document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $messages = document.querySelector('#messages')



// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML

socket.on('chat message', (message) => {
    console.log(message)
    const  html = Mustache.render(messageTemplate, {
        message
    })
    $messages.insertAdjacentHTML('beforeend', html)
})


$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()

    // $messageFormButton.setAttribute('disabled', 'disabled')
    // disable

    const message = e.target.elements.message.value

    socket.emit('sendMessage', message, (error) => { 
        console.log('Message Delivered')
    })
})





socket.on('location', (latitude, longitude) => {

    console.log(longitude, latitude)
            
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