import { ISucursal  } from './sucursales';

export interface IPedidos{
    idPedido?: number;
    fechaPedido?: string;
    idVentaAsociada?: number;
    idCompraAsociada?: number;
    idProveedor?: number;
    idComprador?: number;
    tipoPedido?: string;
    estatusPedido?: string;
    fkSucursal?: string;
    loginCrea?: string
}

export interface IDetPedidos{
    idDetPedido?: number;
    fkPedido?: number;
    fkProducto?: number;
    fkMaterial?: number;
    cantidad?: number;
    unidad?: string;
    estatusDetPedido?: string;
}

export interface IPedidosDetalles{
    pedido: IPedidos;
    sucursal: ISucursal;
    detalles: IDetPedidos[];
}

export interface IPedidosAsociados {
    idAsociado?: number;
    fkVenta?: number;
    fkPedido?: number;
    fkMaterialesComprados?: number;

}