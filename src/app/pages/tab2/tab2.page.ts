import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Label} from 'ng2-charts';
import { ChartType } from 'chart.js';
import { PlanDisplay, Plan, AlertaGeneral, UsuarioLocal } from '../../interfaces/interfaces';
import { NavController, Events, Platform, IonInput, ModalController } from '@ionic/angular';
import { DatosService } from '../../services/datos.service';
import { AccionesService } from '../../services/acciones.service';
import { Router, NavigationExtras } from '@angular/router';
import { Subscription } from 'rxjs';
import { PlanModificarPage } from '../plan-modificar/plan-modificar.page';
import { ReanudarPlanesService } from '../../services/reanudar-planes.service';
import { QuitarPlanesService } from '../../services/quitar-planes.service';

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

  deshabilitalo: boolean = false;

  planesExiste: boolean = false; // Variable utilizada para saber si existen planes o no}
  contadorDePlanes: number = 0;

  //Variable para guardar la infromacion de las alertas
  alertas: AlertaGeneral[] = [];

  //Variable que guarda la informacion del usuario
  usuarioCargado: UsuarioLocal = this.datosService.usuarioCarga;

  //Variable que guarda los datos de los planes registrados y luego se usa para manipularlos
  planes: Plan[] = JSON.parse(JSON.stringify(this.datosService.planesCargados));

  //Variable auxiliar que guardara los planes originales antes de hacer todos los cambios
  planesOriginales: Plan[] = []

  planesRetornados: Plan[] = []

  planesPausados: Plan[] = [];

  //Variable que nos indica si el ususario escogio la opcion de pausar
  pausa: boolean = false;

  diferenciaFondo: number = this.datosService.diferencia;

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
              public modalCtrl: ModalController,
              private reanudarPlanes: ReanudarPlanesService,
              private quitarPlanes: QuitarPlanesService) {}

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

  async transferir(plan: Plan){

if(this.planes.length > 1) {
  let planD = {
    nombre: plan.nombre,
    cantidadTotal: plan.cantidadTotal,
    tiempoTotal: plan.tiempoTotal,
    cantidadAcumulada: plan.cantidadAcumulada,
    tiempoRestante: plan.tiempoRestante,
    descripcion: plan.descripcion,
    aportacionMensual: plan.aportacionMensual,
    pausado: plan.pausado
  }

this.datosService.planASumar = planD;
this.nav.navigateRoot('/selecciona-plan-page');
}
else{
this.datosService.presentToast("Debes tener mas de 1 plan para transferir dinero entre planes");
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
      this.planesPausados = [];
      this.planesRetornados.forEach(element => {
        if(element.pausado == true) {
          this.planesPausados.push(element);
      }
      });
      this.planesRetornados = this.planesRetornados.filter(plan => plan.pausado != true);

      if(this.planesRetornados.length != 0) {
        await this.quitarPlanes.calcularYRegistrar(this.planesOriginales, this.planesPausados, this.planesRetornados, this.planes);
        this.datosService.presentToast("Plan borrado");
        return;
      }
      this.planes = [];
      this.planesPausados.forEach(element => {
        this.planes.push(element);
      });
      await this.datosService.actualizarPlanes(this.planes);
      await this.actualizarUsuario();
      this.datosService.presentToast("Plan borrado");
    }
  }

    //Funcion para pausar planes
  async pausarPlan(i: number, plan: Plan) {

    if(plan.pausado == true){
      this.datosService.presentToast("No puedes pausar un plan que ya esta pausado");
    }
    else{
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
      this.planesPausados = [];
      this.planesRetornados.forEach(element => {
        if(element.pausado == true) {
          this.planesPausados.push(element);
      }
      });
      this.planesRetornados = this.planesRetornados.filter(plan => plan.pausado != true);

      if(this.planesRetornados.length != 0) {
        await this.quitarPlanes.calcularYRegistrar(this.planesOriginales, this.planesPausados, this.planesRetornados, this.planes);
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

  }

  //Funcion para renaudar planes
  renaudarPlan(i, plan: Plan) {

    if(plan.pausado == true){
      this.reanudarPlanes.calcularYRegistrar(i);
      this.datosService.actualizarPlanes(this.planes); 
    }
    else{
      this.datosService.presentToast("No puedes reanudar un plan que actualmente esta activo");
    }
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

  async ionViewDidEnter() {

    await this.datosService.cargarBloqueoModulos();
    if(this.datosService.bloquearModulos == true){
      this.nav.navigateRoot('/tabs/tab3');
      this.accionesService.presentAlertGenerica("No puedes ingresar a dicho modulo", "No se te permite el acceso a este modulo debido a que tus gastos son mayores que tus ingresos, cuando te repongas cambia tus gastos e ingresos en la seccion 'Mis gastos'");
    }

    this.backButtonSub = this.plt.backButton.subscribeWithPriority( 10000, () => {
      this.nav.navigateRoot('/tabs/tab1');
    });
  }
}
