/**
 * Módulo para cargar y exportar el contenido del archivo package.json del proyecto.
 *
 * Este módulo proporciona acceso al objeto package.json parseado, permitiendo
 * acceder a metadatos del proyecto como versión, nombre, dependencias, etc.
 */

import {readFileSync} from 'fs';
import {fileURLToPath} from 'url';
import {dirname, join} from 'path';

/**
 * Ruta absoluta del archivo actual.
 * Convierte la URL del módulo ES6 (import.meta.url) en una ruta de sistema de archivos.
 */
const __filename: string = fileURLToPath(import.meta.url);

/**
 * Directorio que contiene el archivo actual.
 * Obtiene el nombre del directorio a partir de la ruta del archivo.
 */
const __dirname: string = dirname(__filename);

/**
 * Objeto parseado del archivo package.json del proyecto.
 *
 * Contiene toda la información del package.json incluyendo nombre, versión,
 * dependencias, scripts y otros metadatos del proyecto.
 *
 * @type {object} Objeto con las propiedades del package.json
 *
 * @example
 * // Acceder a la versión del proyecto
 * console.log(packageJson.version);
 *
 * @example
 * // Acceder al nombre del proyecto
 * console.log(packageJson.name);
 */
export const packageJson = JSON.parse(readFileSync(join(__dirname, '../../package.json'), 'utf-8'));