import { Component, OnInit } from '@angular/core';
import { ModalController, NavController} from '@ionic/angular';
import { DatosService } from '../../services/datos.service';
import { UsuarioLocal, Rubro, AlertaGeneral } from '../../interfaces/interfaces';
import { Router } from '@angular/router';
import { AccionesService } from '../../services/acciones.service';

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
  requerido = true;

  //Variable que nos ayuda a asegurarnos si el ususario no puede satisfacer sus necesidades basicas
  registrarseAdvertencia: boolean = this.datosService.registrarseAdvertencia;
  
  //Variable que se le asigna los datos del ususario
  usuario: UsuarioLocal = {
    nombre: '',
    sexo: '',
    tipoIngreso: '',
    ingresoCantidad: null,
    gastos: []
  };

  //Constructor con las inyecciones de servicios y controladores necesarias
  constructor( private modalCtrl: ModalController, 
                private datosService: DatosService,
                private nav: NavController,
                private router: Router,
                private accionesService: AccionesService) { }

ngOnInit() {
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

    //Verificar si el usuario no puede satidfacer sus necesidades basicas y se insertan sus datos  
    if(this.registrarseAdvertencia) {
        this.registrarUsuario();
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
    this.datosService.presentToast('Registro exitoso');
  }
}

//Metodo que registra el Ususario en el Storage y hace las operaciones necesarias
  registrarUsuario()
  {
    var i = 0;
    this.usuario.gastos.forEach(element => {
      element.nombre = this.rubros[i].texto;
      element.tipo = this.rubros[i].tipo;
      element.icono = this.rubros[i].nombre;
      element.porcentaje = ((element.cantidad*100)/this.usuario.ingresoCantidad).toString();
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

    this.datosService.guardarUsuarioInfo(this.usuario);
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

  //Metodo para asegurar que todos los datos sean ingresados
  verificarGastosNull() {
    this.usuario.gastos.forEach(element => {
      if(element.cantidad == null) {
        return;
      }
    });
    this.requerido = false;
  }
    
}