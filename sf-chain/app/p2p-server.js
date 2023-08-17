const Websocket = require('ws');
const P2P_PORT = process.env.P2P_PORT || 5001; //gives user ability to define port specifically, and overide 5001 w variable.
const peers = process.env.PEERS ? process.env.PEERS.split(',') : []; //will return back array of websocket arrays, separated by commas
// ? is turner expression

// $ HTTP_PORT=3003 P2P_PORT=5003 PEERS=ws://localhost: 5001,ws: // localhost:5002 npm run dev
//Way to change the ports so that they can  be connected by socket to peer servers w/ i.e. HTTP_PORT=3001 etc.
class P2pServer 
{
    constructor(blockchain)
    {
        this.blockchain = blockchain;
        this.sockets = [];
    }

    listen ()
    {
        const server = new Websocket.Server({port: P2P_PORT}); 
        server.on('connection' , socket => this.connectSocket(socket)); //listening for connection events

        this.connectToPeers();

        console.log(`Listening for peer-to-peer connectons on: ${P2P_PORT}`);
        
    }

    connectToPeers()
    {
        peers.forEach(peer => 
            {
                //peer : ws://loclahost:5001
                const socket = new Websocket(peer);

                socket.on('open', () => this.connectSocket(socket));
            });
    }
    
    connectSocket(socket) //pushes socket to array of sockets.. All sockets run through this function
    {
        this.sockets.push(socket);
        console.log('Socket connected');

        this.messageHandler(socket); //will pass socket object into function into messageHandler

       this.sendChain(socket);
    }    

    messageHandler(socket)
    {
        socket.on('message', message => 
        {
            const data = JSON.parse(message);  //turns stringified message into a regular JS object

            this.blockchain.replaceChain(data);
        })
    }

    sendChain(socket)  //sends chain object of this.blockchain in string form
    {
        socket.send(JSON.stringify(this.blockchain.chain)); 
    }

    syncChains() //send updated blockchain of current instance to all of the socket peers
    {
        this.sockets.forEach(socket =>  this.sendChain(socket));
    }
}
module.exports = P2pServer;