import { Component, OnInit } from '@angular/core';
import { ModalController, NavController, Events, AlertController } from '@ionic/angular';
import { DatosService } from '../../services/datos.service';
import { UsuarioLocal, Gasto ,Rubro } from '../../interfaces/interfaces';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modal-registro',
  templateUrl: './modal-registro.page.html',
  styleUrls: ['./modal-registro.page.scss'],
})
export class ModalRegistroPage implements OnInit {

  i: number = 0;
  etiquetas: string[] = [];
  rubros: Rubro[] = [];
  ingreso: boolean = true;
  sexo: boolean = true;
  registrarseAdvertencia: boolean = this.datosService.registrarseAdvertencia;

  usuario: UsuarioLocal = {
    nombre: '',
    sexo: '',
    tipoIngreso: '',
    ingresoCantidad: null,
    gastos: []
  };

  constructor( private modalCtrl: ModalController, 
                private datosService: DatosService,
                private nav: NavController,
                private router: Router) { }

ngOnInit() {
    this.datosService.getGastosJson().subscribe (val => {
    this.usuario.gastos = val;
    });

    this.datosService.getEtiquetasTab1().subscribe (val => {
      this.etiquetas = val.nombre;
      });

      this.datosService.getRubros().subscribe (val => {
        this.rubros = val;
        });
}

ingresoRadio(event)
{
  this.usuario.tipoIngreso = event.detail.value;
  this.ingreso = false;
}

sexoRadio(event)
{
  this.usuario.sexo = event.detail.value;
  this.sexo = false;
}

 async registrar()
{
  if(this.usuario.tipoIngreso != 'Variable') {

    if(this.validarIngreso()){
        await this.datosService.presentAlertaIngreso();
        this.registrarseAdvertencia = this.datosService.registrarseAdvertencia;

      if(this.registrarseAdvertencia) {
        console.log(this.registrarseAdvertencia);
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

  registrarUsuario()
  {
    this.usuario.gastos.forEach(element => {
      element.nombre = this.rubros[this.i].texto;
      element.tipo = this.rubros[this.i].tipo;
      element.icono = this.rubros[this.i].nombre;
      element.porcentaje = ((element.cantidad*100)/this.usuario.ingresoCantidad).toString();
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

    this.datosService.guardarUsuarioInfo(this.usuario);
    this.datosService.guardarPrimeraVez(false);
    this.datosService.cargarDatos();
    this.modalCtrl.dismiss();
  }

  validarIngreso() {

    var cantidadGastos=0;

      for( var ii = 0; ii < 17; ii++ ) {
        if( this.usuario.gastos[ii].cantidad != 0 ){
      cantidadGastos += this.usuario.gastos[ii].cantidad;
        } 
      }
      console.log('gastos: ', cantidadGastos);
      console.log('Ingresos: ', this.usuario.ingresoCantidad);
        if(cantidadGastos >= this.usuario.ingresoCantidad) {
        return true;
      }
        else{
        return false;
      }
    }
    
}