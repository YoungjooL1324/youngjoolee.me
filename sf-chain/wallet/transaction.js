const ChainUtil = require('../chain-util');

class Transaction 
{
    constructor()
    {
        this.id = ChainUtil.id();
        this.input = null;
        this.outputs = [];
    }

    update(senderWallet, recipient, amount) //handles adding new output object to an existing transaciton by sender
    {          //** Sender public key's are equal to the address posted on outputs
        const senderOutput = this.outputs.find(output => output.address === senderWallet.publicKey);
                //finds an output they previously generated w/ transaction matching sender's public key
        if(amount > senderOutput.amount) 
        {
            console.log(`Amount: ${amount} exceeds balance: ${senderOutput.amount}.`);
            return;
        }
        senderOutput.amount = senderOutput.amount - amount;
        this.outputs.push({amount, address: recipient}); //adds a transaction object to the outputs array
        Transaction.signTransaction(this, senderWallet); //generates new input object with generated signature

        return this; //as result of function itself
    }

    static transactionWithOutputs(senderWallet, outputs) 
    {
        const transaction = new this();
        transaction.outputs.push(...outputs); //spread operator
        Transaction.signTransaction(transaction, senderWallet);
        return transaction;
    }

    static newTransaction(senderWallet , recipient, amount)
    {
        if (amount > senderWallet.balance)
        {
            console.log(`Amount: ${amount} exceeds balance.`);
            return; //return an escape out of this function 
        }

        return Transaction.transactionWithOutputs(senderWallet, [
            {
                amount: senderWallet.balance - amount,
                address: senderWallet.publicKey
            },
            {
                amount,  //because amount: amount, syntax allows us to just put down the name once
                address: recipient
            }
        ]); //pushes elements to end of array
    }

    static signTransaction(transaction, senderWallet) 
    {
        transaction.input = 
        {
            timestamp: Date.now(), //returns the number of ms that have passed since 1/31/1970
            amount: senderWallet.balance,
            address: senderWallet.publicKey,
            signature: senderWallet.sign(ChainUtil.hash(transaction.outputs))
        }
    }

    static verifyTransaction(transaction)
    {
        return ChainUtil.verifySignature(
            transaction.input.address,
            transaction.input.signature,
            ChainUtil.hash(transaction.outputs)
        );
    }
}

module.exports = Transaction; //tells Node.JS, which bits of code to "export" in this class Transaction class
// so that other files are allowed to access the file