/**
 * Interfaz que representa una expresión de tiempo con un signo, un número y una unidad.
 * Se utiliza para especificar intervalos de tiempo relativos.
 *
 * sign - Signo que indica si el intervalo de tiempo es hacia adelante (+) o hacia atrás (-)
 *
 * number - Intervalo de tiempo
 *
 * unit - Unidad de tiempo que se aplica al intervalo de tiempo:
 * - h: horas (máximo ${max_horas})
 * - d: días (máximo ${max_dias})
 * - m: meses (máximo ${max_meses})
 * - a: años (máximo ${max_anios})
 */
export interface ITimeExpression {
    sign: '+' | '-';
    number: number;
    unit: string;
}

/**
 * Interfaz que define un intervalo de tiempo con fecha de inicio y fin. Las fechas están como
 * cadena de caracteres en el formato DATE_TIME_FORMAT.
 */
export interface ITimeInterval {
    start: string
    end: string
}

/**
 * Interfaz que representa la diferencia de tiempo desglosada en días, horas y minutos.
 */
export interface ITimeIntervalDiff {
    days: number
    hours: number
    minutes: number
}