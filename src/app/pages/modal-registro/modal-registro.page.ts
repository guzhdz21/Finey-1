import { Component, OnInit } from '@angular/core';
import { ModalController, NavController, Platform } from '@ionic/angular';
import { DatosService } from '../../services/datos.service';
import { UsuarioLocal, Rubro, AlertaGeneral } from '../../interfaces/interfaces';
import { Router } from '@angular/router';
import { AccionesService } from '../../services/acciones.service';
import { Subscription } from 'rxjs';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { Time } from '@angular/common';

@Component({
  selector: 'app-modal-registro',
  templateUrl: './modal-registro.page.html',
  styleUrls: ['./modal-registro.page.scss'],
})
export class ModalRegistroPage implements OnInit {

  //Variables para guardar datos cargados para el HTML
  etiquetas: string[] = [];
  rubros: Rubro[] = [];
  alertas: AlertaGeneral[] = [];

  //Variables para validar el ingreso de los datos
  ingreso: boolean = true;
  sexo: boolean = true;
  notificacion: boolean = true;
  requerido: boolean = true;
  invalido: boolean;
  invalido2: boolean;
  alertado: boolean[];

  //Variable que nos ayuda a asegurarnos si el ususario no puede satisfacer sus necesidades basicas
  registrarseAdvertencia: boolean = this.datosService.registrarseAdvertencia;

  backButtonSub: Subscription;
  
  //Variable que se le asigna los datos del ususario
  usuario: UsuarioLocal = {
    nombre: '',
    sexo: '',
    tipoIngreso: '',
    ingresoCantidad: null,
    gastos: [],
    fondoPlanes: null,
    fondoAhorro: null
  };

  notificacionTiempo: Date;

  //Constructor con las inyecciones de servicios y controladores necesarias
  constructor( private modalCtrl: ModalController, 
                private datosService: DatosService,
                private nav: NavController,
                private router: Router,
                private accionesService: AccionesService,
                private plt: Platform, 
                private localNotifications: LocalNotifications) { }

ngOnInit() {

  this.alertado = [];
  this.alertado[1] = false;
  this.alertado[2] = false;

  this.invalido = true;
  this.invalido2 = true;

  //Llamado al metodo del servicio datos Service para obtener gastos iniciales de un archivo
  this.datosService.getGastosJson().subscribe (val => {
    this.usuario.gastos = val;
  });

  //Llamado al metodo del servicio datos Service para obtener los textos de las alertas de un archivo
  this.datosService.getAlertasJson().subscribe(val => {
    this.alertas = val;
  });

  //Llamado al metodo del servicio datos Service para obtener las etiquetas de los campos de un archivo
  this.datosService.getEtiquetas().subscribe (val => {
    this.etiquetas = val.nombre;
  });

  //Llamado al metodo del servicio datos Service para obtener los datos de los rubros de un archivo
  this.datosService.getRubros().subscribe (val => {
    this.rubros = val;
  });
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

  this.verificarGastosNull();

}

//Metodo que ayuda a saber que el usuario si escogio uan opcion del tipo de ingreso
ingresoRadio(event)
{
  this.usuario.tipoIngreso = event.detail.value;
  this.ingreso = false;
}

//Metodo que ayuda a saber que el usuario si escogio uan opcion del sexo
sexoRadio(event)
{
  this.usuario.sexo = event.detail.value;
  this.sexo = false;
}

//metodo apara determinar como sera insertado el registro
 async registrar()
{
  //Verificar si el ususario es Fijo o Variable
  if(this.usuario.tipoIngreso != 'Variable') {

    //Verificar si el usuario no ingreso gastos  mayores al ingreso si no se registra el ususario
    if(this.validarIngreso()) {
      await this.datosService.presentAlertaIngreso();
      this.registrarseAdvertencia = this.datosService.registrarseAdvertencia;

    //Verificar si el usuario no puede satisfacer sus necesidades basicas y se insertan sus datos  
    if(this.registrarseAdvertencia) {
        this.registrarUsuario();
        await this.mandarNotificacion();
        await this.guardarDiferencia();
        await this.guardarFechaMes();
        this.nav.navigateRoot('/tabs/tab3');
      }
    }
    else {
      this.registrarUsuario();
      this.nav.navigateRoot('/plan-form-page');
      this.router.navigate(['/plan-form-page'],
      {
        queryParams: {
          value: true
        }
      });
      await this.mandarNotificacion();
      await this.guardarDiferencia();
      await this.guardarFechaMes();
      this.datosService.presentToast('Registro exitoso');
    }
  }
  else {
    this.registrarUsuario();
    this.nav.navigateRoot('/plan-form-page');
    this.router.navigate(['/plan-form-page'],
    {
      queryParams: {
         value: true
        }
    });
    await this.mandarNotificacion();
    await this.guardarFechaMes();
    await this.guardarDiferencia();
    this.datosService.presentToast('Registro exitoso');
  }
}

//Metodo que registra el Ususario en el Storage y hace las operaciones necesarias
  async registrarUsuario()
  {
    var i = 0;
    this.usuario.gastos.forEach(element => {
      element.nombre = this.rubros[i].texto;
      element.tipo = this.rubros[i].tipo;
      element.icono = this.rubros[i].nombre;
      element.porcentaje = (Math.round(((element.cantidad*100)/this.usuario.ingresoCantidad)*100)/100).toString();
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
    this.usuario.gastos.forEach(element => {
      if(element.cantidad != 0) {
        gastosTotales += element.cantidad
      }
    });
    this.usuario.fondoPlanes = 0;
    this.usuario.fondoAhorro = this.usuario.ingresoCantidad - gastosTotales;
    
    await this.datosService.guardarUsuarioInfo(this.usuario);
    this.datosService.guardarPrimeraVez(false);
    this.datosService.cargarDatos();
    this.modalCtrl.dismiss();
  }

  //Funcion que regresa un valor booleano siendro true si el ingreso es menor a los gastos del ususario y false si no
  validarIngreso() {
    var cantidadGastos = 0;

    for( var i = 0; i < 17; i++ ) {
      if( this.usuario.gastos[i].cantidad != 0 ){
        cantidadGastos += this.usuario.gastos[i].cantidad;
      } 
    }

    if(cantidadGastos >= this.usuario.ingresoCantidad) {
      return true;
    }
    else{
      return false;
    }
  }

  //Metodo que llama a ala alerta que muestra la informacion del rubro seleccionado
  botonInfo(titulo: string) {
    this.alertas.forEach(element => {
      if(titulo == element.titulo)
      {
        this.accionesService.presentAlertGenerica(element.titulo, element.mensaje);
        return;
      }
    });
  }

  notificacionT(event) {
    this.notificacionTiempo = new Date(event.detail.value);
    this.notificacion = false;
  }

  //Metodo para asegurar que todos los datos sean ingresados
  verificarGastosNull() {

    this.usuario.gastos.forEach(element => {
      if(element.cantidad == null) {
        return;
      }
    });
    this.requerido = false;
  }

  async mandarNotificacion() {
    await this.datosService.guardarNotificacion(this.notificacionTiempo);
    await this.datosService.mandarNotificacionDiaria();
  }

  async guardarFechaMes() {
    if(new Date().getDate() > 28) {
      await this.datosService.guardarDiaDelMes(28, new Date().getMonth());
    } else {
      await this.datosService.guardarDiaDelMes(new Date().getDate(), new Date().getMonth());
    }
    await this.datosService.guardarFechaDiaria(new Date().getDate());
  }

  async guardarDiferencia() {
    await this.datosService.guardarDiferencia(0);
  }
    
  ionViewDidEnter() {
    this.backButtonSub = this.plt.backButton.subscribeWithPriority( 10000, () => {
      if(window.confirm('¿Deseas salir de la app?'))
      {
        navigator["app"].exitApp();
      }
    });
  }
  
}