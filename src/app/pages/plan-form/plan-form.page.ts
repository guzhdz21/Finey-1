import { Component, OnInit } from '@angular/core';
import { Plan, PlanDisplay} from '../../interfaces/interfaces';
import { Storage } from '@ionic/storage';
import { DatosService } from '../../services/datos.service';
import { NavController, ModalController } from '@ionic/angular';
import { AccionesService } from '../../services/acciones.service';
import { UsuarioLocal, Gasto } from '../../interfaces/interfaces';

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

usuarioCargado: UsuarioLocal = this.datosService.usuarioCarga;
decisionCrearPlan: boolean = false;

planNuevoFinal: PlanDisplay;

planes: PlanDisplay[] = [];

  constructor( private datosService: DatosService,
                private nav: NavController,
                private modalCtrl: ModalController,
                private accionesService: AccionesService) { }

  ngOnInit() { }

  calcularYRegistrar() {
    this.planNuevo.aportacionMensual = this.planNuevo.cantidadTotal / this.planNuevo.tiempoTotal;
    this.planNuevo.cantidadAcumulada = 0;
    this.planNuevo.tiempoRestante = this.planNuevo.tiempoTotal;

    if ( this.validarPlan() ) {
      this.datosService.guardarNuevoPlan(this.planNuevo);
      this.modalCtrl.dismiss();
      this.nav.navigateRoot('/tabs/tab1');
    }

  }

  validarPlan() {

    var margenMax = 0;
    var margenMin = 0;

    for( var ii = 0; ii < 17; ii++ ) {
      if( this.usuarioCargado.gastos[ii].cantidad != 0 ){
      margenMax += this.usuarioCargado.gastos[ii].margenMax;
      } 
    }

    for( var ii = 0; ii < 17; ii++ ) {
      if( this.usuarioCargado.gastos[ii].cantidad != 0 ){
      margenMin += this.usuarioCargado.gastos[ii].margenMin;
      } 
    }

    
   if ( (this.planNuevo.aportacionMensual - margenMax) >= 0 ) {
    this.datosService.presentAlert1('ok', 'Plan creado', '¡Si te propones gastar menos en tus gastos promedio (luz, agua, etc.) puedes completar tu plan en menos tiempo!');
    return true;
   }
   else if ( ( (this.planNuevo.aportacionMensual - margenMax) < 0 ) && ((this.planNuevo.aportacionMensual - margenMin) >= 0 ) ) {
    this.datosService.presentAlert2('Crear', 'Modificar', 'Plan que apenas es posible', 'Puedes crear el plan y cumplirlo en el tiempo establecido MIENTRAS te mantengas en GASTOS MINIMOS en los gastos promedio (luz, agua, etc.) o puedes aumentar el tiempo en conseguirlo para que no estes tan presionado');
    return this.decisionCrearPlan;
   }
   else {
    this.datosService.presentAlert1('Modificar', 'No puedes completar este plan en ese tiempo', 'Presiona Modificar y aumenta tu tiempo para ser apto de conseguirlo');
    return false;
   }

  }


}
