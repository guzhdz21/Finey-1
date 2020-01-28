import { Component, OnInit } from '@angular/core';
import { Opcion } from '../../interfaces/interfaces';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

opciones: Opcion[] = [
  {
    icono: 'cash',
    nombre: 'Mis Gastos',
    redirigirA: ''
  },
  {
    icono: 'calendar',
    nombre: 'Calendario',
    redirigirA: ''
  },
  {
    icono: 'settings',
    nombre: 'Ajustes',
    redirigirA: ''
  }
];

  constructor() { }

  ngOnInit() {}

}
