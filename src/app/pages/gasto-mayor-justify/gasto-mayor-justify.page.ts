import { Component, OnInit, Input } from '@angular/core';
import { GastoMayor, AlertaGeneral, GastosMensuales } from '../../interfaces/interfaces';
import { AccionesService } from '../../services/acciones.service';
import { DatosService } from '../../services/datos.service';
import { ModalController } from '@ionic/angular';

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
  diferencia: number = this.datosService.diferencia;
  gastosMensuales: GastosMensuales[] = this.datosService.gastosMensualesCargados;
  mes: number = this.datosService.mes;

  constructor(private accionesService: AccionesService,
              private datosService: DatosService,
              private modalCtrl: ModalController) { }

  async ngOnInit() {
    //Lllamada a metodo que obtiene la informacion de las alertas de un archivo
    this.datosService.getAlertasJson().subscribe(val => {
      this.alertas = val;
    });
    await this.datosService.cargarDiferencia();
    await this.datosService.cargarMes();
    await this.datosService.cargarGastosMensuales();
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

  async finalizar() {
    if(this.gusto != 'true') {
      if(this.extra == 'true') {
        this.diferencia += (this.gasto.cantidadNueva - this.gasto.cantidadOriginal);
        await this.datosService.guardarDiferencia(this.diferencia);
        for(var gastoMen of this.gastosMensuales) {
          if(gastoMen.mes == this.mes) {
            for(var gastoMen2 of gastoMen.gastos) {
              if(this.gasto.nombre == gastoMen2.nombre) {
                gastoMen2.cantidad = this.gasto.cantidadOriginal;
                break;
              }
            }
            break;
          }
        }
        this.datosService.guardarGastosMensuales(this.gastosMensuales);
        
      }
    }
    this.gasto.mayor = false;
    this.modalCtrl.dismiss({
      mayor: this.gasto.mayor
    });
  }

  regresar() {
    this.modalCtrl.dismiss({
      mayor: this.gasto.mayor
    });
  }

  
}
