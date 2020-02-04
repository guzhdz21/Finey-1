import { Component, OnInit, Input } from '@angular/core';
import { Opcion } from '../../interfaces/interfaces';
import { DatosService } from '../../services/datos.service';
import { UsuarioLocal, Gasto ,Rubro } from '../../interfaces/interfaces';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

  @Input() nombre: string;
  @Input() sexo: string;

  usuarioMenu: UsuarioLocal = this.datosService.usuarioCarga;

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

  constructor(public datosService: DatosService) { }

  ngOnInit() {
    this.datosService.cargarDatos();
  }
}
