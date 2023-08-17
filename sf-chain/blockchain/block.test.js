const { italic } = require('chalk');
const Block = require('./block');

describe('Block', () => {
    let data, lastBlock, block; //scope of variables is for all functions in describe function

    beforeEach(() => { //runs code inside before each of the following functions that will be utilized in those functions
        data = 'bar';
        lastBlock = Block.genesis();
        block = Block.mineBlock(lastBlock, data); //assigns the variables declared earlier.
    })

    it('sets the `data` to match the input', () => {
        expect(block.data).toEqual(data); //what we expect inputted data to be
    });

    it('sets the `lastHash` to match the hash of the last block', () => 
    {
        expect(block.lastHash).toEqual(lastBlock.hash);
    });

    it('generates a hash that matches the difficulty', () =>
    {
        expect(block.hash.substring(0, block.difficulty)).toEqual('0'.repeat(block.difficulty)); //verify that 0's match block's own difficulty
        console.log(block.toString()) //nonce value appears(no. of loops to generate). timestamp also included in the calculation
    });

    it('lowers the difficulty for slowly mined blocks' , () => 
    {
        expect(Block.adjustDifficulty(block, block.timestamp + 36000)).toEqual(block.difficulty - 1) //because block took one hour, difficulty should be lowered
    });

    it('raises the difficulty for quickly mined blocks', () => 
    {
        expect(Block.adjustDifficulty(block, block.timestamp + 1)).toEqual(block.difficulty +1)  //because block took only one millisecond before next has, difficulty should be raised
    });
});
