import {ISucursal} from './sucursales';

export interface IUsuarios{
    login: string;
    passw: string;
    nombres: string;
    cargo: string;
    nivel: number;
    email: string;
    fksucursal: number;
    estatus: string;
    imagen?: string;
}

interface IUsuario{
    login?: string;    
    nombres?: string;
    cargo?: string;
    nivel?: number;
    email?: string;    
    estatus?: string;
    imagen?: string;
}

export interface IUsuarioSucursal{
    usuario?: IUsuario;
    sucursal?: ISucursal;    
}
/*
export interface IUser extends Document{
    username: string;
    email:string;
    passw: string;
}*/