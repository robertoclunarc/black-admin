export interface Iprecios{
    idPrecio?: number;
    fkMaterial?: number;
    fkProducto?: number;
    Precio?: number;
    fkMoneda?: number;
    fechaPrecio?: string;
    tipo?: string;
}