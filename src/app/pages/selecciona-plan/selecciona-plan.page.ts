import { Component, OnInit } from '@angular/core';
import { DatosService } from '../../services/datos.service';
import { Plan, UsuarioLocal } from '../../interfaces/interfaces';
import { Events, NavController, Platform, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { NavigationExtras } from '@angular/router';
import { AccionesService } from '../../services/acciones.service';

@Component({
  selector: 'app-selecciona-plan',
  templateUrl: './selecciona-plan.page.html',
  styleUrls: ['./selecciona-plan.page.scss'],
})
export class SeleccionaPlanPage implements OnInit {

  constructor(private datosService: DatosService,
            private event: Events,
            private nav: NavController,
            private plt: Platform,
            private modalCtrl: ModalController,
            private accionesService: AccionesService,) { }

  planes: Plan[] = [];
  rutaSeguir: string = "/tabs/tab2";
  backButtonSub: Subscription;
  cantidadTransferir: number;
  transferenciaAprobada: boolean = true;

  planSumar: Plan = {
              nombre: '',
              cantidadTotal: null,
              tiempoTotal: null,
              cantidadAcumulada: null,
              tiempoRestante: null,
              descripcion: '',
              aportacionMensual: null,
              pausado: false
  };

  planS: Plan;
  planR: Plan;
  usuario: UsuarioLocal = this.datosService.usuarioCarga;
  ingresoExtra: number = this.datosService.ingresoExtra;
  perdida: number = this.datosService.perdida;
  diferenciaFondo: number = this.datosService.diferencia;

  ngOnInit() {
    this.datosService.cargarDatosPlan();
    this.planes = this.datosService.planesCargados;
    this.datosService.cargarDatos();
    this.usuario = this.datosService.usuarioCarga;
    this.datosService.cargarIngresoExtra();
    this.ingresoExtra = this.datosService.ingresoExtra;
    this.datosService.cargarPerdida();
    this.perdida = this.datosService.perdida;
    this.datosService.cargarDiferencia();
    this.diferenciaFondo = this.datosService.diferencia;
    this.planSumar = this.datosService.planASumar;
  }

  //Metodo que hace la transferencia de dinero
  async planSeleccionado(planRestar: Plan) {
    for(var plan of this.planes) {
      if(plan.aportacionMensual == this.planSumar.aportacionMensual
        && plan.cantidadAcumulada == this.planSumar.cantidadAcumulada
        && plan.cantidadTotal == this.planSumar.cantidadTotal
        && plan.descripcion == this.planSumar.descripcion
        && plan.nombre == this.planSumar.nombre
        && plan.pausado == this.planSumar.pausado
        && plan.tiempoRestante == this.planSumar.tiempoRestante
        && plan.tiempoTotal == this.planSumar.tiempoTotal) {
          this.planS = plan;
      }
      if(plan == planRestar) {
        this.planR = plan;
      }
    }

    await this.accionesService.presentAlertTransferencia();

    if(this.accionesService.tipoTransferencia == true) { //Si es cierta cantidad el TIPO DE TRANSFERENCIA

    await this.accionesService.presentAlertTransfer([{text: 'Listo',handler: (bla) => { 
      console.log(bla.cantidadTransferir);
      if(parseInt(bla.cantidadTransferir) <= 0)  {
        this.datosService.presentToast('No se puede ingresar 0 ni numeros negativos');
        this.transferenciaAprobada = false;
        
      } else if(parseInt(bla.cantidadTransferir) > this.planR.cantidadAcumulada) {
        this.datosService.presentToast('No puedes transferir una cantidad mayor a la que contiene el plan');
        this.transferenciaAprobada = false;
      } 
      else {
        this.transferenciaAprobada = true;
        this.cantidadTransferir = parseInt(bla.cantidadTransferir);
      }
    }}]);

    if(this.transferenciaAprobada == true){
      this.planR.cantidadAcumulada -= this.cantidadTransferir;
      this.planS.cantidadAcumulada += this.cantidadTransferir; 
      this.ajustarPlanes();
      this.datosService.presentToast('Transferencia realizada con éxito');
    }

  }
  else{ //Si es la opcion de TODO

    if(planRestar.cantidadAcumulada <= 0){
      this.accionesService.presentAlertGenerica("Cantidad inválida" , "No puedes seleccionar este plan, pues tiene 0 de cantidad");
    }
    else{
      var transferir = this.planR.cantidadAcumulada;
      this.planR.cantidadAcumulada = 0;
      this.planR.tiempoRestante = this.planR.tiempoTotal;
      this.planS.cantidadAcumulada += transferir;
      this.ajustarPlanes();
      this.datosService.presentToast('Transferencia realizada con éxito');
    }
  }
    this.nav.navigateRoot('/tabs/tab2');

  }
            
            
//Metodo que te regresa a la pantalla tab1 en este caso
  async ionViewDidEnter() {
          
    await this.datosService.cargarBloqueoModulos();
    if(this.datosService.bloquearModulos == true){
      this.rutaSeguir = "/tabs/tab3";
      this.backButtonSub = this.plt.backButton.subscribeWithPriority( 10000, () => {
        this.modalCtrl.dismiss();
        this.nav.navigateRoot('/tabs/tab3');
      });
    }
    else{
      this.backButtonSub = this.plt.backButton.subscribeWithPriority( 10000, () => {
      this.modalCtrl.dismiss();
      this.nav.navigateRoot('/tabs/tab1');
      });
    }
  }

  async ajustarPlanes() {
    var planesTerminados: Plan[] = [];
    var planesPausados: Plan[] = [];
    for(var plan of this.planes) {
      if(plan.tiempoRestante == 0 && (plan.cantidadAcumulada + 1) >= plan.cantidadTotal ) {
        planesTerminados.push(plan);
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
          var g = this.usuario.ingresoCantidad + this.ingresoExtra - this.perdida - ahorrar;
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
    await this.actualizarUsuario();
  }
  
  async validarGasto(gasto: number) {;
    var gastosUsuario = 0;
    var margenMax = 0;
    var margenMin = 0;
    for(var gastos of this.usuario.gastos) {
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

  async actualizarUsuario() {
    this.usuario = this.datosService.usuarioCarga;
    this.usuario.fondoPlanes = 0;
    this.datosService.planesCargados.forEach(element => {
      if(element.pausado != true) {
        this.usuario.fondoPlanes += element.aportacionMensual; 
      }
    });
    this.usuario.fondoPlanes = Math.round(this.usuario.fondoPlanes*100)/100;
    var gastos = 0;
    var margenMin = 0;
    this.datosService.usuarioCarga.gastos.forEach(element => {
      if(element.cantidad != 0) {
        gastos += element.cantidad;
        margenMin += element.margenMin;
      }
    });

    this.usuario.fondoAhorro = this.usuario.ingresoCantidad - this.usuario.fondoPlanes - gastos;
    if(this.usuario.fondoAhorro < 0) {
      this.usuario.fondoAhorro = this.usuario.ingresoCantidad - this.usuario.fondoPlanes - margenMin;
    }
    this.usuario.fondoAhorro -= this.diferenciaFondo;
    this.usuario.fondoAhorro = Math.round(this.usuario.fondoAhorro*100)/100;
    await this.datosService.guardarUsuarioInfo(this.usuario);
  }

}
          
