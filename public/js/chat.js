const socket = io();
//Elements
const $messageForm = document.querySelector('#message-form');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('#submit');
const $messageLocation = document.querySelector('#send-location');
const $messages = document.querySelector('#messages');

//Templates
const messageTemplates = document.querySelector('#message-template').innerHTML;
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML;
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;

//Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true  /*this is just to remove ? from the join query*/ });

const autoScroll = () => {
    //New message element
    const $newMessage = $messages.lastElementChild;

    //new message's height
    const newMessageStyles = getComputedStyle($newMessage);
    const newMessageMargin = parseInt(newMessageStyles.marginBottom);
    const newMessage = $newMessage.offsetHeight + newMessageMargin;

    //visible height
    const visibleHeight = $messages.offsetHeight;

    //height of messages 
    const containerHeight = $messages.scrollHeight;

    //how far to scroll
    const scrollOffset = $messages.scrollTop + visibleHeight;

    if (containerHeight - newMessage <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight;
    }
}

socket.on('message', (message) => {
    console.log(message);
    const html = Mustache.render(messageTemplates, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('hh:mm A')
    });
    $messages.insertAdjacentHTML('beforeend', html);
    autoScroll();
})



socket.on('locationMessage', (url) => {
    console.log(url);
    const html = Mustache.render(locationMessageTemplate, {
        username: url.username,
        url: url.url,
        createdAt: moment(url.createdAt).format('hh:mm A')
    })
    $messages.insertAdjacentHTML('beforeend', html);
    autoScroll();
})

socket.on('roomData', ({ room, users }) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users,
    })
    document.querySelector('#sidebar').innerHTML = html;
})


$messageForm.addEventListener('submit', (e) => {
    e.preventDefault(); // avoids page to be refresh
    // disable form

    $messageFormButton.setAttribute('disabled', 'disabled');

    const message = e.target.elements.message.value;
    if (message === '') {
        $messageFormButton.removeAttribute('disabled');
        return alert('please type something !!')
    }

    socket.emit('sendMessage', message, (error) => {
        // enable
        $messageFormButton.removeAttribute('disabled');
        $messageFormInput.value = '';
        $messageFormInput.focus();
        if (error) {
            return console.log(error);
        }
        console.log('Message was delivered');

    });
})



$messageLocation.addEventListener('click', (e) => {
    e.preventDefault();

    if (!navigator.geolocation) {
        return alert('Geo Location is Not Supported');
    }

    //disable
    $messageLocation.setAttribute('disabled', 'disabled');

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            lattitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            $messageLocation.removeAttribute('disabled');
            console.log('Location Shared!', 'if Location is not correct, check if the GPS on the device is on or not!!');
        })
    })
})

socket.emit('join', { username, room }, (error) => {

});