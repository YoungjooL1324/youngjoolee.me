const TransactionPool = require('./transaction-pool');
const Transaction = require('./transaction');
const Wallet = require('./index');
const { italic } = require('chalk');
const expectExport = require('expect');


describe("TransactionPool", () =>  //describes suite of test cases enumerated by 'it' functions
{
    let tp, wallet, transaction;

    beforeEach(() => 
    {
        tp = new TransactionPool();
        wallet = new Wallet();
        transaction = Transaction.newTransaction(wallet, 'r4nd-4dr335', 30);
        tp.updateOrAddTransaction(transaction); //every test will now have a transaction array w/ one transaction in it
    });

    it("adds a transaction to the pool", () => 
    {
        expect(tp.transactions.find(t => t.id === transaction.id)).toEqual(transaction) //expect transaction in transactions array to equal original transaction
    });
    it("updates a transaction in the pool", () => 
    {
        const oldTransaction = JSON.stringify(transaction);
        const newTransaction = transaction.update(wallet, "foo-4ddr355", 40);
        tp.updateOrAddTransaction(newTransaction); //should update 

        expect(JSON.stringify(tp.transactions.find(t => t.id === newTransaction.id))).not.toEqual(oldTransaction);

    });

});