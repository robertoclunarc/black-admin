import { IGastosProductos } from '../models/gastos_productos';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class GastosProductosService {
	private url: string;	
	
	constructor(private http: HttpClient) {
		this.url = environment.GastosProductosUrl;
	}

	consultarTodos(): Observable<IGastosProductos[]> {

		return this.http.get<IGastosProductos[]>(this.url + 'consultar')
			.pipe(
				tap(result => this.log(`fetched GastosProductos`)),
				catchError(this.handleError('consultarTodos', []))
			);
	}
    
    /*consultarPorId(id: number): Observable<IGastosProductos[]> {

		return this.http.get<IGastosProductos[]>(this.url + 'consultar/'+id)
			.pipe(
				tap(result => this.log(`fetched GastosProductos por ID`)),
				catchError(this.handleError('consultarPorID', []))
			);
	}*/	

	viewFromAnyField(gasto: IGastosProductos, condicion: string): Observable<IGastosProductos[]> {			

		const url = `${this.url}filtrar/${gasto.idgasto}/${gasto.fkCosto}/${gasto.descripcion_gasto}/${condicion}`;

		return this.http.get<IGastosProductos[]>(url)
			.pipe(
				tap(result => this.log(`fetched gasto any field`)),
				catchError(this.handleError('viewFromAnyField', []))
			);
	}

	async viewFromAnyFieldPromise(gasto: IGastosProductos, condicion: string): Promise<IGastosProductos[]> {			

		const url = `${this.url}filtrar/${gasto.idgasto}/${gasto.fkCosto}/${gasto.descripcion_gasto}/${condicion}`;

		return await this.http.get<IGastosProductos[]>(url).toPromise();
	}
	
	registrar(gasto: IGastosProductos) {
		return this.http.post<IGastosProductos>(this.url + 'insertar', gasto).pipe(
			tap(result => { this.log(`gasto insertado`) }),
			catchError(this.handleError('registrar gasto', []))
		);
	}


	actualizar(gasto: IGastosProductos) {
		const url = `${this.url}actualizar/${gasto.idgasto}`;

		return this.http.put(url, gasto).pipe(
			tap(result => {
			}),
			catchError(this.handleError('actualizando gasto', []))
		);
	}

	eliminar(id: number) {
		const url = `${this.url}eliminar/${id}`;

		return this.http.delete(url).pipe(
			tap(result => {
			}),
			catchError(this.handleError('error eliminando gasto', []))
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