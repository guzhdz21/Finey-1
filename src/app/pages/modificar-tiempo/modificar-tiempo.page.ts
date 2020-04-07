import { Component, OnInit, Input } from '@angular/core';
import { Plan } from '../../interfaces/interfaces';
import { ModalController, NavController } from '@ionic/angular';
import { DatosService } from '../../services/datos.service';
import { AccionesService } from '../../services/acciones.service';

@Component({
  selector: 'app-modificar-tiempo',
  templateUrl: './modificar-tiempo.page.html',
  styleUrls: ['./modificar-tiempo.page.scss'],
})
export class ModificarTiempoPage implements OnInit {

  @Input() planesAux;

  planes: Plan[] = this.datosService.planesCargados;

  planMenor: Plan;

  planMayor: Plan;

  constructor(
              private modalCtrl: ModalController,
              private nav: NavController,
              private datosService: DatosService,
              private accionesService: AccionesService) { }

  async ngOnInit() {
    await this.datosService.cargarDatosPlan();
    this.planes = this.datosService.planesCargados;
  }

  cambiarTiempo(i: number) {
    this.accionesService.presentAlertTiempo([{text: 'Ok',handler: (bla) => { 
      if(bla.tiempo.toString().includes('.')) {
          bla.tiempo = this.planes[i].tiempoRestante;
          this.datosService.presentToast('No se pueden insertar meses con punto decimal');
        } else {
          this.planes[i].tiempoRestante = bla.tiempo;
        }
      }
    }, {text: 'Cancelar',handler: (bla) => {}}], this.planes[i].tiempoRestante);
  }

  async guardar() {
    var margenMax = 0;
    var margenMin = 0;
    this.datosService.usuarioCarga.gastos.forEach(element => {
      if( element.cantidad != 0 ) {
        margenMax += element.margenMax;
        margenMin += element.margenMin;
      } 
    });

    if(await this.calculosDosPlanes(margenMax, margenMin)) {
      if(await this.ocho(margenMax, margenMin)) {
        return;
      }
      this.guardarCambios();
      return;
    } else {
      await this.accionesService.presentAlertPlan([{text: 'Modificar', handler: (blah) => {}}], 
      'No puedes completar los planes en ese tiempo', 'Presiona Modificar y aumenta los tiempos para ser apto de conseguirlos');
      return;
    }
  }

  async guardarCambios() {
    await this.accionesService.presentAlertPlan([{text: 'Ok', handler: (blah) => {}}], 
      'Planes Modificados', '¡Si te propones gastar menos en tus gastos promedio (luz, agua, etc.) puedes completar tus planes en menos tiempo!');
    this.datosService.actualizarPlanes(this.planes);
    this.modalCtrl.dismiss();
    this.nav.navigateRoot('/tabs/tab2');
  }

  async calculosDosPlanes(margenMax: number, margenMin: number) {
    //Variables iniciales
    var ahorrar = 0;
    this.planMenor = this.planes[0];
     this.planMayor = this.planes[1];
    var gasto = 0;

    //Se determina cuanto debe ahorrar el ususario al mes
    if(this.planMayor.tiempoRestante < this.planMenor.tiempoRestante) {
      var aux = this.planMenor;
      this.planMenor = this.planMayor;
      this.planMayor = aux;
    }
    ahorrar += (this.planMenor.cantidadTotal - this.planMenor.cantidadAcumulada) + (this.planMayor.cantidadTotal - this.planMayor.cantidadAcumulada);
    ahorrar /= this.planMayor.tiempoRestante;
    gasto = this.datosService.usuarioCarga.ingresoCantidad - ahorrar;

    this.planMenor.aportacionMensual = (this.planMenor.cantidadTotal - this.planMenor.cantidadAcumulada)/this.planMenor.tiempoRestante;
    //Verificamos el caso de los planes
    //Caso en que quitando lo que debe ahorrar al mes el usuario, puede satisfacer sus necesidades basicas en los dos margenes
    return await this.validarDosplanes(ahorrar, gasto, margenMax, margenMin)
  }

  async validarDosplanes(ahorrar: number, gasto: number, margenMax: number, margenMin: number){
    if (gasto  >= margenMax) {
      //Verificar si el plan menor es prioritario
      if(this.planMenor.aportacionMensual >= ahorrar) {

        //Determinar si el ussuario desea pausar un plan 
       return await this.opcionesPrioridad(margenMax, margenMin, gasto);
        //Un plan es aceptado y se le notifica al usuario
      } else {
        this.planMayor.aportacionMensual = ahorrar - this.planMenor.aportacionMensual;
        return true;
      }
           
      //Caso en que quitando lo que debe ahorrar al mes el usuario, solo puede satisfacer sus necesidades basicas en margen minimo
    } else if ( ( gasto < margenMax ) && (gasto >= margenMin ) ) {
      
      //Veridficar si el plan menor es prioritario
      if(this.planMenor.aportacionMensual >= ahorrar) {

        //Determinar que desea hacer el ususario con el plan prioritario
       return await this.opcionesPrioridad(margenMax, margenMin, gasto);

        //Plan es valido y se le da opcion al ussuario si desea modificarlo o crearlo 
      } else {
        this.planMayor.aportacionMensual = ahorrar - this.planMenor.aportacionMensual;
        await this.accionesService.presentAlertPlan([{text: 'Adelante', handler: (blah) => {this.accionesService.alertaPlanCrear = true}},
                                                  {text: 'Modificar', handler: (blah) => {this.accionesService.alertaPlanCrear = false}}], 
                                                  'Planes que apnes son posibles', 
        'Puedes dejarlos asi (Adelabte) y cumplirlos en el tiempo establecido MIENTRAS te mantengas en GASTOS MINIMOS en los gastos promedio' +
        ' (luz, agua, etc.) o puedes aumentar el tiempo (Modificar) en conseguirlos para que no estes tan presionado');
        return this.accionesService.alertaPlanCrear;
      }
      //Caso en que el sueldo del ususario no puede obtener el plan ese plan
    } else {
      return false;
     }
  }

  async opcionesPrioridad(margenMax: number, margenMin: number, gasto: number) {
      if(await this.intentarPrioritario(margenMax, margenMin, gasto)) {
        return true;
      } else {
        return false;
      }
  }

  async intentarPrioritario(margenMax: number, margenMin: number, gasto: number) {
      this.planMenor.aportacionMensual = (this.planMenor.cantidadTotal - this.planMenor.cantidadAcumulada)/this.planMenor.tiempoRestante;
      this.planMayor.aportacionMensual = (this.planMayor.cantidadTotal - this.planMayor.cantidadAcumulada)/this.planMayor.tiempoRestante;
      var ahorrar = this.planMenor.aportacionMensual + this.planMayor.aportacionMensual;
      var gasto = this.datosService.usuarioCarga.ingresoCantidad - ahorrar;
      return await this.validarGasto(margenMax,margenMin, gasto )
  }
  
  validarGasto(margenMax: number, margenMin: number, gasto: number) {
    if (  gasto  >= margenMax ) {
      return true;
    } else if ( ( gasto < margenMax ) && (gasto >= margenMin ) ) {
      return true;
    } else {
      return false;
    }
  }

  async ocho(margenMax: number, margenMin: number) {
    var ochoPorciento = this.obtenerOchoPorciento(margenMax);
    var aux = false;
    await this.planes.forEach(element => {
      if(element.aportacionMensual <= ochoPorciento) {
          aux = true;
      }
    });
    if(aux) {
      if(this.planMenor.aportacionMensual >= this.datosService.usuarioCarga.ingresoCantidad - margenMin - ochoPorciento) {
        await this.accionesService.presentAlertPlan([{text: 'Modificar', handler: (blah) => {}}], 
        'Plan demasiado pequeño', 'Se ha detectado que alguno(s) planes recibiran poco dinero, ' + 
        'te pedimos que aumentes el tiempo del plan con menor tiempo ya que se detecto que se lleva todo tu fondo de ahorro');
      } else {
        await this.accionesService.presentAlertPlan([{text: 'Modificar', handler: (blah) => {}}], 
          'Plan demasiado pequeño', 'Se ha detectado que alguno(s) planes recibiran poco dinero, ' + 
          'te pedimos que aumentes el tiempo de los planes que puedas');
      }
    }
    return aux;
  }

  obtenerOchoPorciento(margenMax: number) {
    return (this.datosService.usuarioCarga.ingresoCantidad - margenMax)*0.08;
  }

  async cancelar() {
    var cancelar;
    await this.accionesService.presentAlertPlan([{text: 'Si', handler: (blah) => {cancelar = true}},
                                                  {text: 'No', handler: (blah) => {cancelar = false}}], 
                                                  '¿Seguro que quieres volver?', 
      'Si cancelas se borrara el nuevo plan que ingresaste');
    
    if(cancelar) {
      this.datosService.actualizarPlanes(this.planesAux);
      await this.modalCtrl.dismiss();
      this.nav.navigateRoot('tabs/tab2');
    }
  }
}
