import { IProveedores } from '../models/proveedores';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class ProveedoresService {
	private url: string;	
	
	constructor(private http: HttpClient) {
		this.url = environment.proveedoresUrl;
	}

	consultarTodos(): Observable<IProveedores[]> {

		return this.http.get<IProveedores[]>(this.url + 'consultar')
			.pipe(
				tap(result => this.log(`fetched Proveedoress`)),
				catchError(this.handleError('consultarTodos', []))
			);
	}
    
    /*consultarPorId(id: number): Observable<IProveedores[]> {

		return this.http.get<IProveedores[]>(this.url + 'consultar/'+id)
			.pipe(
				tap(result => this.log(`fetched Proveedoress por ID`)),
				catchError(this.handleError('consultarPorID', []))
			);
	}*/	

	viewFromAnyField(Proveedores: IProveedores): Observable<IProveedores[]> {			

		const url = `${this.url}filtrar/${Proveedores.idProveedor}/${Proveedores.NombresProveedor}`;

		return this.http.get<IProveedores[]>(url)
			.pipe(
				tap(result => this.log(`fetched Proveedores any field`)),
				catchError(this.handleError('viewFromAnyField', []))
			);
	}
	
	registrar(Proveedores: IProveedores) {
		return this.http.post<IProveedores>(this.url + 'insertar', Proveedores).pipe(
			tap(result => { this.log(`Proveedores insertada`) }),
			catchError(this.handleError('registrar Proveedores', []))
		);
	}


	actualizar(Proveedores: IProveedores) {
		const url = `${this.url}actualizar/${Proveedores.idProveedor}`;

		return this.http.put(url, Proveedores).pipe(
			tap(result => {
			}),
			catchError(this.handleError('actualizando Proveedores', []))
		);
	}

	eliminar(id: number) {
		const url = `${this.url}eliminar/${id}`;

		return this.http.delete(url).pipe(
			tap(result => {
			}),
			catchError(this.handleError('error eliminando Proveedor', []))
		);
	}


	private handleError<T>(operation = 'operation', result?: T) {
		return (error: any): Observable<T> => {
			console.error(error);
			return of(result as T);
		};
	}

	private log(message: string) {
		console.log('UserService: ' + message);
	}

}