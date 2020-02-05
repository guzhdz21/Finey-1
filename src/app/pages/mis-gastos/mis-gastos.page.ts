import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, NavController, IonRadioGroup, Events, AlertController } from '@ionic/angular';
import { DatosService } from '../../services/datos.service';
import { UsuarioLocal, Gasto, Rubro } from '../../interfaces/interfaces';

@Component({
  selector: 'app-mis-gastos',
  templateUrl: './mis-gastos.page.html',
  styleUrls: ['./mis-gastos.page.scss'],
})
export class MisGastosPage implements OnInit {

  @ViewChild('sexo',{static: true}) sexo: IonRadioGroup;
  @ViewChild('tipoIngreso',{static: true}) tipoIngreso: IonRadioGroup;

  etiquetas: string[] = [];
  i: number = 0;
  rubros: Rubro[] = [];
  registrarseAdvertencia: boolean = true;

  usuarioCargado: UsuarioLocal = this.datosService.usuarioCarga;

  usuarioModificado: UsuarioLocal = this.usuarioCargado;

  constructor(private modalCtrl: ModalController,
              private nav: NavController,
              public datosService: DatosService,
              private event: Events,
              private alertCtrl: AlertController) { }

  ngOnInit() {
    console.log(this.datosService.usuarioCarga.gastos[16]);
    this.datosService.cargarDatos();
    this.datosService.getEtiquetasTab1().subscribe (val => {
      this.etiquetas = val.nombre;
      });
      
      this.datosService.cargarDatos();
      this.tipoIngreso.value = this.usuarioCargado.tipoIngreso;
      
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
          await this.presentAlert();
  
        if(this.registrarseAdvertencia) {
          console.log(this.registrarseAdvertencia);
          this.modificarUsuario();
          this.nav.navigateRoot('/tabs/tab1');
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
  this.usuarioModificado.gastos.forEach(element => {
    element.tipo = this.rubros[this.i].tipo;
    element.porcentaje = ((element.cantidad*100)/this.usuarioModificado.ingresoCantidad).toString();
    if (element.tipo === 'Promedio') {
      element.margenMax = element.cantidad+(element.cantidad*0.07);
      element.margenMin = element.cantidad-(element.cantidad*0.07);
    }
    else {
      element.margenMax = element.cantidad;
      element.margenMin = element.cantidad;
    }
    this.i++;
  });

  this.datosService.guardarUsuarioInfo(this.usuarioModificado);
  this.event.publish('usuarioActualizado');
  this.event.publish('salirActualizado');
  this.modalCtrl.dismiss();
  this.nav.navigateRoot('/tabs/tab1');
  this.datosService.presentToast('Cambios modificados');
  }

  validarIngreso() {

    var cantidadGastos=0;

      for( var ii = 0; ii < 17; ii++ ) {
        if( this.usuarioModificado.gastos[ii].cantidad != 0 ){
      cantidadGastos += this.usuarioModificado.gastos[ii].cantidad;
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

    async presentAlert() {
      
      const alert = await this.alertCtrl.create({
        header: 'Advertencia',
        message: 'Tus gastos son mayores que tus ingresos, si deseas continuar presiona Ok, si quieres modificar algun dato presiona Configurar.',
        buttons: [
          {
            text: 'Ok',
            handler: (blah) => {
              this.registrarseAdvertencia = true;
            }
          },
          {
            text: 'Configurar',
            handler: (blah) => { 
              this.registrarseAdvertencia = false;
            }
          }
      ]
      });
      alert.present();
      await alert.onDidDismiss();
    }
    
}