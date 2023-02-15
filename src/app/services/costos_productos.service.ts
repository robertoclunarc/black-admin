import { ICosto, ICostoGastos, IProductosCostos } from '../models/costos_productos.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class CostosProductosService {
	private url: string;	
	nuevoCosto: ICosto={};
	constructor(private http: HttpClient) {
		this.url = environment.CostosProductosUrl;
	}

	consultarTodos(): Observable<ICosto[]> {

		return this.http.get<ICosto[]>(this.url + 'consultar')
			.pipe(
				tap(result => this.log(`fetched Costos`)),
				catchError(this.handleError('consultarTodos', []))
			);
	} 

	viewFromAnyField(idCosto: string, idProducto: string): Observable<ICostoGastos[]> {			

		const url = `${this.url}filtrar/${idCosto}/${idProducto}`;

		return this.http.get<ICostoGastos[]>(url)
			.pipe(
				tap(result => this.log(`fetched costo any field`)),
				catchError(this.handleError('viewFromAnyField', []))
			);
	}

	viewFromAnyFieldProducto(idCosto: string, idProducto: string, descripcion: string, sucursal: string): Observable<IProductosCostos[]> {			
		
		const url = `${this.url}filtrar/producto/${idProducto}/${descripcion}/${idCosto}/${sucursal}`;

		return this.http.get<IProductosCostos[]>(url)
			.pipe(
				tap(result => this.log(`fetched costo any field`)),
				catchError(this.handleError('viewFromAnyFieldProducto', []))
			);
	}
	
	registrar(costo: ICosto) {
		return this.http.post<ICosto>(this.url + 'insertar', costo).pipe(
			tap(result => { 
				this.nuevoCosto=result; 
				this.log(`Costo insertado`) 
			}),
			catchError(this.handleError('registrar Costo', []))
		);
	}


	actualizar(costo: ICosto) {
		const url = `${this.url}actualizar/${costo.idCosto}`;

		return this.http.put(url, costo).pipe(
			tap(result => {
			}),
			catchError(this.handleError('actualizando costo', []))
		);
	}

	eliminar(id: number) {
		const url = `${this.url}eliminar/${id}`;

		return this.http.delete(url).pipe(
			tap(result => {
			}),
			catchError(this.handleError('error eliminando costo', []))
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