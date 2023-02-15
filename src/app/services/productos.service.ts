import { IProductos, IdetProducto, IdetProductosConMateriales, IDetProductos } from '../models/productos';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class ProductosService {
	private url: string;	
	nuevo: IProductos={};
	constructor(private http: HttpClient) {
		this.url = environment.productosUrl
	}

	consultarTodos(): Observable<IProductos[]> {

		return this.http.get<IProductos[]>(this.url + 'consultar')
			.pipe(
				tap(result => this.log(`fetched productos (${result.length})`)),
				catchError(this.handleError('consultarTodos', []))
			);
	}
    
    viewFromAnyField(id: number, descripcion: string): Observable<IProductos[]> { 
		const url = `${this.url}filtrar/${id}/${descripcion}`;

		return this.http.get<IProductos[]>(url)
			.pipe(
				tap(result => this.log(`fetched productos any field: ${result.length}`)),
				catchError(this.handleError('viewFromAnyField', []))
			);
	}

    productosMateriales(id: number, descripcion: string, idMaterial: number, idSucursal: number): Observable<IdetProductosConMateriales[]> { 
		const url = `${this.url}filtrar/detalles/${id}/${descripcion}/${idMaterial}/${idSucursal}`;

		return this.http.get<IdetProductosConMateriales[]>(url)
			.pipe(
				tap(result => this.log(`fetched productosMateriales: ${result.length}`)),
				catchError(this.handleError('productosMateriales', []))
			);
	}
	
	registrarCabecera(cabecera: IProductos) {
		return this.http.post<IProductos>(this.url + 'insertar', cabecera).pipe(
			tap(result => { this.nuevo=result; this.log(`Producto insertado`) }),
			catchError(this.handleError('registrar producto', []))
		);
	}	

    registrarDetalle(detalle: IDetProductos) {
		return this.http.post<IDetProductos>(this.url + 'insertar/detalles', detalle).pipe(
			tap(result => { this.log(`detalles producto insertada`) }),
			catchError(this.handleError('registrar detalle productos', []))
		);
	}

	actualizarCabecera(cabecera: IProductos) {
		const url = `${this.url}actualizar/${cabecera.idProducto}`;

		return this.http.put(url, cabecera).pipe(
			tap(result => {
			}),
			catchError(this.handleError('actualizando Producto', []))
		);
	}

    actualizarDetalle(detalle: IDetProductos) {
		const url = `${this.url}detalles/actualizar/${detalle.idDetProducto}`;

		return this.http.put(url, detalle).pipe(
			tap(result => {
			}),
			catchError(this.handleError('actualizando detalle producto', []))
		);
	}

	eliminarCabecera(id: number) {
		const url = `${this.url}eliminar/${id}`;

		return this.http.delete(url).pipe(
			tap(result => {
			}),
			catchError(this.handleError('error eliminando producto', []))
		);
	}

    eliminarDetalle(id: number) {
		const url = `${this.url}detalles/eliminar/${id}`;

		return this.http.delete(url).pipe(
			tap(result => {
			}),
			catchError(this.handleError('error eliminando detalle producto', []))
		);
	}

	eliminarDetalleTodo(id: number) {
		const url = `${this.url}detalles/eliminar/todo/${id}`;

		return this.http.delete(url).pipe(
			tap(result => { console.log(result);
			}),
			catchError(this.handleError('error eliminando todos los detalles producto', []))
		);
	}


	private handleError<T>(operation = 'operation', result?: T) {
		return (error: any): Observable<T> => {
			console.error(error);
			return of(result as T);
		};
	}

	private log(message: string) {
		console.log('MaterialesCompradosService: ' + message);
	}

}