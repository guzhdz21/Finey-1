import { Injectable } from '@angular/core';
import { Plan, UsuarioLocal } from '../interfaces/interfaces';
import { DatosService } from './datos.service';
import { AccionesService } from './acciones.service';
import { ModalController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ModificarPlanesService {

  constructor(private datosService: DatosService, 
              private accionesService: AccionesService,
              private modalCtrl: ModalController,
              private nav: NavController,
              private router: Router) { }

  planes: Plan[] = [];

  invalido: boolean = false;
  invalido2: boolean = false;
  invalido3: boolean = false;
  invalido4: boolean = false;

  planesOriginales: Plan[] = [];
  //Variable auxiliar para que el el modal cargue algo ants de recibir los datos
  indexAux: number;

  //Variable que guarda la informaciond el usuario del ususario
  usuarioCargado: UsuarioLocal = this.datosService.usuarioCarga;

  ingresoExtra = this.datosService.ingresoExtra;

  //Variable auxiliar que guardara los planes originales antes de hacer todos los cambios

  planesRetornados: Plan[] = []

  planesPrioritarios: Plan[] = []

  planesPausados: Plan[] = [];

  //Varibale auciliar que guarda un arreglo de planes
  planesaux: Plan[] = [];

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
  
  diferenciaFondo: number = this.datosService.diferencia;

  planModificado: Plan;

  prioridadMinimo: boolean;

  multiplan: boolean;

  gastosUsuario: number;

  //Metodo para calcular los datos necesarios para un plan y guardarlo en el storage
  async calcularYModificar(planesOriginales: Plan[], indexAux: number, planes:Plan[]) {

    if(planes[indexAux].tiempoTotal <= 0){
      this.accionesService.presentAlertGenerica("Tiempo total inválido", "No puedes ingresar un tiempo total menor a 1 mes ni mayor a 96 meses");
      this.invalido = true;
      }
      else{
        this.invalido = false;
        }

      if(planes[indexAux].cantidadTotal <= 0){
        this.accionesService.presentAlertGenerica("Cantidad total inválida", "No puedes ingresar una cantidad negativa o igual a 0")
        this.invalido2 = true;
        }
        else{
          this.invalido2 = false;
          }

        if(planes[indexAux].tiempoRestante <= 0){
          this.accionesService.presentAlertGenerica("Tiempo restante inválido", "No puedes ingresar un tiempo restante menor a 1 mes ni mayor a el tiempo total del plan");
          this.invalido3 = true;
          }
          else{
            this.invalido3 = false;
            }

          if(planes[indexAux].cantidadAcumulada < 0){
            this.accionesService.presentAlertGenerica("Cantidad acumulada inválida", "No puedes ingresar una cantidad negativa");
            this.invalido4 = true;
            }
            else{
              this.invalido4 = false;
              }

            if(this.invalido == false && this.invalido2 == false && this.invalido3 == false && this.invalido4 == false){
              console.log("Guardado")
              await this.datosService.cargarDatos();
              this.usuarioCargado = this.datosService.usuarioCarga;
              await this.datosService.cargarDiferencia();
              this.diferenciaFondo = this.datosService.diferencia;
              await this.datosService.cargarIngresoExtra();
              this.ingresoExtra = this.datosService.ingresoExtra;
          
              this.planesOriginales = planesOriginales;
              this.planes = planes;
              this.planesPrioritarios = [];
              this.indexAux = indexAux;
          
              this.planes[this.indexAux].aportacionMensual = (this.planes[this.indexAux].cantidadTotal - this.planes[this.indexAux].cantidadAcumulada) / this.planes[this.indexAux].tiempoRestante;
              if(this.planes[this.indexAux].aportacionMensual <= 0) {
                await this.accionesService.presentAlertPlan([{text: 'Modificar', handler: (blah) => {}}], 
                                                                'PLan Invalido', 
                  'No puedes ingresar una cantidad acumulada mayor o igual al costo del plan');
                  return;
              }
          
              if(this.planes[this.indexAux].tiempoRestante > this.planes[this.indexAux].tiempoTotal || this.planes[this.indexAux].tiempoRestante == 0) {
                await this.accionesService.presentAlertPlan([{text: 'Modificar', handler: (blah) => {}}], 
                                                                'PLan Invalido', 
                  'No puedes ingresar una un tiempo restante mayor al costo del plan o igual a cero');
                  return;
              }
          
              if(this.planes[this.indexAux].pausado) {
                if(await this.validarPlanPausado()) {
                  await this.datosService.actualizarPlanes(this.planes);
                  await this.modalCtrl.dismiss();
                  this.actualizarUsuario();
                this.nav.navigateRoot('/tabs/tab2');
                return;
                }
                this.planes = JSON.parse(JSON.stringify(this.planesOriginales));
                return;
              }
          
              this.planesRetornados = JSON.parse(JSON.stringify(this.planes));
              this.planesPausados = [];
              this.planesRetornados.forEach(element => {
                if(element.pausado) {
                  this.planesPausados.push(element)
                }
              });
              this.planesRetornados = this.planesRetornados.filter(plan => plan.pausado != true);
              for(var plan of this.planesRetornados) {
                if(plan.nombre == this.planes[this.indexAux].nombre &&
                  plan.aportacionMensual == this.planes[this.indexAux].aportacionMensual &&
                  plan.cantidadAcumulada == this.planes[this.indexAux].cantidadAcumulada &&
                  plan.cantidadTotal == this.planes[this.indexAux].cantidadTotal &&
                  plan.descripcion == this.planes[this.indexAux].descripcion &&
                  plan.tiempoRestante == this.planes[this.indexAux].tiempoRestante &&
                  plan.tiempoTotal == this.planes[this.indexAux].tiempoTotal) {
                  this.planModificado = plan;
                }
              }
          
              if ( await this.validarPlanModificado() ) {
                await this.calcularYRegistrar();
              } else {
                this.planes = JSON.parse(JSON.stringify(this.planesOriginales));
              }
              return;
            }

  }

  //Metodo para validar el ingreso del plan
  async validarPlanModificado() {

    var margenMax = 0;
    var margenMin = 0;

    this.gastosUsuario = 0

    this.usuarioCargado.gastos.forEach(element => {
      if( element.cantidad != 0 ) {
        margenMax += element.margenMax;
        margenMin += element.margenMin;
        this.gastosUsuario += element.cantidad;
      }
    });

    if ( (this.usuarioCargado.ingresoCantidad + this.ingresoExtra - this.planes[this.indexAux].aportacionMensual ) >= margenMax 
    || (this.usuarioCargado.ingresoCantidad + this.ingresoExtra - this.planes[this.indexAux].aportacionMensual ) >= this.gastosUsuario ) {
      return true;
   }
    else if ( ( (this.usuarioCargado.ingresoCantidad + this.ingresoExtra - this.planes[this.indexAux].aportacionMensual) < margenMax ) 
    && (( this.usuarioCargado.ingresoCantidad + this.ingresoExtra - this.planes[this.indexAux].aportacionMensual) >= margenMin ) ) {
      if(this.planes.length == 1) {
        await this.accionesService.presentAlertPlan([{text: 'Guardar', handler: (blah) => {this.accionesService.alertaPlanCrear = true}},
                                                {text: 'Modificar', handler: (blah) => {this.accionesService.alertaPlanCrear = false}}], 
                                                'Plan que apenas es posible', 
        'Puedes guardar el plan y cumplirlo en el tiempo establecido MIENTRAS te mantengas en GASTOS MINIMOS en los gastos promedio (luz, agua, etc.) o puedes aumentar el tiempo en conseguirlo para que no estes tan presionado');
        return this.accionesService.alertaPlanCrear;
      }
      return true;
   }
   else {
    await this.accionesService.presentAlertPlan([{text: 'Modificar', handler: (blah) => {}}], 
    'No puedes completar este plan en ese tiempo', 'Presiona Modificar y aumenta tu tiempo para ser apto de conseguirlo');
    this.calcularEstimacionPlanes(margenMin);
    return false;
   }
  }

  async validarPlanPausado() {

    var margenMax = 0;
    var margenMin = 0;

    this.usuarioCargado.gastos.forEach(element => {
      if( element.cantidad != 0 ) {
        margenMax += element.margenMax;
        margenMin += element.margenMin;
      }
    });

    if ( (this.usuarioCargado.ingresoCantidad + this.ingresoExtra - this.planes[this.indexAux].aportacionMensual ) >= margenMax 
    || (this.usuarioCargado.ingresoCantidad + this.ingresoExtra - this.planes[this.indexAux].aportacionMensual ) >= this.gastosUsuario) {
      return true;
   }
    else if ( ( (this.usuarioCargado.ingresoCantidad + this.ingresoExtra - this.planes[this.indexAux].aportacionMensual) < margenMax ) 
    && (( this.usuarioCargado.ingresoCantidad + this.ingresoExtra - this.planes[this.indexAux].aportacionMensual) >= margenMin ) ) {
      return true;
   }
   else {
    await this.accionesService.presentAlertPlan([{text: 'Modificar', handler: (blah) => {}}], 
    'No puedes completar este plan en ese tiempo', 'Presiona Modificar y aumenta tu tiempo para ser apto de conseguirlo');
    this.calcularEstimacionPlanes(margenMin);
    return false;
   }
  }
  
  //Metodo que manda llamar los metodos para calcular los datos para agregar un plan nuevo y lo guarda en el Storage si es que es valido
  async calcularYRegistrar() {

    //Inicializacion de variables
    this.planesPrioritarios = [];
    this.planesRetornados.forEach(element => {
      if(element.pausado == true) {
        this.planesPausados.push(element);
      }
    });
    this.planesRetornados = this.planesRetornados.filter(plan => plan.pausado != true);

    //Valores iniciales
    var unPlan = false;
    var margenMax = 0;
    var margenMin = 0;

    //Verificar si hay planes previos
    if(this.planesRetornados.length == 1) {
      unPlan = true;
    }

    //Obtner margenes maximos y minimos
    this.usuarioCargado.gastos.forEach(element => {
      if( element.cantidad != 0 ) {
        margenMax += element.margenMax;
        margenMin += element.margenMin;
      } 
    });

    //Casos mas de un plan
    if(unPlan == false) {

      //Caso dos planes
      if(this.planesRetornados.length == 2) {
        this.multiplan = false; 
        await this.casoDosPlanes(margenMax, margenMin);
        return;
      }

      //caso mas de dos planes
      this.multiplan = true;
      this.casoMasDosPlanes(margenMax, margenMin);
      return;
    }

      //Caso un plan
      this.multiplan = false;
      this.casoUnPlan(margenMax, margenMin);
      return;
  }

  //Metodo que ejecuta todos lo necesario para validar e ingresar un plan
  async casoUnPlan(margenMax: number, margenMin: number) {
    //Obtenemos el ochoporciento del fondo de ahorro del ussuario llamamos el metdo que lo valida
    var ochoPorciento = this.obtenerOchoPorciento(margenMax);

    if(await this.siPlanModificadoMuyPequeño(ochoPorciento, margenMax, margenMin)) {
      this.planes = JSON.parse(JSON.stringify(this.planesOriginales));
      return;
    }

    //Guarda el nuevo plan
    this.planes = [];
    this.planes = this.planesRetornados;
    await this.guardarCambiosAPlanes();
    this.actualizarUsuario();
    this.modalCtrl.dismiss();
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
        this.planesRetornados.push(element);
      });
      this.planes = this.planesRetornados;
      await this.datosService.actualizarPlanes(this.planes);
      this.actualizarUsuario();
      this.modalCtrl.dismiss();
      this.nav.navigateRoot('/tabs/tab2');
      return;
    }

    //Caso en que el usuario escogio modificar tiempos
    if(this.modificar == true) {
      this.planes = this.planesRetornados;
      this.datosService.actualizarPlanes(this.planes);
      this.irAPlanModificar();
      return;
    }

    //Caso en que el los planes fueron validos
    if(this.creado) {

      //Se inserta plan
      this.planes = this.planesRetornados;
      await this.guardarCambiosAPlanes();
      this.actualizarUsuario();
      this.modalCtrl.dismiss();
      this.nav.navigateRoot('/tabs/tab2');
      return;
    }
    this.planes = JSON.parse(JSON.stringify(this.planesOriginales));
    return;
  }

  //Metodo que realiza calculos inciales para validar
  async calculosDosPlanes(margenMax: number, margenMin: number) {
    //Valores inciales de variables
    var ahorrar = 0;
    this.planMenor = this.planesRetornados[0];
    this.planMayor = this.planesRetornados[1];
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
    if (gasto  >= margenMax || gasto  >= this.gastosUsuario) {

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
        await this.accionesService.presentAlertPlan([{text: 'Guardar', handler: (blah) => {this.accionesService.alertaPlanCrear = true}},
                                                  {text: 'Modificar', handler: (blah) => {this.accionesService.alertaPlanCrear = false}}], 
                                                  'Plan que apenas es posible', 
        'Puedes guardar el plan y cumplirlo en el tiempo establecido MIENTRAS te mantengas en GASTOS MINIMOS en los gastos promedio (luz, agua, etc.) o puedes aumentar el tiempo en conseguirlo para que no estes tan presionado');
        this.creado = this.accionesService.alertaPlanCrear;
        return;
      }

      //Caso en que no son posibles
    } else {
      await this.accionesService.presentAlertPlan([{text: 'Modificar', handler: (blah) => {}}], 
      'No puedes completar este plan en ese tiempo', 'Presiona Modificar y aumenta tu tiempo para ser apto de conseguirlo');
      this.creado = false;
      this.calcularEstimacionPlanes(margenMin);
      return;
    }
  }

  //Metodo que ejecuta los procesos para el caso de encontrar un plan de prioridad
  async opcionesPrioridad(margenMax: number, margenMin: number) {
    //Vemos si es posible darle al prioritario lo necesario y que no afecte al ussuario
    if(await this.intentarPrioritario(margenMax, margenMin)) {
      if(this.prioridadMinimo) {
        await this.accionesService.presentAlertPlan([{text: 'Guardar', handler: (blah) => {this.accionesService.alertaPlanCrear = true}},
                                                  {text: 'Modificar', handler: (blah) => {this.accionesService.alertaPlanCrear = false}}], 
                                                  'Plan que apenas es posible', 
        'Puedes guardar el plan y cumplirlo en el tiempo establecido MIENTRAS te mantengas en GASTOS MINIMOS en los gastos promedio (luz, agua, etc.) o puedes aumentar el tiempo en conseguirlo para que no estes tan presionado');
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
      await this.prioridad(this.planMenor.nombre);
      this.creado = false;
      return;
    }
  }

  //Metodo que Pausa el plan no proritario si el ussuario escogio esa opcion
  pausarPorPrioridadDosPlanes(planPrioiritario: Plan) {
    this.planesRetornados.forEach(element => {
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
      this.planes = JSON.parse(JSON.stringify(this.planesOriginales));
      return;
    }

    //Caso en que el ussuario escogio modificar tiempos
    if(this.modificar == true) {
      this.planesRetornados.forEach(element => {
        this.planesPrioritarios.push(element);
      });
      this.datosService.actualizarPlanes(this.planesPrioritarios);
      this.irAPlanModificar();
      return;
    }
    
    //Caso en que el los planes fueron validos
    if(this.creado) {

      //Se inserta plan
      this.planes = this.planesRetornados;
      await this.guardarCambiosAPlanes();
      this.actualizarUsuario();
      this.modalCtrl.dismiss();
      this.nav.navigateRoot('/tabs/tab2');
      return;
    }

    this.planes = JSON.parse(JSON.stringify(this.planesOriginales));
    return;
  }

  //Metodo que realiza calculos inciales para validar
  async calculosMasDosPlanes(margenMax: number, margenMin: number) {
    //Valores iniciales de variables
    var ahorrar = 0;
    this.planMenor = this.planesRetornados[0];
    this.planMayor = this.planesRetornados[1];
    var gasto = 0;

    //Determinamos que plan es mayor y cual es menor
    this.planesRetornados.forEach(element => {
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
    
    //Calculamos cuanto debe ahorrar el susuario, agregamos nuevo plan y vemos si es valido
    ahorrar /= this.planMayor.tiempoRestante;
    gasto = this.usuarioCargado.ingresoCantidad + this.ingresoExtra - ahorrar - this.diferenciaFondo;
    await this.validarMasDosPlanes(ahorrar, gasto, margenMax, margenMin);
  }

  //Metodo que valida mas de dos planes y procede segun el caso
  async validarMasDosPlanes(ahorrar: number, gasto: number, margenMax: number, margenMin: number) {

    //Obtenemos la paortacion mensual del plan menor
    this.planMenor.aportacionMensual = (this.planMenor.cantidadTotal - this.planMenor.cantidadAcumulada)/this.planMenor.tiempoRestante;
    //Caso en que son posibles en margen maximo
    if (gasto  >= margenMax || gasto  >= this.gastosUsuario) {

      //Verificamso si hay prioritario
      var acumulacion = this.planMenor.aportacionMensual * (this.planesRetornados.length -1);
      if(acumulacion >= ahorrar) {
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
      var acumulacion = this.planMenor.aportacionMensual * (this.planesRetornados.length -1);
      if(acumulacion >= ahorrar) {
        await this.opcionesPrioridadDos(margenMax, margenMin);

      } else {
        //Alerta al ususario con ocpiones
        await this.accionesService.presentAlertPlan([{text: 'Guardar', handler: (blah) => {this.accionesService.alertaPlanCrear = true}},
                                                  {text: 'Modificar', handler: (blah) => {this.accionesService.alertaPlanCrear = false}}], 
                                                  'Plan que apenas es posible', 
        'Puedes guardar el plan y cumplirlo en el tiempo establecido MIENTRAS te mantengas en GASTOS MINIMOS en los gastos promedio (luz, agua, etc.) o puedes aumentar el tiempo en conseguirlo para que no estes tan presionado');
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
      this.calcularEstimacionPlanes(margenMin);
      return; 
    }
  }

  //Metodo que ejecuta los procesos para el caso de encontrar un plan de prioridad
  async opcionesPrioridadDos(margenMax: number, margenMin: number) {

    //Vemos si es posible darle al prioritario lo necesario y que no afecte al ussuario
    if(await this.intentarPrioritario(margenMax, margenMin)) {
      //Calculos finales en el caso de que si se pueda
      if(this.prioridadMinimo) {
        await this.accionesService.presentAlertPlan([{text: 'Guardar', handler: (blah) => {this.accionesService.alertaPlanCrear = true}},
                                                  {text: 'Modificar', handler: (blah) => {this.accionesService.alertaPlanCrear = false}}], 
                                                  'Plan que apenas es posible', 
        'Puedes guardar el plan y cumplirlo en el tiempo establecido MIENTRAS te mantengas en GASTOS MINIMOS en los gastos promedio (luz, agua, etc.) o puedes aumentar el tiempo en conseguirlo para que no estes tan presionado');
        if(!this.accionesService.alertaPlanCrear) {
          this.creado = false;
          return;
        }
      } 
      this.prioridadDos = false;
      this.planesaux = [];
      this.planesRetornados.forEach(element => {
        this.planesaux.push(element);
      });
      this.planesRetornados = []
      this.planesPrioritarios.forEach(element => {
        this.planesRetornados.push(element);
      });
      this.planesaux.forEach(element => {
        this.planesRetornados.push(element);
      });
      this.creado = true;
      return;

    } else {
      //Vemos que opcion escoge el ussuario
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
      this.creado = false;
      return;
    }
  }

  //Calculos finales para la incorporacion del nuevo plan
  confirmarCreacionMasDosPlanes(ahorrar: number) {
    //Vemos si todos los planes tienen el mismo tiempo
    var iguales = true;
    this.planesRetornados.forEach(element => {
      if(element.tiempoRestante != this.planMenor.tiempoRestante) {
        iguales = false;
      }
    });
    //Caso en el que si tengan el mismo tiempo
    if(iguales) {
      this.planesRetornados.forEach(element => {
        element.aportacionMensual = (element.cantidadTotal - element.cantidadAcumulada)/element.tiempoRestante;
      });
      this.creado = true;
      return;
    }

    //Caso diferente tiempo
    var aux = this.planMenor.aportacionMensual;
    this.planesRetornados = this.planesRetornados.filter(plan => plan != this.planMenor);
    this.planesRetornados.forEach(element => {
      if(element != this.planMayor) {
        element.aportacionMensual = this.planMenor.aportacionMensual;
        aux += element.aportacionMensual;
      }
    });

    this.planMayor.aportacionMensual = ahorrar - aux;
    this.planesRetornados.unshift(this.planMenor);
    this.creado = true;
    return;
  }

  //Metodo que va al menu de pausa o dividide igualitariamente el sobrante entre los planes no prioritarios
  async pausarODividirMasDosPlanes(margenMax: number, margenMin: number) {

    //Caso de pausar
    if(this.pausa) {
      this.planes = this.planesRetornados;
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
    ahorro /= this.planesRetornados.length;

    this.planesRetornados.forEach(element => {
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
  async siPlanModificadoMuyPequeño(ochoPorciento: number, margenMax: number, margenMin: number) {
    if(this.planModificado.aportacionMensual <= ochoPorciento) {
      if(this.planesRetornados.length == 2) {
        if(await this.intentarPrioritario(margenMax, margenMin)) {
          if(!(this.planModificado.aportacionMensual <= ochoPorciento)) {
            return false;
          }
        }
      }
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

    if(!this.multiplan) {
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

    this.planesRetornados = this.planesRetornados.filter(plan => plan != this.planMenor);
    this.planMenor = this.planes[0];
    this.planesRetornados.forEach(element => {
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
    if(this.planesRetornados.length == 1) {
      ahorrar += ahorrar2;
      gasto = this.usuarioCargado.ingresoCantidad + this.ingresoExtra - ahorrar - this.diferenciaFondo;
      return this.validarGasto(margenMax,margenMin, gasto);
    } 
    
    else if(this.planesRetornados.length == 2) {
      if(this.planMenor.aportacionMensual >= (ahorrar2)) {
        return this.intentarPrioritario(margenMax,margenMin);
      }

      this.planMayor.aportacionMensual = ahorrar2 - this.planMenor.aportacionMensual;
      ahorrar += ahorrar2;
      gasto = this.usuarioCargado.ingresoCantidad + this.ingresoExtra - ahorrar - this.diferenciaFondo;
      return this.validarGasto(margenMax,margenMin, gasto);
    } 
    
    else {
      var acumulacion = this.planMenor.aportacionMensual * (this.planesRetornados.length -1);
      if(acumulacion>= (ahorrar2)) {
        return this.intentarPrioritario(margenMax,margenMin);
      }

      var iguales = true;
      this.planesRetornados.forEach(element => {
        if(element.tiempoRestante != this.planMenor.tiempoRestante) {
          iguales = false;
        }
      });
      if(iguales) {
        this.planesRetornados.forEach(element => {
          element.aportacionMensual = (element.cantidadTotal - element.cantidadAcumulada)/element.tiempoRestante;
        });
        ahorrar += ahorrar2;
        gasto = this.usuarioCargado.ingresoCantidad + this.ingresoExtra - ahorrar - this.diferenciaFondo;
        return this.validarGasto(margenMax,margenMin, gasto);
      }

      var sobrante = ahorrar2 - this.planMenor.aportacionMensual;
      this.planesRetornados.forEach(element => {
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
    if (  gasto  >= margenMax || gasto  >= this.gastosUsuario) {
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
    if(this.planesRetornados.length == 2) {
      await this.accionesService.presentAlertPlan([{text: 'No puedo', handler: (blah) => {this.modificar = false, this.prioridadDos = true}},
                                                  {text: 'Modificar', handler: (blah) => {this.modificar = true, this.prioridadDos = false}},
                                                  {text: 'Cancelar', handler: (blah) => {this.modificar = false, this.prioridadDos = false}}], 
                                                  'Se ha detectado el plan ' + nombre + ' como de maxima prioridad', 
    'Puedes guardar el plan y modificar el tiempo de los planes para hacer posible ' + 
    ' completar los planes, si no puedes hacer esto escoge "No puedo" para pausar el' + 
    ' plan que no es prioritario');
    return;

    }

    await this.accionesService.presentAlertPlan([{text: 'No puedo', handler: (blah) => {this.modificar = false, this.prioridadDos = true}},
                                                  {text: 'Modificar', handler: (blah) => {this.modificar = true, this.prioridadDos = false}},
                                                  {text: 'Cancelar', handler: (blah) => {this.modificar = false, this.prioridadDos = false}}], 
                                                  'Se ha detectado el plan ' + nombre + ' como de maxima prioridad', 
    'Puedes guardarel plan y modificar el tiempo de los planes para hacer posible ' + 
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
     await this.datosService.presentToast("Plan Modificado")
      this.planesPausados.forEach(element => {
        this.planes.push(element);
      });
      await this.datosService.actualizarPlanes(this.planes);
  }

  //Metodo que calcula ala estimacion de los meses para que dos o mas planes puedan ser cumplidos
  async calcularEstimacionPlanes(margenMin: number) {
    if(this.planes[this.indexAux].pausado) {
      var estimacion = (this.planes[this.indexAux].cantidadTotal - this.planes[this.indexAux].cantidadAcumulada);
    } else {
      if(this.planesRetornados.length == 1) {
        var estimacion = (this.planModificado.cantidadTotal - this.planModificado.cantidadAcumulada);
      } else {
        var estimacion = 0;
        this.planesRetornados.forEach(element => {
          estimacion += (element.cantidadTotal - element.cantidadAcumulada);
        });
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
    
    if(this.usuarioCargado.ingresoCantidad + this.ingresoExtra - this.usuarioCargado.fondoPlanes < margenMax 
      && this.usuarioCargado.ingresoCantidad + this.ingresoExtra - this.usuarioCargado.fondoPlanes < this.gastosUsuario
      && this.usuarioCargado.ingresoCantidad + this.ingresoExtra - this.usuarioCargado.fondoPlanes >= margenMin) {
        this.accionesService.presentAlertGenerica('Gastos Minimos', 'Ahora estas en un sistema de gastos minimos, '+ 
        'esto quiere decir que ahora para hacer los calculos que determinaran cuanto ahorraras al mes' + 
        ' se tomara en cuenta el margen minimo de tus gastos (el pequeño margen de desviacion' + 
        ' en cada uno de tus gastos que provoca que gastes menos, sobre todo en tus gastos promedio),' + 
        ' por lo tanto ahora ahorraras mas si te mantienes dentro de ese margen, ' +
        'pero recuerda que el porcentaje de ese ahorro que no es para los planes sera menor, debido que '+ 
        'los planes se estan llevando casi todo y entraste en este modo para' + 
        ' asi poder cumplir todos dichos planes');
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
