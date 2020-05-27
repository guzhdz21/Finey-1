import { Component, OnInit } from '@angular/core';
import { DatosService } from '../../services/datos.service';
import { Plan } from '../../interfaces/interfaces';
import { Events } from '@ionic/angular';

@Component({
  selector: 'app-planes-terminados',
  templateUrl: './planes-terminados.page.html',
  styleUrls: ['./planes-terminados.page.scss'],
})
export class PlanesTerminadosPage implements OnInit {

  constructor(private datosService: DatosService,
              private event: Events) { }

  planes: Plan[] = [];

  ngOnInit() {
    this.datosService.cargarPlanesTerminados();
    this.planes = this.datosService.planesTerminados;
    this.event.subscribe('planesTerminados', () => {
      this.planes = this.datosService.planesTerminados;
    });
  }

}
