import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DatosService } from '../../services/datos.service';
import { UsuarioLocal, Gasto, Rubro } from '../../interfaces/interfaces';

@Component({
  selector: 'app-modal-registro',
  templateUrl: './modal-registro.page.html',
  styleUrls: ['./modal-registro.page.scss'],
})
export class ModalRegistroPage implements OnInit {

  i: number = 0;
  etiquetas: string[] = [];
  rubros: Rubro[] = [];
  usuario: UsuarioLocal = {
    nombre: '',
    sexo: '',
    tipoIngreso: '',
    ingresoCantidad: null,
    gastos: []
  };

  constructor( private modalCtrl: ModalController, 
                private datosService: DatosService) { }

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
}

sexoRadio(event)
{
  this.usuario.sexo = event.detail.value;
}

registrar()
{
  console.log(this.rubros);
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
  this.modalCtrl.dismiss();
  this.datosService.guardarPrimeraVez(false);
}

}

