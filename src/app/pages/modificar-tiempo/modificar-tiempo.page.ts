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

  @Input() planesOriginales: Plan[];
  @Input() planesPausados: Plan[];

  planes: Plan[] = this.datosService.planesCargados;

  planMenor: Plan;

  planMayor: Plan;

  planesPrioritarios: Plan[] = [];
  
  planesaux: Plan[] = [];

  diferenciaFondo: number = this.datosService.diferencia;

  multiplan: boolean;

  gastosUsuario: number;

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
          var diferencia =  bla.tiempo - this.planes[i].tiempoRestante;
          this.planes[i].tiempoRestante = bla.tiempo;
          this.planes[i].tiempoTotal += diferencia;
        }
      }
    }, {text: 'Cancelar',handler: (bla) => {}}], this.planes[i].tiempoRestante);
  }

  async guardar() {
    this.planesPrioritarios = [];
    var margenMax = 0;
    var margenMin = 0;
    this.gastosUsuario = 0;
    this.datosService.usuarioCarga.gastos.forEach(element => {
      if( element.cantidad != 0 ) {
        margenMax += element.margenMax;
        margenMin += element.margenMin;
        this.gastosUsuario += element.cantidad;
      } 
    });
    if(this.planes.length == 2) {
      this.multiplan = false;
      if(await this.calculosDosPlanes(margenMax, margenMin)) {
        this.guardarCambios();
        return;
      } else {
        this.planes.forEach(element => {
          this.planesPrioritarios.push(element);
        });
        this.planes = this.planesPrioritarios;
        this.planesPrioritarios = [];
        await this.accionesService.presentAlertPlan([{text: 'Modificar', handler: (blah) => {}}], 
        'No puedes completar los planes en ese tiempo', 'Presiona Modificar y aumenta los tiempos para ser apto de conseguirlos');
        return;
      }
    }
    this.multiplan = true;
    if(await this.calculosMasDosPlanes(margenMax, margenMin)) {

      this.guardarCambios();
      return;
    } else {
      this.planes.forEach(element => {
        this.planesPrioritarios.push(element);
      });
      this.planes = this.planesPrioritarios;
      this.planesPrioritarios = [];
      await this.accionesService.presentAlertPlan([{text: 'Modificar', handler: (blah) => {}}], 
      'No puedes completar los planes en ese tiempo', 'Presiona Modificar y aumenta los tiempos para ser apto de conseguirlos');
      return;
    }
  }

  async guardarCambios() {
    await this.accionesService.presentAlertPlan([{text: 'Ok', handler: (blah) => {}}], 
      'Planes Modificados', '¡Si te propones gastar menos en tus gastos promedio (luz, agua, etc.) puedes completar tus planes en menos tiempo!');
    this.planesPausados.forEach(element => {
      this.planes.push(element);
    });
    await this.datosService.actualizarPlanes(this.planes);
    this.actualizarUsuario();
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
    gasto = this.datosService.usuarioCarga.ingresoCantidad - ahorrar - this.diferenciaFondo;

    this.planMenor.aportacionMensual = (this.planMenor.cantidadTotal - this.planMenor.cantidadAcumulada)/this.planMenor.tiempoRestante;
    //Verificamos el caso de los planes
    //Caso en que quitando lo que debe ahorrar al mes el usuario, puede satisfacer sus necesidades basicas en los dos margenes
    return await this.validarDosplanes(ahorrar, gasto, margenMax, margenMin)
  }

  async validarDosplanes(ahorrar: number, gasto: number, margenMax: number, margenMin: number){
    if (gasto  >= margenMax || gasto  >= this.gastosUsuario) {
      //Verificar si el plan menor es prioritario
      if(this.planMenor.aportacionMensual >= ahorrar) {

        //Determinar si el ussuario desea pausar un plan 
       return await this.opcionesPrioridad(margenMax, margenMin);
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
       return await this.opcionesPrioridad(margenMax, margenMin);

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

  async calculosMasDosPlanes(margenMax: number, margenMin: number) {
    var ahorrar = 0;
    this.planMenor = this.planes[0];
    this.planMayor = this.planes[1];
    var gasto = 0;

    this.planes.forEach(element => {
      if(this.planMenor.tiempoRestante >= element.tiempoRestante) {
        if(this.planMenor.tiempoRestante == element.tiempoRestante) { 
          if((this.planMenor.cantidadTotal - this.planMenor.cantidadAcumulada) 
            < (element.cantidadTotal - element.cantidadAcumulada)) { 
              this.planMenor = element;
            }
        } else {
          this.planMenor = element;
        }
      }
      if(this.planMayor.tiempoRestante <= element.tiempoRestante) {
        if(this.planMayor.tiempoRestante == element.tiempoRestante) { 
          if((this.planMayor.cantidadTotal - this.planMayor.cantidadAcumulada) 
            > (element.cantidadTotal - element.cantidadAcumulada)) { 
              this.planMayor = element;
            }
        } else {
          this.planMayor = element;
        }
      }
      ahorrar += (element.cantidadTotal - element.cantidadAcumulada); 
    });
    
    ahorrar /= this.planMayor.tiempoRestante;
    gasto = this.datosService.usuarioCarga.ingresoCantidad - ahorrar - this.diferenciaFondo;
    return await this.validarMasDosPlanes(ahorrar, gasto, margenMax, margenMin);
  }

  async validarMasDosPlanes(ahorrar: number, gasto: number, margenMax: number, margenMin: number) {
    this.planMenor.aportacionMensual = (this.planMenor.cantidadTotal - this.planMenor.cantidadAcumulada)/this.planMenor.tiempoRestante;
    
    if (gasto  >= margenMax || gasto  >= this.gastosUsuario) {

      if(this.planMenor.aportacionMensual >= (ahorrar/2)) {
        return await this.opcionesPrioridadDos(margenMax, margenMin);
      } else {
        this.confirmarCreacionMasDosPlanes(ahorrar);
        return true;
      }
           
    } else if ( ( gasto < margenMax ) && (gasto >= margenMin ) ) {

      if(this.planMenor.aportacionMensual >= (ahorrar)/2) {
        return await this.opcionesPrioridadDos(margenMax, margenMin);
      } else {
        this.confirmarCreacionMasDosPlanes(ahorrar);
        return true;
      }

    } else {
      return false; 
    }
  }

  confirmarCreacionMasDosPlanes(ahorrar: number) {
    var iguales = true;
    this.planes.forEach(element => {
      if(element.tiempoRestante != this.planMenor.tiempoRestante) {
        iguales = false;
      }
    });
    if(iguales) {
      this.planes.forEach(element => {
        element.aportacionMensual = (element.cantidadTotal - element.cantidadAcumulada)/element.tiempoRestante;
      });
      return;
    }

    var aux = this.planMenor.aportacionMensual;
    this.planes = this.planes.filter(plan => plan != this.planMenor);
    this.planes.forEach(element => {
      if(element != this.planMayor) {
        element.aportacionMensual = this.planMenor.aportacionMensual;
        aux += element.aportacionMensual;
      }
    });
    this.planMayor.aportacionMensual = ahorrar - aux;
    this.planes.unshift(this.planMenor);
    return;
  }

  async opcionesPrioridad(margenMax: number, margenMin: number) {
      if(await this.intentarPrioritario(margenMax, margenMin)) {
        return true;
      } else {
        return false;
      }
  }

  async opcionesPrioridadDos(margenMax: number, margenMin: number) {
    if(await this.intentarPrioritario(margenMax, margenMin)) {
      this.planesaux = [];
      this.planes.forEach(element => {
        this.planesaux.push(element);
      });
      this.planes = []
      this.planesPrioritarios.forEach(element => {
        this.planes.push(element);
      });
      this.planesaux.forEach(element => {
        this.planes.push(element);
      });
      return true;
    } else {
      return false;
    }
  }

  async intentarPrioritario(margenMax: number, margenMin: number) {

    var ahorrar = 0;
    var gasto;
    if(!this.multiplan) {
      this.planMenor.aportacionMensual = (this.planMenor.cantidadTotal - this.planMenor.cantidadAcumulada)/this.planMenor.tiempoRestante;
      this.planMayor.aportacionMensual = (this.planMayor.cantidadTotal - this.planMayor.cantidadAcumulada)/this.planMayor.tiempoRestante;
      ahorrar = this.planMenor.aportacionMensual + this.planMayor.aportacionMensual;
      gasto = this.datosService.usuarioCarga.ingresoCantidad - ahorrar - this.diferenciaFondo;
      return await this.validarGasto(margenMax,margenMin, gasto);
    }
      
    var ahorrar2 = 0;
    this.planMenor.aportacionMensual = (this.planMenor.cantidadTotal - this.planMenor.cantidadAcumulada)/this.planMenor.tiempoRestante;
    this.planesPrioritarios.push(this.planMenor);
    this.planesPrioritarios.forEach(element => {
      ahorrar += element.aportacionMensual;
    });
    gasto = this.datosService.usuarioCarga.ingresoCantidad - ahorrar - this.diferenciaFondo;

    if(!await this.validarGasto(margenMax,margenMin, gasto)) {
      this.planesPrioritarios = this.planesPrioritarios.filter(plan => plan != this.planMenor);
      return false;
    }

    this.planes = this.planes.filter(plan => plan != this.planMenor);
    this.planMenor = this.planes[0];
    this.planes.forEach(element => {
      if(this.planMenor.tiempoRestante >= element.tiempoRestante) {
        if(this.planMenor.tiempoRestante == element.tiempoRestante) { 
          if((this.planMenor.cantidadTotal - this.planMenor.cantidadAcumulada) 
            < (element.cantidadTotal - element.cantidadAcumulada)) { 
              this.planMenor = element;
            }
        } else {
          this.planMenor = element;
        }
      }
      ahorrar2 += (element.cantidadTotal - element.cantidadAcumulada);
    });
    ahorrar2 /= this.planMayor.tiempoRestante;

    this.planMenor.aportacionMensual = (this.planMenor.cantidadTotal - this.planMenor.cantidadAcumulada)/this.planMenor.tiempoRestante;
    if(this.planes.length == 1) {
      ahorrar += ahorrar2;
      gasto = this.datosService.usuarioCarga.ingresoCantidad - ahorrar - this.diferenciaFondo;
      return this.validarGasto(margenMax,margenMin, gasto);
    } 
    
    else if(this.planes.length == 2) {
      if(this.planMenor.aportacionMensual >= (ahorrar2)) {
        return this.intentarPrioritario(margenMax,margenMin);
      }
      this.planMayor.aportacionMensual = ahorrar2 - this.planMenor.aportacionMensual;
      ahorrar += ahorrar2;
      gasto = this.datosService.usuarioCarga.ingresoCantidad - ahorrar - this.diferenciaFondo;
      return this.validarGasto(margenMax,margenMin, gasto);
    } 
    
    else {
      if(this.planMenor.aportacionMensual>= (ahorrar2/2)) {
        return this.intentarPrioritario(margenMax, margenMin);
      }
      var iguales = true;
      this.planes.forEach(element => {
        if(element.tiempoRestante != this.planMenor.tiempoRestante) {
          iguales = false;
        }
      });
      if(iguales) {
        this.planes.forEach(element => {
          element.aportacionMensual = (element.cantidadTotal - element.cantidadAcumulada)/element.tiempoRestante;
        });
        ahorrar += ahorrar2;
        gasto = this.datosService.usuarioCarga.ingresoCantidad - ahorrar - this.diferenciaFondo;
        return this.validarGasto(margenMax,margenMin, gasto);
    }
      var sobrante = ahorrar2 - this.planMenor.aportacionMensual;
      this.planes.forEach(element => {
        if(element != this.planMenor && element != this.planMayor) {
          element.aportacionMensual = this.planMenor.aportacionMensual;
          sobrante -= this.planMenor.aportacionMensual;
        }
      });
      this.planMayor.aportacionMensual = sobrante;
      ahorrar += ahorrar2;
      gasto = this.datosService.usuarioCarga.ingresoCantidad - ahorrar - this.diferenciaFondo;
      return this.validarGasto(margenMax,margenMin, gasto);
    }
  }
  
  validarGasto(margenMax: number, margenMin: number, gasto: number) {
    if (  gasto  >= margenMax || gasto  >= this.gastosUsuario) {
      return true;
    } else if ( ( gasto < margenMax ) && (gasto >= margenMin ) ) {
      return true;
    } else {
      return false;
    }
  }

  async actualizarUsuario() {
    await this.datosService.cargarDatos();
    this.datosService.usuarioCarga.fondoPlanes = 0;
    this.datosService.planesCargados.forEach(element => {
      if(element.pausado != true) {
        this.datosService.usuarioCarga.fondoPlanes += element.aportacionMensual; 
      }
    });
    this.datosService.usuarioCarga.fondoPlanes = Math.round(this.datosService.usuarioCarga.fondoPlanes*100)/100;
    var gastos = 0;
    var margenMin = 0;
    var margenMax = 0;
    this.datosService.usuarioCarga.gastos.forEach(element => {
      if(element.cantidad != 0) {
        gastos += element.cantidad;
        margenMin += element.margenMin;
        margenMax += element.margenMax;
      }
    });
    this.datosService.usuarioCarga.fondoAhorro = this.datosService.usuarioCarga.ingresoCantidad - this.datosService.usuarioCarga.fondoPlanes -gastos;
    if(this.datosService.usuarioCarga.fondoAhorro < 0) {
      this.datosService.usuarioCarga.fondoAhorro = this.datosService.usuarioCarga.ingresoCantidad - this.datosService.usuarioCarga.fondoPlanes - margenMin;
    }

    if(this.datosService.usuarioCarga.ingresoCantidad - this.datosService.usuarioCarga.fondoPlanes < margenMax 
      && this.datosService.usuarioCarga.ingresoCantidad - this.datosService.usuarioCarga.fondoPlanes < this.gastosUsuario 
      && this.datosService.usuarioCarga.ingresoCantidad - this.datosService.usuarioCarga.fondoPlanes >= margenMin) {
        this.accionesService.presentAlertGenerica('Gastos Minimos', 'Ahora estas en un sistema de gastos minimos, '+ 
      'esto quiere decir que se tomara en cuenta tus gastos en margen minimo (el pequeño margen de desviacion' + 
      ' en cada uno de tus gastos que provoca que gastes menos sobre todo en tus gastos promedio) para hacer los' + 
      'calculos de tus ahorros ya que al gastar menos ahorraras mas ,' +
      'pero recuerda que el porcentaje de ese ahorro que no es para los planes sera menor debido que '+ 
      'los planes se estan llevando casi todo, por lo tanto procura mantenerte dentro de se margen y' + 
      ' asi poder cumplir todos tus planes');
    }

    this.datosService.usuarioCarga.fondoAhorro -= this.diferenciaFondo;
    this.datosService.usuarioCarga.fondoAhorro = Math.round(this.datosService.usuarioCarga.fondoAhorro*100)/100;
    await this.datosService.guardarUsuarioInfo(this.datosService.usuarioCarga);
  }

  async cancelar() {
    var cancelar;
    await this.accionesService.presentAlertPlan([{text: 'Si', handler: (blah) => {cancelar = true}},
                                                  {text: 'No', handler: (blah) => {cancelar = false}}], 
                                                  '¿Seguro que quieres volver?', 
      'Si cancelas se borraran todos los cambios a tus planes y volvera a como estaban antes');
    
    if(cancelar) {
      console.log(this.planesOriginales);
      this.datosService.actualizarPlanes(this.planesOriginales);
      await this.modalCtrl.dismiss();
      this.nav.navigateRoot('tabs/tab2');
    }
  }
}
