/**
 * Interfaz que define una magnitud con su nombre y los códigos correspondientes
 * tanto para la API como para el sistema.
 */
export interface IMagnitude {
    /** Nombre de la magnitud */
    nombre: string;
    /** Código utilizado en la API para extraer datos desde AirVisio*/
    airVisio: string;
    /** Código utilizado en el sistema Visor para ingresar los datos */
    visor: number;
    /** abreviación */
    abbr: string;
}

/**
 * Interfaz que define un punto de observación (estación de monitoreo) con su nombre y los códigos correspondientes
 * tanto para la API como para el sistema.
 */
export interface IOpoint {
    /** Nombre del punto de observación */
    nombre: string;
    /** Código utilizado en la API para extraer datos desde AirVisio*/
    airVisio: string;
    /** Código utilizado en el sistema Visor para ingresar los datos */
    visor: number;
    /** Abreviación del punto de observación */
    abbr: string;
}
