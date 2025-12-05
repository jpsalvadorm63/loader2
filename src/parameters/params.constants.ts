import {IMagnitude, IOpoint} from "./params.interfaces.js";

/**
 * Se utiliza como parámetro por default cuando no se pasa parámetro alguno
 */
export const NONEPARAM = 'NONEPARAM'

/**
 * Se utiliza como parámetro por decir que pasan todos los elementos de una lista
 */
export const ALLPARAM = 'ALL'

/**
 * Lista de magnitudes medidas por las estaciones de monitoreo de calidad del aire.
 * Cada magnitud tiene las siguientes propiedades:
 * @property {string} nombre - Nombre completo de la magnitud
 * @property {string} airVisio - Identificador usado en el sistema AirVisio
 * @property {number} visor - Código numérico usado en el sistema Visor
 * @property {string} abbr - Abreviatura o símbolo químico de la magnitud
 */
export const MAGNITUDES: IMagnitude[] = [
    { nombre: 'Material Particulado 2.5', airVisio: 'PM2.5_ug',  visor: 10, abbr: "PM2.5"},
    { nombre: 'Material Particulado 10',  airVisio: 'PM10_ug',   visor: 3,  abbr: "PM10" },
    { nombre: 'Ozono',                    airVisio: 'OZONO_ug',  visor: 14, abbr: "O3"   },
    { nombre: 'Dióxido de Nitrógeno',     airVisio: 'NO2_ug',    visor: 8,  abbr: "NO2"  },
    { nombre: 'Monóxido de Carbono',      airVisio: 'CO_mg',     visor: 6,  abbr: "CO"   },
    { nombre: 'Dióxido de Carbono',       airVisio: 'CO2_mg',    visor: 5,  abbr: "CO2"  },
    { nombre: 'Dióxido de Azufre',        airVisio: 'SO2_ug',    visor: 1,  abbr: "SO2"  },
    { nombre: 'Óxido nítrico',            airVisio: 'NO_ug',     visor: 8,  abbr: "NO"   },
    { nombre: 'Óxidos de nitrógeno',      airVisio: 'NOX_ug',    visor: 12, abbr: "NOx"  },
    { nombre: 'Temperatura ambiente',     airVisio: 'TEMP_AMB',  visor: 83, abbr: "TEMP" },
    { nombre: 'Velocidad del viento',     airVisio: 'RAP_VEC',   visor: 81, abbr: "VEL"  },
    { nombre: 'Dirección del viento',     airVisio: 'DIR_VEC',   visor: 82, abbr: "DIR"  },
    { nombre: 'Humedad relativa',         airVisio: 'HUM_REL',   visor: 86, abbr: "HUM"  },
    { nombre: 'Precipitación',            airVisio: 'LLUVIA',    visor: 89, abbr: "LLU"  },
    { nombre: 'Presión barométrica',      airVisio: 'PRES_BAR',  visor: 87, abbr: "PRE"  },
    { nombre: 'Radiación solar',          airVisio: 'RAD_SOLAR', visor: 88, abbr: "RS"   }
];

export const OPOINT: IOpoint[] = [
    {nombre: 'Belisario',   airVisio: 'Belisario',   visor: 3,  abbr: "BEL" },
    {nombre: 'Carapungo',   airVisio: 'Carapungo',   visor: 2,  abbr: "CAR" },
    {nombre: 'Centro',      airVisio: 'Centro',      visor: 6,  abbr: "CEN" },
    {nombre: 'Cotocollao',  airVisio: 'Cotocollao',  visor: 1,  abbr: "COT" },
    {nombre: 'El Camal',    airVisio: 'El Camal',    visor: 5,  abbr: "CML" },
    {nombre: 'Guamani',     airVisio: 'Guamani',     visor: 7,  abbr: "GUA" },
    {nombre: 'Los Chillos', airVisio: 'Los Chillos', visor: 9,  abbr: "LCH" },
    {nombre: 'San Antonio', airVisio: 'San Antonio', visor: 14, abbr: "SAP" },
    {nombre: 'Tumbaco',     airVisio: 'Tumbaco',     visor: 8,  abbr: "TUM" }
];



