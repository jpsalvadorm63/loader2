import readline from "readline";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

export const wait = async (waitingMessage: string) => await new Promise<void>(resolve => {
    console.log(waitingMessage)
    process.stdin.on('keypress', (ch, key) => {
        if (key.name === 'q' || key.name === 'escape') {
            rl.close();
            process.exit(0);
        }
    });
    process.stdin.setRawMode(true);
    process.stdin.resume();
});