import { IUnidades } from '../models/unidades';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class UnidadesService {
	private url: string;	
	
	constructor(private http: HttpClient) {
		this.url = environment.unidadesUrl;
	}


	consultarTodos(): Observable<IUnidades[]> {

		return this.http.get<IUnidades[]>(this.url + 'consultar')
			.pipe(
				tap(result => this.log(`fetched Unidades`)),
				catchError(this.handleError('consultarTodos', []))
			);
	}
    
    viewFromAnyField(filtro: IUnidades): Observable<IUnidades[]> {

		return this.http.get<IUnidades[]>(this.url + 'consultar/filtrar/'+filtro.idUnidad+'/'+filtro.descripcion)
			.pipe(
				tap(result => this.log(`fetched unidades (${result.length})`)),
				catchError(this.handleError('viewFromAnyField', []))
			);
	}
	
	registrar(registro: IUnidades) {
		return this.http.post<IUnidades>(this.url + 'insertar', registro).pipe(
			tap(result => { this.log(`unidad insertada`) }),
			catchError(this.handleError('registrar precio', []))
		);
	}


	actualizar(registro: IUnidades) {
		const url = `${this.url}actualizar/${registro.idUnidad}`;

		return this.http.put(url, registro).pipe(
			tap(result => {
			}),
			catchError(this.handleError('actualizando unidad', []))
		);
	}

	eliminar(id: number) {
		const url = `${this.url}eliminar/${id}`;

		return this.http.delete(url).pipe(
			tap(result => {
			}),
			catchError(this.handleError('error eliminando unidad', []))
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