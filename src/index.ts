import * as web3 from '@solana/web3.js'
import Dotenv from 'dotenv';
import question from './question';
Dotenv.config()



async function main() {
    const payer = initializeKeypair(); 
    const connection = new web3.Connection(web3.clusterApiUrl('devnet'));
    const amount = await question("How much sol would you like to send?  ")
    const receiver = await question("Which address would you like to send it to?  ")
    await sendSol(connection, payer, amount, receiver)
}   

main()

function initializeKeypair(): web3.Keypair {
    const secret = JSON.parse(process.env.PRIVATE_KEY ?? "") as number [];
    const secretKey = Uint8Array.from(secret);
    const keypairFromSecretKey = web3.Keypair.fromSecretKey(secretKey);
    return keypairFromSecretKey;
}

async function sendSol(connection: web3.Connection, payer: web3.Keypair, amount: string, receiver: string) {  
    //console.log(connection, payer, amount, receiver);
    /* Inside this function, we need to:

        create a transaction
        create an instruction
        add the instruction to the transaction
        send the transaction. 
    */
    const transaction = new web3.Transaction()
    const receiverWeb3 = new web3.PublicKey(receiver)
    const instructions = web3.SystemProgram.transfer({
        fromPubkey: payer.publicKey,
        toPubkey: receiverWeb3,
        lamports: Number(amount)*web3.LAMPORTS_PER_SOL
    })
    transaction.add(instructions)
    const sig = await web3.sendAndConfirmTransaction(connection, transaction, [payer])
    console.log(sig);
    
}