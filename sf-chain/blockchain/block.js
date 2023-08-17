
const ChainUtil = require('../chain-util');
const {DIFFICULTY, MINE_RATE} = require('../config'); //config file that is one directory above

class Block
{
    constructor(timestamp, lastHash, hash, data, nonce, difficulty)
    {
        this.timestamp = timestamp; //property of block
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
        this.nonce = nonce;
        this.difficulty = difficulty || DIFFICULTY;
    }


    toString()
    {
        return `Block -
            Timestamp : ${this.timestamp}
            Last Hash : ${this.lastHash.substring(0,10)}
            Hash      : ${this.hash.substring(0,10)}
            Nonce     : ${this.nonce}
            Difficulty: ${this.difficulty}
            Data      : ${this.data}`;
            //back ticks used for template strings
    }

    static genesis()
    {
        return new this('Genesis Time', '-----' , 'f1r57-h45h' , [], 0, DIFFICULTY) //Empty Array: First data for genesis block
    }

    static mineBlock(lastBlock, data)
    {
        let hash, timestamp; //be reassigned every time we iterate through do-while loop
        const lastHash = lastBlock.hash;
        let { difficulty } = lastBlock; //declares local difficulty variable that is assigned to difficulty key in lastBlock object 
        let nonce = 0;

        do 
        {
            nonce++;
            timestamp = Date.now();//.now() generates number of milliseconds passed since 1970
            difficulty = Block.adjustDifficulty(lastBlock, timestamp);
            hash = Block.hash(timestamp, lastHash, data, nonce, difficulty); //will later generate with hash generating function
        } while(hash.substring(0, difficulty) !== '0'.repeat(difficulty)); //continue the loop until the condition is met

        return new this(timestamp, lastHash, hash, data, nonce, difficulty);

    }

    static hash(timestamp, lastHash, data, nonce, difficulty)
    {
        return ChainUtil.hash(`${timestamp}${lastHash}${data}${nonce}${difficulty}`).toString(); //Combining all these inputs as one string using an ES6 template String
    }

    static blockHash(block)
    {
        const { timestamp, lastHash, data,nonce, difficulty } = block;   //assigns local variables to values previously definedv in block parameter.
        return Block.hash(timestamp, lastHash, data, nonce, difficulty);
    }   

    static adjustDifficulty(lastBlock, currentTime) 
    {
        let { difficulty } = lastBlock;
        //if minerate > currentTime  - lastBlock timestamp Then difficulty should be raised. And vice versa 
        difficulty =  lastBlock.timestamp + MINE_RATE > currentTime ? difficulty + 1 : difficulty - 1;
        return difficulty;
    }

}



module.exports = Block;