import { IEmpresa } from '../models/empresa';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class EmpresasService {
	private url: string;	
	
	constructor(private http: HttpClient) {
		this.url = environment.empresasUrl;
	}

	consultarTodos(): Observable<IEmpresa[]> {

		return this.http.get<IEmpresa[]>(this.url + 'consultar')
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

	viewFromAnyField(Empresa: IEmpresa): Observable<IEmpresa[]> {			

		const url = `${this.url}filtrar/${Empresa.idEmpresa}/${Empresa.nombreEmpresa}/${Empresa.rifEmpresa}`;

		return this.http.get<IEmpresa[]>(url)
			.pipe(
				tap(result => this.log(`fetched Empresa any field`)),
				catchError(this.handleError('viewFromAnyField', []))
			);
	}
	
	registrar(Empresa: IEmpresa) {
		return this.http.post<IEmpresa>(this.url + 'insertar', Empresa).pipe(
			tap(result => { this.log(`Empresa insertada`) }),
			catchError(this.handleError('registrar Empresa', []))
		);
	}


	actualizar(Empresa: IEmpresa) {
		const url = `${this.url}actualizar/${Empresa.idEmpresa}`;

		return this.http.put(url, Empresa).pipe(
			tap(result => {
			}),
			catchError(this.handleError('actualizando Empresa', []))
		);
	}

	eliminar(id: number) {
		const url = `${this.url}eliminar/${id}`;

		return this.http.delete(url).pipe(
			tap(result => {
			}),
			catchError(this.handleError('error eliminando Empresa', []))
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