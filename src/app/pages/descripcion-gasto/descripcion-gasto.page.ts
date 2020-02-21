import { Component, OnInit, Input } from '@angular/core';
import { Gasto } from '../../interfaces/interfaces';

@Component({
  selector: 'app-descripcion-gasto',
  templateUrl: './descripcion-gasto.page.html',
  styleUrls: ['./descripcion-gasto.page.scss'],
})
export class DescripcionGastoPage implements OnInit {

  //Variables que recibe del Tabs1 para verificar cual selecciono
  @Input() color;
  @Input() rubro;
  @Input() gastos;

  //Variable para el HTML
  info: Gasto  = {
    nombre: '',
    cantidad: null,
    tipo: '',
    porcentaje: '',
    icono: '',
    margenMin: null,
    margenMax: null
  }

  constructor() { }

  ngOnInit() {
    //For each que verifica y asigna la informacion del gasto selecionado a la variable del HTML
    this.gastos.forEach(element => {
      if(this.rubro === element.nombre)
      {
        this.info = element;
        return
      }
    });
  }

}
