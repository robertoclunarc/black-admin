import { IMaterialesComprados,IdetallesCompras,IdetallesComprasConMateriales, IfitroCompras, IDetallesCompra } from '../models/materiales_compras';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class MaterialesCompradosService {
	private url: string;	
	
	constructor(private http: HttpClient) {
		this.url = environment.compraMaterialesUrl;
	}

	consultarTodos(): Observable<IMaterialesComprados[]> {

		return this.http.get<IMaterialesComprados[]>(this.url + 'consultar')
			.pipe(
				tap(result => this.log(`fetched Compras`)),
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

	viewFromAnyField(filtro: IfitroCompras): Observable<IdetallesComprasConMateriales[]> { 
		//Id/:idmaterial/:descripcion/:idSucursal/:idProveedor/:fechaIni/:fechaFin', SelectRecordFilter);

		const url = `${this.url}filtrar/${filtro.idCompra}/${filtro.fkMaterial}/${filtro.descripcionMaterial}/${filtro.idSucursal}/${filtro.idProveedor}/${filtro.fechaIni}/${filtro.fechaFin}`;

		return this.http.get<IdetallesComprasConMateriales[]>(url)
			.pipe(
				tap(result => this.log(`fetched compramateriales any field: ${result.length}`)),
				catchError(this.handleError('viewFromAnyField', []))
			);
	}
	
	registrarCabecera(cabecera: IMaterialesComprados) {
		return this.http.post<IMaterialesComprados>(this.url + 'insertar', cabecera).pipe(
			tap(result => { this.log(`compra insertada`) }),
			catchError(this.handleError('registrar compra', []))
		);
	}

    registrarDetalle(detalle: IDetallesCompra) {
		return this.http.post<IMaterialesComprados>(this.url + 'detalles/insertar', detalle).pipe(
			tap(result => { this.log(`detalle compra insertada`) }),
			catchError(this.handleError('registrar detalle compra', []))
		);
	}

	actualizarCabecera(cabecera: IMaterialesComprados) {
		const url = `${this.url}actualizar/${cabecera.idCompra}`;

		return this.http.put(url, cabecera).pipe(
			tap(result => {
			}),
			catchError(this.handleError('actualizando compra', []))
		);
	}

    actualizarDetalle(detalle: IDetallesCompra) {
		const url = `${this.url}detalles/actualizar/${detalle.idDetCompra}`;

		return this.http.put(url, detalle).pipe(
			tap(result => {
			}),
			catchError(this.handleError('actualizando detalle compra', []))
		);
	}

	eliminarCabecera(id: number) {
		const url = `${this.url}eliminar/${id}`;

		return this.http.delete(url).pipe(
			tap(result => {
			}),
			catchError(this.handleError('error eliminando compra', []))
		);
	}

    eliminarDetalle(id: number) {
		const url = `${this.url}detalles/eliminar/${id}`;

		return this.http.delete(url).pipe(
			tap(result => {
			}),
			catchError(this.handleError('error eliminando detalle compra', []))
		);
	}

	eliminarDetalleTodo(id: number) {
		const url = `${this.url}detalles/eliminar/todo/${id}`;

		return this.http.delete(url).pipe(
			tap(result => { console.log(result);
			}),
			catchError(this.handleError('error eliminando todos los detalles compra', []))
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