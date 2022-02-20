import { IparametrosGrales } from '../models/util.interface';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class ParametrosService {
	private url: string;	
	
	constructor(private http: HttpClient) {
		this.url = environment.parametrosUrl;
	}

	consultarTodos(): Observable<IparametrosGrales[]> {

		return this.http.get<IparametrosGrales[]>(this.url + 'consultar')
			.pipe(
				tap(result => this.log(`fetched parametros`)),
				catchError(this.handleError('consultarTodos', []))
			);
	}	

	parametrosUltimaFecha(): Observable<IparametrosGrales[]> {			

		const url = `${this.url}iva`;

		return this.http.get<IparametrosGrales[]>(url)
			.pipe(
				tap(result => this.log(`fetched iva`)),
				catchError(this.handleError('porcentajeIva', []))
			);
	}
	
	registrar(param: IparametrosGrales) {
		return this.http.post<IparametrosGrales>(this.url + 'insertar', param).pipe(
			tap(result => { this.log(`parametro insertado`) }),
			catchError(this.handleError('registrar parametro', []))
		);
	}


	actualizar(param: IparametrosGrales) {
		const url = `${this.url}actualizar/${param.idParametro}`;

		return this.http.put(url, param).pipe(
			tap(result => {
			}),
			catchError(this.handleError('actualizando parametro', []))
		);
	}

	eliminar(id: number) {
		const url = `${this.url}eliminar/${id}`;

		return this.http.delete(url).pipe(
			tap(result => {
			}),
			catchError(this.handleError('error eliminando parametro', []))
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