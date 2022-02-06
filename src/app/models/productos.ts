export interface IProductos{ 
    idProducto ?: number;
    descripcionProducto? : string;
    fechaProduccion?: string;
    imagenProducto?: string;
    //detalles?: IDetProductos[]
}

export interface IDetProductos{   
    idDetProducto?: number;
    fkProducto?: number;
    fkMateria?: number;
    cantidad?: number;
    unidad?: string;
}
