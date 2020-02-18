import { Component, OnInit, Input } from '@angular/core';
import { DatosService } from '../../services/datos.service';
import { UsuarioLocal, Gasto, Rubro, AlertaGeneral, Plan } from '../../interfaces/interfaces';
import { AccionesService } from '../../services/acciones.service';
import { Events, NavController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-plan-modificar',
  templateUrl: './plan-modificar.page.html',
  styleUrls: ['./plan-modificar.page.scss'],
})
export class PlanModificarPage implements OnInit {

  @Input() index: string;

  alertas: AlertaGeneral[] = [];

  planes: Plan[] = [{
    nombre: '',
    cantidadTotal: 0,
    tiempoTotal: 0,
    cantidadAcumulada: 0,
    tiempoRestante: 0,
    descripcion: '',
    aportacionMensual: 0
  }];

  indexAux: number = 0;

  usuarioCargado: UsuarioLocal = this.datosService.usuarioCarga;

  constructor( private nav: NavController,
              public datosService: DatosService,
              private event: Events,
              private accionesService: AccionesService,
              private modalCtrl: ModalController) { }

  ngOnInit() {
    this.datosService.cargarDatosPlan();
    this.event.subscribe('planesCargados', () => {
      this.planes = this.datosService.planesCargados;
      this.indexAux = Number(this.index);
    }
    )
  }

  botonInfo(titulo: string) {
    this.alertas.forEach(element => {
      if(titulo == element.titulo)
      {
        this.accionesService.presentAlertGenerica(element.titulo, element.mensaje);
        return;
      }
    });
  }

  regresar() {
    this.modalCtrl.dismiss();
    this.nav.navigateRoot('/tabs/tab2');
  }

  async calcularYModificar() {
    this.planes[this.indexAux].aportacionMensual = this.planes[this.indexAux].cantidadTotal / this.planes[this.indexAux].tiempoTotal;
    this.planes[this.indexAux].cantidadAcumulada = 0;
    this.planes[this.indexAux].tiempoRestante = this.planes[this.indexAux].tiempoTotal;

    if ( await this.validarPlan() ) {
      this.datosService.actualizarPlanes(this.planes);
      this.modalCtrl.dismiss();
      this.nav.navigateRoot('/tabs/tab2');
    }
  }


  async validarPlan() {

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

   if ( (this.usuarioCargado.ingresoCantidad - this.planes[this.indexAux].aportacionMensual ) >= margenMax ) {
    await this.accionesService.presentAlertPlan([{text: 'ok', handler: (blah) => {}}], 
    'Plan creado', 
    '¡Si te propones gastar menos en tus gastos promedio (luz, agua, etc.) puedes completar tu plan en menos tiempo!');
    return true;
   }
   else if ( ( (this.usuarioCargado.ingresoCantidad - this.planes[this.indexAux].aportacionMensual) < margenMax ) 
                && (( this.usuarioCargado.ingresoCantidad - this.planes[this.indexAux].aportacionMensual) >= margenMin ) ) {
    await this.accionesService.presentAlertPlan([{text: 'Crear', handler: (blah) => {this.accionesService.alertaPlanCrear = true}},
    {text: 'Modificar', handler: (blah) => {this.accionesService.alertaPlanCrear = false}}], 'Plan que apenas es posible', 
    'Puedes crear el plan y cumplirlo en el tiempo establecido MIENTRAS te mantengas en GASTOS MINIMOS en los gastos promedio (luz, agua, etc.) o puedes aumentar el tiempo en conseguirlo para que no estes tan presionado');
    return this.accionesService.alertaPlanCrear;
   }
   else {
    await this.accionesService.presentAlertPlan([{text: 'Modificar', handler: (blah) => {}}], 'No puedes completar este plan en ese tiempo', 'Presiona Modificar y aumenta tu tiempo para ser apto de conseguirlo');
    return false;
   }
  }

}
