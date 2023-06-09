import * as web3 from '@solana/web3.js'
import Dotenv from 'dotenv';
import question from './question';
Dotenv.config()



async function main() {
    const payer = initializeKeypair(); 
    const connection = new web3.Connection(web3.clusterApiUrl('devnet'));
    const amount = await question("How much sol would you like to send?  ")
    const receiverBs58 = await question("Which address would you like to send it to?  ")
    //const receiver = publicKeyFromBs58(receiverBs58)
    await sendSol(connection, payer, amount, receiverBs58)
}   
main()

function initializeKeypair(): web3.Keypair {
    const secret = JSON.parse(process.env.PRIVATE_KEY ?? "") as number [];
    const secretKey = Uint8Array.from(secret);
    const keypairFromSecretKey = web3.Keypair.fromSecretKey(secretKey);
    return keypairFromSecretKey;
}

// function publicKeyFromBs58(receiver: string): any {
//     try {
//         return new web3.PublicKey(receiver)
//     }
//     catch (err) {
//         throw new Error("Invalid public key, please retry")
//     }
// }
 
async function sendSol(connection: web3.Connection, payer: web3.Keypair, amount: string, receiver: string) {  
    //console.log(connection, payer, amount, receiver);
    /* Inside this function, we need to:

        create a transaction
        create an instruction
        add the instruction to the transaction
        send the transaction. 
    */
    const transaction = new web3.Transaction()

    const instructions = web3.SystemProgram.transfer({
        fromPubkey: payer.publicKey,
        toPubkey: new web3.PublicKey(receiver),
        lamports: Number(amount)*web3.LAMPORTS_PER_SOL
    })
    transaction.add(instructions)
    const sig = await web3.sendAndConfirmTransaction(connection, transaction, [payer])
    console.log(sig);
    
}