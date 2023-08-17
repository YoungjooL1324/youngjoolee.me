//specific test for wallet class
const { italic } = require('chalk');
const expectExport = require('expect');
const Wallet = require('./index');
const TransactionPool = require('./transaction-pool');

describe('Wallet', () => 
{
    let wallet, tp;

    beforeEach(() => 
    {
       wallet = new Wallet();
       tp = new TransactionPool(); 
    });

    describe("creating a transaction", () => 
    {
        let transaction, sendAmount, recipient;

        beforeEach(() =>  //setting up variables before every test
        {
            sendAmount = 50;
            recipeint = "r4nd0m-4ddr355";
            transaction = wallet.createTransaction(recipient, sendAmount, tp); //creates transaction and adds to given pool
        });

        describe("and doing the same transaction", () => 
        {
            beforeEach(() => 
            {
                wallet.createTransaction(recipient, sendAmount, tp);
            });

            it("doubles the `sendAmount` subtracted from the wallet balance", () => 
            {//
                expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount)
                .toEqual(wallet.balance - sendAmount*2); //transaction has been performed twice by this point.
            }); 

            it("clones the `sendAmount` output for the recpient", () => 
            {
                expect(transaction.outputs.filter(output => output.address === recipient).map(output => output.amount))
                .toEqual([sendAmount, sendAmount]); //map Takes output array and transforms it into a new array of only the outputAmounts
            }); //should equal to the 2 sendAmounts, or the 2 transactions we created
        });
    });
});