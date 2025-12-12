import readline from "readline";

/**
 * Limpia la pantalla de la consola y mueve el cursor a la posición (0,0)
 */
export const clearScreen = () => {
    // Limpia pantalla + mueve el cursor a (0,0)
    process.stdout.write('\x1Bc');              // "Full reset" (funciona bien en la mayoría)
    // Alternativa menos agresiva:
    // process.stdout.write('\x1B[2J\x1B[0f');  // clear + home
}

/**
 * Espera a que el usuario presione Enter para continuar o 'q' para salir
 * @param {string} waitingMessage - Mensaje a mostrar al usuario (por defecto 'Press Enter to continue or q to quit...')
 * @returns {Promise<void>} Promesa que se resuelve cuando el usuario presiona Enter o termina el proceso si presiona 'q'
 */
export const wait = async (
    waitingMessage: string = 'Press Enter to continue or q to quit...',
    clearScreenBefore: boolean = false
) =>
    await new Promise<void>(async resolve => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        const answer = await new Promise<string>(resolve => {
            rl.question(waitingMessage, (input) => {
                rl.close();
                resolve(input);
            });
        });

        if(clearScreenBefore) clearScreen()

        if (answer.toLowerCase() === 'q') {
            process.exit(0);
        }

        resolve();
    });
