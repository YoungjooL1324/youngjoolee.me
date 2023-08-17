const Block =require('./block');   //   ./ indicates that block class is local

class Blockchain
{
    constructor()
    {
        this.chain = [Block.genesis()];
    }


    addBlock(data)
    {
        const block = Block.mineBlock(this.chain[this.chain.length - 1] , data); //first parameter = const lastBlock
        this.chain.push(block);

        return block;
    }

    isValidChain(chain) //validates incoming chains
    {
        if(JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) 
        {
            return false;
        }
        
        for(let i = 1; i < chain.length; i++)
        {
            const block = chain[i];
            const lastBlock = chain[i-1];

            if(block.lastHash != lastBlock.hash || //Checks that the chain is accurate
                block.hash != Block.blockHash(block)) //To check that block itself hasn't been tampered and generated hash is correct 
            {
                return false;
            }

            return true; //if all the tests are passed
        }
    }

    replaceChain(newChain)
    {//choosing longest chain allows all nodes to agree on chain with  most valid blocks. Solves issues such as forking
        if(newChain.length <= this.chain.length)  
        {
                console.log("Received chain is not longer than the current chain.");
                return;
        }
        else if(!this.isValidChain(newChain))
        {
            console.log("The received chain is not valid");
            return;
        }

        this.chain = newChain;
        console.log("Replacing blockchain with new chain.");

    }
}


module.exports = Blockchain;