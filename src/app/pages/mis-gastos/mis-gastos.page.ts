import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, NavController, IonRadioGroup, Events, Platform } from '@ionic/angular';
import { DatosService } from '../../services/datos.service';
import { UsuarioLocal, Rubro, AlertaGeneral, Plan, GastosMensuales } from '../../interfaces/interfaces';
import { AccionesService } from '../../services/acciones.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-mis-gastos',
  templateUrl: './mis-gastos.page.html',
  styleUrls: ['./mis-gastos.page.scss'],
})
export class MisGastosPage implements OnInit {

  //Declaracion de variable para manejar el valor de elementos HTML
  @ViewChild('tipoIngreso',{static: true}) tipoIngreso: IonRadioGroup;

  //Variables para guardar los datos cargados y mostrarlos en el formulario del HTML
  etiquetas: string[] = [];
  rubros: Rubro[] = [];

  //Variable que guarda la informacion de las alertas
  alertas: AlertaGeneral[] = [];

  planes = this.datosService.planesCargados;

  //Variable que nos ayuda a asegurarnos si el ususario no puede satisfacer sus necesidades basicas
  registrarseAdvertencia: boolean = this.datosService.registrarseAdvertencia;

  alertado: boolean[];

  //Variable para guardar los datos del ususario
  usuarioModificado: UsuarioLocal = this.datosService.usuarioCarga;

  usuarioCargado: UsuarioLocal = JSON.parse(JSON.stringify(this.datosService.usuarioCarga));

  diferenciaAhorro: number = this.datosService.diferencia;

  backButtonSub: Subscription;

  invalido: boolean;
  invalido2: boolean;

  rutaSeguir: string = "/tabs/tab1";

  aporteDiario: number;
  valorPromedio = [];

  sobrepasado: boolean;
  mes: number = this.datosService.mes;

  gastosMenusales: GastosMensuales[] = this.datosService.gastosMensualesCargados;

  //Constructor con todas las inyecciones y controladores necesarios
  constructor(private modalCtrl: ModalController,
              private nav: NavController,
              public datosService: DatosService,
              private event: Events,
              private accionesService: AccionesService, 
              private plt: Platform) { }

  ngOnInit() {
    this.valorPromedio[1] = 0;
    this.valorPromedio[2] = 0;
    this.valorPromedio[3] = 0;
    this.valorPromedio[4] = 0;
    this.valorPromedio[5] = 0;
    this.valorPromedio[6] = 0;
    this.valorPromedio[7] = 0;
    this.valorPromedio[8] = 0;

    this.sobrepasado = false;

    this.alertado = [];
    this.alertado[1] = false;
    this.alertado[2] = false;

    this.invalido = false;
    this.invalido2 = false;

    this.aporteDiario = 0;
    this.aporteDiario = (this.usuarioModificado.ingresoCantidad / 30);

    //Llamada a metodo que carga los datos del usuario
    this.datosService.cargarDatos();
    this.usuarioModificado = this.datosService.usuarioCarga;
    this.usuarioCargado = JSON.parse(JSON.stringify(this.datosService.usuarioCarga));
    this.datosService.cargarMes();
    this.mes = this.datosService.mes;

    this.datosService.cargarGastosMensuales();
    this.gastosMenusales = this.datosService.gastosMensualesCargados;

    //Lllamada a metodo que obtiene la informacion de las alertas de un archivo
    this.datosService.getAlertasJson().subscribe(val => {
      this.alertas = val;
    });
    
    //LLamada a metodo que obtiene las etiquetas de un archivo
    this.datosService.getEtiquetas().subscribe (val => {
      this.etiquetas = val.nombre;
    });

    this.datosService.cargarDatosPlan();
    this.planes = this.datosService.planesCargados;

    //Asignacion del tipo de ingreso a la variable
    this.tipoIngreso.value = this.usuarioModificado.tipoIngreso;
    
    //Llamada a metodo que obtiene los rubros de un archivo
    this.datosService.getRubros().subscribe (val => {
      this.rubros = val;
    });
  }

  //Metodo que actualiza el valor del tipo ingrso al modificarlo
  ingresoRadio_misgastos(event)
  {
   this.usuarioModificado.tipoIngreso = event.detail.value;
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

  //Metodo para regresar al pulsar el boton back
  regresar() {
    this.modalCtrl.dismiss();
    this.nav.navigateRoot('/tabs/tab3');
  }

  //Metodo para modificar los datos del ususario con los ingresados
  async modificar()
  {
  
        //Multiplicar X30 el ingreso de cada dia del usuario
        if(this.usuarioModificado.tipoIngreso == 'Variable'){
          this.usuarioModificado.ingresoCantidad = this.aporteDiario * 30; 
          console.log("Ganancia mensual: " + this.usuarioModificado.ingresoCantidad)
        }

      //Condicion que valida el ingreso de los gastos e ingreso
      if(this.validarIngreso()) {
        await this.accionesService.presentAlertOpciones([{text: 'Ok', handler: (blah) => {this.registrarseAdvertencia = true;}},
        {text: 'Configurar', handler: (blah) => {this.registrarseAdvertencia = true;}}],
        'Advertencia', 'Tus gastos son mayores que tus ingresos, si deseas continuar presiona Ok, si quieres modificar ' 
        + 'algun dato presiona Configurar. NOTA: Si seleccionas Ok, se te bloqueran varias secciones de la app');
          this.registrarseAdvertencia = this.datosService.registrarseAdvertencia;

          //Condicional que verifica si un usuario no puede satisfacer sus necesidades y lo redirige
        if(this.registrarseAdvertencia) {
          this.datosService.guardarBloqueoModulos(true); ////////BLOQUEAR MODULOS///////
          console.log(this.registrarseAdvertencia);
          this.modificarUsuario();
          
          this.nav.navigateRoot('/tabs/tab3');
        }
      }
      else {
        this.datosService.guardarBloqueoModulos(false); ////////LE DOY PERMISO PARA LOS MODULOS///////
        this.modificarUsuario();
        await this.datosService.cargarBloqueoModulos();

        this.calcularPromedios();
        if(this.sobrepasado) {
          var irATests;
          await this.accionesService.presentAlertOpciones([{text: 'Vamos', handler: (blah) => {irATests = true}},
          {text: 'En otro momento', handler: (blah) => {this.registrarseAdvertencia = true;}}],
          'Atencion', 'Detectamos que en algunos rubros sobrepasas el promedio nacional en gasto, te recomendamos ' 
          + 'ir a el modal analizar mis gastos para contestar unas preguntas y recibir consejos de como ahorrar');
          if(irATests) {
            this.nav.navigateRoot('/tabs/tab3');
          } else {
            this.nav.navigateRoot('/tabs/tab1');
          }
        } else {
          this.nav.navigateRoot('/tabs/tab1');
        }
      }
      this.modalCtrl.dismiss();
      this.datosService.presentToast('Se han modificado tus gastos');
  }

  //Metodo que calcula los datos necearios para modificar y lo guarda en storage
  async modificarUsuario()
  {

    var i = 0;
    if(this.mes != 1) {
      for (var gastos of this.usuarioCargado.gastos) {
        for(var gastosM of this.usuarioModificado.gastos) {
          if(gastosM.nombre == gastos.nombre) {
            if(gastosM.cantidad != gastos.cantidad) {
              for (var mes of this.gastosMenusales) {
                for (var gastosMen of mes.gastos) {
                  if(gastosMen.nombre == gastosM.nombre) {
                    gastosMen.cantidad = gastosM.cantidad;
                    gastosM.porcentaje = (Math.round(((gastosM.cantidad*100)/this.usuarioModificado.ingresoCantidad)*100)/100).toString();
                    if(gastosM.tipo == 'Promedio') {
                      gastosM.margenMax = gastosM.cantidad + (gastosM.cantidad*0.07);
                      gastosM.margenMin = gastosM.cantidad - (gastosM.cantidad*0.07);
                    } else {
                      gastosM.margenMax = gastosM.cantidad;
                      gastosM.margenMin = gastosM.cantidad;
                    }
                  }
                } 
              }
            }
          }
        }
      }
    } else {
      for (var gastos of this.usuarioCargado.gastos) {
        for(var gastosM of this.usuarioModificado.gastos) {
          if(gastosM.nombre == gastos.nombre) {
            if(gastosM.cantidad != gastos.cantidad) {
              gastosM.porcentaje = (Math.round(((gastosM.cantidad*100)/this.usuarioModificado.ingresoCantidad)*100)/100).toString();
              if(gastosM.tipo == 'Promedio') {
                  gastosM.margenMax = gastosM.cantidad + (gastosM.cantidad*0.07);
                  gastosM.margenMin = gastosM.cantidad - (gastosM.cantidad*0.07);
              } else {
                gastosM.margenMax = gastosM.cantidad;
                gastosM.margenMin = gastosM.cantidad;
              }
            }
          }
        }
      }
    }

  var gastosTotales = 0;
  var margenMin = 0;
    this.usuarioModificado.gastos.forEach(element => {
      if(element.cantidad != 0) {
        gastosTotales += element.cantidad
        margenMin += element.margenMin;
      }
    });

    if(this.datosService.planesExisten == false) {
      this.planes = [];
    }
    //A cada uno de los planes le agregamos lo correspondiente

    //Guardamos los planes terminados y pausados
    var planesPausados: Plan[] = [];
    for(var plan of this.planes) {
      if(plan.pausado) {
        planesPausados.push(plan);
      }
    }

    this.planes = this.planes.filter(p => p.pausado != true);

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
          var g = this.usuarioModificado.ingresoCantidad - ahorrar;
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
    console.log(planesPrioritarios);
    this.datosService.actualizarPlanes(planesPrioritarios);

    this.usuarioModificado.fondoPlanes = 0;
    this.datosService.planesCargados.forEach(element => {
      if(element.pausado != true) {
        this.usuarioModificado.fondoPlanes += element.aportacionMensual; 
      }
    });
    this.usuarioModificado.fondoAhorro = this.usuarioModificado.ingresoCantidad - gastosTotales - this.usuarioModificado.fondoPlanes;
    if(this.usuarioModificado.fondoAhorro < 0) {
      this.usuarioModificado.fondoAhorro = this.usuarioModificado.ingresoCantidad - margenMin - this.usuarioModificado.fondoPlanes;
    }
    this.usuarioModificado.fondoAhorro -= this.diferenciaAhorro;
    this.datosService.usuarioCarga.fondoAhorro = Math.round(this.datosService.usuarioCarga.fondoAhorro*100)/100;

    this.datosService.guardarUsuarioInfo(this.usuarioModificado);
    this.event.publish('usuarioActualizado');
  }

  //Metodo para validar el ingreso de gastos e ingreso
  validarIngreso() {
    var cantidadGastos = 0;

    for( var i = 0; i < 17; i++ ) {
      if( this.usuarioModificado.gastos[i].cantidad != 0 ){
      cantidadGastos += this.usuarioModificado.gastos[i].cantidad;
      } 
    }

    if(cantidadGastos >= this.usuarioModificado.ingresoCantidad) {
      return true;
    }
    else {
      return false;
    }
  }

  validarGasto(gasto: number) {

    var gastosUsuario = 0;
    var margenMax = 0;
    var margenMin = 0;
    for(var gastos of this.usuarioModificado.gastos) {
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
  
  //Metodo para el boton de informacion
  botonInfo(titulo: string) {
    this.alertas.forEach(element => {
      if(titulo == element.titulo) {
        this.accionesService.presentAlertGenerica(element.titulo, element.mensaje);
        return;
      }
    });
  }

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

  calcularPromedios() {
    //Vivienda
    this.valorPromedio[1] = this.usuarioModificado.gastos[0].cantidad + this.usuarioModificado.gastos[1].cantidad + this.usuarioModificado.gastos[2].cantidad + this.usuarioModificado.gastos[3].cantidad;

    //Alimentos
    this.valorPromedio[2] = this.usuarioModificado.gastos[4].cantidad ;

    //Cuidado personal
    this.valorPromedio[3] = this.usuarioModificado.gastos[5].cantidad + this.usuarioModificado.gastos[7].cantidad  + this.usuarioModificado.gastos[15].cantidad ;

    //Transporte
    this.valorPromedio[4] = this.usuarioModificado.gastos[8].cantidad;

    //Internet/cable/telefonía
    this.valorPromedio[5] = this.usuarioModificado.gastos[10].cantidad;

    //Electronicos
    this.valorPromedio[6] = this.usuarioModificado.gastos[12].cantidad;

    //Educación
    this.valorPromedio[7] = this.usuarioModificado.gastos[13].cantidad;

    //Ocio
    this.valorPromedio[8] = this.usuarioModificado.gastos[14].cantidad;

    if(this.valorPromedio[1] >= 5215){ //Vivienda
      this.sobrepasado = true;
    }

    if(this.valorPromedio[2] >= 3500){ //Alimentos
      this.sobrepasado = true;
    }

    if(this.valorPromedio[3] >= 1300){ //Cuidado personal
      this.sobrepasado = true;
    }

    if(this.valorPromedio[4] >= 1300){ //Transporte
      this.sobrepasado = true;
    }

    if(this.valorPromedio[5] >= 885){ //Internet/cable/television
      this.sobrepasado = true;
    }

    if(this.valorPromedio[6] >= 800){ //Electronicos
      this.sobrepasado = true;
    } 

    if(this.valorPromedio[7] >= 1500){ //Educacion
      this.sobrepasado = true;
    }

    if(this.valorPromedio[8] >= 800){ //Ocio
      this.sobrepasado = true;
    }
  }
}