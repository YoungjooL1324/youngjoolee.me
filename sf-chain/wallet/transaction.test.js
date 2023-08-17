const expectExport = require('expect');
const Transaction = require('./transaction');
const Wallet = require('./index');

describe('Transaction', () => 
{
    let transaction, wallet, recipient, amount;

    beforeEach(() =>  //run before each of the tests in this file are run
    {
        wallet = new Wallet();
        amount = 50;
        recipient = "r3c1p13nt";
        transaction = Transaction.newTransaction(wallet, recipient, amount);
    });

    it("outputs the `amount` subtracted from the wallet balance", () => 
    {
        expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount).toEqual(wallet.balance - amount); //looking for output which's address field matches the wallet's publicKey field
    }); // === STRICT EQUALITY COMPARISON OPERATOR, returns false for values which are not of same type

    it('outputs the `amount` added to the recipient', () => 
    {
        expect(transaction.outputs.find(output => output.address === recipient).amount).toEqual(amount);
    });

    it('inputs the balance of the wallet', () => 
    {
        expect(transaction.input.amount).toEqual(wallet.balance);
    });
    
    it('validates a valid transaction' ,() => 
    {
        expect(Transaction.verifyTransaction(transaction)).toBe(true);
    });

    it('invalidates a corrupt transaction', () => 
    {
        transaction.outputs[0].amount = 50000; //this is an invalid transaction between no one can have this much money to transact @ beginning
        expect(Transaction.verifyTransaction(transaction)).toBe(false);
    });

    describe('transacting with an amount that exceeds the balance', () => 
    {
        beforeEach(() =>
        {
            amount = 50000;
            transaction = Transaction.newTransaction(wallet, recipient, amount);
        });

        it("does not create the transaction", () => 
        {
            expect(transaction).toEqual(undefined); //because 50000 exceeds the 50 initially in wallet
        })
    });

    describe('and updating a transaction', () => 
    {
        let nextAmount, nextRecipient;
        beforeEach(() => 
        {
            nextAmount = 20;
            nextRecipient = "n3xt-4ddr355";
            transaction = transaction.update(wallet, nextRecipient, nextAmount);
        }); 

        it("it subtracts the next amount from the sender's output", () => 
        {
            expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount).toEqual(wallet.balance - amount - nextAmount);
        }); //checks the output Balance of the multi-transaction. amount comes from the top beforeEach function

        it("outputs an amount for the next recipient", () => 
        {
            expect(transaction.outputs.find(output => output.address === nextRecipient).amount).toEqual(nextAmount);
        }); //checks that the output of the next recipient is the same as nextAmount 
    });
});