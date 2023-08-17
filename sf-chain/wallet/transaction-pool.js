const Transaction = require('../wallet/transaction');

class TransactionPool 
{
    constructor()
    {
        this.transactions = []; //array of collection of transactions
    }

    updateOrAddTransaction(transaction)
    {
        let transactionWithId = this.transactions.find(t => t.id === transaction.id);//checks that transactions array doesn't have same id as incoming transaciton
    
        if (transactionWithId) //if var exists 
        {
            this.transactions[this.transactions.indexOf(transactionWithId)] = transaction; //updates transaction @ index w/ incoming transaction
        }
        else
        {
            this.transactions.push(transaction); //if this transaction doesn't yet exist in array then add it to the end
        }
    }

    existingTransaction(address) //return a transaction from the pool that was created with this address
    {
        return this.transactions.find(t => t.input.address === address); //if the inputted address is equal to an already existing address returns the transaction
    }
}

module.exports = TransactionPool;