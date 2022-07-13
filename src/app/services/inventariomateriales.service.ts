import { IinventariosMateriales, IMaterialesEnInventario } from '../models/inventarios';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class InventarioMateialesService {
	private url: string;	
	
	constructor(private http: HttpClient) {
		this.url = environment.inventarioUrl + 'materiales/'
	}

	consultarTodos(): Observable<IMaterialesEnInventario[]> {

		return this.http.get<IMaterialesEnInventario[]>(this.url + 'consultar')
			.pipe(
				tap(result => this.log(`fetched inventarios`)),
				catchError(this.handleError('consultarTodos', []))
			);
	}
    
    consultarPorId(id: number): Observable<IinventariosMateriales[]> {

		return this.http.get<IinventariosMateriales[]>(this.url + 'consultar/'+id)
			.pipe(
				tap(result => this.log(`fetched inventarios por ID`)),
				catchError(this.handleError('consultarPorID', []))
			);
	}	

	viewFromAnyField(inventario: IinventariosMateriales): Observable<IinventariosMateriales[]> {			

		const url = `${this.url}filtrar/${inventario.fkMateriaPrima}/${inventario.fksucursal}/${inventario.ubicacionA}/${inventario.fechaCrea}/${inventario.unidad}`;

		return this.http.get<IinventariosMateriales[]>(url)
			.pipe(
				tap(result => this.log(`fetched inventario any field`)),
				catchError(this.handleError('viewFromAnyField', []))
			);
	}
	
	registrar(inventario: IinventariosMateriales) {
		return this.http.post<IinventariosMateriales>(this.url + 'insertar', inventario).pipe(
			tap(result => { this.log(`inventario insertada`) }),
			catchError(this.handleError('registrar inventario', []))
		);
	}


	actualizar(inventario: IinventariosMateriales) {
		const url = `${this.url}actualizar/${inventario.idInventario}`;

		return this.http.put(url, inventario).pipe(
			tap(result => {
			}),
			catchError(this.handleError('actualizando inventario', []))
		);
	}

    sumar(inventario: IinventariosMateriales) {
		/*const url = `${this.url}sumar/${inventario.idInventario}${inventario.cantidad}`;

		return this.http.put(url, inventario).pipe(
			tap(result => { console.log(result)
			}),
			catchError(this.handleError('restando inventario', []))
		);*/
		return this.http.post<IinventariosMateriales>(this.url + 'sumar', inventario).pipe(
			tap(result => {console.log(result); this.log(`inventario insertada`) }),
			catchError(this.handleError('registrar inventario', []))
		);
	}

    restar(inventario: IinventariosMateriales) {
		const url = `${this.url}restar/${inventario.fkMateriaPrima}/${inventario.cantidad}/${inventario.unidad}/${inventario.fksucursal}`;

		return this.http.put(url, inventario).pipe(
			tap(result => { console.log(result)
			}),
			catchError(this.handleError('sumando inventario', []))
		);
	}

	eliminar(id: number) {
		const url = `${this.url}eliminar/${id}`;

		return this.http.delete(url).pipe(
			tap(result => {
			}),
			catchError(this.handleError('error eliminando inventario', []))
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