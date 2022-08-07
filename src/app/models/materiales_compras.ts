import { ImateriPrima } from './materiaprima';
import { IMoneda } from './monedas';
import { IProveedores } from '../models/proveedores';
import { ISucursal } from './sucursales';

export interface IMaterialesComprados{
    idCompra?: number;
    fechaCompra?: string;
    tasaDia?: number;
    fkMoneda?: number;    
    subtotal?: number;
    iva?: number;
    montoIva?: number;
    neto?: number;
    estatus?: string;
    idProveedor?: number;
    loginCrea?: string;
    fkSucursal?: number;
}

export interface IdetallesCompras{
    fkcompra?: number;
    idDetCompra?: number;
    fkMateriaPrima?: number;
    cantidad?: number;
    unidad?: string;
    precioUnitario?: number;
    subtotal?: number;
}

export interface IDetallesCompra{
    fkcompra?: number;
    idDetCompra?: number;
    MateriaPrima?: ImateriPrima;
    cantidad?: number;
    unidad?: string;
    precioUnitario?: number;
    subtotal?: number;
}

export interface IdetallesComprasConMateriales{
    compra?: IMaterialesComprados;
    moneda?: IMoneda;
    proveedor?: IProveedores;
    sucursal?:ISucursal;
    detalles?: IDetallesCompra[];    
}

export interface IfitroCompras{
    idCompra?: string;   
    fkMaterial?:string;
    descripcionMaterial?: string;
    idSucursal?: string;
    idProveedor?: string;
    fechaIni?: string;  
    fechaFin?: string;  
}
