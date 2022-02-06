import { IUsuarios } from '../models/usuarios';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class UsuariosService {
	private url: string;	
	
	constructor(private http: HttpClient) {
		this.url = environment.usuariosUrl;
	}

	consultarTodos(): Observable<IUsuarios[]> {

		return this.http.get<IUsuarios[]>(this.url + 'consultar')
			.pipe(
				tap(result => this.log(`fetched Usuarios`)),
				catchError(this.handleError('consultarTodos', []))
			);
	}
    
    signIn(_login: string, _passw: string) {

		return this.http.post<IUsuarios>(this.url + 'sigin', {login: _login, passw: _passw}).pipe(
			tap(result => { this.log(`sigIn`) }),
			catchError(this.handleError('error en sigIn', []))
		);
	}	
	
	signUp(user: IUsuarios) {
		return this.http.post<IUsuarios>(this.url + 'signup', user).pipe(
			tap(result => { this.log(`usuario registrado`) }),
			catchError(this.handleError('registrando usuario', []))
		);
	}

	/*actualizar(user: IUsuarios) {
		const url = `${this.url}actualizar/${user.login}`;

		return this.http.put(url, user).pipe(
			tap(result => {
			}),
			catchError(this.handleError('actualizando usuario', []))
		);
	}*/

	/*eliminar(login: string) {
		const url = `${this.url}eliminar/${login}`;

		return this.http.delete(url).pipe(
			tap(result => {
			}),
			catchError(this.handleError('error eliminando usuario', []))
		);
	}*/


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