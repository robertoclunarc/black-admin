import { ISucursal } from '../models/sucursales';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class SucursalesService {
	private url: string;	
	
	constructor(private http: HttpClient) {
		this.url = environment.sucursalesUrl;
	}

	consultarTodos(): Observable<ISucursal[]> {

		return this.http.get<ISucursal[]>(this.url + 'consultar')
			.pipe(
				tap(result => this.log(`fetched sucursals`)),
				catchError(this.handleError('consultarTodos', []))
			);
	}
    
    /*consultarPorId(id: number): Observable<ISucursal[]> {

		return this.http.get<ISucursal[]>(this.url + 'consultar/'+id)
			.pipe(
				tap(result => this.log(`fetched sucursales por ID`)),
				catchError(this.handleError('consultarPorID', []))
			);
	}*/	

	viewFromAnyField(sucursal: ISucursal): Observable<ISucursal[]> {			

		const url = `${this.url}filtrar/${sucursal.idSucursal}/${sucursal.nombreSucursal}/${sucursal.rifSucursal}/${sucursal.fkempresa}`;

		return this.http.get<ISucursal[]>(url)
			.pipe(
				tap(result => this.log(`fetched sucursal any field`)),
				catchError(this.handleError('viewFromAnyField', []))
			);
	}
	
	registrar(sucursal: ISucursal) {
		return this.http.post<ISucursal>(this.url + 'insertar', sucursal).pipe(
			tap(result => { this.log(`sucursal insertada`) }),
			catchError(this.handleError('registrar sucursal', []))
		);
	}


	actualizar(sucursal: ISucursal) {
		const url = `${this.url}actualizar/${sucursal.idSucursal}`;

		return this.http.put(url, sucursal).pipe(
			tap(result => {
			}),
			catchError(this.handleError('actualizando sucursal', []))
		);
	}

	eliminar(id: number) {
		const url = `${this.url}eliminar/${id}`;

		return this.http.delete(url).pipe(
			tap(result => {
			}),
			catchError(this.handleError('error eliminando sucursal', []))
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