import { Component, OnInit } from '@angular/core';
import { DatosService } from '../../services/datos.service';
import { AlertaGeneral, GastosMensual } from '../../interfaces/interfaces';
import { AccionesService } from '../../services/acciones.service';
import { ModalController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-gastos-diarios',
  templateUrl: './gastos-diarios.page.html',
  styleUrls: ['./gastos-diarios.page.scss'],
})
export class GastosDiariosPage implements OnInit {

  alertas: AlertaGeneral[] = [];
  etiquetas: string[] = ['Vivienda'];
  gastos: GastosMensual[] = [
    {
      mes: 1,
      nombre: '',
      cantidad: 0
    }
  ];
  gastosMensuales: GastosMensual[] = this.datosService.gastosMensualesCargados;
  mes: number = this.datosService.mes;

  constructor(private datosService: DatosService,
              private accionesService: AccionesService,
              private modalCtrl: ModalController,
              private nav: NavController) { }

  ngOnInit() {
    this.datosService.cargarGastosMensuales();
    this.datosService.cargarMes();

    this.datosService.getAlertasJson().subscribe(val => {
      this.alertas = val;
    });

    this.datosService.getEtiquetas().subscribe (val => {
      this.etiquetas = val.nombre;

      this.gastos = [];
      val.nombre.forEach(element => {
        var gasto: GastosMensual = {
          mes: this.mes,
          cantidad: null,
          nombre: element
        };
       this.gastos.push(gasto);
      });
    });
  }

  botonInfo(titulo: string) {
    for(let element of this.alertas) {
      if(titulo == element.titulo) {
        this.accionesService.presentAlertGenerica(element.titulo.substring(0, element.titulo.length-1), element.mensaje);
        
        return;
      }
    }
  }

  async ingresar() {
    if(this.gastosMensuales.length == 0) {
      this.gastos.forEach(element => {
        this.gastosMensuales.push(element);
      });
    } else {
      this.gastos.forEach(gasto => {
        this.gastosMensuales.forEach(mensual => {
          if(gasto.mes == mensual.mes && gasto.nombre == mensual.nombre && gasto.cantidad != 0) {
            mensual.cantidad += gasto.cantidad;
          }
        });
      });
    }
    await this.datosService.guardarGastosMensuales(this.gastosMensuales);
    await this.datosService.guardarFechaDiaria(new Date());
    this.modalCtrl.dismiss();
    this.nav.navigateRoot('/tabs/tab1');
  }
}
