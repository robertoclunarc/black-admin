import { IMoneda } from '../models/monedas';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class MonendasService {
	private url: string;	
	
	constructor(private http: HttpClient) {
		this.url = environment.monedasUrl;
	}


	consultarTodos(): Observable<IMoneda[]> {

		return this.http.get<IMoneda[]>(this.url + 'consultar')
			.pipe(
				tap(result => this.log(`fetched Monedas`)),
				catchError(this.handleError('consultarTodos', []))
			);
	}
    
    /*consultarPorId(id: number): Observable<IMoneda[]> {

		return this.http.get<IMoneda[]>(this.url + 'consultar/'+id)
			.pipe(
				tap(result => this.log(`fetched Monedas por ID`)),
				catchError(this.handleError('consultarPorID', []))
			);
	}*/	

	viewFromAnyField(moneda: IMoneda): Observable<IMoneda[]> {			

		const url = `${this.url}filtrar/${moneda.idMoneda}/${moneda.descripcionMoneda}`;

		return this.http.get<IMoneda[]>(url)
			.pipe(
				tap(result => this.log(`fetched Moneda any field`)),
				catchError(this.handleError('viewFromAnyField', []))
			);
	}
	
	registrar(moneda: IMoneda) {
		return this.http.post<IMoneda>(this.url + 'insertar', moneda).pipe(
			tap(result => { this.log(`Moneda insertada`) }),
			catchError(this.handleError('registrar moneda', []))
		);
	}


	actualizar(moneda: IMoneda) {
		const url = `${this.url}actualizar/${moneda.idMoneda}`;

		return this.http.put(url, moneda).pipe(
			tap(result => {
			}),
			catchError(this.handleError('actualizando moneda', []))
		);
	}

	eliminar(id: number) {
		const url = `${this.url}eliminar/${id}`;

		return this.http.delete(url).pipe(
			tap(result => {
			}),
			catchError(this.handleError('error eliminando Moneda', []))
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