import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'Bienvenido a Angular';
  curso: string = 'Curso de Spring 5 y Angular 18';
  profesor: string = 'Andrés Guzmán';
  
}
