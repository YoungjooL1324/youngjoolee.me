const ChainUtil = require('../chain-util');//every user's application will have fresh instance of every constant
const Transaction = require('./transaction');
const { INITIAL_BALANCE } = require('../config');



class Wallet 
{
    constructor()
    {
        this.balance =  INITIAL_BALANCE; //give all wallets an initial balance. Not same as real world
        this.keyPair = ChainUtil.genKeyPair();
        this.publicKey = this.keyPair.getPublic().encode("hex"); // returns the public key contained in Key-Pair object in hexa-decimal string form
    }


    toString() 
    {
        return `Wallet - 
            publicKey : ${this.publicKey.toString()}
            balance : ${this.balance}`
    }

    sign(dataHash) 
    {
        return this.keyPair.sign(dataHash);
    }

    createTransaction(recipient, amount, transactionPool)
    {
        if(amount > this.balance)
        {
            console.log(`Amount: ${amount} exceeds current balance: ${this.balance}`);
            return;
        }
        
        let transaction = transactionPool.existingTransaction(this.publicKey); //returns whether a transaction pool exists based on public key
        
        if(transaction)
        {
            transaction.update(this, recipient, amount); //updates existing transaction w/ new one w/ method parameters
        }
        else //if the let function returns null
        {   
            transaction = Transaction.newTransaction(this, recipient, amount);
            transactionPool.updateOrAddTransaction(transaction);
        }   

        return transaction;
    }
}

module.exports = Wallet;