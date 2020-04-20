import { Component, OnInit } from '@angular/core';
import { DatosService } from '../../services/datos.service';
import { AlertaGeneral, GastosMensuales, GastoMensual } from '../../interfaces/interfaces';
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
  gastos: GastosMensuales = {
    mes: 1,
    gastos: [
      {
        nombre: '',
        cantidad: 0
      }
    ]
  }
  
  gastosMensuales: GastosMensuales[] = this.datosService.gastosMensualesCargados;
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

      var gastos: GastosMensuales = {
        mes: this.mes,
        gastos: []
      }
      val.nombre.forEach(element => {
        var gasto: GastoMensual = {
          nombre: element,
          cantidad: 0
        } 
       gastos.gastos.push(gasto);
      });
      this.gastos = gastos;
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
      this.gastosMensuales.push(this.gastos);
    } else {
      for(var mensual of this.gastosMensuales) {
        if(mensual.mes == this.gastos.mes) {
          for(var gasto of this.gastos.gastos) {
            for (var gastoMensual of mensual.gastos) {
              if(gasto.nombre == gastoMensual.nombre && gasto.cantidad != 0) {
                gastoMensual.cantidad += gasto.cantidad;
              }
            }
          }
        }
        return;
      }
    }
    await this.datosService.guardarGastosMensuales(this.gastosMensuales);
    await this.datosService.guardarFechaDiaria(new Date());
    this.modalCtrl.dismiss();
    this.nav.navigateRoot('/tabs/tab1');
  }
}
