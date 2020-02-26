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

  planes: Plan[] = this.datosService.planesCargados;

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
    var unPlan = false;
    if(this.planes[0].cantidadTotal == null) {
      this.planNuevo.aportacionMensual = this.planNuevo.cantidadTotal / this.planNuevo.tiempoTotal;
      unPlan = true;
    }
    this.planNuevo.cantidadAcumulada = 0;
    this.planNuevo.tiempoRestante = this.planNuevo.tiempoTotal;



    if (await this.validarPlan(unPlan)) {
      this.datosService.guardarNuevoPlan(this.planNuevo);
      this.modalCtrl.dismiss();
      this.nav.navigateRoot('/tabs/tab2');
    }
  }

  //Metodo para validar el ingreso del plan
  async validarPlan(unPlan: boolean) {

    var margenMax = 0;
    var margenMin = 0;

    this.usuarioCargado.gastos.forEach(element => {
      if( element.cantidad != 0 ) {
        margenMax += element.margenMax;
        margenMin += element.margenMin;
      } 
    });

    if(unPlan = true) {
      var ahorrar = 0;
      ahorrar = this.usuarioCargado.ingresoCantidad - this.planNuevo.aportacionMensual;
      return this.alertasUnPlan(margenMax, margenMin, ahorrar);
    }
    else if(this.planes.length == 1) {
      this.dosPlanes(margenMax, margenMin);
    }
   
  }

  dosPlanes(margenMax: number, margenMin: number) {
    var ahorrar = 0;
    var mesMayor = 0;
    var planMenor = this.planes[0];

    this.planes.forEach(element => {
      
    });
    ahorrar += planMenor.cantidadTotal;
    mesMayor = planMenor.tiempoTotal;
    if(this.planNuevo.tiempoTotal < planMenor.tiempoRestante) {
      planMenor = this.planNuevo;
    }

    ahorrar += this.planNuevo.cantidadTotal;
    ahorrar /= mesMayor;
    ahorrar = this.usuarioCargado.ingresoCantidad - ahorrar;

    if (  ahorrar  >= margenMax ) {
      planMenor
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

  //Imprimir las alertas segun el caso en un solo plan
  async alertasUnPlan( margenMax: number, margenMin: number, ahorrar: number) {
    if (  ahorrar  >= margenMax ) {
      await this.accionesService.presentAlertPlan([{text: 'ok', handler: (blah) => {}}], 
                                                    'Plan creado', 
      '¡Si te propones gastar menos en tus gastos promedio (luz, agua, etc.) puedes completar tu plan en menos tiempo!');
      return true;
     }
     else if ( ( ahorrar < margenMax ) && (ahorrar >= margenMin ) ) {
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
}
