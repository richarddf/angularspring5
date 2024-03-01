import { Component } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent {
  public cliente : Cliente = new Cliente();
  public titulo : string = "Crear Cliente";
  public errores : string[] = [];

  constructor(private clienteService : ClienteService, private router : Router, private activateRoute : ActivatedRoute){}

  ngOnInit(){
    this.cargarCliente();
  }

  cargarCliente(): void {
    this.activateRoute.params.subscribe(params =>{
      let id = params['id']
      if (id){
        this.clienteService.getCliente(id).subscribe((cliente)=> this.cliente = cliente)
      }
    })
  }

  // create() : void {
  //   /* console.log("clicked!");
  //   console.log(this.cliente); */
  //   this.clienteService.create(this.cliente)
  //     .subscribe(cliente => {
  //       this.router.navigate(['/clientes']);
  //       Swal.fire('Nuevo Cliente',`Cliente ${cliente.nombre} creado con éxito!`,'success')
  //     }
  //   );
  // }

  create() : void {
    /* console.log("clicked!");
    console.log(this.cliente); */
    this.clienteService.create(this.cliente)
      .subscribe({
        next: (json) => {
        this.router.navigate(['/clientes']);
        //Swal.fire('Nuevo Cliente',`Cliente ${json.cliente.nombre} creado con éxito!`,'success')
        Swal.fire('Nuevo Cliente', `${json.mensaje}: ${json.cliente.nombre}`,'success')
      },
        error: (err) => {
        this.errores = err.error.errors as string[];
        console.error('Código de error desde el backend ' + err.status);
        console.error(err.error.errors);
      }
    });
  }
    
  // update() : void {
  //   this.clienteService.update(this.cliente)
  //     .subscribe(cliente => {
  //       this.router.navigate(['/clientes']);
  //       Swal.fire('Cliente Actualizado',`Cliente ${cliente.nombre} actualizado con éxito`,'success')
  //     }

  //     )
  // }

  update() : void {
    this.clienteService.update(this.cliente)
      .subscribe({
        next: (json) => {
        this.router.navigate(['/clientes']);
        Swal.fire('Cliente Actualizado',`${json.mensaje}: ${json.cliente.nombre}`,'success')
      },
        error: (err) => {
        this.errores = err.error.errors as string[];
        console.error('Código de error desde el backend ' + err.status);
        console.error(err.error.errors);
      }
     });
  }  
}
