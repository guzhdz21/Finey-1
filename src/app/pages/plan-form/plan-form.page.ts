import { Component, OnInit } from '@angular/core';
import { Plan, PlanDisplay} from '../../interfaces/interfaces';
import { Storage } from '@ionic/storage';
import { DatosService } from '../../services/datos.service';
import { NavController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-plan-form',
  templateUrl: './plan-form.page.html',
  styleUrls: ['./plan-form.page.scss'],
})
export class PlanFormPage implements OnInit {

planNuevo: Plan = {
  nombre: '',
  cantidadTotal: null,
  tiempoTotal: null,
  cantidadAcumulada: null,
  tiempoRestante: null,
  descripcion: '',
  aportacionMensual: null,
};

planNuevoFinal: PlanDisplay;

planes: PlanDisplay[] = [];

  constructor( private datosService: DatosService,
                private nav: NavController,
                private modalCtrl: ModalController) { }

  ngOnInit() { }

  calcularYRegistrar() {
    this.planNuevo.aportacionMensual = this.planNuevo.cantidadTotal / this.planNuevo.tiempoTotal;
    this.planNuevo.cantidadAcumulada = 0;
    this.planNuevo.tiempoRestante = this.planNuevo.tiempoTotal;
    this.datosService.guardarNuevoPlan(this.planNuevo);
    this.modalCtrl.dismiss();
    this.nav.navigateRoot('/tabs/tab1');
  }
}
