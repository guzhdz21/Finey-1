import { Component, OnInit } from '@angular/core';
import { DatosService } from '../../services/datos.service';
import { Plan } from '../../interfaces/interfaces';
import { Events, NavController } from '@ionic/angular';
import { AccionesService } from '../../services/acciones.service';

@Component({
  selector: 'app-planes-terminados',
  templateUrl: './planes-terminados.page.html',
  styleUrls: ['./planes-terminados.page.scss'],
})
export class PlanesTerminadosPage implements OnInit {

  constructor(private datosService: DatosService,
              private event: Events,
              private nav: NavController,
              private accionesService: AccionesService) { }

  planes: Plan[] = [];

  ngOnInit() {
    this.datosService.cargarPlanesTerminados();
    this.planes = this.datosService.planesTerminados;
    this.event.subscribe('planesTerminados', () => {
      this.planes = this.datosService.planesTerminados;
    });
  }

  async ionViewDidEnter() {

    await this.datosService.cargarBloqueoModulos();
    if(this.datosService.bloquearModulos == true){
      this.nav.navigateRoot('/tabs/tab3');
      this.accionesService.presentAlertGenerica("No puedes ingresar a dicho modulo", "No se te permite el acceso a este modulo debido a que tus gastos son mayores que tus ingresos, cuando te repongas cambia tus gastos e ingresos en la seccion 'Mis gastos'");
    }
  }

}
