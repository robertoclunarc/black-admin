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
/*
export interface IUser extends Document{
    username: string;
    email:string;
    passw: string;
}*/