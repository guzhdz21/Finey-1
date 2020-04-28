import { Component, OnInit, Input } from '@angular/core';
import { GastoMayor, AlertaGeneral } from '../../interfaces/interfaces';
import { AccionesService } from '../../services/acciones.service';
import { DatosService } from '../../services/datos.service';

@Component({
  selector: 'app-gasto-mayor-justify',
  templateUrl: './gasto-mayor-justify.page.html',
  styleUrls: ['./gasto-mayor-justify.page.scss'],
})
export class GastoMayorJustifyPage implements OnInit {

  @Input() gasto: GastoMayor;

  //Variable que guarda la informacion de las alertas
  alertas: AlertaGeneral[] = [];

  gusto: String = null;
  extra: String = null;
  pregunta2: boolean = false;
  valido: boolean = true;

  constructor(private accionesService: AccionesService,
              private datosService: DatosService) { }

  ngOnInit() {
    //Lllamada a metodo que obtiene la informacion de las alertas de un archivo
    this.datosService.getAlertasJson().subscribe(val => {
      this.alertas = val;
    });
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

  gustoRadio(event)
  {
    this.gusto = event.detail.value;
    if(this.gusto == 'false') {
      this.pregunta2 = true;
      this.valido = true;
    } else {
      this.pregunta2 = false;
      this.valido = false;
    }
  }

  extraRadio(event)
  {
    this.extra = event.detail.value;
    this.valido = false;
  }

  finalizar() {
  }

}
