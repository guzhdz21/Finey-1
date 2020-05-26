import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, NavController, IonRadioGroup, Events, Platform } from '@ionic/angular';
import { DatosService } from '../../services/datos.service';
import { UsuarioLocal, Rubro, AlertaGeneral } from '../../interfaces/interfaces';
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

  //Variable que nos ayuda a asegurarnos si el ususario no puede satisfacer sus necesidades basicas
  registrarseAdvertencia: boolean = this.datosService.registrarseAdvertencia;

  //Variable para guardar los datos del ususario
  usuarioModificado: UsuarioLocal = this.datosService.usuarioCarga;

  diferenciaAhorro: number = this.datosService.diferencia;

  backButtonSub: Subscription;

  invalido: boolean;

  //Constructor con todas las inyecciones y controladores necesarios
  constructor(private modalCtrl: ModalController,
              private nav: NavController,
              public datosService: DatosService,
              private event: Events,
              private accionesService: AccionesService, 
              private plt: Platform) { }

  ngOnInit() {

    this.invalido = true;

    //Llamada a metodo que carga los datos del usuario
    this.datosService.cargarDatos();

    //Lllamada a metodo que obtiene la informacion de las alertas de un archivo
    this.datosService.getAlertasJson().subscribe(val => {
      this.alertas = val;
    });
    
    //LLamada a metodo que obtiene las etiquetas de un archivo
    this.datosService.getEtiquetas().subscribe (val => {
      this.etiquetas = val.nombre;
    });
    
    //Llamada al metodo que carga los datos
    this.datosService.cargarDatos();

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

  comprobar(event, cantidad, opcion){

      if(opcion == 1){
        if(cantidad < 0){
          this.invalido = true;
          this.accionesService.presentAlertGenerica("Cantidad de ingreso inválida", "No puedes insertar una cantidad de ingreso negativa");
        }
        else{
          this.invalido = false;
        }
      }
      else{
        if(cantidad < 0){
          this.invalido = true;
          this.accionesService.presentAlertGenerica("Cantidad de gasto inválida", "No puedes insertar una cantidad de gasto negativa");
        }
        else{
          this.invalido = false;
        }
      }

  }

  //Metodo para regresar al pulsar el boton back
  regresar() {
    this.modalCtrl.dismiss();
    this.nav.navigateRoot('/tabs/tab1');
  }

  //Metodo para modificar los datos del ususario con los ingresados
  async modificar()
  {
    //Condicioanl que verifica si el ususario es variable
    if(this.usuarioModificado.tipoIngreso != 'Variable') {
  
      //Condicion que valida el ingreso de los gastos e ingreso
      if(this.validarIngreso()) {
          await this.datosService.presentAlertaIngreso();
          this.registrarseAdvertencia = this.datosService.registrarseAdvertencia;

          //Condicional que verifica si un usuario no puede satisfacer sus necesidades y lo redirige
        if(this.registrarseAdvertencia) {
          console.log(this.registrarseAdvertencia);
          this.modificarUsuario();
          this.nav.navigateRoot('/tabs/tab3');
        }
      }
      else {
        this.modificarUsuario();
        this.nav.navigateRoot('/tabs/tab1');
        this.datosService.presentToast('Se han modificado tus gastos');
      }
    }
    else {
        this.modificarUsuario();
        this.nav.navigateRoot('/tabs/tab1');
        this.datosService.presentToast('Se han modificado tus datos');
    }
  }

  //Metodo que calcula los datos necearios para modificar y lo guarda en storage
  modificarUsuario()
  {
    var i = 0;
    this.usuarioModificado.gastos.forEach(element => {
    element.tipo = this.rubros[i].tipo;
    element.porcentaje = ((element.cantidad*100)/this.usuarioModificado.ingresoCantidad).toString();
    if (element.tipo === 'Promedio') {
      element.margenMax = element.cantidad+(element.cantidad*0.07);
      element.margenMin = element.cantidad-(element.cantidad*0.07);
    }
    else {
      element.margenMax = element.cantidad;
      element.margenMin = element.cantidad;
    }
    i++;
  });

  var gastosTotales = 0;
  var margenMin = 0;
    this.usuarioModificado.gastos.forEach(element => {
      if(element.cantidad != 0) {
        gastosTotales += element.cantidad
        margenMin += element.margenMin;
      }
    });

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
  this.modalCtrl.dismiss();
  this.nav.navigateRoot('/tabs/tab1');
  this.datosService.presentToast('Cambios modificados');
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
  
  //Metodo para el boton de informacion
  botonInfo(titulo: string) {
    this.alertas.forEach(element => {
      if(titulo == element.titulo) {
        this.accionesService.presentAlertGenerica(element.titulo, element.mensaje);
        return;
      }
    });
  }

  ionViewDidEnter() {
    this.backButtonSub = this.plt.backButton.subscribeWithPriority( 10000, () => {
      this.modalCtrl.dismiss();
      this.nav.navigateRoot('/tabs/tab1');
    });
  }
}