import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Plan, AlertaGeneral } from '../../interfaces/interfaces';
import { DatosService } from '../../services/datos.service';
import { NavController, ModalController, Platform, IonInput, NumericValueAccessor } from '@ionic/angular';
import { AccionesService } from '../../services/acciones.service';
import { UsuarioLocal } from '../../interfaces/interfaces';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-plan-form',
  templateUrl: './plan-form.page.html',
  styleUrls: ['./plan-form.page.scss'],
})
export class PlanFormPage implements OnInit {

  //Variable que viene del Modal registro y del tab2 y nos indica si es la primera vez que abre la app
  @Input() registro: string;
  @ViewChild('tiempo',{static: true}) tiempo: IonInput;

  //Variable para guardar los datos del nuevo plan
  planNuevo: Plan = {
    nombre: '',
    cantidadTotal: null,
    tiempoTotal: null,
    cantidadAcumulada: null,
    tiempoRestante: null,
    descripcion: '',
    aportacionMensual: null,
    pausado: false
  };

  //Variable para guardar la infromacion de las alertas
  alertas: AlertaGeneral[] = [];

  //Variable que guarda la informacion del usuario
  usuarioCargado: UsuarioLocal = this.datosService.usuarioCarga;

  planes: Plan[] = this.datosService.planesCargados;

  planesaux: Plan[] = []

  planesOriginales: Plan[] = []

  planesPrioritarios: Plan[] = [];

  prioridadDos: boolean = false; 
  
  creado: boolean;

  pausa: boolean;

  modificar: boolean;

  backButtonSub: Subscription;

  planPrioritario: Plan;

  planMayor: Plan;

  planMenor: Plan;

  ahorrar: number;

  constructor( private datosService: DatosService,
                private nav: NavController,
                private modalCtrl: ModalController,
                private accionesService: AccionesService,
                private plt: Platform,
                private router: Router) { }

  ngOnInit() {
    //Metodo que obtiene la informacion de las alertas de un archivo
    this.datosService.getAlertasJson().subscribe(val => {
      this.alertas = val;
    });
   }

   //Metodo que calcula los datos para agregar un plan nuevo y lo guarda en el Storage
  async calcularYRegistrar() {
    this.planesPrioritarios = [];
    //Valores iniciales
    var unPlan = false;
    var margenMax = 0;
    var margenMin = 0;

    //Verificar si hay planes previos
    if( this.planes.length < 1 || this.datosService.planesExisten == false) {
      unPlan = true;
    }

    //Obtner margenes maximos y minimos
    this.usuarioCargado.gastos.forEach(element => {
      if( element.cantidad != 0 ) {
        margenMax += element.margenMax;
        margenMin += element.margenMin;
      } 
    });
    
    //Obtner la aportacion mensual de nuevo plan y verificar si es valido
    this.planNuevo.aportacionMensual = (this.planNuevo.cantidadTotal - this.planNuevo.cantidadAcumulada) / this.planNuevo.tiempoTotal;
    if(this.planNuevo.aportacionMensual <= 0) {
      await this.accionesService.presentAlertPlan([{text: 'Modificar', handler: (blah) => {}}], 
                                                      'PLan Invalido', 
        'No puedes ingresar una cantidad acumulada mayor o igual al costo del plan');
        return;
    }
    this.planNuevo.tiempoRestante = this.planNuevo.tiempoTotal;

    //Verifica si el plan es posible
    if (await this.validarPlan(margenMax, margenMin, unPlan)) { 

      //Mas de un plan
      if(unPlan == false) {

        //Dos planes
        if(this.planes.length == 1) { 
          await this.casoDosPlanes(margenMax, margenMin);
          return;
        }

        //Mas de dos planes
        this.casoMasDosPlanes(margenMax, margenMin);
        return;
      }

      //Un plan
      this.casoUnPlan(margenMax);
      return;
    }
    return;
  }

  //Metodo para validar el ingreso del plan
  async validarPlan(margenMax: number, margenMin: number, unPlan: boolean) {
      var gasto = 0;
      gasto = this.usuarioCargado.ingresoCantidad - this.planNuevo.aportacionMensual;
      return this.alertasUnPlan(margenMax, margenMin, gasto, unPlan);
  }

  async casoUnPlan(margenMax: number) {
    //Un plan
    var ochoPorciento = this.obtenerOchoPorciento(margenMax);
    //Verificar si el plan es menor o igual al 8% del dinero destinado ahorrar
    if(await this.siPlanNuevoMuyPequeño(ochoPorciento)) {
      return;
    }
    this.planes = [];
    this.planes.push(this.planNuevo);
    this.guardarCambiosAPlanes();
    this.nav.navigateRoot('/tabs/tab2');
    return;
  }

  async casoDosPlanes(margenMax: number, margenMin: number){
    await this.calculosDosPlanes(margenMax, margenMin);
    //Verificas si hay un plan prioritario
    if(this.prioridadDos == true) {
      this.planPrioritario = this.planMenor;
      await this.pausarPorPrioridadDosPlanes();
      this.datosService.actualizarPlanes(this.planes);
      this.modalCtrl.dismiss();
      this.nav.navigateRoot('/tabs/tab2');
      return;
    }

    if(this.modificar == true) {
      this.planesOriginales = [];
      this.planes.forEach(element => {
        this.planesOriginales.push(element);
      });
      this.planes.push(this.planNuevo);
      this.datosService.actualizarPlanes(this.planes);
      this.modalCtrl.dismiss();
      this.nav.navigateRoot('/modificar-tiempo-page');
      this.router.navigate(['/modificar-tiempo-page'],
        {
          queryParams: {
            planesOriginales: JSON.stringify(this.planesOriginales)
          }
        });
      return;
    }

    if(this.creado) {
      //Verificar si algun plan no recibe el 8% del fondo de ahorro
      if(await this.ocho(margenMax)) {
        if(this.pausa) {
          this.planes.push(this.planNuevo);
          this.datosService.actualizarPlanes(this.planes);
          this.modalCtrl.dismiss();
          this.nav.navigateRoot('/plan-pausar-page');
          return;
        }
        return;
      }
      this.planes.push(this.planNuevo);
      this.guardarCambiosAPlanes();
      this.nav.navigateRoot('/tabs/tab2');
      return;
    }
    return;
  }

  //Metodo que ingresa dos planes
  async calculosDosPlanes(margenMax: number, margenMin: number) {
    //Variables iniciales
    var ahorrar = 0;
    this.planMenor = this.planes[0];
     this.planMayor = this.planNuevo;
    var gasto = 0;

    //Se determina cuanto debe ahorrar el ususario al mes
    if(this.planMayor.tiempoRestante <= this.planMenor.tiempoRestante) {
      if(this.planMayor.tiempoRestante == this.planMenor.tiempoRestante) {
        if((this.planMayor.cantidadTotal - this.planMayor.cantidadAcumulada) 
        > (this.planMenor.cantidadTotal - this.planMenor.cantidadAcumulada)) {
          var aux = this.planMenor;
          this.planMenor = this.planMayor;
          this.planMayor = aux;
        }
      } else {
        var aux = this.planMenor;
        this.planMenor = this.planMayor;
        this.planMayor = aux;
      }
    }
    ahorrar += (this.planMenor.cantidadTotal - this.planMenor.cantidadAcumulada) + (this.planMayor.cantidadTotal - this.planMayor.cantidadAcumulada);
    ahorrar /= this.planMayor.tiempoRestante;
    gasto = this.usuarioCargado.ingresoCantidad - ahorrar;

    this.planMenor.aportacionMensual = (this.planMenor.cantidadTotal - this.planMenor.cantidadAcumulada)/this.planMenor.tiempoRestante;
    //Verificamos el caso de los planes
    //Caso en que quitando lo que debe ahorrar al mes el usuario, puede satisfacer sus necesidades basicas en los dos margenes
    await this.validarDosplanes(ahorrar, gasto, margenMax, margenMin)
  }

  async casoMasDosPlanes(margenMax, margenMin) {
    //Mas de dos planes
    this.planesOriginales = [];
    this.planes.forEach(element => {
      this.planesOriginales.push(element);
    });

    await this.calculosMasDosPlanes(margenMax, margenMin);
    if(this.prioridadDos == true) {
      if(await this.pausarODividirMasDosPlanes(margenMax, margenMin)) {
        return;
      }
      this.planes = this.planesOriginales;
      return;
    }

    if(this.modificar == true) {
      this.planesOriginales = [];
      this.planes.forEach(element => {
        this.planesOriginales.push(element);
      });
      this.planes.forEach(element => {
        this.planesPrioritarios.push(element);
      });
      this.datosService.actualizarPlanes(this.planesPrioritarios);
      this.modalCtrl.dismiss();
      this.nav.navigateRoot('/modificar-tiempo-page');
      this.router.navigate(['/modificar-tiempo-page'],
        {
          queryParams: {
            planesOriginales: JSON.stringify(this.planesOriginales)
          }
        });
      return;
    }
    
    if(this.creado) {
      if(await this.ocho(margenMax)) {
        if(this.pausa) {
          this.datosService.actualizarPlanes(this.planes);
          this.modalCtrl.dismiss();
          this.nav.navigateRoot('/plan-pausar-page');
          return;
        }
        console.log('no');
        this.planes = this.planesOriginales;
        return;
      }
      this.guardarCambiosAPlanes();
      this.nav.navigateRoot('/tabs/tab2');
      return;
    }
    this.planes = this.planesOriginales;
    return;
  }

  async calculosMasDosPlanes(margenMax: number, margenMin: number) {
    var ahorrar = 0;
    this.planMenor = this.planes[0];
    this.planMayor = this.planNuevo;
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
    
    if(this.planNuevo.tiempoRestante <= this.planMenor.tiempoRestante) {
      if(this.planNuevo.tiempoRestante == this.planMenor.tiempoRestante) { 
        if((this.planNuevo.cantidadTotal - this.planNuevo.cantidadAcumulada) 
          > (this.planMenor.cantidadTotal - this.planMenor.cantidadAcumulada)) { 
            this.planMenor = this.planNuevo;
        }
      } else {
        this.planMenor = this.planNuevo;
      }
    }
    ahorrar += (this.planNuevo.cantidadTotal - this.planNuevo.cantidadAcumulada);
    
    ahorrar /= this.planMayor.tiempoRestante;
    this.ahorrar = ahorrar;
    gasto = this.usuarioCargado.ingresoCantidad - ahorrar;
    this.planes.push(this.planNuevo);
    await this.validarMasDosPlanes(ahorrar, gasto, margenMax, margenMin);
  }

  async ocho(margenMax: number) {
    var ochoPorciento = this.obtenerOchoPorciento(margenMax);
    if(await this.siPlanNuevoMuyPequeño(ochoPorciento)) {
      return true;
    } else {
      if(this.planes.length == 1) {
        if(this.planes[0].aportacionMensual <= ochoPorciento) {
          await this.accionesService.presentAlertPlan([{text: 'Modificar', handler: (blah) => {this.pausa = false}},
                                                        {text: 'Pausar', handler: (blah) => {this.pausa = true}}], 
                                                      'Plan demasiado pequeño', 
            'Se ha detectado que el otro plan actual recibira muy poco dinero, te pedimos que aumentes' +
            ' el tiempo del nuevo plan o pauses cualquiera de los dos'
          );
          return true;
        }
       return false;
      }
      var aux = false;
      await this.planes.forEach(element => {
        if(element.aportacionMensual <= ochoPorciento) {
           aux = true;
           console.log(element);
        }
      });
      if(aux) {
        await this.accionesService.presentAlertPlan([{text: 'Modificar', handler: (blah) => {this.pausa = false}},
                                                        {text: 'Pausar', handler: (blah) => {this.pausa = true}}], 
                                                      'Plan demasiado pequeño', 
            'Se ha detectado que alguno(s) planes recibiran muy poco dinero, te pedimos que aumentes' +
            ' el tiempo del nuevo plan o pauses cualquiera de los dos'
          );
          return true;
      }
      return false;
    }

  }
  //Metodo para preguntarle al usuario que se deberia hacer con su plan prioritario
  async prioridad(nombre: string) {
    if(this.planes.length == 1) {
      await this.accionesService.presentAlertPlan([{text: 'No puedo', handler: (blah) => {this.modificar = false, this.prioridadDos = true}},
                                                  {text: 'Modificar', handler: (blah) => {this.modificar = true, this.prioridadDos = false}},
                                                  {text: 'Cancelar', handler: (blah) => {this.modificar = false, this.prioridadDos = false}}], 
                                                  'Se ha detectado el plan ' + nombre + ' como de maxima prioridad', 
    'Puedes crear el nuevo plan y modificar el tiempo de los planes para hacer posible ' + 
    ' completar los planes, si no puedes hacer esto escoge "No puedo" para pausar el' + 
    ' plan que no es prioritario');
    return;
    }
    await this.accionesService.presentAlertPlan([{text: 'No puedo', handler: (blah) => {this.modificar = false, this.prioridadDos = true}},
                                                  {text: 'Modificar', handler: (blah) => {this.modificar = true, this.prioridadDos = false}},
                                                  {text: 'Cancelar', handler: (blah) => {this.modificar = false, this.prioridadDos = false}}], 
                                                  'Se ha detectado el plan ' + nombre + ' como de maxima prioridad', 
    'Puedes crear el nuevo plan y modificar el tiempo de los planes para hacer posible ' + 
    ' completar los planes, si no puedes hacer esto escoge "No puedo"');
    return;
  }

  async pausar() {
    var pausar;
    await this.accionesService.presentAlertPlan([{text: 'Pausar', handler: (blah) => {pausar = true}},
                                                  {text: 'Repartir', handler: (blah) => {pausar = false}}], 
                                                  'Elije una opcion para proceder',
    'Puedes pausar todos los planes que escogas (excepto los prioritarios) o al prioritario acumularle lo necesario y del sobrante' + 
    ' repartirlo igualitariamente a los demas planes');
    return pausar;
  }

  //Imprimir las alertas segun el caso
  async alertasUnPlan( margenMax: number, margenMin: number, gasto: number, unPlan: boolean) {
    if (  gasto  >= margenMax ) {
      return true;
     }
     else if ( ( gasto < margenMax ) && (gasto >= margenMin ) ) {
       if(unPlan) {
         console.log('hola');
        await this.accionesService.presentAlertPlan([{text: 'Crear', handler: (blah) => {this.accionesService.alertaPlanCrear = true}},
                                                    {text: 'Modificar', handler: (blah) => {this.accionesService.alertaPlanCrear = false}}], 
        'Plan que apenas es posible', 
        'Puedes crear el plan y cumplirlo en el tiempo establecido MIENTRAS te mantengas en GASTOS MINIMOS en los gastos promedio (luz, agua, etc.) o puedes aumentar el tiempo en conseguirlo para que no estes tan presionado');
        return this.accionesService.alertaPlanCrear;
       }
       return true;
     }
     else {
      await this.accionesService.presentAlertPlan([{text: 'Modificar', handler: (blah) => {}}], 
      'No puedes completar este plan en ese tiempo', 'Presiona Modificar y aumenta tu tiempo para ser apto de conseguirlo');
      this.calcularEstimacion(margenMin);
      return false;
     }
  }

  async guardarCambiosAPlanes() {
     await this.accionesService.presentAlertPlan([{text: 'Ok', handler: (blah) => {}}], 
                                                      'Plan creado', 
          '¡Si te propones gastar menos en tus gastos promedio (luz, agua, etc.) puedes completar tu plan en menos tiempo!');
      this.datosService.actualizarPlanes(this.planes);
      await this.modalCtrl.dismiss();
  }

  obtenerOchoPorciento(margenMax: number) {
    return (this.usuarioCargado.ingresoCantidad - margenMax)*0.08;
  }

  async siPlanNuevoMuyPequeño(ochoPorciento: number) {
    if(this.planNuevo.aportacionMensual <= ochoPorciento) {
      await this.accionesService.presentAlertPlan([{text: 'Ok', handler: (blah) => {}}], 
                                                  'Plan demasiado pequeño', 
    'Reduce el tiempo para completarlo o aumenta la cantidad');
    return true;
    }
    return false;
  }

  async validarDosplanes(ahorrar: number, gasto: number, margenMax: number, margenMin: number){
    if (gasto  >= margenMax) {
      //Verificar si el plan menor es prioritario
      if(this.planMenor.aportacionMensual >= ahorrar) {

        //Determinar si el ussuario desea pausar un plan 
        await this.opcionesPrioridad(margenMax, margenMin);
        //Un plan es aceptado y se le notifica al usuario
      } else {
        this.planMayor.aportacionMensual = ahorrar - this.planMenor.aportacionMensual;
        this.creado = true;
        return;
      }
           
      //Caso en que quitando lo que debe ahorrar al mes el usuario, solo puede satisfacer sus necesidades basicas en margen minimo
    } else if ( ( gasto < margenMax ) && (gasto >= margenMin ) ) {
      
      //Veridficar si el plan menor es prioritario
      if(this.planMenor.aportacionMensual >= ahorrar) {

        //Determinar que desea hacer el ususario con el plan prioritario
        await this.opcionesPrioridad(margenMax, margenMin);

        //Plan es valido y se le da opcion al ussuario si desea modificarlo o crearlo 
      } else {
        this.planMayor.aportacionMensual = ahorrar - this.planMenor.aportacionMensual;
        await this.accionesService.presentAlertPlan([{text: 'Crear', handler: (blah) => {this.accionesService.alertaPlanCrear = true}},
                                                  {text: 'Modificar', handler: (blah) => {this.accionesService.alertaPlanCrear = false}}], 
                                                  'Plan que apenas es posible', 
        'Puedes crear el plan y cumplirlo en el tiempo establecido MIENTRAS te mantengas en GASTOS MINIMOS en los gastos promedio (luz, agua, etc.) o puedes aumentar el tiempo en conseguirlo para que no estes tan presionado');
        this.creado = this.accionesService.alertaPlanCrear;
        return;
      }

      //Caso en que el sueldo del ususario no puede obtener el plan ese plan
    } else {
      await this.accionesService.presentAlertPlan([{text: 'Modificar', handler: (blah) => {}}], 
      'No puedes completar este plan en ese tiempo', 'Presiona Modificar y aumenta tu tiempo para ser apto de conseguirlo');
      this.creado = false;
      this.calcularEstimacionDosPlanes(margenMin);
      return;
     }
  }

  async validarMasDosPlanes(ahorrar: number, gasto: number, margenMax: number, margenMin: number) {
    this.planMenor.aportacionMensual = (this.planMenor.cantidadTotal - this.planMenor.cantidadAcumulada)/this.planMenor.tiempoRestante;
    
    if (gasto  >= margenMax) {

      if(this.planMenor.aportacionMensual >= (ahorrar/2)) {
        await this.opcionesPrioridadDos(margenMax, margenMin);
      } else {
        this.confirmarCreacionMasDosPlanes(ahorrar);
        return;
      }
           
    } else if ( ( gasto < margenMax ) && (gasto >= margenMin ) ) {

      if(this.planMenor.aportacionMensual >= (ahorrar)/2) {
        await this.opcionesPrioridadDos(margenMax, margenMin);
      } else {
        await this.accionesService.presentAlertPlan([{text: 'Crear', handler: (blah) => {this.accionesService.alertaPlanCrear = true}},
                                                  {text: 'Modificar', handler: (blah) => {this.accionesService.alertaPlanCrear = false}}], 
                                                  'Plan que apenas es posible', 
        'Puedes crear el plan y cumplirlo en el tiempo establecido MIENTRAS te mantengas en GASTOS MINIMOS en los gastos promedio (luz, agua, etc.) o puedes aumentar el tiempo en conseguirlo para que no estes tan presionado');
        this.creado = this.accionesService.alertaPlanCrear;
        if(this.creado) {
          this.confirmarCreacionMasDosPlanes(ahorrar);
        }
        return;
      }

    } else {
      await this.accionesService.presentAlertPlan([{text: 'Modificar', handler: (blah) => {}}], 
      'No puedes completar este plan en ese tiempo', 'Presiona Modificar y aumenta tu tiempo para ser apto de conseguirlo');
      this.creado = false;
      this.calcularEstimacionDosPlanes(margenMin);
      return; 
    }
  }

  async opcionesPrioridad(margenMax: number, margenMin: number) {
    if(await this.intentarPrioritario(margenMax, margenMin)) {
      this.prioridadDos = false;
      this.creado = true;
      return;
    } else {
      await this.prioridad(this.planMenor.nombre);
      this.creado = false;
      return;
    }
  }

  async opcionesPrioridadDos(margenMax: number, margenMin: number) {
    if(await this.intentarPrioritario(margenMax, margenMin)) {
      this.prioridadDos = false;
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
      this.creado = true;
      return;
    } else {
      await this.prioridad(this.planMenor.nombre);
      this.creado = false;
      if(this.prioridadDos) {
        if(await this.pausar()) {
          this.pausa = true;
          return;
        }
        this.pausa = false;
        return;
      }
      return;
    }
  }

  pausarPorPrioridadDosPlanes() {
    this.planes.push(this.planNuevo);
    this.planes.forEach(element => {
      if(element != this.planPrioritario) {
          element.aportacionMensual = 0;
          element.pausado = true;
      } else {
          element.aportacionMensual = (element.cantidadTotal - element.cantidadAcumulada)/element.tiempoRestante;
      }
    });
  }

  async pausarODividirMasDosPlanes(margenMax: number, margenMin: number) {
    if(this.pausa) {
      this.datosService.actualizarPlanes(this.planes);
      this.modalCtrl.dismiss();
      this.nav.navigateRoot('/plan-pausar-page');
      this.router.navigate(['/plan-pausar-page'],
      {
        queryParams: {
          planesPrioritarios: JSON.stringify(this.planesPrioritarios),
          margenMax: margenMax,
          margenMin: margenMin
        }
      });
      return true;
    }

    var ahorro = 0;
    this.planesPrioritarios.forEach(element => {
      ahorro += element.aportacionMensual;
    });
    ahorro = this.usuarioCargado.ingresoCantidad - ahorro;
    var gasto = margenMin;
    ahorro = ahorro - gasto;
    ahorro /= this.planes.length;
    var ochoporciento = this.obtenerOchoPorciento(margenMax);
    if(ahorro <= ochoporciento) {
      var pausar;
      await this.accionesService.presentAlertPlan([{text: 'Pausar', handler: (blah) => {pausar = true}},
                                                  {text: 'Modificar', handler: (blah) => {pausar = false}}], 
                                                  'Planes demasiados pequeños',
      'Hemos detectado que al hacer el reparto los planes reciben muy poco dinero te recomendamos elejir la opcion "Pausar" ' + 
      ' para pausar algunos planes o modificar los datos del nuevo plan');
      if(pausar) {
        this.pausa = pausar;
        this.pausarODividirMasDosPlanes(margenMax, margenMin);
        return true;
      }
      return false;
    }
    this.planes.forEach(element => {
      element.aportacionMensual = ahorro;
      if(element.tiempoRestante == 1) {
        if(ahorro != element.cantidadTotal - element.cantidadAcumulada) {
          element.tiempoRestante += 1;
          element.tiempoTotal += 1;
        }
      }
      this.planesPrioritarios.push(element);
    });
    this.datosService.actualizarPlanes(this.planesPrioritarios);
      this.modalCtrl.dismiss();
      this.nav.navigateRoot('/tabs/tab2');
    return true;
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
      this.creado = true;
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
    this.creado = true;
    return;
  }

  async intentarPrioritario(margenMax: number, margenMin: number) {
    var ahorrar: number = 0;
    var gasto: number;
    if(this.planes.length == 1) {
      this.planMenor.aportacionMensual = (this.planMenor.cantidadTotal - this.planMenor.cantidadAcumulada)/this.planMenor.tiempoRestante;
      this.planMayor.aportacionMensual = (this.planMayor.cantidadTotal - this.planMayor.cantidadAcumulada)/this.planMayor.tiempoRestante;
      ahorrar = this.planMenor.aportacionMensual + this.planMayor.aportacionMensual;
      gasto = this.usuarioCargado.ingresoCantidad - ahorrar;
      return await this.validarGasto(margenMax, margenMin, gasto);
    }

    var ahorrar2 = 0;
    this.planMenor.aportacionMensual = (this.planMenor.cantidadTotal - this.planMenor.cantidadAcumulada)/this.planMenor.tiempoRestante;
    this.planesPrioritarios.push(this.planMenor);
    this.planesPrioritarios.forEach(element => {
      ahorrar += element.aportacionMensual;
    });

    gasto = this.usuarioCargado.ingresoCantidad - ahorrar;
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
      gasto = this.usuarioCargado.ingresoCantidad - ahorrar;
      return this.validarGasto(margenMax,margenMin, gasto);
    } 
    
    else if(this.planes.length == 2) {
      if(this.planMenor.aportacionMensual >= (ahorrar2)) {
        return this.intentarPrioritario(margenMax,margenMin);
      }
      this.planMayor.aportacionMensual = ahorrar2 - this.planMenor.aportacionMensual;
      ahorrar += ahorrar2;
      gasto = this.usuarioCargado.ingresoCantidad - ahorrar;
      return this.validarGasto(margenMax,margenMin, gasto);
    } 
    
    else {
      if(this.planMenor.aportacionMensual>= (ahorrar2/2)) {
        return this.intentarPrioritario(margenMax,margenMin);
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
        gasto = this.usuarioCargado.ingresoCantidad - ahorrar;
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
      gasto = this.usuarioCargado.ingresoCantidad - ahorrar;
      return this.validarGasto(margenMax,margenMin, gasto);
    }
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

  async calcularEstimacion(margenMin: number) {
    var estimacion = -1 * (this.planNuevo.cantidadTotal-this.planNuevo.cantidadAcumulada);
    var estimacion = estimacion/(margenMin - this.usuarioCargado.ingresoCantidad);
    var aux = Math.round(estimacion);
    if(aux < estimacion) {
      estimacion = estimacion + 0.5;
    }
    await this.accionesService.presentAlertGenerica("ATENCION", "Te sugerimos que aumentes el tiempo de " + 
    "tu plan minimo a " + Math.round(estimacion) + " meses para poder cumplirlo");
  }

  async calcularEstimacionDosPlanes(margenMin: number) {
    if(this.planes.length == 1 ) { 
      var estimacion = (this.planNuevo.cantidadTotal - this.planNuevo.cantidadAcumulada) + (this.planes[0].cantidadTotal - this.planes[0].cantidadAcumulada);
    } else {
      var estimacion = 0;
      this.planes.forEach(element => {
        estimacion += (element.cantidadTotal - element.cantidadAcumulada);
      });
    }
    
    estimacion = -1 * estimacion;
    estimacion = estimacion/(margenMin - this.usuarioCargado.ingresoCantidad);
    var aux = Math.round(estimacion);
    console.log(estimacion + ' ' + aux);
    if(aux < estimacion) {
      estimacion = estimacion + 0.5;
    }
    await this.accionesService.presentAlertGenerica("ATENCION", "Te sugerimos que aumentes el tiempo de " + 
    "tu plan minimo a " + Math.round(estimacion) + " meses para poder cumplirlo");
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

  tiempoPlan(event) {
    if(this.tiempo.value != Math.round(this.planNuevo.tiempoTotal).toString()) {
      this.tiempo.value = this.tiempo.value.substr(0, this.tiempo.value.length - 1);
    }
  }

  ionViewDidEnter() {
    this.backButtonSub = this.plt.backButton.subscribeWithPriority( 10000, () => {
      this.modalCtrl.dismiss();
      if(this.registro == 'true'){
        this.nav.navigateRoot('/tabs/tab1');
      } else {
      this.nav.navigateRoot('/tabs/tab2');
      }
    });
  }
}
