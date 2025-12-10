import readline from "readline";

/**
 * Espera a que el usuario presione Enter para continuar o 'q' para salir
 * @param {string} waitingMessage - Mensaje a mostrar al usuario (por defecto 'Press Enter to continue or q to quit...')
 * @returns {Promise<void>} Promesa que se resuelve cuando el usuario presiona Enter o termina el proceso si presiona 'q'
 */
export const wait = async (waitingMessage: string = 'Press Enter to continue or q to quit...') =>
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

        if (answer.toLowerCase() === 'q') {
            process.exit(0);
        }

        resolve();
    });
