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
 * Pausa la ejecución y espera la interacción del usuario mediante la entrada de consola.
 *
 * Esta función crea una interfaz de lectura que espera a que el usuario presione Enter para continuar
 * o ingrese 'q' para salir del programa. Opcionalmente puede limpiar la pantalla antes de continuar.
 *
 * @param {string} waitingMessage - Mensaje que se mostrará al usuario mientras espera.
 *                                   Por defecto: 'Press Enter to continue or q to quit...'
 * @param {boolean} clearScreenBefore - Si es true, limpia la pantalla antes de continuar después de
 *                                       que el usuario presione Enter. Por defecto: false
 *
 * @returns {Promise<void>} Promesa que se resuelve cuando el usuario presiona Enter o termina
 *                          el proceso si ingresa 'q'.
 *
 * @example
 * // Espera con mensaje por defecto
 * await wait();
 *
 * @example
 * // Espera con mensaje personalizado
 * await wait('Presiona Enter para descargar datos...');
 *
 * @example
 * // Espera y limpia la pantalla antes de continuar
 * await wait('Presiona Enter para continuar...', true);
 *
 * @example
 * // El usuario puede salir del programa ingresando 'q'
 * await wait('Enter para continuar, q para salir');
 * // Si el usuario ingresa 'q' o 'Q', el proceso termina con process.exit(0)
 */
export const wait = async (
    waitingMessage: string = 'Presione Enter para continuar o q para salir...',
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
