
//HTML references

const lblDesk= document.querySelector('h1');
const btnDispatch = document.querySelector('button');
const lblTicket = document.querySelector('small');
const divAlert = document.querySelector('.alert')
const lblPendientes = document.querySelector('#lblPendientes')

const socket = io();

const searchParams = new URLSearchParams(window.location.search);

if(!searchParams.has('desk')){
    window.location = 'index.html'
    throw new Error('El escritorio es obligatorio')
}

const desk = searchParams.get('desk');

lblDesk.innerText = desk
divAlert.style.display = 'none'

socket.on('connect', () => {
    console.log('Conectado');

    btnDispatch.disabled = false;


});

socket.on('disconnect', () => {
    // console.log('Desconectado del servidor');
    btnDispatch.disabled = true;
    
});
socket.on('last-ticket', (ticket) => {
    // console.log('Desconectado del servidor');
    //lblNewTicket.innerText = "Ticket "+ticket
    
});

socket.on('queue-leght', (payload) => {
    console.log('queue-leght', payload);
    lblPendientes.innerText = payload
    
});



btnDispatch.addEventListener('click', () => {
    
    socket.emit('dispatch-ticket', {desk}, ( {ok, data, msg} ) => {
        console.log("TicketControl", ok)
       if(!ok){
           lblTicket.innerText = 'Nadie'
           return divAlert.style.display = '';
        }
        
        
       lblTicket.innerText = 'Ticket '+  data.num


    })
    

});