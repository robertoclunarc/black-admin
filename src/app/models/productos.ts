import { ImateriPrima } from './materiaprima';
//import { ISucursal } from './sucursales';
import { IMoneda } from './monedas';
import { IUsuarioSucursal } from './usuarios'

export interface IProductos{ 
    idProducto ?: number;
    descripcionProducto? : string;
    fechaProduccion?: string;
    imagenProducto?: string;
    fkSucursal?: number;    
    marcaProducto?: string;
    retieneIva_prod?: boolean;
    iva?: number;
    montoIva?: number;
    precio?: number;
    fkMoneda?: number;
    tasaDiaProd?: number;
}

export interface IdetProducto{   
    idDetProducto?: number;
    fkProducto?: number;
    Materia?:ImateriPrima;
    cantidad?: number;
    unidad?: string;
}

export interface IdetProductosConMateriales{    
    producto?:IProductos
    materiaPrima?: IdetProducto[];  
    usuarioSucursal?: IUsuarioSucursal
    moneda?: IMoneda,
}
