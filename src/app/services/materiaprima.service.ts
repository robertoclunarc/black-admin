import { ImateriPrima } from '../models/materiaprima';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class MateriaPrimaService {
	private url: string;	
	nuevo: ImateriPrima={};
	constructor(private http: HttpClient) {
		this.url = environment.materiaPrimaUrl;
	}

	consultarTodos(): Observable<ImateriPrima[]> {

		return this.http.get<ImateriPrima[]>(this.url + 'consultar')
			.pipe(
				tap(result => this.log(`fetched Empresas`)),
				catchError(this.handleError('consultarTodos', []))
			);
	}
    
    /*consultarPorId(id: number): Observable<IEmpresa[]> {

		return this.http.get<IEmpresa[]>(this.url + 'consultar/'+id)
			.pipe(
				tap(result => this.log(`fetched Empresas por ID`)),
				catchError(this.handleError('consultarPorID', []))
			);
	}*/	

	viewFromAnyField(id: number, desc: string, marca: string): Observable<ImateriPrima[]> {			

		const url = `${this.url}filtrar/${id}/${desc}/${marca}`;

		return this.http.get<ImateriPrima[]>(url)
			.pipe(
				tap(result => this.log(`fetched materia prima any field`)),
				catchError(this.handleError('viewFromAnyField', []))
			);
	}
	
	registrar(materia: ImateriPrima) {
		return this.http.post<ImateriPrima>(this.url + 'insertar', materia).pipe(
			tap(result => { this.nuevo=result; this.log(`materia prima insertada`) }),
			catchError(this.handleError('registrar materia', []))
		);
	}


	actualizar(materia: ImateriPrima) {
		const url = `${this.url}actualizar/${materia.idMateriaPrima}`;

		return this.http.put(url, materia).pipe(
			tap(result => {
			}),
			catchError(this.handleError('actualizando materia', []))
		);
	}

	eliminar(id: number) {
		const url = `${this.url}eliminar/${id}`;

		return this.http.delete(url).pipe(
			tap(result => {
			}),
			catchError(this.handleError('error eliminando materia', []))
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