import { Component, OnInit, ɵflushModuleScopingQueueAsMuchAsPossible } from '@angular/core';
import { DatosService } from '../../services/datos.service';
import { AlertaGeneral, GastosMensuales, GastoMensual, UsuarioLocal, Plan } from '../../interfaces/interfaces';
import { AccionesService } from '../../services/acciones.service';
import { ModalController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-gastos-diarios',
  templateUrl: './gastos-diarios.page.html',
  styleUrls: ['./gastos-diarios.page.scss'],
})
export class GastosDiariosPage implements OnInit {

  alertas: AlertaGeneral[] = [];
  etiquetas: string[] = ['Vivienda'];
  gastos: GastosMensuales = {
    mes: 1,
    gastos: [
      {
        nombre: '',
        cantidad: 0
      }
    ]
  };

  planes: Plan[] = this.datosService.planesCargados;

  diferenciaFondo: number = this.datosService.diferencia;
  
  //Variable para guardar los datos del ususario
  usuario: UsuarioLocal = this.datosService.usuarioCarga;

  aporteDiario: number;
  invalido: boolean;
  invalido2: boolean;
  alertado: boolean[];
  muestraInput: boolean;

  gastosMensuales: GastosMensuales[] = this.datosService.gastosMensualesCargados;
  mes: number = this.datosService.mes;

  constructor(private datosService: DatosService,
              private accionesService: AccionesService,
              private modalCtrl: ModalController,
              private nav: NavController) { }

  async ngOnInit() {

    if(this.usuario.tipoIngreso == 'Variable') {
      this.invalido2 = true;
    }
    else{
      this.invalido2 = false;
    }

    this.muestraInput = false;

    this.alertado = [];
    this.alertado[1] = false;
    this.alertado[2] = false;

    this.invalido = true;

    await this.datosService.cargarGastosMensuales();
    this.datosService.cargarMes();

    this.datosService.getAlertasJson().subscribe(val => {
      this.alertas = val;
    });

    this.datosService.getEtiquetas().subscribe (val => {
      this.etiquetas = val.nombre;

      var gastos: GastosMensuales = {
        mes: this.mes,
        gastos: []
      }
      val.nombre.forEach(element => {
        var gasto: GastoMensual = {
          nombre: element,
          cantidad: null
        } 
       gastos.gastos.push(gasto);
      });
      this.gastos = gastos;
    });
  }

  botonInfo(titulo: string) {
    for(let element of this.alertas) {
      if(titulo == element.titulo) {
        this.accionesService.presentAlertGenerica(element.titulo.substring(0, element.titulo.length-1), element.mensaje);
        return;
      }
    }
  }

  checkBoxInicial(event){
    if(event.currentTarget.checked == true) {
      this.muestraInput = true;
      this.invalido2 = true;
    }
    else{
      this.muestraInput = false;
      this.invalido2 = false;
    }
  }

  comprobar(event, cantidad, index){

    if(index == 1){
      if(cantidad <= 0){
        this.invalido2 = true;
  
      if(this.alertado[index] == false){
        if(cantidad != null){
          this.accionesService.presentAlertGenerica("Cantidad inválida", "No puedes insertar una cantidad negativa o igual a 0");
          this.alertado[index] = true;
        }
      }
  
      }
      else{
        this.invalido2 = false;
      }
    }

    else{
      if(cantidad < 0){
        this.invalido = true;
  
      if(this.alertado[index] == false){
        if(cantidad != null){
          this.accionesService.presentAlertGenerica("Cantidad inválida", "No puedes insertar una cantidad negativa");
          this.alertado[index] = true;
        }
      }
    }
    else{
      this.invalido = false;
    }
  }
}

  async ingresar() {

    if(this.usuario.tipoIngreso == 'Variable') {
      this.usuario.ingresoCantidad = this.aporteDiario * 30;
      this.datosService.guardarUsuarioInfo(this.usuario);
      this.reajustarPlanes();
    }

    var nuevoMes = true;
    for(var mensual of this.gastosMensuales) {
      if(mensual.mes == this.gastos.mes) {
        nuevoMes = false
      }
    }

    if(nuevoMes) {
      this.gastosMensuales.push(this.gastos);
    } else {
      for(var mensual of this.gastosMensuales) {
        if(mensual.mes == this.gastos.mes) {
          for(var gasto of this.gastos.gastos) {
            for (var gastoMensual of mensual.gastos) {
              if(gasto.nombre == gastoMensual.nombre && gasto.cantidad != 0) {
                gastoMensual.cantidad += gasto.cantidad;
              }
            }
          }
        }
        break;
      }
    }

    var gastosEsteMes: GastosMensuales = null;
    for(mensual of this.gastosMensuales) {
      if(mensual.mes == this.mes) {
        gastosEsteMes = mensual;
      }
    }

    var gastosMayores: String = "";
    for(var gastoUsuario of this.datosService.usuarioCarga.gastos) {
      for(var gastoMensual of gastosEsteMes.gastos) {
        if(gastoUsuario.nombre == gastoMensual.nombre) {
          if(gastoUsuario.tipo == 'Promedio' &&  gastoUsuario.margenMax < gastoMensual.cantidad && gastoUsuario.cantidad != 0){
            gastosMayores += gastoUsuario.nombre + ', ';
          } else if(gastoUsuario.tipo == 'Fijo' &&  gastoUsuario.margenMax < gastoMensual.cantidad) {
            gastosMayores += gastoUsuario.nombre + ', ';
          }
        }
      }
    }

    if(gastosMayores != "") {
      await this.accionesService.presentAlertGenerica('Cuidado','En los rubros: ' + 
      gastosMayores + 'estas sobrepasando el margen maximo, asi que te recomendamos limitarte un poco en tus gastos, '
      + 'ya que podrias llegar a tener perdidas y afectar el desempeño de tus planes');
    }
    await this.datosService.guardarGastosMensuales(this.gastosMensuales);
    await this.datosService.guardarFechaDiaria(new Date().getDate());
    this.modalCtrl.dismiss();
    this.nav.navigateRoot('/tabs/tab1');
  }

  async reajustarPlanes() {
    //Calculos nuevos
    await this.datosService.cargarDatosPlan();
    this.planes = this.datosService.planesCargados;
    await this.datosService.cargarDatos();
    this.usuario = this.datosService.usuarioCarga;

    var planesPausados: Plan[] = [];
    for(var plan of this.planes) {
      if(plan.pausado) {
        planesPausados.push(plan);
      }
    }
    this.planes = this.planes.filter(p => p.pausado != true);

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
          var g = this.usuario.ingresoCantidad - ahorrar;
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

  async actualizarUsuario() {
    await this.datosService.cargarDiferencia();
    this.diferenciaFondo = this.datosService.diferencia;
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

  validarGasto(gasto: number) {
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
}
