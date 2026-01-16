import {magnitudes2array} from "../parameters/params.magnitudes.js";


export const commandMagnitudes = (magnitudes : string | null) => {
    return magnitudes2array(magnitudes);
}