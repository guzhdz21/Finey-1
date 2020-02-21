import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, NavController, IonRadioGroup, Events } from '@ionic/angular';
import { DatosService } from '../../services/datos.service';
import { UsuarioLocal, Rubro, AlertaGeneral } from '../../interfaces/interfaces';
import { AccionesService } from '../../services/acciones.service';

@Component({
  selector: 'app-mis-gastos',
  templateUrl: './mis-gastos.page.html',
  styleUrls: ['./mis-gastos.page.scss'],
})
export class MisGastosPage implements OnInit {

  //Declaracion de variables para manejar el valor de elementos HTML
  @ViewChild('sexo',{static: true}) sexo: IonRadioGroup;
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

  //Constructor con todas las inyecciones y controladores necesarios
  constructor(private modalCtrl: ModalController,
              private nav: NavController,
              public datosService: DatosService,
              private event: Events,
              private accionesService: AccionesService) { }

  ngOnInit() {
    //Llamada a metodo que carga los datos del ussuario
    this.datosService.cargarDatos();

    //Lllamada a metodo que obtiene la informacion de las alertas de un archivo
    this.datosService.getAlertasJson().subscribe(val => {
      this.alertas = val;
    });
    
    //LLamada a metodo que obtiene las etiquetas de un archivo
    this.datosService.getEtiquetas().subscribe (val => {
      this.etiquetas = val.nombre;
    });
      
    this.datosService.cargarDatos();
    this.tipoIngreso.value = this.usuarioModificado.tipoIngreso;
      
    this.datosService.getRubros().subscribe (val => {
      this.rubros = val;
    });
  }

  ingresoRadio_misgastos(event)
  {
   this.usuarioModificado.tipoIngreso = event.detail.value;
  }

  regresar() {
    this.modalCtrl.dismiss();
    this.nav.navigateRoot('/tabs/tab1');
  }

  async modificar()
  {
    if(this.usuarioModificado.tipoIngreso != 'Variable') {
  
      if(this.validarIngreso()){
          await this.datosService.presentAlertaIngreso();
          this.registrarseAdvertencia = this.datosService.registrarseAdvertencia;

  
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

  this.datosService.guardarUsuarioInfo(this.usuarioModificado);
  this.event.publish('usuarioActualizado');
  this.modalCtrl.dismiss();
  this.nav.navigateRoot('/tabs/tab1');
  this.datosService.presentToast('Cambios modificados');
  }

  validarIngreso() {
    var cantidadGastos=0;

      for( var i = 0; i < 17; i++ ) {
        if( this.usuarioModificado.gastos[i].cantidad != 0 ){
      cantidadGastos += this.usuarioModificado.gastos[i].cantidad;
        } 
      }
      console.log('gastos: ', cantidadGastos);
      console.log('Ingresos: ', this.usuarioModificado.ingresoCantidad);
        if(cantidadGastos >= this.usuarioModificado.ingresoCantidad) {
        return true;
      }
        else{
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