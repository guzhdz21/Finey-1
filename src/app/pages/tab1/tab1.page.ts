import { Component, OnInit, Inject, LOCALE_ID } from '@angular/core';
import { ChartType } from 'chart.js';
import { SingleDataSet, Label, ThemeService } from 'ng2-charts';
import { Rubro, UsuarioLocal, GastoMayor, Gasto, GastosMensuales, Plan, GastoMensual, AlertaGeneral } from '../../interfaces/interfaces';
import {Observable, Subscription} from 'rxjs';
import { DatosService } from '../../services/datos.service';
import { ModalController, NavController, Events, Platform, LoadingController } from '@ionic/angular';
import { DescripcionGastoPage } from '../descripcion-gasto/descripcion-gasto.page';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { AccionesService } from '../../services/acciones.service';
import { ModalRegistroPage } from '../modal-registro/modal-registro.page';
import { GastosDiariosPage } from '../gastos-diarios/gastos-diarios.page';
import { GastosMayoresPage } from '../gastos-mayores/gastos-mayores.page';
import { Router } from '@angular/router';

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

  ingresoProximo: number = 0;

  //Variables de descicion
  gastosCero: boolean = true;

  backButtonSub: Subscription;

  //Datos del ussuario
  usuarioCargado: UsuarioLocal = this.datosService.usuarioCarga;

  mes: number = this.datosService.mes;

  perdida: number = this.datosService.perdida;

  gastosMensuales: GastosMensuales[] = this.datosService.gastosMensualesCargados;

  diferenciaFondo: number = this.datosService.diferencia;

  planes: Plan[] = [];

  ingresoExtra: number = this.datosService.ingresoExtra;

  alertas: AlertaGeneral[] = [];
  
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
              private accionesService: AccionesService,
              private loadingCtrl: LoadingController,
              private router: Router) {}

  async ngOnInit() {
    await this.datosService.cargarDatos();
    await this.datosService.cargarPrimeraVez();
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

    this.datosService.getAlertasJson().subscribe(val => {
      this.alertas = val;
    });

    await this.datosService.cargarGastosMensuales();
    await this.datosService.cargarDiferencia();
    await this.datosService.cargarMes();
    await  this.datosService.cargarFechaDiaria();
    await this.datosService.cargarDiaDelMes();
    await this.datosService.cargarDiferencia();
    await this.datosService.cargarIngresoExtra();
    this.localNotifications.fireQueuedEvents();
    //Condicional para abrir el registro de la app
    if(this.datosService.primera === true) {
      await this.abrirRegistro();
    }

    //Asignacion al arreglo de rubros por la funcion qdel servicio datosService que obtiene los rubros de un archicvo
    this.rubros = this.datosService.getRubros();

    //Lllamada a metodo que obtiene la informacion de las alertas de un archivo
    this.datosService.getAlertasJson().subscribe(val => {
      this.alertas = val;
    });

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
    
    if(await new Date().getHours() > 19 && await new Date().getHours() < 24) {
      if(this.datosService.fechaDiaria != null && this.datosService.fechaDiaria != await new Date().getDate()) {
        await this.abrirGastosDiarios();
      }
    }

    this.ingresoExtra = this.datosService.ingresoExtra;
  }

  async anadirIngreso(){
    await this.accionesService.presentAlertIngresoExtra([{text: 'Añadir ingreso extra',handler: (bla) => { 
      if(parseInt(bla.ingresoExtra) <= 0)  {
          this.datosService.presentToast('No se puede ingresar 0 ni numeros negativos');
        } else {
          this.datosService.guardarIngresoExtra(parseInt(bla.ingresoExtra));
          this.ingresoExtra = parseInt(bla.ingresoExtra);
          this.datosService.presentToast('Ingreso extra añadido');
        }
      }
    }, {text: 'Cancelar',handler: (bla) => {}}]);
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

    await this.accionesService.presentAlertGenerica('Nuevo Mes','Ha pasado un mes por lo tanto ' 
    + 'haremos calculos y determinaremos en que rubros gastaste mas y en cuales menos para reajustar tus gastos ' 
    + 'y planes');
    await this.presentLoading('Comparando gastos...');

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
                gastosMayores.push(gastoMayor);
              } else if(gastos.margenMin > element.cantidad) {
                dineroMas += (gastos.cantidad - gastoMayor.cantidadNueva);
              }
            }
          });
        });
      }
    });

    if(hayMayores) {
      await this.accionesService.presentAlertGenerica('Gastaste de mas',
      'Se ha detectado que gastaste mas de lo normal en ciertos rubros, ' +
      'por la tanto necesitamos que contestes unas preguntas');
      await this.abrirGastosMayores(gastosMayores);
    }

    var sumar = false;
    if(dineroMas > 0) {
      await this.accionesService.presentAlertOpciones([{text: 'Sumar al fondo de ahorro', handler: (blah) => {sumar = true}},
                                                      {text: 'Quedarmelo', handler: (blah) => {sumar = false}}], 
      'Gastaste menos', 
      'Felicidades estas aprendiendo a ahorrar, Se ha detectado que gastaste menos de lo normal en ciertos rubros, por la tanto tienes algo de dinero extra,' +
      ' escoge si deseas sumarlo al fondo de ahorro para tratar de minimizar el impacto, si gastaste de mas en otros ' + 
      'rubos, o si quieres quedartelo para que los gastes o ahorres como quieras');
    }

    await this.datosService.cargarDiferencia();
    this.diferenciaFondo = this.datosService.diferencia;

    await this.datosService.cargarDatosPlan();
    this.planes = this.datosService.planesCargados;
    
    await this.datosService.cargarGastosMensuales();
    this.gastosMensuales = this.datosService.gastosMensualesCargados;

    await this.datosService.cargarPerdida();
    this.perdida = this.datosService.perdida;

    await this.presentLoading('Calculando ahorro...');

    var gastosDelMes: number = 0;
    this.gastosMensuales.forEach(mensuales => {
      if(mensuales.mes == this.mes) {
        mensuales.gastos.forEach(element => {
          gastosDelMes += element.cantidad;
        });
      }
    });

    //Le restamos al ahorro los gastos del mes
    var totalAhorro = this.usuarioCargado.ingresoCantidad + this.ingresoExtra -this.perdida - gastosDelMes;
    totalAhorro -= this.diferenciaFondo;

    //Agregamos lo extra ganado si asi lo desea el ussuario
    if(!sumar) {
      totalAhorro -= dineroMas;
    }

    await this.datosService.presentToast(totalAhorro.toString());
    console.log(totalAhorro);

    var cantidadValida = false;
    var quincePorciento = false;
    while (cantidadValida == false) {
      await this.accionesService.presentAlertAhorrado([{text: 'Ingresar',handler: (bla) => { 
        if(parseInt(bla.ahorrado) < 0)  {
            bla.ahorrado = totalAhorro;
            this.datosService.presentToast('No se puede ingresar negativo');
          } else {
            cantidadValida = true;
            var quince = totalAhorro * 0.15;
            quince = totalAhorro - quince;
            if(parseInt(bla.ahorrado) <= quince) {
              quincePorciento = true;
            } 
            totalAhorro = parseInt(bla.ahorrado);
          }
        }
      }], totalAhorro);
    }

    if(quincePorciento) {
      await this.accionesService.presentAlertGenerica('Precaucion','Hemos determinado que puedes tener ciertas ' 
    + 'fugas de dinero, si deseas eliminarlas o darte cuenta cuales pueden ser, ve la seccion de "Gastos Hormiga" del menú');
    }

    console.log(totalAhorro);

    await this.datosService.guardarDiferencia(0);
    this.diferenciaFondo = this.datosService.diferencia;
    await this.datosService.guardarIngresoExtra(0);
    this.ingresoExtra = this.datosService.ingresoExtra;
    await this.datosService.guardarPerdida(0);
    this.perdida = this.datosService.perdida;


    if(this.mes == 1) {
      this.mes++;
      this.datosService.guardarMes(this.mes);
    } else {

      await this.presentLoading('Reajustando gastos...');
      //Desviacion
      var aprendio = false;
      var aumento = false;
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
      if(gastos.cantidad > Math.round(promedio*100)/100) {
        aprendio = true;
      }

      if(gastos.cantidad < Math.round(promedio*100)/100) {
        aumento = true;
      }
      gastos.cantidad = Math.round(promedio*100)/100;
      gastos.porcentaje = (Math.round(((gastos.cantidad*100)/this.usuarioCargado.ingresoCantidad)*100)/100).toString();
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
        gastos.margenMax = Math.round(gastos.margenMax*100)/100;
        gastos.margenMin = gastos.cantidad - desviacion;
        gastos.margenMin = Math.round(gastos.margenMin*100)/100;
      } else {
        gastos.margenMax = gastos.cantidad;
        gastos.margenMin = gastos.cantidad;
      }
     
      });

      if(aprendio) {
      await this.accionesService.presentAlertGenerica('Gastos Reducidos','Felicidades has aprendido ahorrar en algunos rubros ' 
    + 'por lo que se les ha disminuido el margen de gasto');
    }
    
      if(aumento) {
      await this.accionesService.presentAlertGenerica('Gastos Aumentados','Ten cuidado, debido a que gastaste ' 
    + 'de mas o sobrepasaste el gasto normal, en algunos rubros aumento el margen de gasto');
      }

      if(this.mes > 24) {
        this.gastosMensuales.shift();
        this.datosService.guardarGastosMensuales(this.gastosMensuales);
      }

      this.mes++;
      this.datosService.guardarMes(this.mes);
    }
    await this.actualizarUsuario();

    if(this.datosService.planesExisten == false) {
      this.planes = [];
    }

    if(this.planes.length != 0) {
      await this.presentLoading('Recalculando planes...');
    }

    var planesAux = this.planes;
    //A cada uno de los planes le agregamos lo correspondiente
    do {
      if(planesAux.length != 0) {
        var planM = planesAux[0];
        for(var plan of planesAux) {
          if(planM.tiempoRestante >= plan.tiempoRestante) {
            if(planM.tiempoRestante == plan.tiempoRestante) { 
              if((planM.cantidadTotal - planM.cantidadAcumulada) 
                < (plan.cantidadTotal - plan.cantidadAcumulada)) { 
                  planM = plan;
                }
            } else {
              planM = plan;
            }
          }
        }
        if(planM.pausado != true) {
          if(totalAhorro == 0) {
            //Aumento de tiempo
            planM.tiempoRestante += 1;
            planM.tiempoTotal += 1;
          } else {
              totalAhorro -= planM.aportacionMensual;
              if(totalAhorro >= 0) {
                planM.cantidadAcumulada += planM.aportacionMensual;
                planM.cantidadAcumulada = Math.round(planM.cantidadAcumulada*100)/100;
                this.notificaciones(planM);
              } else {
                //Aqui iria el aumento de tiempo
                totalAhorro += planM.aportacionMensual;
                planM.cantidadAcumulada += totalAhorro;
                planM.cantidadAcumulada = Math.round(planM.cantidadAcumulada*100)/100;
                this.notificaciones(planM);
                totalAhorro = 0;
                planM.tiempoRestante += 1;
                planM.tiempoTotal += 1;
              }
            }
          planM.tiempoRestante -= 1;
        }
      }

      planesAux = planesAux.filter(p => p != planM);
    } while(planesAux.length != 0);
    
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
    var valido;
    do{
      do {
        var ahorrar = 0;
        if(planesRestantes != 0) {

          if(planesRestantes == 1) {
            prioritario = false;
            this.planes[0].aportacionMensual = (this.planes[0].cantidadTotal - this.planes[0].cantidadAcumulada)/this.planes[0].tiempoRestante;
            ahorrar += this.planes[0].aportacionMensual;
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

            ahorrar = ahorro;

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
            var iguales = true;
            var tiempo = this.planes[0].tiempoRestante;
            for(var plan of this.planes) {
              if(plan.tiempoRestante != tiempo) {
                iguales = false;
              }
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
            ahorrar = ahorro;
            planMenor.aportacionMensual = (planMenor.cantidadTotal - planMenor.cantidadAcumulada)/planMenor.tiempoRestante;
  
            var acumulacion = planMenor.aportacionMensual * (this.planes.length -1);
            if(acumulacion >= ahorro) {
              planesPrioritarios.push(planMenor);
              this.planes = this.planes.filter(p => p != planMenor);
              prioritario = true;
            } else {

              if(iguales) {
                for(var plan of this.planes) {
                  plan.aportacionMensual = (plan.cantidadTotal - plan.cantidadAcumulada)/plan.tiempoRestante;
                }
              } else {
                ahorro -= planMenor.aportacionMensual;
                for(var plan of this.planes) {
                  if(plan != planMenor && plan != planMayor) {
                    plan.aportacionMensual = planMenor.aportacionMensual;
                    ahorro -= planMenor.aportacionMensual;
                  }
                }
                planMayor.aportacionMensual = ahorro;
              }
              prioritario = false;
            }
          }
        }
      } while (prioritario);
          for(var p of planesPrioritarios) {
            ahorrar += p.aportacionMensual;
          }
          var g = this.usuarioCargado.ingresoCantidad - ahorrar;
          valido = this.validarGasto(g);
          if(valido == false) {
            this.planes[this.planes.length-1].pausado = true;
            this.planes[this.planes.length-1].aportacionMensual = 0;
            planesPausados.push(this.planes[this.planes.length-1]);
            var planQuitar = this.planes[this.planes.length-1];
            this.planes = this.planes.filter(p => p != planQuitar);
          }
  
      
    } while (valido == false);
    

    for(var plan of this.planes) {
      planesPrioritarios.push(plan);
    }

    for(var plan of planesPausados) {
      planesPrioritarios.push(plan);
    }

    await this.datosService.actualizarPlanes(planesPrioritarios);
    this.ingresoExtra = 0;
    await this.datosService.guardarIngresoExtra(this.ingresoExtra);
    await this.actualizarUsuario();
    await this.datosService.cargarDatos();

    if(planesTerminados.length != 0) {
      this.datosService.cargarPlanesTerminados()
      var planesT = this.datosService.planesTerminados;
      planesTerminados.forEach(element => {
        planesT.unshift(element);
      });
      await this.datosService.actualizarPlanesTerminados(planesT);

      if(planesPausados.length != 0) {
        await this.accionesService.presentAlertGenerica('Planes pausados','Recuerda que todavia cuentas con planes ' 
        + 'pausados, siempre puedes reanudarlos en al seccion "Planes"');
      }

      await this.accionesService.presentAlertOpciones([{text: 'Ok', handler: (blah) => {}}],
      'Felicidades','Has logrado completar uno o varios planes, ' 
      + 'puedes ir a checarlos en la seccion Planes Terminados en el menú');

      await this.accionesService.presentAlertOpciones([{text: 'Claro', handler: (blah) => {this.nav.navigateRoot('/plan-form-page'),
      this.router.navigate(['/plan-form-page'],
      {
        queryParams: {
          value: false
        }
      });}}, 
      {text: 'Mas tarde', handler: (blah) => {}}],
      '¿Qué sigue?','Ya que has completado uno o varios planes, ¿deseas agregar uno nuevo?');
    }

  }

  async presentLoading(texto: string) {
    const loading = await this.loadingCtrl.create({
      cssClass: 'my-custom-class',
      message: texto,
      duration: 1500
    });
    loading.present();
    await loading.onDidDismiss();
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
      this.cantidadGastos = Math.round(gastosCantidad*100)/100;
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
  
  async ionViewDidEnter() {

    await this.datosService.cargarBloqueoModulos();
    if(this.datosService.bloquearModulos == true){
      this.nav.navigateRoot('/tabs/tab3');
      this.accionesService.presentAlertGenerica("No puedes ingresar a dicho modulo", "No se te permite el acceso a este modulo debido a que tus gastos son mayores que tus ingresos, cuando te repongas cambia tus gastos e ingresos en la seccion 'Mis gastos'");
    }

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

  async mandarNotificacion(titulo: string, mensaje: string) {
    await this.localNotifications.schedule({
      title: titulo,
      text: mensaje,
      foreground: true,
      vibrate: true,
      icon: 'alarm',
    });
  }

  async notificaciones(plan: Plan) {
    var porcentaje = (plan.cantidadAcumulada*100)/plan.cantidadTotal;
      porcentaje = Math.round(porcentaje*100)/100;
      if(porcentaje < 100 && porcentaje >= 90) {
        this.mandarNotificacion('¡Ya casi esta¡', 'Estas cerca de completar el plan ' + plan.nombre +
        ', ya estas al ' + porcentaje);
      } else if(porcentaje < 85 && porcentaje >= 80) {
        this.mandarNotificacion('Gran avance', 'Has avanzado bien en el plan ' + plan.nombre +
        ', ya estas al ' + porcentaje);
      } else if(porcentaje < 55 && porcentaje >= 50) {
        this.mandarNotificacion('Y falta menos de la mitad', 'Has avanzado en el plan ' + plan.nombre +
        ', ya estas al ' + porcentaje);
      } else if(porcentaje < 42 && porcentaje >= 40) {
        this.mandarNotificacion('Bien hecho', 'Has avanzado en el plan ' + plan.nombre +
        ', ya estas al ' + porcentaje);
      } else if(porcentaje < 25 && porcentaje >= 20) {
        this.mandarNotificacion('Primeros pasos', 'Has avanzado en el plan ' + plan.nombre +
        ', ya estas al ' + porcentaje);
      }
  }

  async validarGasto(gasto: number) {
    await this.datosService.cargarDatos();
    this.usuarioCargado = this.datosService.usuarioCarga;

    var gastosUsuario = 0;
    var margenMax = 0;
    var margenMin = 0;
    for(var gastos of this.usuarioCargado.gastos) {
      if(gastos.cantidad != 0) {
        gastosUsuario += gastos.cantidad;
        margenMax += gastos.margenMax;
        margenMin += gastos.margenMin;
      }
    }
    if (  gasto  >= margenMax || gasto >= gastosUsuario) {
      return true;
     }
     else if ( ( gasto < margenMax ) && (gasto >= margenMin ) ) {
      return true;
     }
     else {
      return false;
     }
  }

  botonInfo(titulo: string) {
    this.alertas.forEach(element => {
      if(titulo == element.titulo)
      {
        this.accionesService.presentAlertGenerica(element.titulo, element.mensaje);
        return;
      }
    });
  }
}
  