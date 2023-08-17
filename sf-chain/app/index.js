const express = require('express'); //app holds main code for interacitve applications
const bodyParser = require('body-parser');  
const Blockchain = require('../blockchain');
const P2pServer = require('./p2p-server');
const Wallet = require('../wallet');
const TransactionPool = require('../wallet/transaction-pool');

const HTTP_PORT = process.env.HTTP_PORT || 3001; //Environment variable OR allows to run on port 3001 when runnning server

const app = express();
const bc = new Blockchain();
const wallet = new Wallet();
const tp = new TransactionPool();
const p2pServer = new P2pServer(bc,tp);

app.use(bodyParser.json()); //allows us to receive Json within Post Requests

app.get('/blocks' , (req, res) => //end points start with a slash
{
    res.json(bc.chain); //chain within blockchain instance
});

app.post('/mine' , (req,res) => 
{
    const block = bc.addBlock(req.body.data);   //body of request has all data 
    console.log.apply(`New block added ${block.toString()}`);

    p2pServer.syncChains(); //second instace automatically syncs its chain w the longer chain of the first instance

    res.redirect('/blocks');   //Redirects to blocks ednpoint that we already ahve
});

app.get('/transactions', (req, res) =>  //endpoint that returns transactions within user's transaction pool instance
{
    res.json(tp.transactions);
});

app.post('/transact', (req, res) => //create a transaction with the user's wallets. consist of specified recipient and amount
{
    const { recipient, amount } = req.body;
    const transaction = wallet.createTransaction(recipient, amount, tp); //creates transaction using local wallet instance of this application
    res.redirect('/transactions');
});
app.listen(HTTP_PORT, () => console.log(`Listening on port ${HTTP_PORT}`))

p2pServer.listen();