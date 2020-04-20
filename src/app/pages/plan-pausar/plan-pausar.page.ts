import { Component, OnInit, Input } from '@angular/core';
import { DatosService } from '../../services/datos.service';
import { Plan } from '../../interfaces/interfaces';
import { NavController, ModalController } from '@ionic/angular';
import { AccionesService } from '../../services/acciones.service';

@Component({
  selector: 'app-plan-pausar',
  templateUrl: './plan-pausar.page.html',
  styleUrls: ['./plan-pausar.page.scss'],
})
export class PlanPausarPage implements OnInit {

  @Input() planesPrioritarios: Plan[];
  @Input() margenMax: number;
  @Input() margenMin: number;
  @Input() planesOriginales: Plan[];
  @Input() diferenciaFondo: number;

  planes: Plan[] = this.datosService.planesCargados;

  planesAux: Plan[] = [];

  planesFinales: Plan[];

  planMenor: Plan;

  planMayor: Plan;

  valido: boolean = true;

  multiplan: boolean;
  
  planesIniciales: Plan[] = [];

  planesPrioritariosI: Plan[] = [];

  constructor(private datosService: DatosService,
              private nav: NavController,
              private modalCtrl: ModalController,
              private accionesService: AccionesService) { }

  async ngOnInit() {
    await this.datosService.cargarDatos();
  }
  
  accionPausar(i) {
    this.valido = true;
    this.planes[i].pausado = !this.planes[i].pausado
    this.planes.forEach(element => {
      if(element.pausado){
        this.valido = false;
      }
    });
  }

  async registrarCambios() {
    this.planesAux = [];
    this.planesIniciales = [];
    this.planes.forEach(element => {
      this.planesIniciales.push(element);
    });
    this.planesPrioritariosI = [];
    this.planesPrioritarios.forEach(element => {
      this.planesPrioritariosI.push(element);
    });

    var ahorrar = this.determinarAhorro();
    var gasto = this.datosService.usuarioCarga.ingresoCantidad - ahorrar - this.diferenciaFondo;
    if(await this.validarGasto(this.margenMax, this.margenMin, gasto)) {

      if(this.multiplan) {
        await this.acomodar();
        if(this.planesAux.length == 0) {
          var ochoPorciento = (this.datosService.usuarioCarga.ingresoCantidad - this.margenMax - this.diferenciaFondo)*0.08;
          if(await this.ocho(ochoPorciento)) {
            this.planes = [];
            this.planesIniciales.forEach(element => {
              this.planes.push(element);
            });
            this.planesPrioritarios = [];
            this.planesPrioritariosI.forEach(element => {
              this.planesPrioritarios.push(element);
            });
            return
          }
        }
        this.planes = this.planesFinales;
        this.procesoDeGuardado();
        return;
      } else {
        if(this.planes.length == 1) {
          if(await !this.verificarTodosPausados()) {
            var ochoPorciento = (this.datosService.usuarioCarga.ingresoCantidad - this.margenMax - this.diferenciaFondo)*0.08;
            if(await this.ocho(ochoPorciento)) {
              this.planes = [];
              this.planesIniciales.forEach(element => {
                this.planes.push(element);
              });
              return
            }
          }
          this.procesoDeGuardado();
          return;
        }
  
        if(this.planes.length == 2) {
          var aux;
          if(!this.planes[1].pausado && this.planes[0].pausado) {
            aux = this.planes[0];
            this.planes[0] = this.planes[1];
            this.planes[1] = aux;
          }
          if(await !this.verificarTodosPausados()) {
            var ochoPorciento = (this.datosService.usuarioCarga.ingresoCantidad - this.margenMax - this.diferenciaFondo)*0.08;
            if(await this.ocho(ochoPorciento)) {
              this.planes = [];
              this.planesIniciales.forEach(element => {
                this.planes.push(element);
              });
              return
            }
          }
  
          this.procesoDeGuardado();
          return;
        }
      }
    }

    this.planes = [];
    this.planesIniciales.forEach(element => {
      this.planes.push(element);
    });
    this.planesPrioritarios = [];
    this.planesPrioritariosI.forEach(element => {
      this.planesPrioritarios.push(element);
    });
    this.accionesService.presentAlertPlan([{text: 'Ok', handler: (blah) => {}}], 
        'Planes que no son posibles', 
        'Con los planes que pausaste aun no alcanzas a cumplirlos, por favor pausa otros o todos');
    return;
  }

  validarGasto(margenMax: number, margenMin: number, gasto: number) {
    if (  gasto  >= margenMax ) {
      return true;
     }
     else if ( ( gasto < margenMax ) && (gasto >= margenMin ) ) {
      return true;
     }
     else {
      return false;
     }
  }

  determinarAhorro() {
    var ahorrar = 0;
    if(this.planes.length < 3) {
      this.planes.forEach(element => {
        if(element.pausado) {
          element.aportacionMensual = 0;
        } else {
          element.aportacionMensual = (element.cantidadTotal - element.cantidadAcumulada)/element.tiempoRestante;
        }
      });
      this.planes.forEach(element => {
        if(!element.pausado) {
          ahorrar += element.aportacionMensual;
        }
      });
      this.planesPrioritarios.forEach(element => {
        ahorrar += element.aportacionMensual;
      });
      this.multiplan = false;

    } else {
      this.multiplan = true;
      this.planes.forEach(element => {
        if(element.pausado) {
          element.aportacionMensual = 0;
        } else {
         this.planesAux.push(element);
        }
      });
      this.planes = this.planes.filter(plan => plan.pausado != false);

      if(this.planesAux.length != 0) {
        this.planMenor = this.planesAux[0];
        this.planMayor = this.planesAux[0];
        this.planesAux.forEach(element => {
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
        this.planMenor.aportacionMensual = (this.planMenor.cantidadTotal - this.planMenor.cantidadAcumulada)/this.planMenor.tiempoRestante
        if(this.planesAux.length > 1) {
          if(this.planesAux.length == 2 && this.planMenor.aportacionMensual >= ahorrar) {
            return ahorrar = this.intentarPrioritario(this.margenMax, this.margenMin);
          } else if( this.planesAux.length > 2 && this.planMenor.aportacionMensual >= (ahorrar)/2) {
            return ahorrar = this.intentarPrioritario(this.margenMax, this.margenMin);
          }
        }
        ahorrar /= this.planMayor.tiempoRestante;
      }
      this.planesPrioritarios.forEach(element => {
        ahorrar += element.aportacionMensual;
      });
    }
    return ahorrar;
  }

  verificarTodosPausados() {
    var pausados = true;
    this.planes.forEach(element => {
      if(!element.pausado) {
          pausados = false;
      }
    });
    return pausados;
  }

  async procesoDeGuardado() {
    this.planes.forEach(element => {
      this.planesPrioritarios.push(element);
    });
    await this.datosService.actualizarPlanes(this.planesPrioritarios);
    this.actualizarUsuario();
    this.modalCtrl.dismiss();
    this.nav.navigateRoot('/tabs/tab2');
    return;
  }

  async intentarPrioritario(margenMax: number, margenMin: number) {
    var ahorrar: number = 0;
    if(this.planesAux.length == 2) {
      this.planMenor.aportacionMensual = (this.planMenor.cantidadTotal - this.planMenor.cantidadAcumulada)/this.planMenor.tiempoRestante;
      this.planMayor.aportacionMensual = (this.planMayor.cantidadTotal - this.planMayor.cantidadAcumulada)/this.planMayor.tiempoRestante;
     return ahorrar = this.planMenor.aportacionMensual + this.planMayor.aportacionMensual;
    }

    var ahorrar2 = 0;
    this.planMenor.aportacionMensual = (this.planMenor.cantidadTotal - this.planMenor.cantidadAcumulada)/this.planMenor.tiempoRestante;
    this.planesPrioritarios.push(this.planMenor);
    this.planesPrioritarios.forEach(element => {
      ahorrar += element.aportacionMensual;
    });

    this.planesAux = this.planesAux.filter(plan => plan != this.planMenor);
    this.planMenor = this.planes[0];
    this.planesAux.forEach(element => {
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
    if(this.planesAux.length == 1) {
      return ahorrar += ahorrar2;
    } 
    
    else if(this.planesAux.length == 2) {
      if(this.planMenor.aportacionMensual >= (ahorrar2)) {
        return this.intentarPrioritario(margenMax,margenMin);
      }
      this.planMayor.aportacionMensual = ahorrar2 - this.planMenor.aportacionMensual;
      return ahorrar += ahorrar2;
    } 
    
    else {
      if(this.planMenor.aportacionMensual>= (ahorrar2/2)) {
        return this.intentarPrioritario(margenMax,margenMin);
      }
      var iguales = true;
      this.planesAux.forEach(element => {
        if(element.tiempoRestante != this.planMenor.tiempoRestante) {
          iguales = false;
        }
      });
      if(iguales) {
        this.planesAux.forEach(element => {
          element.aportacionMensual = (element.cantidadTotal - element.cantidadAcumulada)/element.tiempoRestante;
        });
        return ahorrar += ahorrar2;
    }
      var sobrante = ahorrar2 - this.planMenor.aportacionMensual;
      this.planesAux.forEach(element => {
        if(element != this.planMenor && element != this.planMayor) {
          element.aportacionMensual = this.planMenor.aportacionMensual;
          sobrante -= this.planMenor.aportacionMensual;
        }
      });
      this.planMayor.aportacionMensual = sobrante;
      return ahorrar += ahorrar2;
    }
  }

  acomodar() {
    this.planesFinales = [];
    this.planesAux.forEach(element => {
      this.planesFinales.push(element);
    });
    this.planes.forEach(element => {
      this.planesFinales.push(element);
    });
  }

  ocho(ochoporciento: number) {
    if(this.planes.length == 2) {
      if(this.planes[0].aportacionMensual <= ochoporciento) {
        this.accionesService.presentAlertPlan([{text: 'Ok', handler: (blah) => {}}], 
          'Plan demasiado pequeño', 
          'Hemos encontrado que el plan que no pausaste recibe muy poco dinero, por favor pausa el otro o los dos planes');
          return true;
      }
      return false;
    }
  }

  async actualizarUsuario() {
    this.datosService.usuarioCarga.fondoPlanes = 0;
    this.datosService.planesCargados.forEach(element => {
      this.datosService.usuarioCarga.fondoPlanes += element.aportacionMensual; 
    });
    var gastos = 0;
    this.datosService.usuarioCarga.gastos.forEach(element => {
      if(element.cantidad != 0) {

      }
      gastos += element.cantidad;
    });
    this.datosService.usuarioCarga.fondoAhorro = this.datosService.usuarioCarga.ingresoCantidad - this.datosService.usuarioCarga.fondoPlanes - this.diferenciaFondo -gastos;
    this.datosService.usuarioCarga.fondoAhorro = Math.round(this.datosService.usuarioCarga.fondoAhorro*100)/100;
    await this.datosService.guardarUsuarioInfo(this.datosService.usuarioCarga);
  }

  async cancelar() {
    var cancelar;
    await this.accionesService.presentAlertPlan([{text: 'Si', handler: (blah) => {cancelar = true}},
                                                  {text: 'No', handler: (blah) => {cancelar = false}}], 
                                                  '¿Seguro que quieres volver?', 
      'Si cancelas se borrara el nuevo plan que ingresaste');
    
    if(cancelar) {
      console.log(this.planesOriginales);
      this.datosService.actualizarPlanes(this.planesOriginales);
      await this.modalCtrl.dismiss();
      this.nav.navigateRoot('tabs/tab2');
    }
  }
}
