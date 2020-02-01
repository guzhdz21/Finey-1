import { Component, OnInit, Input } from '@angular/core';
import { Gasto } from '../../interfaces/interfaces';

@Component({
  selector: 'app-descripcion-gasto',
  templateUrl: './descripcion-gasto.page.html',
  styleUrls: ['./descripcion-gasto.page.scss'],
})
export class DescripcionGastoPage implements OnInit {

  @Input() color;
  @Input() rubro;
  @Input() gastos;

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
    this.gastos.forEach(element => {
      if(this.rubro === element.nombre)
      {
        this.info = element;
        return
      }
    });
  }

}
