import { Component, OnInit } from '@angular/core';
import { Opcion } from '../../interfaces/interfaces';
import { ModalController } from '@ionic/angular';
import { MisGastosPage } from 'src/app/pages/mis-gastos/mis-gastos.page';

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
    redirigirA: '/mis-gastos-page'
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

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {}

}
