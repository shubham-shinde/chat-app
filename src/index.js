import './index.css';
import jq from './jq.slim.js';
import io from '../node_modules/socket.io-client/dist/socket.io.js'

var _name;

var socket = io.connect(document.URL);


jq('#name div').click(() => {
    if(jq('#name input').val()!=='') {
        jq('#remove').css({'top':'-100vh'})
        _name = jq('#name input').val();
        socket.emit('name', _name);
    }
});

socket.on('name',(name) => {
    jq('#message-room').append(
        `<div class='name' style="text-align:center;color:blue">
            <p>`+name+` is in chat</p>
        </div>`
    );
})

socket.on('message',(message) => {
    jq('#message-room').append(
        `<div class='messages'>
            <p>`+message.name+`</p>
            `+message.data+`
        </div>`
    );
    jq('#message-room #typing').remove();
})

socket.on('typing', (name) => {
    if(jq('#message-room #typing').html()) {
        jq('#message-room #typing').html(name+` is typing....`)
    }

    else{
        jq('#message-room').append(
            `<div id='typing' style="text-align:center;">
                <p>`+name+` is typing....</p>
            </div>`
        );
    }
})

jq('#button').click(() => {
    const message = { name: _name, data: ''}
    message.data = jq('#input input').val();
    if(message.data !== undefined && message.data !== null && message.data !== '') {
        jq('#input input').val('');
        socket.emit('message', message);
    }
})

jq('#input input').keyup(() => {
    console.log('input changes')
    socket.emit('typing', _name);
})

console.log('this is chat app');