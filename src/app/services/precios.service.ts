import { Iprecios } from '../models/precios';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class PreciosService {
	private url: string;	
	
	constructor(private http: HttpClient) {
		this.url = environment.preciosUrl;
	}


	consultarTodos(): Observable<Iprecios[]> {

		return this.http.get<Iprecios[]>(this.url + 'consultar')
			.pipe(
				tap(result => this.log(`fetched Precios`)),
				catchError(this.handleError('consultarTodos', []))
			);
	}
    
    consultarPorTipos(tipo: string): Observable<Iprecios[]> {

		return this.http.get<Iprecios[]>(this.url + 'consultar/tipos/'+tipo)
			.pipe(
				tap(result => this.log(`fetched tipos (${result.length})`)),
				catchError(this.handleError('consultarPorTipos', []))
			);
	}

	consultarUltimosPrecios(tipo: string): Observable<Iprecios[]> {

		return this.http.get<Iprecios[]>(this.url + 'consultar/ultimoprecio/'+tipo)
			.pipe(
				tap(result => this.log(`fetched ultimos precios (${result.length})`)),
				catchError(this.handleError('consultarUltimosPrecios', []))
			);
	}
	
	registrar(registro: Iprecios) {
		return this.http.post<Iprecios>(this.url + 'insertar', registro).pipe(
			tap(result => { this.log(`precio insertado`) }),
			catchError(this.handleError('registrar precio', []))
		);
	}


	actualizar(registro: Iprecios) {
		const url = `${this.url}actualizar/${registro.idPrecio}`;

		return this.http.put(url, registro).pipe(
			tap(result => {
			}),
			catchError(this.handleError('actualizando tasa', []))
		);
	}

	eliminar(id: number) {
		const url = `${this.url}eliminar/${id}`;

		return this.http.delete(url).pipe(
			tap(result => {
			}),
			catchError(this.handleError('error eliminando precio', []))
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