import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, NavController, IonRadioGroup, Events } from '@ionic/angular';
import { DatosService } from '../../services/datos.service';
import { UsuarioLocal, Gasto, Rubro } from '../../interfaces/interfaces';

@Component({
  selector: 'app-mis-gastos',
  templateUrl: './mis-gastos.page.html',
  styleUrls: ['./mis-gastos.page.scss'],
})
export class MisGastosPage implements OnInit {

  @ViewChild('tipoIngreso',{static: true}) tipoIngreso: IonRadioGroup;

  etiquetas: string[] = [];
  i: number = 0;
  rubros: Rubro[] = [];

  usuarioCargado: UsuarioLocal = this.datosService.usuarioCarga;

  usuarioModificado: UsuarioLocal = this.usuarioCargado;

  constructor(private modalCtrl: ModalController,
              private nav: NavController,
              public datosService: DatosService,
              private event: Events,) { }

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

  modificar()
  {
  this.usuarioModificado.gastos.forEach(element => {
    element.nombre = this.rubros[this.i].texto;
    element.tipo = this.rubros[this.i].tipo;
    element.icono = this.rubros[this.i].nombre;
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

}