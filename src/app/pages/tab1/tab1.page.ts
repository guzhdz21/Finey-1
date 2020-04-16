import { Component, OnInit, Inject, LOCALE_ID } from '@angular/core';
import { ChartType } from 'chart.js';
import { SingleDataSet, Label } from 'ng2-charts';
import { Rubro, UsuarioLocal } from '../../interfaces/interfaces';
import {Observable, Subscription} from 'rxjs';
import { DatosService } from '../../services/datos.service';
import { ModalController, NavController, Events, Platform } from '@ionic/angular';
import { DescripcionGastoPage } from '../descripcion-gasto/descripcion-gasto.page';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { AccionesService } from '../../services/acciones.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  
  //Variables del Chart
  rubros: Observable<Rubro[]>;
  colores: string[] = [];
  etiquetas: string[] = [];
  datos: number[] =[];

  //Variables visuales en el HTML
  cantidadGastos: number;
  saldo: number;

  //Variables de descicion
  gastosCero: boolean = true;

  backButtonSub: Subscription;

  //Datos del ussuario
  usuarioCargado: UsuarioLocal = this.datosService.usuarioCarga;
  
  //Variables de asignacion al Chart
  public doughnutChartLabels: Label[] = ['Vivienda'];
  public doughnutChartData: SingleDataSet = [4];
  public doughnutChartType: ChartType = 'doughnut';
  public chartColors: Array<any> = 
  [{
    backgroundColor: [ ] = ['#ff7f0e']
  }];
  public legend = false;
  
//Constructor con las inyecciones de servicios y controladores necesarios
  constructor(public datosService: DatosService,
              private modalCtrl: ModalController,
              private nav: NavController,
              private event: Events,
              private plt: Platform,
              @Inject(LOCALE_ID) private locale: string,
              private localNotifications: LocalNotifications, 
              private accionesService: AccionesService) {}

  async ngOnInit() {
    this.localNotifications.fireQueuedEvents();
    //Condicional para abrir el registro de la app
    if(this.datosService.primera === true) {
      await this.nav.navigateRoot('/modal-registro-page');
    }

    if(new Date().getHours() > 10 && new Date().getHours() < 24) {
      if(this.datosService.fechaDiaria == null || this.datosService.fechaDiaria.getDay() < new Date().getDay()) {
        await this.nav.navigateRoot('/gastos-diarios-page');
      }
    }

    //Evento que escucha cuando el la informacion del usuario es actualiza para actualizar la grafica
     await this.event.subscribe('usuarioActualizado', () => {
      this.usuarioCargado = this.datosService.usuarioCarga;
      this.gastosCero = true;
      this.datos = [];
      this.datosService.usuarioCarga.gastos.forEach(element => {
        if(element.cantidad != 0){
          this.gastosCero = false;
        }
      this.datos.push(Number(element.porcentaje));
      });
      this.mostrarSaldo();
      this.doughnutChartData = this.datos;
    });
    
    //Evento que escucha cuando el usuario es insertado para cambiar los datos de la grafica
     await this.event.subscribe('usuarioInsertado', () => {
      this.usuarioCargado = this.datosService.usuarioCarga;
      this.mostrarSaldo();
    });

    //Asignacion al arreglo de rubros por la funcion qdel servicio datosService que obtiene los rubros de un archicvo
    this.rubros = this.datosService.getRubros();

    //Llamada a funcion de servicio que obtiene los colores de la grafica de un archivo y asignacion a la variable del Chart
    this.datosService.getColores().subscribe(val => {
      val.colores.forEach(element => {
        this.colores.push(element.toString());
      });
    });
    this.chartColors = [{
      backgroundColor: [ ] = this.colores
    }];
    
    //Llamada a funcion de servicio que obtiene las etiquetas de la grafica y asignacion a la variable de la Chart
    this.datosService.getEtiquetas().subscribe(val => {
      val.nombre.forEach(element => {
        this.etiquetas.push(element.toString() + ' %')
      });
    });
    this.doughnutChartLabels = this.etiquetas;

    //LLamada a funcion del servicio que carga los datos y 
    this.datosService.cargarDatos();

    //Asignacion a la variable de la grafica de los datos de los gastos
    this.datosService.usuarioCarga.gastos.forEach(element => {
      this.datos.push(Number(element.porcentaje));
      if(element.cantidad != 0) {
        this.gastosCero = false;
      }
    });
    this.doughnutChartData = this.datos;
  }


  async abrirDescripcionGasto(seleccion: string, diseño: string) {

    const modal = await this.modalCtrl.create({
      component: DescripcionGastoPage,
      componentProps: {
        color: diseño,
        rubro: seleccion,
        gastos: this.datosService.usuarioCarga.gastos
      }
    });
    await modal.present();
  }

  //Metodo que carga los datos cuando un usuario entrara al tabs
  async ionViewWillEnter() {
    this.datosService.cargarDatos();
    await this.event.subscribe('usuarioInsertado', () => {
    this.usuarioCargado = this.datosService.usuarioCarga;
    });
    this.datos = [];
    this.datosService.usuarioCarga.gastos.forEach(element => {
      this.datos.push(Number(element.porcentaje));
    });
    this.doughnutChartData = this.datos;
    if(this.datosService.primera != true)
    {
      this.mostrarSaldo();
    }
  }

  //Metodo que llama el metodo del servicio para cargar datos
  ionViewWillLeave() {
    this.datosService.cargarDatos();
  }

  //Metodo para calcular y mostrar los gastos y saldo del proyecto
  mostrarSaldo() {
    var gastosCantidad = 0;
      for( var i = 0; i < 17; i++ ) {

        if(this.usuarioCargado.gastos.length < 2) {
          this.ngOnInit();
          return;
        } 
        if ( this.usuarioCargado.gastos[i].cantidad != 0 ) {
          gastosCantidad += this.usuarioCargado.gastos[i].cantidad;
        } 

      }
      this.cantidadGastos = gastosCantidad;
      var saldo = this.usuarioCargado.ingresoCantidad - gastosCantidad;
      this.saldo = saldo;
  }

  ionViewDidLoad () {
    this.plt.ready().then(() => {
      this.localNotifications.fireQueuedEvents();
    }); 
  }
  
  ionViewDidEnter() {
    this.backButtonSub = this.plt.backButton.subscribeWithPriority( 10000, () => {
      navigator["app"].exitApp();
    });
  }
}