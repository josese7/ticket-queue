const TicketControl = require('../models/ticket-control');

const ticketControl = new TicketControl()
// List of connected clients.
const connectedClients = new Set();

const notifyClients = (event, payload) =>{
    console.log("dispatch devent", event, payload)
    for (const clientSocket of connectedClients) {
        clientSocket.emit(event, payload);
    }
}
const socketController = (socket) => {
    //Add new client
    connectedClients.add(socket);
    //when a new cliente is conected
    socket.emit('last-ticket', ticketControl.last);
    socket.emit('current-state', ticketControl.last4);
    socket.emit('queue-leght', ticketControl.tickets.length)


    socket.on('next-ticket', ( payload,  callback ) => {
        
        const next = ticketControl.next();
        callback(next)
       notifyClients('last-ticket',  ticketControl.last);//socket.broadcast.emit('last-ticket', ticketControl.last );
       //All clients are notified of the current queue, but the screen it create does not need to, but we send it anyway.
      notifyClients('queue-leght', ticketControl.tickets.length);


    })

    socket.on('dispatch-ticket', ({desk}, callback) =>{
       if (!desk){
        console.log(desk)
        return callback({
            ok:false,
            msg:'El escritorio es obligatorio'
        })
       }
      
       const ticket = ticketControl.dispatchTicket(desk);
      
       //TODO: Notify changes in last 4
       notifyClients('current-state', ticketControl.last4);
       notifyClients('queue-leght', ticketControl.tickets.length);
    
       
      

       if(!ticket){
        callback({
            ok:false,
            data: null,
            msg:'No hay tickets pendientes'
        })
       }else{
      
        callback({
            ok:true,
            data:ticket,
            msg:'Ticket disponible'
        })
       }
    })

}



module.exports = {
    socketController
}

