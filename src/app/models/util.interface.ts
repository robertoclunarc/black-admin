export  interface IPayload{
    _id: string;
    iat: number;
    exp: number;
    _car?: string;   
    _niv?: number;
}

export interface IparametrosGrales{
    idParametro?: number;
    fechaAct: string;
    iva: number;
}