const socket = io() 

//Elements

const $messageForm =   document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $messages = document.querySelector('#messages')
const $sendLocationButton = document.querySelector('#location');



// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMessageTemplate = document.querySelector("#location-template").innerHTML;
const {username, room} = Qs.parse(location.search, {ignoreQueryPrefix: true});


socket.on('chat message', (message) => {
    console.log(message)
    const  html = Mustache.render(messageTemplate, {
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
})


$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()

    $messageFormButton.setAttribute('disabled', 'disabled')
    // disable

    const message = e.target.elements.message.value

    socket.emit('sendMessage', message, (error) => { 
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = '';
        $messageFormInput.focus()
        console.log('Message Delivered')
    })
})





socket.on('location message', (message) => {

    console.log('Location: ', message)
    const  html = Mustache.render(locationMessageTemplate, {
        url: message.url,
        createdAt: moment(message.createdAt).format('h:mm a')

    })      
    $messages.insertAdjacentHTML('beforeend', html)
})

$sendLocationButton.addEventListener('click', (e) => {
    e.preventDefault()
    if(!navigator.geolocation){
        return alert('Geolocation is not supported by your browser.')
    }

    $sendLocationButton.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition((position) => {
        let cords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }
        socket.emit('location', cords ,() => {
            console.log('Location Shared')
            $sendLocationButton.removeAttribute('disabled')
        })
    })


})

socket.emit('join', {username, room}, (error) => {
    if(error){
        alert(error)
        location.href= '/'
    }
})