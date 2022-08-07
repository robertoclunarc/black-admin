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
    loginCrea?: string;   
    marcaProducto?: string;
    retieneIva_prod?: boolean;
    iva?: number;
    montoIva?: number;
    precio?: number;
    fkMoneda?: number;
    tasaDiaProd?: number;
}

export interface IDetProductos{   
    idDetProducto?: number;
    fkProducto?: number;
    fkMateria?: number;
    cantidad?: number;
    unidad?: string;
    precio?: number;
    moneda?: string;
}

/*export interface IMateriales{    
    materiaPrima?: ImateriPrima;
    cantidad?: number;
    unidad?: string;
}*/

export interface IdetProducto{   
    idDetProducto?: number;
    fkProducto?: number;
    Materia?:ImateriPrima;
    cantidad?: number;
    unidad?: string;
    precio?: number;
    moneda?: string;
}

export interface IdetProductosConMateriales{    
    producto?:IProductos,
    moneda?: IMoneda,
    materiaPrima?: IdetProducto[];  
    usuarioSucursal?: IUsuarioSucursal
}