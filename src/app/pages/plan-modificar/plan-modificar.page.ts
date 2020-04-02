import { Component, OnInit, Input } from '@angular/core';
import { DatosService } from '../../services/datos.service';
import { UsuarioLocal, AlertaGeneral, Plan } from '../../interfaces/interfaces';
import { AccionesService } from '../../services/acciones.service';
import { Events, NavController, ModalController, Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-plan-modificar',
  templateUrl: './plan-modificar.page.html',
  styleUrls: ['./plan-modificar.page.scss'],
})
export class PlanModificarPage implements OnInit {

  //Variable que se recibe del tab2 para saber que plan se modificara
  @Input() index: string;

  //Variable que gaurdan datos para mostrar en el HTML
  alertas: AlertaGeneral[] = [];
  planes: Plan[] = [{
    nombre: '',
    cantidadTotal: 0,
    tiempoTotal: 0,
    cantidadAcumulada: 0,
    tiempoRestante: 0,
    descripcion: '',
    aportacionMensual: 0,
    pausado: false
  }];

  //Variable auxiliar para que el el modal cargue algo ants de recibir los datos
  indexAux: number = 0;

  //Variable que guarda la informaciond el usuario del ususario
  usuarioCargado: UsuarioLocal = this.datosService.usuarioCarga;

  backButtonSub: Subscription;

  //Constructor con todas las inyecciones y controladores necesarios
  constructor( private nav: NavController,
              public datosService: DatosService,
              private event: Events,
              private accionesService: AccionesService,
              private modalCtrl: ModalController,
              private plt: Platform) { }

  ngOnInit() {
    //Metodo que carga datos de los planes y apuntamos al elegido
    this.datosService.cargarDatosPlan();
    this.event.subscribe('planesCargados', () => {
      this.planes = this.datosService.planesCargados;
      this.indexAux = Number(this.index);
    }
    )
  }

  //Metodo que muestra la inromacion del elemento seleccionado con boton de informacion
  botonInfo(titulo: string) {
    this.alertas.forEach(element => {
      if(titulo == element.titulo) {
        this.accionesService.presentAlertGenerica(element.titulo, element.mensaje);
        return;
      }
    });
  }

  //Metodo para regresar cerrar el modal
  regresar() {
    this.modalCtrl.dismiss();
    this.nav.navigateRoot('/tabs/tab2');
  }

  //Metodo para calcular los datos necesarios para un plan y guardarlo en el storage
  async calcularYModificar() {
    this.planes[this.indexAux].aportacionMensual = (this.planes[this.indexAux].cantidadTotal - this.planes[this.indexAux].cantidadAcumulada) / this.planes[this.indexAux].tiempoTotal;
    this.planes[this.indexAux].tiempoRestante = this.planes[this.indexAux].tiempoTotal;

    if ( await this.validarPlan() ) {
      this.datosService.actualizarPlanes(this.planes);
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

   if ( (this.usuarioCargado.ingresoCantidad - this.planes[this.indexAux].aportacionMensual ) >= margenMax ) {
    await this.accionesService.presentAlertPlan([{text: 'ok', handler: (blah) => {}}], 
                                                'Plan creado', 
    '¡Si te propones gastar menos en tus gastos promedio (luz, agua, etc.) puedes completar tu plan en menos tiempo!');
    return true;
   }
   else if ( ( (this.usuarioCargado.ingresoCantidad - this.planes[this.indexAux].aportacionMensual) < margenMax ) 
                && (( this.usuarioCargado.ingresoCantidad - this.planes[this.indexAux].aportacionMensual) >= margenMin ) ) {
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

  ionViewDidEnter() {
    this.backButtonSub = this.plt.backButton.subscribeWithPriority( 10000, () => {
      this.modalCtrl.dismiss();
      this.nav.navigateRoot('/tabs/tab2');
    });
  }
}
