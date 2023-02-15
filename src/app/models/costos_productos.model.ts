import {IGastosProductos} from './gastos_productos';
import { IProductos } from './productos';
import { IMoneda } from './monedas';
import { IUsuarioSucursal } from './usuarios';

export interface ICosto{
    idCosto?: number;
    fecha?: string;
    fkProducto?: number;
    ganancia_porc?: number;
    total?: number;
    neto?: number;
    raciones?: number;
    tasa?: number;
    precio_venta?: number;
}

export interface ICostoGastos{
    costo?: ICosto;
    gastos?: IGastosProductos[];
}

export interface IProductosCostos{    
    producto?:IProductos,
    costos?: ICosto;
    moneda?: IMoneda,
    usuarioSucursal?: IUsuarioSucursal
}