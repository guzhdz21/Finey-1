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
  };
  
  gastosMensuales: GastosMensuales[] = this.datosService.gastosMensualesCargados;
  mes: number = this.datosService.mes;

  constructor(private datosService: DatosService,
              private accionesService: AccionesService,
              private modalCtrl: ModalController,
              private nav: NavController) { }

  async ngOnInit() {
    await this.datosService.cargarGastosMensuales();
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
          cantidad: null
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
    var nuevoMes = true;
    for(var mensual of this.gastosMensuales) {
      if(mensual.mes == this.gastos.mes) {
        nuevoMes = false
      }
    }
    if(nuevoMes) {
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
        break;
      }
    }
    var gastosMayores: String = "";
    for(var gastoUsuario of this.datosService.usuarioCarga.gastos) {
      for(var gastoDiario of this.gastos.gastos) {
        if(gastoUsuario.nombre == gastoDiario.nombre) {
          if(gastoUsuario.tipo == 'Promedio' &&  gastoUsuario.margenMax <= gastoDiario.cantidad && gastoUsuario.cantidad != 0){
            gastosMayores += gastoUsuario.nombre + ', ';
          } else if(gastoUsuario.tipo == 'Fijo' &&  gastoUsuario.margenMax < gastoDiario.cantidad) {
            gastosMayores += gastoUsuario.nombre + ', ';
          }
        }
      }
    }

    if(gastosMayores != "") {
      //await this.accionesService.presentAlertGenerica('Cuidado','En los rubros: ' + 
      //gastosMayores + 'estas igualando o sobrepasando el margen maximo, asi que te recomendamos limitarte un poco en tus gastos');
    }
    await this.datosService.guardarGastosMensuales(this.gastosMensuales);
    await this.datosService.guardarFechaDiaria(new Date().getDate());
    this.modalCtrl.dismiss();
    this.nav.navigateRoot('/tabs/tab1');
  }
}
