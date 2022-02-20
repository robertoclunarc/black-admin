import { ITasaCambio, ItasaFiltro, ItasaCambioMoneda } from '../models/tasas_cambios';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class TasasCambiosService {
	private url: string;	
	
	constructor(private http: HttpClient) {
		this.url = environment.tasasCambiosUrl;
	}


	consultarTodos(): Observable<ITasaCambio[]> {

		return this.http.get<ITasaCambio[]>(this.url + 'consultar')
			.pipe(
				tap(result => this.log(`fetched tasas Cambios`)),
				catchError(this.handleError('consultarTodos', []))
			);
	}
    
    consultarPorIdMoneda(id: number): Observable<ITasaCambio[]> {

		return this.http.get<ITasaCambio[]>(this.url + 'ultimatasa/'+id)
			.pipe(
				tap(result => this.log(`fetched ultima tasa`)),
				catchError(this.handleError('consultarPorID', []))
			);
	}

	viewFromAnyField(filtro: ItasaFiltro): Observable<ItasaCambioMoneda[]> {			

		const url = `${this.url}filtrar/${filtro.idCambio}/${filtro.idMoneda}/${filtro.descripcionMoneda}/${filtro.fechaIni}/${filtro.fechaFin}`;

		return this.http.get<ItasaCambioMoneda[]>(url)
			.pipe(
				tap(result => this.log(`fetched tasa any field`)),
				catchError(this.handleError('viewFromAnyField', []))
			);
	}
	
	registrar(tasaCambio: ITasaCambio) {
		return this.http.post<ITasaCambio>(this.url + 'insertar', tasaCambio).pipe(
			tap(result => { this.log(`tasa insertada`) }),
			catchError(this.handleError('registrar tasa', []))
		);
	}


	actualizar(tasaCambio: ITasaCambio) {
		const url = `${this.url}actualizar/${tasaCambio.idCambio}`;

		return this.http.put(url, tasaCambio).pipe(
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