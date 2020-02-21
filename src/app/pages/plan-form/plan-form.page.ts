import { Component, OnInit, Input } from '@angular/core';
import { Plan, AlertaGeneral } from '../../interfaces/interfaces';
import { DatosService } from '../../services/datos.service';
import { NavController, ModalController } from '@ionic/angular';
import { AccionesService } from '../../services/acciones.service';
import { UsuarioLocal } from '../../interfaces/interfaces';

@Component({
  selector: 'app-plan-form',
  templateUrl: './plan-form.page.html',
  styleUrls: ['./plan-form.page.scss'],
})
export class PlanFormPage implements OnInit {

  //Variable que viene del Modal registro y del tab2 y nos indica si es la primera vez que abre la app
  @Input() registro: string;

  //Variable para guardar los datos del nuevo plan
  planNuevo: Plan = {
    nombre: '',
    cantidadTotal: null,
    tiempoTotal: null,
    cantidadAcumulada: null,
    tiempoRestante: null,
    descripcion: '',
    aportacionMensual: null,
  };

  //Variable para guardar la infromacion de las alertas
  alertas: AlertaGeneral[] = [];

  //Variable que guarda la informacion del usuario
  usuarioCargado: UsuarioLocal = this.datosService.usuarioCarga;

  constructor( private datosService: DatosService,
                private nav: NavController,
                private modalCtrl: ModalController,
                private accionesService: AccionesService) { }

  ngOnInit() {
    //Metodo que obtiene la informacion de las alertas de un archivo
    this.datosService.getAlertasJson().subscribe(val => {
      this.alertas = val;
    });
   }

   //Metodo que calcula los datos para agregar un plan nuevo y lo guarda en el Storage
  async calcularYRegistrar() {
    this.planNuevo.aportacionMensual = this.planNuevo.cantidadTotal / this.planNuevo.tiempoTotal;
    this.planNuevo.cantidadAcumulada = 0;
    this.planNuevo.tiempoRestante = this.planNuevo.tiempoTotal;

    if ( await this.validarPlan() ) {
      this.datosService.guardarNuevoPlan(this.planNuevo);
      this.modalCtrl.dismiss();
      this.nav.navigateRoot('/tabs/tab2');
    }
  }

  //Metodo para validar el ingreso del plan
  async validarPlan() {

    var margenMax = 0;
    var margenMin = 0;

    for( var i = 0; i < 17; i++ ) {
      if( this.usuarioCargado.gastos[i].cantidad != 0 ) {
        margenMax += this.usuarioCargado.gastos[i].margenMax;
      } 
    }

    for( var i = 0; i < 17; i++ ) {
      if( this.usuarioCargado.gastos[i].cantidad != 0 ) {
        margenMin += this.usuarioCargado.gastos[i].margenMin;
      } 
    }

    //Considionals para saber que alaerta mostrar segun los datos ingresados
   if ( (this.usuarioCargado.ingresoCantidad - this.planNuevo.aportacionMensual ) >= margenMax ) {
    await this.accionesService.presentAlertPlan([{text: 'ok', handler: (blah) => {}}], 
                                                  'Plan creado', 
    '¡Si te propones gastar menos en tus gastos promedio (luz, agua, etc.) puedes completar tu plan en menos tiempo!');
    return true;
   }
   else if ( ( (this.usuarioCargado.ingresoCantidad - this.planNuevo.aportacionMensual) < margenMax ) 
                && (( this.usuarioCargado.ingresoCantidad - this.planNuevo.aportacionMensual) >= margenMin ) ) {
    await this.accionesService.presentAlertPlan([{text: 'Crear', handler: (blah) => {this.accionesService.alertaPlanCrear = true}},
                                                {text: 'Modificar', handler: (blah) => {this.accionesService.alertaPlanCrear = false}}], 
                                                'Plan que apenas es posible', 
    'Puedes crear el plan y cumplirlo en el tiempo establecido MIENTRAS te mantengas en GASTOS MINIMOS en los gastos promedio (luz, agua, etc.) o puedes aumentar el tiempo en conseguirlo para que no estes tan presionado');
    return this.accionesService.alertaPlanCrear;
   }
   else {
    await this.accionesService.presentAlertPlan([{text: 'Modificar', handler: (blah) => {}}], 
    'No puedes completar este plan en ese tiempo', 'Presiona Modificar y aumenta tu tiempo para ser apto de conseguirlo');
    return false;
   }
  }

  //Metodo que omite el ingreso del primer plan al hacer el registro
  omitir() {
    this.modalCtrl.dismiss();
    this.nav.navigateRoot('/tabs/tab1');
  }

  //Metodo que muestra la informacion del elemento seleecionado por el boton de informacion
  botonInfo(titulo: string) {
    this.alertas.forEach(element => {
      if(titulo == element.titulo) {
        this.accionesService.presentAlertGenerica(element.titulo, element.mensaje);
        return;
      }
    });
  }
}
