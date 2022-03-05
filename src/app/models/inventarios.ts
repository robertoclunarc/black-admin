export interface IinventariosMateriales{
    idInventario?: number;
    fkMateriaPrima?: number;
    cantidad?: number;
    cantidadAcumulada?: number;
    unidad?: string;
    precio1?: number;
    fkMonedaPrecio1?: number;
    precio2?: number;
    fkMonedaPrecio2?: number;
    fksucursal?: number;
    ubicacionA?: string;
    ubicacionB?: string;
    loginCrea?: string;
    fechaCrea?: string;
    loginActualiza?: string;
    fechaActualiza?: string;
    estatus?: string;
}

export interface IinventariosProductos{
    idInventario?: number;
    fkProducto?: number;
    cantidad?: number;
    unidad?: string;
    precio1?: number;
    precio2?: number;
    fksucursal?: number;
    ubicacionA?: string;
    ubicacionB?: string;
    loginCrea?: string;
    fechaCrea?: string;
    loginActualiza?: string;
    fechaActualiza?: string;
    estatus?: string;
}