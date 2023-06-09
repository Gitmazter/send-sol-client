import {createInterface} from "readline";


const question = (questionText: string) =>{
    const rl = createInterface({
        input: process.stdin,
        output: process.stdout
    });
    return new Promise<string>(resolve => rl.question(questionText, resolve))
        .finally(() => rl.close());
}
export default question;