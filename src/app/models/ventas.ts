import { IMoneda } from './monedas';
import { ISucursal } from './sucursales';
import { IProductos } from './productos';

export interface IVentas{
    idVenta?: number;
    nroFactura?: string;
    fechaVenta?: string;
    total?: number;
    iva?: number;
    montoIva?: number;
    tasaDia?: number;
    fkMoneda?: number;
    neto?: number;
    comprador?: string;
    direccionComprador?: string;
    tlfComprador?: string;
    loginCrea?: string;
    fkSucursal?: number;
    estatus?: string;
}

export interface IdetVenta{
    idDetVenta?: number;
    fkVenta?: number;
    fkProducto?: number;
    cantidad?: number;
    unidad?: string;
    precioUnitario?: number;
    subtotal?: number;
    estatus?: string;
}

export interface IdetVentaProducto{
    detalle?: IdetVenta;
    producto?: IProductos;
}

export interface IDetallesVentas{
    venta: IVentas;
    moneda: IMoneda;
    sucursal: ISucursal;
    detalles: IdetVentaProducto[];
}