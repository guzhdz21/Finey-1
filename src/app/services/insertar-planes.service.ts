import { Injectable, ɵNgModuleFactory } from '@angular/core';
import { Plan, AlertaGeneral, UsuarioLocal } from '../interfaces/interfaces';
import { DatosService } from './datos.service';
import { AccionesService } from './acciones.service';
import { ModalController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class InsertarPlanesService {

  constructor(private datosService: DatosService,
              private accionesService: AccionesService,
              private modalCtrl: ModalController,
              private nav: NavController,
              private router: Router) {  }

    //Variable para guardar los datos del nuevo plan
    planNuevo: Plan;
  
    //Variable para guardar la infromacion de las alertas
    alertas: AlertaGeneral[] = [];
  
    //Variable que guarda la informacion del usuario
    usuarioCargado: UsuarioLocal = this.datosService.usuarioCarga;

    ingresoExtra: number = this.datosService.ingresoExtra;
  
    //Variable que guarda los datos de los planes registrados y luego se usa para manipularlos
    planes: Plan[] = this.datosService.planesCargados;
  
    //Varibale auciliar que guarda un arreglo de planes
    planesaux: Plan[] = [];
  
    //Variable auxiliar que guardara los planes originales antes de hacer todos los cambios
    planesOriginales: Plan[] = [];
  
    planesPausados: Plan[] = [];
  
    //Variable que guarda los planes que son prioritarios
    planesPrioritarios: Plan[] = [];
  
    //Variable que nos indica si se encontro algun plan prioritario y si se deberian pausar
    prioridadDos: boolean = false; 
  
    //Varibales que guardan el plan mayor y el menor de todo un arreglo de planes
    planMayor: Plan;
    planMenor: Plan;
    
    //Variable que nos indica si el plan uevo fue creado sin ningun  inconveniente
    creado: boolean;
  
    //Variable que nos indica si el ususario escogio la opcion de pausar
    pausa: boolean = false;
  
    //Variable que nos indica so el usuario escogio la opcion de modificar
    modificar: boolean;
  
    //Variable que nos indica si el usuario escogio la opcion de modificar cuando se encontro que un plan recibia muy poco
    modificarOcho: boolean;
  
    prioridadMinimo: boolean;
  
    diferenciaFondo: number = this.datosService.diferencia;
  
    gastosUsuario: number;

     //Metodo que manda llamar los metodos para calcular los datos para agregar un plan nuevo y lo guarda en el Storage si es que es valido
    async calcularYRegistrar(planN: Plan) {

    await this.datosService.cargarDatosPlan();
    this.planes = this.datosService.planesCargados;
    await this.datosService.cargarDiferencia();
    this.diferenciaFondo = this.datosService.diferencia;
    await this.datosService.cargarDatos();
    this.usuarioCargado = this.datosService.usuarioCarga;
    await this.datosService.cargarIngresoExtra();
    this.ingresoExtra = this.datosService.ingresoExtra;

      //Inicializacion de variables
      this.planNuevo = planN;
      this.planesPrioritarios = [];
      this.planesPausados = [];
      this.planesOriginales = JSON.parse(JSON.stringify(this.planes));
      this.planes.forEach(element => {
        if(element.pausado == true) {
          this.planesPausados.push(element);
        }
      });
      this.planes = this.planes.filter(plan => plan.pausado != true);
  
      //Valores iniciales
      var unPlan = false;
      var margenMax = 0;
      var margenMin = 0;
  
      //Verificar si hay planes previos
      if( this.planes.length < 1 || this.datosService.planesExisten == false) {
        unPlan = true;
      }
  
      //Obtner margenes maximos y minimos
      this.gastosUsuario = 0;
      this.usuarioCargado.gastos.forEach(element => {
        if( element.cantidad != 0 ) {
          margenMax += element.margenMax;
          margenMin += element.margenMin;
          this.gastosUsuario += element.cantidad;
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
  
        //Casos mas de un plan
        if(unPlan == false) {
  
          //Caso dos planes
          if(this.planes.length == 1) { 
            await this.casoDosPlanes(margenMax, margenMin);
            return;
          }
  
          //caso mas de dos planes
          this.casoMasDosPlanes(margenMax, margenMin);
          return;
        }
  
        //Caso un plan
        this.casoUnPlan(margenMax, margenMin);
        return;
      }
  
      return;
    }
  
    //Metodo para validar el ingreso del plan
    async validarPlan(margenMax: number, margenMin: number, unPlan: boolean) {
      //Calculamos gasto y mandamos llamar el metodo que mostrara la alerta segun el caso
        var gasto = 0;
        gasto = this.usuarioCargado.ingresoCantidad + this.ingresoExtra - this.planNuevo.aportacionMensual - this.diferenciaFondo;
        var ochoPorciento = this.obtenerOchoPorciento(margenMax);
        if(await this.alertasUnPlan(margenMax, margenMin, gasto, unPlan)) {
          if(await this.siPlanNuevoMuyPequeño(ochoPorciento, margenMax, margenMin)) {
            return false;
          }
          return true;
        } 
        return false;
    }
  
    //Metodo que valida el caso de ingreso de plan e imprime una alerta segun el caso
    async alertasUnPlan( margenMax: number, margenMin: number, gasto: number, unPlan: boolean) {
      //Caso que es posible en el margen maximo (no se imprime alerta ya que esa se imprime ya que ingresa el plan)
      if (gasto >= margenMax || gasto >= this.gastosUsuario) {
        return true;
      //Caso que es posible en margen minimo (se imprime sol si es un plan la alerta ya que para mas se imprime despues)
      } else if ( ( gasto < margenMax ) && (gasto >= margenMin ) ) {
         
        if(unPlan) {
          await this.accionesService.presentAlertPlan([{text: 'Crear', handler: (blah) => {this.accionesService.alertaPlanCrear = true}},
                                                      {text: 'Modificar', handler: (blah) => {this.accionesService.alertaPlanCrear = false}}], 
          'Plan que apenas es posible', 
          'Puedes crear el plan y cumplirlo en el tiempo establecido MIENTRAS te mantengas en GASTOS MINIMOS en los ' + 
          'gastos promedio (luz, agua, etc.) o puedes aumentar el tiempo en conseguirlo para que no estes tan presionado');
          return this.accionesService.alertaPlanCrear;
        }
  
        return true;
  
        //Caso que no es posible
      } else {
        await this.accionesService.presentAlertPlan([{text: 'Modificar', handler: (blah) => {}}], 
        'No puedes completar este plan en ese tiempo', 'Presiona Modificar y aumenta tu tiempo para ser apto de conseguirlo');
        this.calcularEstimacionPlanes(margenMin, true);
        return false;
      }
    }
  
    //Metodo que ejecuta todos lo necesario para validar e ingresar un plan
    async casoUnPlan(margenMax: number, margenMin: number) {
      //Obtenemos el ochoporciento del fondo de ahorro del ussuario llamamos el metdo que lo valida
      //var ochoPorciento = this.obtenerOchoPorciento(margenMax);
  
      //if(await this.siPlanNuevoMuyPequeño(ochoPorciento, margenMax, margenMin)) {
        //Retorna si no es valido
        //return;
      //}
  
      //Guarda el nuevo plan
      this.planes = [];
      this.planes.push(this.planNuevo);
      await this.guardarCambiosAPlanes();
      this.actualizarUsuario();
      this.modalCtrl.dismiss()
      this.nav.navigateRoot('/tabs/tab2');
      return;
    }
  
    //Metodo que ejecuta todos lo necesario para validar e ingresar un plan cuando ya hay uno ingresado
    async casoDosPlanes(margenMax: number, margenMin: number){
      //Llammos el metodo que realiza los calculos
      await this.calculosDosPlanes(margenMax, margenMin);
  
      //Casos en que se encuentra un plan prioritario y nose puede satisfacer con el sueldo del ussuario
      //Caso en que el usuario escogio pausar los no prioritarios
      if(this.prioridadDos == true) {
        var planPrioritario = this.planMenor;
        await this.pausarPorPrioridadDosPlanes(planPrioritario);
        this.planesPausados.forEach(element => {
          this.planes.push(element);
        });
        await this.datosService.actualizarPlanes(this.planes);
        this.actualizarUsuario();
        this.modalCtrl.dismiss();
        this.nav.navigateRoot('/tabs/tab2');
        return;
      }
  
      //Caso en que el usuario escogio modificar tiempos
      if(this.modificar == true) {
        this.planes.push(this.planNuevo);
        this.datosService.actualizarPlanes(this.planes);
        this.irAPlanModificar();
        return;
      }
  
      //Caso en que el los planes fueron validos
      if(this.creado) {
  
        //Se inserta plan
        this.planes.push(this.planNuevo);
        await this.guardarCambiosAPlanes();
        this.actualizarUsuario();
        this.modalCtrl.dismiss();
        this.nav.navigateRoot('/tabs/tab2');
        return;
      }
      this.planes = this.planesOriginales;
      return;
    }
  
    //Metodo que realiza calculos inciales para validar
    async calculosDosPlanes(margenMax: number, margenMin: number) {
      //Valores inciales de variables
      var ahorrar = 0;
      this.planMenor = this.planes[0];
      this.planMayor = this.planNuevo;
      var gasto = 0;
  
      //Buacamos que plan de los dos es mayor y cual menor
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
  
      //Obtenemos cuanto debe ahorrar y aportacion mensual del menor
      ahorrar += (this.planMenor.cantidadTotal - this.planMenor.cantidadAcumulada) + (this.planMayor.cantidadTotal - this.planMayor.cantidadAcumulada);
      ahorrar /= this.planMayor.tiempoRestante;
      gasto = this.usuarioCargado.ingresoCantidad + this.ingresoExtra - ahorrar - this.diferenciaFondo;
  
      this.planMenor.aportacionMensual = (this.planMenor.cantidadTotal - this.planMenor.cantidadAcumulada)/this.planMenor.tiempoRestante;
      
      //Llamamos el metodoq ue valida
      await this.validarDosplanes(ahorrar, gasto, margenMax, margenMin)
    }
  
    //Metodo que valida dos planes y procede segun el caso
    async validarDosplanes(ahorrar: number, gasto: number, margenMax: number, margenMin: number){
      //Caso en que son posibles en margen maximo
      if (gasto  >= margenMax || gasto >= this.gastosUsuario) {
  
        //Verificamso si hay prioritario
        if(this.planMenor.aportacionMensual >= ahorrar) {
          //Llamamos al metodo que hace los procesos de prioridad
          await this.opcionesPrioridad(margenMax, margenMin);
          return;
        } else {
          //Calculos finales de validacion
          this.planMayor.aportacionMensual = ahorrar - this.planMenor.aportacionMensual;
          this.creado = true;
          return;
        }
  
        //Caso en que son posibles en margen minimo
      } else if ( ( gasto < margenMax ) && (gasto >= margenMin ) ) {
        
        //Varificamos si hay plan prioritario
        if(this.planMenor.aportacionMensual >= ahorrar) {
          //Llamamos el metodo que ejecuta los procesos para prioridad
          await this.opcionesPrioridad(margenMax, margenMin);
          return;
  
        } else {
          //Alerta para el ususario y se decide que hacer
          this.planMayor.aportacionMensual = ahorrar - this.planMenor.aportacionMensual;
          await this.accionesService.presentAlertPlan([{text: 'Crear', handler: (blah) => {this.accionesService.alertaPlanCrear = true}},
                                                    {text: 'Modificar', handler: (blah) => {this.accionesService.alertaPlanCrear = false}}], 
                                                    'Plan que apenas es posible', 
          'Puedes crear el plan y cumplirlo en el tiempo establecido MIENTRAS te mantengas en GASTOS MINIMOS en los gastos promedio (luz, agua, etc.) o puedes aumentar el tiempo en conseguirlo para que no estes tan presionado');
          this.creado = this.accionesService.alertaPlanCrear;
          return;
        }
  
        //Caso en que no son posibles
      } else {
        await this.accionesService.presentAlertPlan([{text: 'Modificar', handler: (blah) => {}}], 
        'No puedes completar este plan en ese tiempo', 'Presiona Modificar y aumenta tu tiempo para ser apto de conseguirlo');
        this.creado = false;
        this.calcularEstimacionPlanes(margenMin, false);
        return;
      }
    }
  
    //Metodo que ejecuta los procesos para el caso de encontrar un plan de prioridad
    async opcionesPrioridad(margenMax: number, margenMin: number) {
      //Vemos si es posible darle al prioritario lo necesario y que no afecte al ussuario
      if(await this.intentarPrioritario(margenMax, margenMin)) {
        if(this.prioridadMinimo) {
          await this.accionesService.presentAlertPlan([{text: 'Crear', handler: (blah) => {this.accionesService.alertaPlanCrear = true}},
                                                    {text: 'Modificar', handler: (blah) => {this.accionesService.alertaPlanCrear = false}}], 
                                                    'Plan que apenas es posible', 
          'Puedes crear el plan y cumplirlo en el tiempo establecido MIENTRAS te mantengas en GASTOS MINIMOS en los gastos promedio (luz, agua, etc.) o puedes aumentar el tiempo en conseguirlo para que no estes tan presionado');
          if(!this.accionesService.alertaPlanCrear) {
            this.creado = false;
            return;
          }
        } 
        this.prioridadDos = false;
        this.creado = true;
        return;
      } else {
        //Si no es posible entonces se llama el metodo que le da opciones al ussuario
        if(this.planesPrioritarios.length > 0) {
          await this.prioridad(this.planesPrioritarios[0].nombre);
        } else {
        await this.prioridad(this.planMenor.nombre);
        }
        this.creado = false;
        return;
      }
    }
  
    //Metodo que Pausa el plan no proritario si el ussuario escogio esa opcion
    pausarPorPrioridadDosPlanes(planPrioiritario: Plan) {
      this.planes.push(this.planNuevo);
      this.planes.forEach(element => {
        if(element != planPrioiritario) {
            element.aportacionMensual = 0;
            element.pausado = true;
        } else {
            element.aportacionMensual = (element.cantidadTotal - element.cantidadAcumulada)/element.tiempoRestante;
        }
      });
    }
  
    //Metodo que ejecuta todos lo necesario para validar e ingresar un plan cuando ya hay dos o mas ingresados
    async casoMasDosPlanes(margenMax, margenMin) {
       //Llammos el metodo que realiza los calculos
      await this.calculosMasDosPlanes(margenMax, margenMin);
  
      //Casos en que se encuentra un plan prioritario y nose puede satisfacer con el sueldo del ussuario
      //Caso en que el usuario escogio pausar los no prioritarios
      if(this.prioridadDos == true) {
        if(await this.pausarODividirMasDosPlanes(margenMax, margenMin)) {
          return;
        }
  
        this.planes = this.planesOriginales;
        return;
      }
  
      //Caso en que el ussuario escogio modificar tiempos
      if(this.modificar == true) {
        this.planes.forEach(element => {
          this.planesPrioritarios.push(element);
        });
  
        this.datosService.actualizarPlanes(this.planesPrioritarios);
        this.irAPlanModificar();
        return;
      }
      
      //Caso en que el los planes fueron validos
      if(this.creado) {
  
         //Se inserta plan
        await this.guardarCambiosAPlanes();
        this.actualizarUsuario();
        this.modalCtrl.dismiss();
        this.nav.navigateRoot('/tabs/tab2');
        return;
      }
  
      this.planes = this.planesOriginales;
      return;
    }
  
    //Metodo que realiza calculos inciales para validar
    async calculosMasDosPlanes(margenMax: number, margenMin: number) {
      //Valores iniciales de variables
      var ahorrar = 0;
      this.planMenor = this.planes[0];
      this.planMayor = this.planNuevo;
      var gasto = 0;
  
      //Determinamos que plan es mayor y cual es menor
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
      
      //Veos si el plan nuevo es mayor o menor del resultado anterios
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
      
      //Calculamos cuanto debe ahorrar el susuario, agregamos nuevo plan y vemos si es valido
      ahorrar /= this.planMayor.tiempoRestante;
      gasto = this.usuarioCargado.ingresoCantidad + this.ingresoExtra - ahorrar - this.diferenciaFondo;
      this.planes.push(this.planNuevo);
      await this.validarMasDosPlanes(ahorrar, gasto, margenMax, margenMin);
    }
  
    //Metodo que valida mas de dos planes y procede segun el caso
    async validarMasDosPlanes(ahorrar: number, gasto: number, margenMax: number, margenMin: number) {
  
      //Obtenemos la paortacion mensual del plan menor
      this.planMenor.aportacionMensual = (this.planMenor.cantidadTotal - this.planMenor.cantidadAcumulada)/this.planMenor.tiempoRestante;
      //Caso en que son posibles en margen maximo
      if (gasto  >= margenMax || gasto >= this.gastosUsuario) {
  
        //Verificamso si hay prioritario
        var acumulacion = this.planMenor.aportacionMensual * (this.planes.length -1);
        if(acumulacion >= (ahorrar)) {
          await this.opcionesPrioridadDos(margenMax, margenMin);
          //Llamamos al metodo que hace los procesos de prioridad
        } else {
          //Llamamos al metodo que hace los calculos finales de validacion
          this.confirmarCreacionMasDosPlanes(ahorrar);
          return;
        }
             
        //Caso en que son posibles en margen minimo
      } else if ( ( gasto < margenMax ) && (gasto >= margenMin ) ) {
  
        //Verificamso si hay prioritario
        var acumulacion = this.planMenor.aportacionMensual * (this.planes.length -1);
        if(acumulacion >= (ahorrar)) {
          await this.opcionesPrioridadDos(margenMax, margenMin);
  
        } else {
          //Alerta al ususario con ocpiones
          await this.accionesService.presentAlertPlan([{text: 'Crear', handler: (blah) => {this.accionesService.alertaPlanCrear = true}},
                                                    {text: 'Modificar', handler: (blah) => {this.accionesService.alertaPlanCrear = false}}], 
                                                    'Plan que apenas es posible', 
          'Puedes crear el plan y cumplirlo en el tiempo establecido MIENTRAS te mantengas en GASTOS MINIMOS en los gastos promedio (luz, agua, etc.) o puedes aumentar el tiempo en conseguirlo para que no estes tan presionado');
          this.creado = this.accionesService.alertaPlanCrear;
  
          //Procedemos segun la opcion
          if(this.creado) {
            this.confirmarCreacionMasDosPlanes(ahorrar);
          }
          return;
        }
  
        //Caso e que no son posibles
      } else {
        await this.accionesService.presentAlertPlan([{text: 'Modificar', handler: (blah) => {}}], 
        'No puedes completar este plan en ese tiempo', 'Presiona Modificar y aumenta tu tiempo para ser apto de conseguirlo');
        this.creado = false;
        this.calcularEstimacionPlanes(margenMin, false);
        return; 
      }
    }
  
    //Metodo que ejecuta los procesos para el caso de encontrar un plan de prioridad
    async opcionesPrioridadDos(margenMax: number, margenMin: number) {
  
      //Vemos si es posible darle al prioritario lo necesario y que no afecte al ussuario
      if(await this.intentarPrioritario(margenMax, margenMin)) {
        //Calculos finales en el caso de que si se pueda
        if(this.prioridadMinimo) {
          await this.accionesService.presentAlertPlan([{text: 'Crear', handler: (blah) => {this.accionesService.alertaPlanCrear = true}},
                                                    {text: 'Modificar', handler: (blah) => {this.accionesService.alertaPlanCrear = false}}], 
                                                    'Plan que apenas es posible', 
          'Puedes crear el plan y cumplirlo en el tiempo establecido MIENTRAS te mantengas en GASTOS MINIMOS en los gastos promedio (luz, agua, etc.) o puedes aumentar el tiempo en conseguirlo para que no estes tan presionado');
          if(!this.accionesService.alertaPlanCrear) {
            this.creado = false;
            return;
          }
        } 
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
        //Vemos que opcion escoge el usuario
        if(this.planesPrioritarios.length > 0) {
          await this.prioridad(this.planesPrioritarios[0].nombre);
        } else {
          await this.prioridad(this.planMenor.nombre);
          this.creado = false;
        }
  
        if(this.prioridadDos) {
          //Vemos si el ussuario desea pausar o no
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
  
    //Calculos finales para la incorporacion del nuevo plan
    confirmarCreacionMasDosPlanes(ahorrar: number) {
      //Vemos si todos los planes tienen el mismo tiempo
      var iguales = true;
      this.planes.forEach(element => {
        if(element.tiempoRestante != this.planMenor.tiempoRestante) {
          iguales = false;
        }
      });
      //Caso en el que si tengan el mismo tiempo
      if(iguales) {
        this.planes.forEach(element => {
          element.aportacionMensual = (element.cantidadTotal - element.cantidadAcumulada)/element.tiempoRestante;
        });
        this.creado = true;
        return;
      }
  
      //Caso diferente tiempo
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
  
    //Metodo que va al menu de pausa o dividide igualitariamente el sobrante entre los planes no prioritarios
    async pausarODividirMasDosPlanes(margenMax: number, margenMin: number) {
  
      //Caso de pausar
      if(this.pausa) {
        this.datosService.actualizarPlanes(this.planes);
        this.irAPlanPausar(margenMax, margenMin);
        return true;
      }
  
      //Calculos para dividir igualirtariamente
      var ahorro = 0;
      this.planesPrioritarios.forEach(element => {
        ahorro += element.aportacionMensual;
      });
  
      ahorro = this.usuarioCargado.ingresoCantidad + this.ingresoExtra - ahorro;
      var gasto = margenMin;
      ahorro = ahorro - gasto;
      ahorro /= this.planes.length;
  
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
  
      this.planesPausados.forEach(element => {
        this.planesPrioritarios.push(element);
      });
  
      await this.datosService.actualizarPlanes(this.planesPrioritarios);
      this.actualizarUsuario();
      this.modalCtrl.dismiss();
      this.nav.navigateRoot('/tabs/tab2');
      return true;
    }
  
    //Metodo que obtiene el ocho porciento del fondo de ahorro del usuario
    obtenerOchoPorciento(margenMax: number) {
      return (this.usuarioCargado.ingresoCantidad + this.ingresoExtra - margenMax - this.diferenciaFondo)*0.08;
    }
  
    //Metodo que es llamado cuando el plan nuevo recibe menos o el 8%
    async siPlanNuevoMuyPequeño(ochoPorciento: number, margenMax: number, margenMin: number) {
      if(this.planNuevo.aportacionMensual <= ochoPorciento) {
        await this.accionesService.presentAlertPlan([{text: 'Ok', handler: (blah) => {}}], 
                                                        'Plan demasiado pequeño', 
                'Reduce el tiempo para completarlo o aumenta la cantidad');
        return true;
      }
      return false;
    }
  
    //Metodo que hace los procedimeinto necesarios para intentar satisfacer los planes prioritarios (analizalo arlex)
    async intentarPrioritario(margenMax: number, margenMin: number) {
      this.prioridadMinimo = false;
      var ahorrar: number = 0;
      var gasto: number;
  
      if(this.planes.length == 1) {
        this.planMenor.aportacionMensual = (this.planMenor.cantidadTotal - this.planMenor.cantidadAcumulada)/this.planMenor.tiempoRestante;
        this.planMayor.aportacionMensual = (this.planMayor.cantidadTotal - this.planMayor.cantidadAcumulada)/this.planMayor.tiempoRestante;
        ahorrar = this.planMenor.aportacionMensual + this.planMayor.aportacionMensual;
        gasto = this.usuarioCargado.ingresoCantidad + this.ingresoExtra - ahorrar;
        return await this.validarGasto(margenMax, margenMin, gasto);
      }
  
      var ahorrar2 = 0;
      this.planMenor.aportacionMensual = (this.planMenor.cantidadTotal - this.planMenor.cantidadAcumulada)/this.planMenor.tiempoRestante;
      this.planesPrioritarios.push(this.planMenor);
      this.planesPrioritarios.forEach(element => {
        ahorrar += element.aportacionMensual;
      });
  
      gasto = this.usuarioCargado.ingresoCantidad + this.ingresoExtra - ahorrar - this.diferenciaFondo;
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
        gasto = this.usuarioCargado.ingresoCantidad + this.ingresoExtra - ahorrar - this.diferenciaFondo;
        return this.validarGasto(margenMax,margenMin, gasto);
      } 
      
      else if(this.planes.length == 2) {
        if(this.planMenor.aportacionMensual >= (ahorrar2)) {
          return this.intentarPrioritario(margenMax,margenMin);
        }
  
        this.planMayor.aportacionMensual = ahorrar2 - this.planMenor.aportacionMensual;
        ahorrar += ahorrar2;
        gasto = this.usuarioCargado.ingresoCantidad + this.ingresoExtra - ahorrar - this.diferenciaFondo;
        return this.validarGasto(margenMax,margenMin, gasto);
      } 
      
      else {
        var acumulacion = this.planMenor.aportacionMensual * (this.planes.length -1);
        if(acumulacion >= (ahorrar)) {
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
          gasto = this.usuarioCargado.ingresoCantidad + this.ingresoExtra - ahorrar - this.diferenciaFondo;
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
        gasto = this.usuarioCargado.ingresoCantidad + this.ingresoExtra - ahorrar - this.diferenciaFondo;
        return this.validarGasto(margenMax,margenMin, gasto);
      }
    }
  
    //Metodo que valida el gasto que se hace cuando se intenta satisfacer los planes prioriatrios
    validarGasto(margenMax: number, margenMin: number, gasto: number) {
      if (  gasto  >= margenMax || gasto >= this.gastosUsuario) {
        return true;
       }
       else if ( ( gasto < margenMax ) && (gasto >= margenMin ) ) {
         this.prioridadMinimo = true;
        return true;
       }
       else {
        return false;
       }
    }
  
    //Metodo que imprime las alertas de casos de prioridad y procede segun los escogido pro el susuario
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
  
    //Metodo que imprime alerta donde el suuario decidira si pausar o modificar los planes
    async pausar() {
      var pausar;
      await this.accionesService.presentAlertPlan([{text: 'Pausar', handler: (blah) => {pausar = true}},
                                                    {text: 'Repartir', handler: (blah) => {pausar = false}}], 
                                                    'Elije una opcion para proceder',
      'Puedes pausar todos los planes que escogas (excepto los prioritarios) o al prioritario acumularle lo necesario y del sobrante' + 
      ' repartirlo igualitariamente a los demas planes');
      return pausar;
    }
  
    //Metodo que guarda los cambios en los planes (se inserta uno nuevo correctamente)
    async guardarCambiosAPlanes() {
       await this.accionesService.presentAlertPlan([{text: 'Ok', handler: (blah) => {}}], 
                                                        'Plan creado', 
            '¡Si te propones gastar menos en tus gastos promedio (luz, agua, etc.) puedes completar tu plan en menos tiempo!');
        this.planesPausados.forEach(element => {
          this.planes.push(element);
        });
        await this.datosService.actualizarPlanes(this.planes);
    }
  
    //Metodo que calcula ala estimacion de los meses para que dos o mas planes puedan ser cumplidos
    async calcularEstimacionPlanes(margenMin: number, primero: boolean) {
      if(this.datosService.planesExisten == false || this.planes.length < 1) {
        var estimacion = (this.planNuevo.cantidadTotal - this.planNuevo.cantidadAcumulada);
      }
      else if(this.planes.length == 1 ) { 
        var estimacion = (this.planNuevo.cantidadTotal - this.planNuevo.cantidadAcumulada) + (this.planes[0].cantidadTotal - this.planes[0].cantidadAcumulada);
      } else {
        var estimacion = 0;
        this.planes.forEach(element => {
          estimacion += (element.cantidadTotal - element.cantidadAcumulada);
        });
        if(primero) {
          estimacion += this.planNuevo.cantidadTotal - this.planNuevo.cantidadAcumulada;
        }
      }
      
      estimacion = -1 * estimacion;
      estimacion = estimacion/(margenMin - this.usuarioCargado.ingresoCantidad + this.ingresoExtra + this.diferenciaFondo);
      var aux = Math.round(estimacion);
      if(aux < estimacion) {
        estimacion = estimacion + 0.5;
      }
      await this.accionesService.presentAlertGenerica("ATENCION", "Te sugerimos que aumentes el tiempo de " + 
      "tu plan minimo a " + Math.round(estimacion) + " meses para poder ingresarlo");
    }
    
    async actualizarUsuario() {
      await this.datosService.cargarDatos();
      this.usuarioCargado = this.datosService.usuarioCarga;
      this.usuarioCargado.fondoPlanes = 0;
      this.datosService.planesCargados.forEach(element => {
        if(element.pausado != true) {
          this.usuarioCargado.fondoPlanes += element.aportacionMensual; 
        }
      });
      this.usuarioCargado.fondoPlanes = Math.round(this.usuarioCargado.fondoPlanes*100)/100;
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
  
      this.usuarioCargado.fondoAhorro = this.usuarioCargado.ingresoCantidad + this.ingresoExtra - this.usuarioCargado.fondoPlanes - gastos;
      if(this.usuarioCargado.fondoAhorro < 0) {
        this.usuarioCargado.fondoAhorro = this.usuarioCargado.ingresoCantidad + this.ingresoExtra - this.usuarioCargado.fondoPlanes - margenMin;
      }
      this.usuarioCargado.fondoAhorro -= this.diferenciaFondo;
      this.usuarioCargado.fondoAhorro = Math.round(this.usuarioCargado.fondoAhorro*100)/100;
      
      if(this.usuarioCargado.ingresoCantidad + this.ingresoExtra - this.usuarioCargado.fondoPlanes < margenMax &&
        this.usuarioCargado.ingresoCantidad + this.ingresoExtra - this.usuarioCargado.fondoPlanes < this.gastosUsuario
        && this.usuarioCargado.ingresoCantidad + this.ingresoExtra - this.usuarioCargado.fondoPlanes >= margenMin) {
        this.accionesService.presentAlertGenerica('Gastos Minimos', 'Ahora estas en un sistema de gastos minimos, '+ 
        'esto quiere decir que se tomara en cuenta tus gastos en margen minimo (el pequeño margen de desviacion' + 
        ' en cada uno de tus gastos que provoca que gastes menos sobre todo en tus gastos promedio) para hacer los' + 
        'calculos de tus ahorros ya que al gastar menos ahorraras mas ,' +
        'pero recuerda que el porcentaje de ese ahorro que no es para los planes sera menor debido que '+ 
        'los planes se estan llevando casi todo, por lo tanto procura mantenerte dentro de se margen y' + 
        ' asi poder cumplir todos tus planes');
      }
      await this.datosService.guardarUsuarioInfo(this.usuarioCargado);
    }
  
    //Metodo que redirecciona a la page de pasuar planes
    irAPlanPausar(margenMax: number, margenMin) {
      this.modalCtrl.dismiss();
      this.nav.navigateRoot('/plan-pausar-page');
      this.router.navigate(['/plan-pausar-page'], {
        queryParams: {
          planesPrioritarios: JSON.stringify(this.planesPrioritarios),
          margenMax: margenMax,
          margenMin: margenMin,
          planesOriginales: JSON.stringify(this.planesOriginales),
          diferenciaFondo: this.diferenciaFondo,
          planesPausados: JSON.stringify(this.planesPausados)
        }
      });
      return;
    }
  
    //Metodo que redirecciona a la page de modificar tiempo de planes
    irAPlanModificar() {
      this.modalCtrl.dismiss();
      this.nav.navigateRoot('/modificar-tiempo-page');
      this.router.navigate(['/modificar-tiempo-page'], {
        queryParams: {
          planesOriginales: JSON.stringify(this.planesOriginales),
          planesPausados: JSON.stringify(this.planesPausados)
        }
      });
    }
}
