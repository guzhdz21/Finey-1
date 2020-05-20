import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Label} from 'ng2-charts';
import { ChartType } from 'chart.js';
import { PlanDisplay, Plan, AlertaGeneral, UsuarioLocal } from '../../interfaces/interfaces';
import { NavController, Events, Platform, IonInput, ModalController } from '@ionic/angular';
import { DatosService } from '../../services/datos.service';
import { AccionesService } from '../../services/acciones.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PlanModificarPage } from '../plan-modificar/plan-modificar.page';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit{

 //Variable que viene del Modal registro y del tab2 y nos indica si es la primera vez que abre la app
 @Input() registro: string;
 //ViewChild que nos permite ver el valor del input tiempo
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

  //Variable donde se establece el valor inicial 
  planDis: PlanDisplay = {
    doughnutChartData: [20, 80],
      plan: {
        nombre: 'Moto',
        cantidadTotal: 1,
        tiempoTotal: 1,
        cantidadAcumulada: 1,
        tiempoRestante: 1,
        descripcion: '400 cc',
        aportacionMensual: 1,
        pausado: false
      }
  };

  //Arreglo donde se guardan los planes cargados
  planesDis: PlanDisplay[] = [
    this.planDis
  ];

  planesExiste: boolean = false; // Variable utilizada para saber si existen planes o no}

  //Variable para guardar la infromacion de las alertas
  alertas: AlertaGeneral[] = [];

  //Variable para no mostrar alertas de creado cuando se borra un plan
  borrado: boolean = false;

  //Variable que guarda la informacion del usuario
  usuarioCargado: UsuarioLocal = this.datosService.usuarioCarga;

  //Variable que guarda los datos de los planes registrados y luego se usa para manipularlos
  planes: Plan[] = JSON.parse(JSON.stringify(this.datosService.planesCargados));

  //Varibale auciliar que guarda un arreglo de planes
  planesaux: Plan[] = []

  //Variable auxiliar que guardara los planes originales antes de hacer todos los cambios
  planesOriginales: Plan[] = []

  planesRetornados: Plan[] = []

  planesPausados: Plan[] = [];

  planesCopia: Plan[] = []

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

  diferenciaFondo: number = this.datosService.diferencia;

  multiplan: boolean;

  //Variable que se usa para el regreso o boton back nativo del celular
  backButtonSub: Subscription;

  gastosUsuario: number;


  //Variables del chart
  public doughnutChartLabels: Label[] = ['Progreso %', 'Restante %'];
  public doughnutChartType: ChartType = 'doughnut';
  public chartColors: Array<any> = 
  [{
    backgroundColor: [ ] = ['#32CD32','#B0C4DE']
  }];

  public legend = false;

  constructor(private nav: NavController,
              private event: Events,
              private datosService: DatosService,
              private accionesService: AccionesService,
              private router: Router,
              private plt: Platform,
              public modalCtrl: ModalController) {}

  ngOnInit() {
    //Metodo para cargar los planes haya o no
    this.datosService.cargarDatosPlan();
    this.event.subscribe('planesCargados', () => {
      if(this.datosService.planesCargados.length <= 0) {
        this.planesExiste = false;
        this.planesDis = [this.planDis];
        this.planes = [];
        return;
      }
      else {
        this.planesExiste = true;
      }
      this.planes = JSON.parse(JSON.stringify(this.datosService.planesCargados));
      this.planesDis = [];
      this.datosService.planesCargados.forEach(element => {
        this.planesDis.push({
          doughnutChartData: [
            Math.round(((element.cantidadAcumulada*100)/element.cantidadTotal)*100)/100,
            Math.round((((element.cantidadTotal - element.cantidadAcumulada)*100)/element.cantidadTotal)*100)/100
          ],
          plan: element
        });
      });
    });

    // Comprobamos que existen los planes y asignamos su progreso a la grafica pastel
    this.event.subscribe('planesModificados', () => {
      if(this.datosService.planesCargados.length <= 0) {
        this.planesExiste = false;
        this.planesDis = [this.planDis];
        this.planes = [];
        return;
      }
      this.planes = JSON.parse(JSON.stringify(this.datosService.planesCargados));
      this.planesDis = [];
      this.datosService.planesCargados.forEach(element => {
        this.planesDis.push({
          doughnutChartData: [
            (element.cantidadAcumulada*100)/element.cantidadTotal,
            ((element.cantidadTotal - element.cantidadAcumulada)*100)/element.cantidadTotal
          ],
          plan: element
        });
      });
    });
  }

  // Metodo que abre el formulario para insertar un nuevo plan o modificar alguno ya existente
  async abrirFormulario(opcion: string, i: number) {
    if(opcion == 'planNuevo') {
      this.nav.navigateRoot('/plan-form-page');
      this.router.navigate(['/plan-form-page'],
      {
        queryParams: {
          value: false
        }
      });
    }
    else if(opcion == 'modificar'){

      await this.abrirModal(i);
    }
  }

  async abrirModal(i: number) {
    this.planesOriginales = JSON.parse(JSON.stringify(this.planes));
    const modal = await this.modalCtrl.create({
      component: PlanModificarPage,
      componentProps: {
        index: i,
        planesOriginales: this.planesOriginales
      }
    });
    await modal.present();
    await modal.onDidDismiss();
  }

  irAcomodarPlanes() {
    this.nav.navigateRoot('/acomodar-page');
  }

  // Alerta que presenta la descripcion de un plan
  descripcion(descripcion: string) {
    this.accionesService.presentAlertGenerica('Descripcion', descripcion);
  }

  // Metodo para borrar un plan del storage
  async borrarPlan(i: number) {
    await this.accionesService.presentAlertPlan([{text: 'Cancelar', handler: (blah) => {this.accionesService.borrar = false}},
                                                {text: 'Borrar', handler: (blah) => {this.accionesService.borrar = true}}], 
                                                '¿Estas seguro de que quieres borrar este plan?', 'No podrás recuperar el progreso guardado en este plan');
    
    if(this.accionesService.borrar == true) {
      this.planesOriginales = JSON.parse(JSON.stringify(this.planes));
      await this.datosService.borrarPlan(i);
      this.planesRetornados = JSON.parse(JSON.stringify(this.planes));
      this.datosService.planesExisten = false;
      this.borrado = true;
      this.planesPausados = [];
      this.planesRetornados.forEach(element => {
        if(element.pausado == true) {
          this.planesPausados.push(element);
      }
      });
      this.planesRetornados = this.planesRetornados.filter(plan => plan.pausado != true);

      if(this.planesRetornados.length != 0) {
        await this.calcularYRegistrar();
        this.datosService.planesExisten = true;
        this.datosService.presentToast("Plan borrado");
        return;
      }
      this.planes = [];
      this.planesPausados.forEach(element => {
        this.planes.push(element);
      });
      await this.datosService.actualizarPlanes(this.planes);
      await this.actualizarUsuario();
      this.borrado = false;
      this.datosService.presentToast("Plan borrado");
    }
  }

    //Funcion para pausar planes
    async pausarPlan(i) {

      var p;
      await this.accionesService.presentAlertPlan([{text: 'Cancelar', handler: (blah) => {p = false}},
                                                {text: 'Pausar', handler: (blah) => {p = true}}], 
                                                '¿Estas seguro de que quieres pausar este plan?', 
                                                'El progreso y la aportacion de este plan quedara detenido hasta que se reanude el plan');
    
    if(p == true) {
      this.planesOriginales = JSON.parse(JSON.stringify(this.planes));
      var planes: Plan[] = [];
      this.planesDis[i].plan.pausado = true;
      this.planesDis[i].plan.aportacionMensual = 0;
      this.planesDis.forEach(element => {
        planes.push(element.plan);
      });
      this.datosService.actualizarPlanes(planes);

      this.planesRetornados = JSON.parse(JSON.stringify(this.planes));
      this.datosService.planesExisten = false;
      this.planesPausados = [];
      this.planesRetornados.forEach(element => {
        if(element.pausado == true) {
          this.planesPausados.push(element);
      }
      });
      this.planesRetornados = this.planesRetornados.filter(plan => plan.pausado != true);

      if(this.planesRetornados.length != 0) {
        await this.calcularYRegistrar();
        this.datosService.planesExisten = true;
        this.datosService.presentToast("Plan pausado");
        return;
      }
      this.planes = [];
      this.planesPausados.forEach(element => {
        this.planes.push(element);
      });
      await this.datosService.actualizarPlanes(this.planes);
      await this.actualizarUsuario();
      this.datosService.presentToast("Plan pausado");
    }
    }

  //Metodo que manda llamar los metodos para calcular los datos para agregar un plan nuevo y lo guarda en el Storage si es que es valido
  async calcularYRegistrar() {

    //Inicializacion de variables
    this.planesPrioritarios = [];

    //Valores iniciales
    var unPlan = false;
    var margenMax = 0;
    var margenMin = 0;

    //Verificar si hay planes previos
    if( this.planesRetornados.length == 1) {
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
    this.casoUnPlan();
    return;
  }

  //Metodo que ejecuta todos lo necesario para validar e ingresar un plan
  async casoUnPlan() {
    this.planesRetornados[0].aportacionMensual = (this.planesRetornados[0].cantidadTotal - this.planesRetornados[0].cantidadAcumulada) / this.planesRetornados[0].tiempoRestante;

    this.planes = [];
    this.planes.push(this.planesRetornados[0]);
    await this.guardarCambiosAPlanes();
    this.actualizarUsuario();
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

      //Verificamos si no reciben menos del ocho porciento
      if(await this.ocho(margenMax, margenMin)) {

        //Casos si si reciben menos
        //Caso en que el ussuario decidio pausar planes
        if(this.pausa) {
          this.planes = this.planesRetornados;
          this.datosService.actualizarPlanes(this.planes);
          this.irAPlanPausar(margenMax, margenMin);
          return;
        }
        //Caso en que el ussuario decidio modificar tiempos
        if(this.modificarOcho) {
          this.planes = this.planesRetornados;
          this.datosService.actualizarPlanes(this.planes);
          this.irAPlanModificar();
          return;
        }

        this.planes = this.planesOriginales;
        this.datosService.actualizarPlanes(this.planes);
        return;
      }

      //Se inserta plan
      this.planes = this.planesRetornados;
      await this.guardarCambiosAPlanes();
      this.actualizarUsuario();
      this.nav.navigateRoot('/tabs/tab2');
      return;
    }
    this.planes = this.planesOriginales;
    this.datosService.actualizarPlanes(this.planes);
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
    gasto = this.usuarioCargado.ingresoCantidad - ahorrar - this.diferenciaFondo;

    this.planMenor.aportacionMensual = (this.planMenor.cantidadTotal - this.planMenor.cantidadAcumulada)/this.planMenor.tiempoRestante;
    
    //Llamamos el metodoq ue valida
    await this.validarDosplanes(ahorrar, gasto, margenMax, margenMin)
  }

  //Metodo que valida dos planes y procede segun el caso
  async validarDosplanes(ahorrar: number, gasto: number, margenMax: number, margenMin: number){
    //Caso en que son posibles en margen maximo
    if (gasto >= margenMax || gasto >= this.gastosUsuario) {

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
        this.creado = true;
        return;
      }

      //Caso en que no son posibles
    } else {
      await this.accionesService.presentAlertPlan([{text: 'Ok', handler: (blah) => {}}],
      'No puedes borrar ese plan', 'Presiona ok y mejor pausalo para proceder');
      this.creado = false;
      return;
    }
  }

  //Metodo que ejecuta los procesos para el caso de encontrar un plan de prioridad
  async opcionesPrioridad(margenMax: number, margenMin: number) {
    //Vemos si es posible darle al prioritario lo necesario y que no afecte al ussuario
    if(await this.intentarPrioritario(margenMax, margenMin)) {
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

    //Casos en que se encuentra un plan prioritario y nose puede satisfacer con el sueldo del usuario
    //Caso en que el usuario escogio pausar los no prioritarios
    if(this.prioridadDos == true) {
      if(await this.pausarODividirMasDosPlanes(margenMax, margenMin)) {
        return;
      }

      this.planes = this.planesOriginales;
      this.datosService.actualizarPlanes(this.planes);
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

      //Verificamos si no reciben menos del ocho porciento
      if(await this.ocho(margenMax, margenMin)) {

        //Casos si si reciben menos
        //Caso en que el ussuario decidio pausar planes
        if(this.pausa) {
          this.planes = this.planesRetornados;
          this.datosService.actualizarPlanes(this.planes);
          this.irAPlanPausar(margenMax, margenMin);
          return;
        }

         //Caso en que el ussuario decidio modificar tiempos
        if(this.modificarOcho) {

          this.planesRetornados.forEach(element => {
            this.planesPrioritarios.push(element);
          });
          this.datosService.actualizarPlanes(this.planesPrioritarios);
          this.irAPlanModificar();
          return;
        }

        this.planes = this.planesOriginales;
        this.datosService.actualizarPlanes(this.planes);
        return;
      }

       //Se inserta plan
      this.planes = this.planesRetornados;
      await this.guardarCambiosAPlanes();
      this.actualizarUsuario();
      this.nav.navigateRoot('/tabs/tab2');
      return;
    }

    this.planes = this.planesOriginales;
    this.datosService.actualizarPlanes(this.planes);
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
    
    //Calculamos cuanto debe ahorrar el usuario, agregamos nuevo plan y vemos si es valido
    ahorrar /= this.planMayor.tiempoRestante;
    gasto = this.usuarioCargado.ingresoCantidad - ahorrar - this.diferenciaFondo;
    await this.validarMasDosPlanes(ahorrar, gasto, margenMax, margenMin);
  }

  //Metodo que valida mas de dos planes y procede segun el caso
  async validarMasDosPlanes(ahorrar: number, gasto: number, margenMax: number, margenMin: number) {

    //Obtenemos la paortacion mensual del plan menor
    this.planMenor.aportacionMensual = (this.planMenor.cantidadTotal - this.planMenor.cantidadAcumulada)/this.planMenor.tiempoRestante;
    //Caso en que son posibles en margen maximo
    if (gasto  >= margenMax || gasto >= this.gastosUsuario) {

      //Verificamso si hay prioritario
      if(this.planMenor.aportacionMensual >= (ahorrar/2)) {
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
      if(this.planMenor.aportacionMensual >= (ahorrar)/2) {
        await this.opcionesPrioridadDos(margenMax, margenMin);

      } else {
        //Procedemos segun la opcion
        this.confirmarCreacionMasDosPlanes(ahorrar);
        return;
      }

      //Caso e que no son posibles
    } else {
      await this.accionesService.presentAlertPlan([{text: 'Ok', handler: (blah) => {}}], 
      'No puedes borrar este plan', 'Presiona Ok y pausalo para poder proceder');
      this.creado = false;
      //this.calcularEstimacionDosPlanes(margenMin);
      return; 
    }
  }

  //Metodo que ejecuta los procesos para el caso de encontrar un plan de prioridad
  async opcionesPrioridadDos(margenMax: number, margenMin: number) {

    //Vemos si es posible darle al prioritario lo necesario y que no afecte al ussuario
    if(await this.intentarPrioritario(margenMax, margenMin)) {
      //Calculos finales en el caso de que si se pueda 
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
      await this.prioridad(this.planMenor.nombre);
      this.creado = false;

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

    ahorro = this.usuarioCargado.ingresoCantidad - ahorro;
    var gasto = margenMin;
    ahorro = ahorro - gasto;
    ahorro /= this.planesRetornados.length;

    var ochoporciento = this.obtenerOchoPorciento(margenMax);

    //Comprobamos que ninguna reciba menos del 8%
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
    //this.modalCtrl.dismiss();
    this.actualizarUsuario();
    this.nav.navigateRoot('/tabs/tab2');
    return true;
  }

  //Metodo que obtiene el ocho porciento del fondo de ahorro del usuario
  obtenerOchoPorciento(margenMax: number) {
    return (this.usuarioCargado.ingresoCantidad - margenMax - this.diferenciaFondo)*0.08;
  }

  //Metodo que verifica si los planes reciben menos o el 8%
  async ocho(margenMax: number, margenMin: number) {
    var ochoPorciento = this.obtenerOchoPorciento(margenMax);
    var aux = false;
      await this.planesRetornados.forEach(element => {
        if(element.aportacionMensual <= ochoPorciento) {
           aux = true;
        }
      });
      if(aux) {
        if(this.planes.length == 2) {
          if(await this.intentarPrioritario(margenMax, margenMin)) {
            var aux = false;
            await this.planesRetornados.forEach(element => {
              if(element.aportacionMensual <= ochoPorciento) {
                aux = true;
              }
            });
            if(aux == false) {
              return false;
            }
          }
        }
        await this.accionesService.presentAlertPlan([{text: 'Modificar', handler: (blah) => {this.pausa = false, this.modificarOcho = true}},
                                                        {text: 'Pausar', handler: (blah) => {this.pausa = true, this.modificarOcho = false}}], 
                                                      'Plan demasiado pequeño', 
            'Se ha detectado que alguno(s) planes recibiran muy poco dinero, te pedimos que modifiques' +
            ' el tiempo de los planes o pauses algunos'
          );
          return true;
      }
      return false;
  }

  //Metodo que hace los procedimeinto necesarios para intentar satisfacer los planes prioritarios (analizalo arlex)
  async intentarPrioritario(margenMax: number, margenMin: number) {
    var ahorrar: number = 0;
    var gasto: number;

    if(!this.multiplan) {
      this.planMenor.aportacionMensual = (this.planMenor.cantidadTotal - this.planMenor.cantidadAcumulada)/this.planMenor.tiempoRestante;
      this.planMayor.aportacionMensual = (this.planMayor.cantidadTotal - this.planMayor.cantidadAcumulada)/this.planMayor.tiempoRestante;
      ahorrar = this.planMenor.aportacionMensual + this.planMayor.aportacionMensual;
      gasto = this.usuarioCargado.ingresoCantidad - ahorrar - this.diferenciaFondo;
      return await this.validarGasto(margenMax, margenMin, gasto);
    }

    var ahorrar2 = 0;
    this.planMenor.aportacionMensual = (this.planMenor.cantidadTotal - this.planMenor.cantidadAcumulada)/this.planMenor.tiempoRestante;
    this.planesPrioritarios.push(this.planMenor);
    this.planesPrioritarios.forEach(element => {
      ahorrar += element.aportacionMensual;
    });

    gasto = this.usuarioCargado.ingresoCantidad - ahorrar - this.diferenciaFondo;
    if(!await this.validarGasto(margenMax,margenMin, gasto)) {
      this.planesPrioritarios = this.planesPrioritarios.filter(plan => plan != this.planMenor);
      return false;
    }

    this.planesRetornados = this.planesRetornados.filter(plan => plan != this.planMenor);
    this.planMenor = this.planesRetornados[0];
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
      gasto = this.usuarioCargado.ingresoCantidad - ahorrar - this.diferenciaFondo;
      return this.validarGasto(margenMax,margenMin, gasto);
    } 
    
    else if(this.planesRetornados.length == 2) {
      if(this.planMenor.aportacionMensual >= (ahorrar2)) {
        return this.intentarPrioritario(margenMax,margenMin);
      }

      this.planMayor.aportacionMensual = ahorrar2 - this.planMenor.aportacionMensual;
      ahorrar += ahorrar2;
      gasto = this.usuarioCargado.ingresoCantidad - ahorrar - this.diferenciaFondo;
      return this.validarGasto(margenMax,margenMin, gasto);
    } 
    
    else {
      if(this.planMenor.aportacionMensual>= (ahorrar2/2)) {
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
        gasto = this.usuarioCargado.ingresoCantidad - ahorrar - this.diferenciaFondo;
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
      gasto = this.usuarioCargado.ingresoCantidad - ahorrar - this.diferenciaFondo;
      return this.validarGasto(margenMax,margenMin, gasto);
    }
  }

  //Metodo que valida el gasto que se hace cuando se intenta satisfacer los planes prioriatrios
  validarGasto(margenMax: number, margenMin: number, gasto: number) {
    if (  gasto  >= margenMax || this.gastosUsuario ) {
      return true;
     }
     else if ( ( gasto < margenMax ) && (gasto >= margenMin ) ) {
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
    this.planesPausados.forEach(element => {
      this.planes.push(element);
    });
      await this.datosService.actualizarPlanes(this.planes);
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
    this.datosService.usuarioCarga.gastos.forEach(element => {
      if(element.cantidad != 0) {
        gastos += element.cantidad;
        margenMin += element.margenMin;
      }
    });

    this.usuarioCargado.fondoAhorro = this.usuarioCargado.ingresoCantidad - this.usuarioCargado.fondoPlanes - gastos;
    if(this.usuarioCargado.fondoAhorro < 0) {
      this.usuarioCargado.fondoAhorro = this.usuarioCargado.ingresoCantidad - this.usuarioCargado.fondoPlanes - margenMin;
    }
    this.usuarioCargado.fondoAhorro -= this.diferenciaFondo;
    this.usuarioCargado.fondoAhorro = Math.round(this.usuarioCargado.fondoAhorro*100)/100;
    await this.datosService.guardarUsuarioInfo(this.usuarioCargado);
  }
  //Metodo que omite el ingreso de un plan al inciar la app por primera vez
  omitir() {
    //this.modalCtrl.dismiss();
    this.nav.navigateRoot('/tabs/tab1');
  }

  //Metodo que imprime la informacion de lo que se debe llenar 
  botonInfo(titulo: string) {
    this.alertas.forEach(element => {
      if(titulo == element.titulo) {
        this.accionesService.presentAlertGenerica(element.titulo, element.mensaje);
        return;
      }
    });
  }

  //Metodo que valdia el tiempo que ingresa el ususario
  tiempoPlan(event) {
    if(this.tiempo.value.toString().includes('.')) {
      this.tiempo.value = this.tiempo.value.substr(0, this.tiempo.value.length - 1);
    }
  }

  //Metodo que redirecciona a la page de pasuar planes
  irAPlanPausar(margenMax: number, margenMin) {
    //this.modalCtrl.dismiss();
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
    //this.modalCtrl.dismiss();
    this.nav.navigateRoot('/modificar-tiempo-page');
    this.router.navigate(['/modificar-tiempo-page'], {
      queryParams: {
        planesOriginales: JSON.stringify(this.planesOriginales),
        planesPausados: JSON.stringify(this.planesPausados)
      }
    });
  }

  //Funcion para renaudar planes
  renaudarPlan(i) {
    var planes: Plan[] = [];
    this.planesDis[i].plan.pausado = false; 
    this.planesDis.forEach(element => {
      planes.push(element.plan);
    });
    this.datosService.actualizarPlanes(planes); 
  }

  ionViewDidEnter() {
    this.backButtonSub = this.plt.backButton.subscribeWithPriority( 10000, () => {
      this.nav.navigateRoot('/tabs/tab1');
    });
  }
}
