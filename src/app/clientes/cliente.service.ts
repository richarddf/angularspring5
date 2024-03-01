import { Injectable } from '@angular/core';
import { CLIENTES } from './cliente.json';
import { Cliente } from './cliente';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { DatePipe, formatDate } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private urlEndPoint : string = 'http://localhost:8080/api/clientes';

  private httpHeaders = new HttpHeaders({'Content-type' : 'application/json'});

  constructor(private http: HttpClient, private router : Router) { }

/*   getClientes(): Observable<Cliente[]> {
    //return of(CLIENTES);
    
    // return this.http.get<Cliente[]>(this.urlEndPoint);     
    //la otra forma equivalente sería como la linea de abajo
  
    //return this.http.get(this.urlEndPoint).pipe(
    //  map( response => response as Cliente[])
    //);

    return this.http.get(this.urlEndPoint).pipe(
      tap(response => {
        let clientes = response as Cliente[];
        console.log('ClienteService: tap 1');
        clientes.forEach(cliente => {
          console.log(cliente.nombre);
        });
      }),
      map( response => {

        let clientes = response as Cliente[];

        return clientes.map(cliente => {
          cliente.nombre = cliente.nombre.toUpperCase();

          //cliente.createAt = formatDate(cliente.createAt, 'dd-MM-yyyy', 'en-US'); // Una forma de cambiar el formato de fecha
          let datePipe = new DatePipe('es');
          //cliente.createAt = datePipe.transform(cliente.createAt, 'EEEE dd, MMMM yyyy')?.toString() || cliente.createAt; 
          
          return cliente;
        });
      }),
      tap(response => {
        console.log('ClienteService: tap 2');
        response.forEach(cliente => {
          console.log(cliente.nombre);
        });
      })
    );
  } */

  getClientes(page: number): Observable<any> {
    return this.http.get(this.urlEndPoint +'/page/'+ page).pipe(
      tap( (response: any) => {
        console.log('ClienteService: tap 1');
        (response.content as Cliente[]).forEach(cliente => {
          console.log(cliente.nombre);
        });
      }),
      map( (response: any) => {
        (response.content as Cliente[]).map(cliente => {
          cliente.nombre = cliente.nombre.toUpperCase();

          //cliente.createAt = formatDate(cliente.createAt, 'dd-MM-yyyy', 'en-US'); // Una forma de cambiar el formato de fecha
          let datePipe = new DatePipe('es');
          //cliente.createAt = datePipe.transform(cliente.createAt, 'EEEE dd, MMMM yyyy')?.toString() || cliente.createAt; 
          
          return cliente;
        });
        return response;
      }),
      tap(response => {
        console.log('ClienteService: tap 2');
        (response.content as Cliente[]).forEach(cliente => {
          console.log(cliente.nombre);
        });
      })
    );
  }

  // create (cliente: Cliente): Observable<Cliente>{
  //   return this.http.post<Cliente>(this.urlEndPoint, cliente, {headers: this.httpHeaders}).pipe(
  //     catchError(e => {
  //       console.log(e.error.mensaje);
  //       //Swal.fire('Error al crear al cliente', e.error.mensaje, 'error');
  //       Swal.fire(e.error.mensaje, e.error.error, 'error');
  //       return throwError(() => e);
  //     })
  //   );
  // }

  create (cliente: Cliente): Observable<any>{
    return this.http.post<any>(this.urlEndPoint, cliente, {headers: this.httpHeaders}).pipe(
      catchError(e => {

        if(e.status==400){
          return throwError(() => e);
        }

        console.log(e.error.mensaje);
        //Swal.fire('Error al crear al cliente', e.error.mensaje, 'error');
        Swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(() => e);
      })
    );
  }

  getCliente (id : number): Observable<Cliente>{
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        this.router.navigate(['/clientes']);
        console.log(e.error.mensaje);
        Swal.fire('Error al editar', e.error.mensaje, 'error');
        return throwError(() => e);
      })
    );
  }

  update (cliente: Cliente): Observable<any>{
    return this.http.put<any>(`${this.urlEndPoint}/${cliente.id}`, cliente, {headers : this.httpHeaders}).pipe(
      catchError(e => {

        if(e.status==400){
          return throwError(() => e);
        }
        
        console.log(e.error.mensaje);
        //Swal.fire('Error al editar al cliente', e.error.mensaje, 'error');
        Swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(() => e);
      })
    );
  }

  delete (id : number) : Observable<Cliente> {
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`, {headers : this.httpHeaders}).pipe(
      catchError(e => {
        console.log(e.error.mensaje);
        //Swal.fire('Error al eliminar al cliente', e.error.mensaje, 'error');
        Swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(() => e);
      })
    );
  }

  subirFoto (archivo : File, id : any) : Observable<Cliente>{
    
    let formData = new FormData();
    formData.append("archivo", archivo);
    formData.append("id", id);

    return this.http.post(`${this.urlEndPoint}/upload`, formData).pipe(
      map( (response:any) => response.cliente as Cliente),
      catchError(e => {
        console.log(e.error.mensaje);
        Swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(() => e);
      })
      );
  }
}
