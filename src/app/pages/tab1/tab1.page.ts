import { Component, OnInit, Inject, LOCALE_ID } from '@angular/core';
import { ChartType } from 'chart.js';
import { SingleDataSet, Label, ThemeService } from 'ng2-charts';
import { Rubro, UsuarioLocal, GastoMayor, Gasto, GastosMensuales, Plan } from '../../interfaces/interfaces';
import {Observable, Subscription} from 'rxjs';
import { DatosService } from '../../services/datos.service';
import { ModalController, NavController, Events, Platform } from '@ionic/angular';
import { DescripcionGastoPage } from '../descripcion-gasto/descripcion-gasto.page';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { AccionesService } from '../../services/acciones.service';
import { ModalRegistroPage } from '../modal-registro/modal-registro.page';
import { GastosDiariosPage } from '../gastos-diarios/gastos-diarios.page';
import { GastosMayoresPage } from '../gastos-mayores/gastos-mayores.page';

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
  cantidadGastos: number = 0;
  saldo: number;

  //Variables de descicion
  gastosCero: boolean = true;

  backButtonSub: Subscription;

  //Datos del ussuario
  usuarioCargado: UsuarioLocal = this.datosService.usuarioCarga;

  mes: number = this.datosService.mes;

  gastosMensuales: GastosMensuales[] = this.datosService.gastosMensualesCargados;

  diferenciaFondo: number = this.datosService.diferencia;

  planes: Plan[] = []; 
  
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

    await this.datosService.cargarGastosMensuales();
    await this.datosService.cargarDiferencia();
    await this.datosService.cargarMes();
    await  this.datosService.cargarFechaDiaria();
    await this.datosService.cargarDiaDelMes();
    await this.datosService.cargarDiferencia();
    this.localNotifications.fireQueuedEvents();
    //Condicional para abrir el registro de la app
    if(this.datosService.primera === true) {
      await this.abrirRegistro();
    }

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

    this.doughnutChartData = [4];
    this.datos = []
    //Asignacion a la variable de la grafica de los datos de los gastos
    this.datosService.usuarioCarga.gastos.forEach(element => {
      this.datos.push(Number(element.porcentaje));
      if(element.cantidad != 0) {
        this.gastosCero = false;
      }
    });
    this.doughnutChartData = this.datos;
    

    
    if(await new Date().getMonth() != this.datosService.fechaMes.mes 
    && await new Date().getDate() == this.datosService.fechaMes.dia) {
      await this.nuevoMes();
    }
    
    if(await new Date().getHours() > 10 && await new Date().getHours() < 24) {
      if(this.datosService.fechaDiaria != null && this.datosService.fechaDiaria != await new Date().getDate()) {
        await this.abrirGastosDiarios();
      }
    }
    
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

  async abrirRegistro() {

    const modal = await this.modalCtrl.create({
      component: ModalRegistroPage
    });
     modal.present();
    await modal.onDidDismiss();
  }

  async abrirGastosDiarios() {
    const modal = await this.modalCtrl.create({
      component: GastosDiariosPage
    });
    modal.present();
    await modal.onDidDismiss();
  }

  async abrirGastosMayores(gastosMayores: GastoMayor[]) {
    const modal = await this.modalCtrl.create({
      component: GastosMayoresPage,
      componentProps: {
        gastosMayores: gastosMayores
      }
    });
    modal.present();
    await modal.onDidDismiss();
  } 

  async nuevoMes() {
    await this.datosService.cargarGastosMensuales();
    await this.datosService.cargarMes();
    this.gastosMensuales = this.datosService.gastosMensualesCargados;
    this.mes = this.datosService.mes;

    await this.abrirGastosDiarios();

    var gastosMayores: GastoMayor[] = [];
    var dineroMas: number = 0;

    var hayMayores = false;
    this.gastosMensuales.forEach(mensuales => {
      if(mensuales.mes == this.mes) {
        this.usuarioCargado.gastos.forEach(gastos => {
          mensuales.gastos.forEach(element => {
            if(gastos.nombre == element.nombre) {
              var gastoMayor: GastoMayor =  {
                nombre: gastos.nombre,
                mayor: false,
                cantidadOriginal: gastos.cantidad,
                cantidadNueva: element.cantidad
              }
              if(gastos.margenMax < element.cantidad) {
                hayMayores = true;
                gastoMayor.mayor = true;
              } else if(gastos.margenMin > element.cantidad) {
                dineroMas += (gastos.cantidad - gastoMayor.cantidadNueva);
              }
              gastosMayores.push(gastoMayor);
            }
          });
        });
      }
    });

    if(hayMayores) {
      await this.accionesService.presentAlertGenerica('Gastaste de mas',
      'Se ha detectado que gastaste mas de lo normal en ciertos rubros, por la tanto necesitamos que conteste unas preguntas');
      await this.abrirGastosMayores(gastosMayores);
    }

    var sumar = false;
    if(dineroMas > 0) {
      await this.accionesService.presentAlertOpciones([{text: 'Sumar al fondo de ahorro', handler: (blah) => {sumar = true}},
                                                      {text: 'Quedarmelo', handler: (blah) => {sumar = false}}], 
      'Gastaste menos', 
      'Se ha detectado que gastaste menos de lo normal en ciertos rubros, por la tanto tienes algo de dinero extra,' +
      ' escoge si deseas sumarlo al fondo de ahorro para tratar de minimizar el impacto, si gastaste de mas en otros ' + 
      'rubos, en tu fondo de ahorro o si quieres quedartelo para que los gastes o ahorres como quieras');
    }

    await this.datosService.cargarDiferencia();
    this.diferenciaFondo = this.datosService.diferencia;

    await this.datosService.cargarDatosPlan();
    this.planes = this.datosService.planesCargados;
    
    await this.datosService.cargarGastosMensuales();
    this.gastosMensuales = this.datosService.gastosMensualesCargados;

    var gastosDelMes: number = 0;
    this.gastosMensuales.forEach(mensuales => {
      if(mensuales.mes == this.mes) {
        mensuales.gastos.forEach(element => {
          gastosDelMes += element.cantidad;
        });
      }
    });

    //Le restamos al ahorro los gastos del mes
    var totalAhorro = this.usuarioCargado.ingresoCantidad - gastosDelMes;
    console.log(totalAhorro);
    totalAhorro -= this.diferenciaFondo;

    //Agregamos lo extra ganado si asi lo desea el ussuario
    if(!sumar) {
      totalAhorro -= dineroMas;
    }

    await this.datosService.presentToast(totalAhorro.toString());
    console.log(totalAhorro);

    //A cada uno de los planes le agregamos lo correspondiente
    for(var plan of this.planes) {
      if(plan.pausado != true) {
        if(totalAhorro == 0) {
          //Aumento de tiempo
          plan.tiempoRestante += 1;
          plan.tiempoTotal += 1;
        } else {
            totalAhorro -= plan.aportacionMensual;
            if(totalAhorro >= 0) {
              plan.cantidadAcumulada += plan.aportacionMensual;
              plan.cantidadAcumulada = Math.round(plan.cantidadAcumulada*100)/100;
            } else {
              //Aqui iria el aumento de tiempo
              totalAhorro += plan.aportacionMensual;
              plan.cantidadAcumulada += totalAhorro;
              plan.cantidadAcumulada = Math.round(plan.cantidadAcumulada*100)/100;
              totalAhorro = 0;
              plan.tiempoRestante += 1;
              plan.tiempoTotal += 1;
            }
          }
        plan.tiempoRestante -= 1;
      }
      
    }
    console.log(totalAhorro);

    //Guardamos los planes terminados y pausados
    var planesTerminados: Plan[] = [];
    var planesPausados: Plan[] = [];
    for(var plan of this.planes) {
      if(plan.tiempoRestante == 0 && (plan.cantidadAcumulada + 1) >= plan.cantidadTotal ) {
        planesTerminados.push(plan);
      } else if(plan.tiempoRestante == 0){
        plan.tiempoRestante + 1;
        plan.tiempoTotal + 1;
      }

      if(plan.pausado) {
        planesPausados.push(plan);
      }
    }

    this.planes = this.planes.filter(p => p.pausado != true);

    //Quitamos los planes terminados
    for(var plan of planesTerminados) {
      this.planes = this.planes.filter(p => p != plan);
    }

    //Calculos nuevos
    var planesPrioritarios: Plan[] = [];
    var planesRestantes: number = this.planes.length;
    var prioritario = false;
    do {
      if(planesRestantes != 0) {
        if(planesRestantes == 1) {
          prioritario = false;
          this.planes[0].aportacionMensual = (this.planes[0].cantidadTotal - this.planes[0].cantidadAcumulada)/this.planes[0].tiempoRestante;
        }
        else if(planesRestantes == 2) {
          prioritario = false;
          var ahorro = 0;
          var planMenor: Plan = this.planes[0];
          var planMayor: Plan =  this.planes[0];
          for(var plan of this.planes) {
            if(planMenor.tiempoRestante >= plan.tiempoRestante) {
              if(planMenor.tiempoRestante == plan.tiempoRestante) { 
                if((planMenor.cantidadTotal - planMenor.cantidadAcumulada) 
                  < (plan.cantidadTotal - plan.cantidadAcumulada)) { 
                    planMenor = plan;
                  }
              } else {
                planMenor = plan;
              }
            }
            if(planMayor.tiempoRestante <= plan.tiempoRestante) {
              if(planMayor.tiempoRestante == plan.tiempoRestante) { 
                if((planMayor.cantidadTotal - planMayor.cantidadAcumulada) 
                  > (plan.cantidadTotal - plan.cantidadAcumulada)) { 
                    planMayor = plan;
                  }
              } else {
                planMayor = plan;
              }
            }
            ahorro += (plan.cantidadTotal - plan.cantidadAcumulada);
          }
          ahorro /= planMayor.tiempoRestante;
          planMenor.aportacionMensual = (planMenor.cantidadTotal - planMenor.cantidadAcumulada)/planMenor.tiempoRestante;
          if(planMenor.aportacionMensual >= ahorro) {
            planesPrioritarios.push(planMenor);
            this.planes = this.planes.filter(p => p != planMenor);
            planMenor = this.planes[0];
            planMenor.aportacionMensual = (planMenor.cantidadTotal - planMenor.cantidadAcumulada)/planMenor.tiempoRestante;
          }
          ahorro -= planMenor.aportacionMensual;
          planMayor.aportacionMensual = ahorro;
        }
        else {
          var ahorro = 0;
          var planMenor: Plan = this.planes[0];
          var planMayor: Plan =  this.planes[0];
          for(var plan of this.planes) {
            if(planMenor.tiempoRestante >= plan.tiempoRestante) {
              if(planMenor.tiempoRestante == plan.tiempoRestante) { 
                if((planMenor.cantidadTotal - planMenor.cantidadAcumulada) 
                  < (plan.cantidadTotal - plan.cantidadAcumulada)) { 
                    planMenor = plan;
                  }
              } else {
                planMenor = plan;
              }
            }
            if(planMayor.tiempoRestante <= plan.tiempoRestante) {
              if(planMayor.tiempoRestante == plan.tiempoRestante) { 
                if((planMayor.cantidadTotal - planMayor.cantidadAcumulada) 
                  > (plan.cantidadTotal - plan.cantidadAcumulada)) { 
                    planMayor = plan;
                  }
              } else {
                planMayor = plan;
              }
            }
            ahorro += (plan.cantidadTotal - plan.cantidadAcumulada);
          }
          ahorro /= planMayor.tiempoRestante;
          planMenor.aportacionMensual = (planMenor.cantidadTotal - planMenor.cantidadAcumulada)/planMenor.tiempoRestante;
          var acumulacion = planMenor.aportacionMensual * (this.planes.length -1);
          if(acumulacion >= ahorro) {
            planesPrioritarios.push(planMenor);
            this.planes = this.planes.filter(p => p != planMenor);
            prioritario = true;
          } else {
            ahorro -= planMenor.aportacionMensual;
            for(var plan of this.planes) {
              if(plan != planMenor && plan != planMayor) {
                plan.aportacionMensual = planMenor.aportacionMensual;
                ahorro -= planMenor.aportacionMensual;
              }
            }
            planMayor.aportacionMensual = ahorro;
            prioritario = false;
          }
        } 
      }

    } while (prioritario);
    

    for(var plan of this.planes) {
      planesPrioritarios.push(plan);
    }
    for(var plan of planesPausados) {
      planesPrioritarios.push(plan);
    }
    this.datosService.actualizarPlanes(planesPrioritarios);

    //Notificar ususario

    await this.datosService.guardarDiferencia(0);

    if(this.mes == 1) {
      this.mes++;
      this.datosService.guardarMes(this.mes);
      return;
    }
  
    //Desviacion
    var meses = this.gastosMensuales.length;
    this.usuarioCargado.gastos.forEach(gastos => {
      var promedio = 0;
      var datos = [];
      
      this.gastosMensuales.forEach(gastosMen => {
        gastosMen.gastos.forEach(element => {
          if(element.nombre == gastos.nombre) {
            promedio += element.cantidad;
            datos.push(element.cantidad);
          }
        });
      });
      promedio /= meses;
      gastos.cantidad = promedio;
      if(gastos.tipo == 'Promedio') {
        var sumatoria = 0;

        datos.forEach(element => {
          var aux = element - promedio;
          aux *= aux;
          sumatoria += aux;
        });
        var desviacion = sumatoria / meses;
        desviacion = Math.sqrt(desviacion);
        gastos.margenMax = gastos.cantidad + desviacion;
        gastos.margenMin = gastos.cantidad - desviacion;
      } else {
        gastos.margenMax = gastos.cantidad;
        gastos.margenMin = gastos.cantidad;
      }
     
    });
    this.mes++;
    this.datosService.guardarMes(this.mes);
    await this.actualizarUsuario();
    await this.datosService.cargarDatos();
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
  async mostrarSaldo() {
    var gastosCantidad = 0;
    if(this.usuarioCargado.gastos.length < 2) {
      this.etiquetas = [];
      await this.datosService.cargarDatos();
    }
      for( var gasto of this.usuarioCargado.gastos) {
        if ( gasto.cantidad != 0 ) {
          gastosCantidad += gasto.cantidad;
        } 
      }
      this.cantidadGastos = gastosCantidad;
    if(this.colores.length < 5) {
      this.datosService.getColores().subscribe(val => {
        val.colores.forEach(element => {
          this.colores.push(element.toString());
        });
      });
      this.chartColors = [{
        backgroundColor: [ ] = this.colores
      }];
    }  
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

  async actualizarUsuario() {
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

    this.usuarioCargado.fondoAhorro = this.usuarioCargado.ingresoCantidad - this.usuarioCargado.fondoPlanes - gastos;
    if(this.usuarioCargado.fondoAhorro < 0) {
      this.usuarioCargado.fondoAhorro = this.usuarioCargado.ingresoCantidad - this.usuarioCargado.fondoPlanes - margenMin;
    }
    this.usuarioCargado.fondoAhorro -= this.diferenciaFondo;
    this.usuarioCargado.fondoAhorro = Math.round(this.usuarioCargado.fondoAhorro*100)/100;
    await this.datosService.guardarUsuarioInfo(this.usuarioCargado);
  }
}
  