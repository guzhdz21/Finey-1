import { Component, OnInit, Input } from '@angular/core';
import { Plan, AlertaGeneral } from '../../interfaces/interfaces';
import { DatosService } from '../../services/datos.service';
import { NavController, ModalController, Platform } from '@ionic/angular';
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

  prioridadDos: boolean = false; 
  
  creado: boolean;

  pausa: boolean;

  backButtonSub: Subscription;

  planPrioritario: Plan;

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
          await this.dosPlanes(margenMax, margenMin);
          //Verificas si hay un plan prioritario
          if(this.prioridadDos == true) {
            this.planes.push(this.planNuevo);
            this.planes.forEach(element => {
              if(element != this.planPrioritario) {
                element.aportacionMensual = 0;
                element.pausado = true;
              } else {
                element.aportacionMensual = (element.cantidadTotal - element.cantidadAcumulada)/element.tiempoRestante;
              }
            });
            this.datosService.actualizarPlanes(this.planes);
            this.modalCtrl.dismiss();
            this.nav.navigateRoot('/tabs/tab2');
            return;
          }

          if(this.creado == true) {
            //Verificar si algun plan no recibe el 8% del fondo de ahorro
            if(await this.ocho(margenMax)) {
              if(this.prioridadDos) {
                this.planes.push(this.planNuevo);
                this.datosService.actualizarPlanes(this.planes);
                this.modalCtrl.dismiss();
                this.nav.navigateRoot('/plan-pausar-page');
                return;
              }
              return;
            }
            this.planes.push(this.planNuevo);
            this.datosService.actualizarPlanes(this.planes);
            this.modalCtrl.dismiss();
            this.nav.navigateRoot('/tabs/tab2');
            return;
          }
          return;
        }

        //Mas de dos planes
        await this.masDosPlanes(margenMax, margenMin);
        if(this.prioridadDos == true) {

          this.planes.push(this.planNuevo);
          this.datosService.actualizarPlanes(this.planes);
          if(this.pausa) {
          this.modalCtrl.dismiss();
          this.nav.navigateRoot('/plan-pausar-page');
          this.router.navigate(['/plan-pausar-page'],
          {
            queryParams: this.planPrioritario
          });
          }          
          return;
        }
        
        if(this.creado == true) {
          this.datosService.actualizarPlanes(this.planes);
          this.modalCtrl.dismiss();
          this.nav.navigateRoot('/tabs/tab2');
          return;
        }
        return;
      }

      //Un plan
      var ochoPorciento = (this.usuarioCargado.ingresoCantidad - margenMax)*0.08;
      //Verificar si el plan es menor o igual al 8% del dinero destinado ahorrar
      if(this.planNuevo.aportacionMensual <= ochoPorciento) {
        await this.accionesService.presentAlertPlan([{text: 'Ok', handler: (blah) => {}}], 
                                                    'Plan demasiado pequeño', 
      'Reduce el tiempo para completarlo o aumenta la cantidad');
      return;
      }
      this.planes = [];
      this.planes.push(this.planNuevo);
      this.datosService.actualizarPlanes(this.planes);
      this.modalCtrl.dismiss();
      this.nav.navigateRoot('/tabs/tab2');
      return;
    }
    return;
  }

  //Metodo para validar el ingreso del plan
  async validarPlan(margenMax: number, margenMin: number, unPLan: boolean) {
      var ahorrar = 0;
      ahorrar = this.usuarioCargado.ingresoCantidad - this.planNuevo.aportacionMensual;
      return this.alertasUnPlan(margenMax, margenMin, ahorrar, unPLan);
  }

  async masDosPlanes(margenMax: number, margenMin: number) {
    var ahorrar = 0;
    var planMenor = this.planes[0];
    var planMayor = this.planNuevo;
    var gasto = 0;

    this.planes.forEach(element => {
      if(planMenor.tiempoRestante > element.tiempoRestante) {
        planMenor = element;
      }
      if(planMayor.tiempoRestante < element.tiempoRestante) {
        planMayor = element;
      }
      ahorrar += (element.cantidadTotal - element.cantidadAcumulada); 
    });
    
    if(this.planNuevo.tiempoRestante < planMenor.tiempoRestante) {
      planMenor = this.planNuevo;
    }
    ahorrar += this.planNuevo.cantidadTotal - this.planNuevo.cantidadAcumulada;
    
    ahorrar /= planMayor.tiempoRestante;
    gasto = this.usuarioCargado.ingresoCantidad - ahorrar;

    if (gasto  >= margenMax) {

      planMenor.aportacionMensual = (planMenor.cantidadTotal - planMenor.cantidadAcumulada)/planMenor.tiempoRestante;

      if(planMenor.aportacionMensual >= (ahorrar/2)) {
        if(await this.prioridad(planMenor.nombre)) {
          this.prioridadDos = false;
          this.creado = false;
          return;
        } else {
          this.prioridadDos = true;
          this.creado = false;
          this.planPrioritario = planMenor;
          if(await this.pausar()) {
            this.pausa = true;
            return;
          }
          this.pausa = false;
          return;
        }

      } else {
        var aux = planMenor.aportacionMensual;
        this.planes.push(this.planNuevo);
        this.planes = this.planes.filter(plan => plan != planMenor);
        this.planes.forEach(element => {
          if(element != planMayor) {
            element.aportacionMensual = planMenor.aportacionMensual;
            aux += element.aportacionMensual;
          }
        });
        planMayor.aportacionMensual = ahorrar - aux;
        this.planes.push(planMenor);
        await this.accionesService.presentAlertPlan([{text: 'ok', handler: (blah) => {}}], 
                                                      'Plan creado', 
        '¡Si te propones gastar menos en tus gastos promedio (luz, agua, etc.) puedes completar tu plan en menos tiempo!');
        this.creado = true;
        return;
      }
           
    } else if ( ( gasto < margenMax ) && (ahorrar >= margenMin ) ) {

      planMenor.aportacionMensual = (planMenor.cantidadTotal - planMenor.cantidadAcumulada)/planMenor.tiempoRestante;
      
      if(planMenor.aportacionMensual >= (ahorrar)/2) {
        if(await this.prioridad(planMenor.nombre)) {
          this.prioridadDos = false;
          this.creado = false;
          return;
        } else {
          this.prioridadDos = true;
          this.planPrioritario = planMenor;
          if(await this.pausar()) {
          
          this.creado = false;
          return;
          }
          
        }

      } else {
        await this.accionesService.presentAlertPlan([{text: 'Crear', handler: (blah) => {this.accionesService.alertaPlanCrear = true}},
                                                  {text: 'Modificar', handler: (blah) => {this.accionesService.alertaPlanCrear = false}}], 
                                                  'Plan que apenas es posible', 
        'Puedes crear el plan y cumplirlo en el tiempo establecido MIENTRAS te mantengas en GASTOS MINIMOS en los gastos promedio (luz, agua, etc.) o puedes aumentar el tiempo en conseguirlo para que no estes tan presionado');
        this.creado = this.accionesService.alertaPlanCrear;
        if(this.creado = true) {
          var aux = planMenor.aportacionMensual;
          this.planes.push(this.planNuevo);
          this.planes = this.planes.filter(plan => plan != planMenor);
          this.planes.forEach(element => {
          if(element != planMayor) {
            element.aportacionMensual = planMenor.aportacionMensual;
            aux += element.aportacionMensual;
          }
        });
        planMayor.aportacionMensual = ahorrar - aux;
        this.planes.push(planMenor);
        }
        return;
      }

    } else {
      await this.accionesService.presentAlertPlan([{text: 'Modificar', handler: (blah) => {}}], 
      'No puedes completar este plan en ese tiempo', 'Presiona Modificar y aumenta tu tiempo para ser apto de conseguirlo');
      this.creado = false;
      return; 
    }
  }

  //Metodo que ingresa dos planes
  async dosPlanes(margenMax: number, margenMin: number) {
    //Variables iniciales
    var ahorrar = 0;
    var planMenor = this.planes[0];
    var planMayor = this.planNuevo;
    var gasto = 0;

    //Se determina cuanto debe ahorrar el ususario al mes
    ahorrar += (planMenor.cantidadTotal - planMenor.cantidadAcumulada) + planMayor.cantidadTotal;
    if(planMayor.tiempoTotal < planMenor.tiempoRestante) {
      var aux = planMenor;
      planMenor = planMayor;
      planMayor = aux;
    }
    ahorrar /= planMayor.tiempoRestante;
    gasto = this.usuarioCargado.ingresoCantidad - ahorrar;

    //Verificamos el caso de los planes
    //Caso en que quitando lo que debe ahorrar al mes el usuario, puede satisfacer sus necesidades basicas en los dos margenes
    if (gasto  >= margenMax) {
      
      planMenor.aportacionMensual = (planMenor.cantidadTotal - planMenor.cantidadAcumulada)/planMenor.tiempoRestante;

      //Verificar si el plan menor es prioritario
      if(planMenor.aportacionMensual >= ahorrar) {

        //Determinar si el ussuario desea pausar un plan 
        if(await this.prioridad(planMenor.nombre)) {
          this.prioridadDos = false;
          this.creado = false;
          return;
        } else {
          this.prioridadDos = true;
          this.planPrioritario = planMenor;
          this.creado = false;
          return;
        }

        //Un plan es aceptado y se le notifica al ususario
      } else {
        planMayor.aportacionMensual = ahorrar - planMenor.aportacionMensual;
        await this.accionesService.presentAlertPlan([{text: 'Ok', handler: (blah) => {}}], 
                                                      'Plan creado', 
        '¡Si te propones gastar menos en tus gastos promedio (luz, agua, etc.) puedes completar tu plan en menos tiempo!');
        this.creado = true;
        return;
      }
           
      //Caso en que quitando lo que debe ahorrar al mes el usuario, solo puede satidfacer sus necesidades basicas en margen minimo
    } else if ( ( gasto < margenMax ) && (ahorrar >= margenMin ) ) {

      planMenor.aportacionMensual = (planMenor.cantidadTotal - planMenor.cantidadAcumulada)/planMenor.tiempoRestante;
      
      //Veridficar si el plan menor es prioritario
      if(planMenor.aportacionMensual >= ahorrar) {

        //Determinar que desea hacer el ususario con el plan prioritario
        if(await this.prioridad(planMenor.nombre)) {
          this.prioridadDos = false;
          this.creado = false;
          return;
        } else {
          this.prioridadDos = true;
          this.planPrioritario = planMenor;
          this.creado = false;
          return;
        }

        //Plan es valido y se le da opcion al ussuario si desea modificarlo o crearlo 
      } else {
        planMayor.aportacionMensual = ahorrar - planMenor.aportacionMensual;
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
      return;
     }
  }

  async ocho(margenMax: number) {
    var ochoPorciento = (this.usuarioCargado.ingresoCantidad - margenMax)*0.08;

    if(this.planes.length == 1) {
      if(this.planNuevo.aportacionMensual <= ochoPorciento) {
        await this.accionesService.presentAlertPlan([{text: 'Ok', handler: (blah) => {}}], 
                                                    'Plan demasiado pequeño', 
      'Reduce el tiempo para completarlo o aumenta la cantidad');
      return true;
      } else if(this.planes[0].aportacionMensual <= ochoPorciento) {
        await this.accionesService.presentAlertPlan([{text: 'Modificar', handler: (blah) => {this.prioridadDos = false}},
                                                      {text: 'Pausar', handler: (blah) => {this.prioridadDos = true}}], 
                                                    'Plan demasiado pequeño', 
      'Se ha detectado que el otro plan actual recibira muy poco dinero, te pedimos que aumentes' +
      ' el tiempo del nuevo plan o pauses cualquiera de los dos');
      return true;
      }
      return false;
    }
  }
  //Metodo para preguntarle al usuario que se deberia hacer con su plan prioritario
  async prioridad(nombre: string) {
    var modificar;
    if(this.planes.length == 1) {
      await this.accionesService.presentAlertPlan([{text: 'No puedo', handler: (blah) => {modificar = false}},
                                                  {text: 'Modificar', handler: (blah) => {modificar = true}}], 
                                                  'Hemos detectado el plan ' + nombre + ' como prioritario', 
    'Puedes modificar los datos del plan nuevo, si no puedes hacer esto escoge "No puedo" para pausar el' + 
    ' plan que no es prioritario');
    return modificar;
    }
    await this.accionesService.presentAlertPlan([{text: 'No puedo', handler: (blah) => {modificar = false}},
                                                  {text: 'Modificar', handler: (blah) => {modificar = true}}], 
                                                  'Hemos detectado el plan ' + nombre + ' como prioritario', 
    'Puedes modificar los datos del plan nuevo, si no puedes hacer esto escoge "No puedo"');
    return modificar;
  }

  async pausar() {
    var pausar;
    await this.accionesService.presentAlertPlan([{text: 'Pausar', handler: (blah) => {pausar = true}},
                                                  {text: 'Repartir', handler: (blah) => {pausar = false}}], 
                                                  'Elije una opcion para proceder',
    'Puedes pausar todos los planes hasta que solo queden 2 o al prioritario acumularle lo necesario y del sobrante' + 
    ' repartirlo igualitariamente a los demas planes');
    return pausar;
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

  //Imprimir las alertas segun el caso
  async alertasUnPlan( margenMax: number, margenMin: number, ahorrar: number, unPlan: boolean) {
    if (  ahorrar  >= margenMax ) {
      if(unPlan) {
        await this.accionesService.presentAlertPlan([{text: 'ok', handler: (blah) => {}}], 
                                                    'Plan creado', 
      '¡Si te propones gastar menos en tus gastos promedio (luz, agua, etc.) puedes completar tu plan en menos tiempo!');
      }
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
