const EC = require('elliptic').ec; //is a class, so create instance to use methods within the class
const {v1: uuidV1} = require('uuid'); //function that generates unique ID
const ec = new EC("secp256k1"); //elliptic curve algorithm used by Bitcoin
const SHA256 = require('crypto-js/sha256');
//nonce: included as a part of the calculation of the hash for the block

class ChainUtil 
{
    static genKeyPair()
    {
        return ec.genKeyPair();
    }

    static id()
    {
        return uuidV1();
    }
    
    static hash(data)
    {
        return SHA256(JSON.stringify(data)).toString(); //generates a hash of whatever data comes in, no matter its form
    }

    static verifySignature(publicKey, signature, dataHash)
    {
        return ec.keyFromPublic(publicKey, "hex").verify(dataHash, signature); //verify's signature of key gotten from 
    }//keyFromPublic method, which gets us a key object fomr publicKey parameter

}

module.exports = ChainUtil;
