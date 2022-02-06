import { IMoneda } from './monedas';

export interface ITasaCambio{
    idCambio?: number;
    fechaCambio?: string;
    tasaDia?: number;
    idMoneda?: number;
}

export interface ItasaCambioMoneda{
    tasa: ITasaCambio;
    modeda: IMoneda;
}