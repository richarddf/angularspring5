import { Component } from '@angular/core';
import { Cliente } from '../cliente';
import { ClienteService } from '../cliente.service';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'detalle-cliente',
  standalone: true,
  imports: [],
  templateUrl: './detalle.component.html',
  styleUrl: './detalle.component.css'
})
export class DetalleComponent {
  cliente : Cliente = new Cliente;
  titulo : String = "Detalle del cliente";
  private fotoSeleccionada : File = new File([], 'dummy'); // Manera de inicializar una variable de tipo de dato File

  constructor(private clienteService : ClienteService, private activatedRoute : ActivatedRoute){}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.activatedRoute.paramMap.subscribe( params =>{
      let id : number = +params.get('id')! | 0;

      if(id){
        this.clienteService.getCliente(id).subscribe(cliente => {
          this.cliente = cliente;
        });
      }
    });
  }

  seleccionarFoto(event : any){
    this.fotoSeleccionada = event.target.files[0];
    console.log(this.fotoSeleccionada);
  }

  subirFoto(){
    this.clienteService.subirFoto(this.fotoSeleccionada, this.cliente.id)
      .subscribe(cliente => {
        this.cliente = cliente;
        Swal.fire('La foto se ha subido completamente!',`la foto se ha subido con éxito: ${this.cliente.foto}`,'success')
      });
  }
}
