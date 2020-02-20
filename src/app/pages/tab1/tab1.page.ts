import { Component, OnInit } from '@angular/core';
import { ChartType } from 'chart.js';
import { SingleDataSet, Label } from 'ng2-charts';
import { Rubro, UsuarioLocal } from '../../interfaces/interfaces';
import {Observable} from 'rxjs';
import { DatosService } from '../../services/datos.service';
import { ModalController, NavController, Events } from '@ionic/angular';
import { DescripcionGastoPage } from '../descripcion-gasto/descripcion-gasto.page';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  

  rubros: Observable<Rubro[]>;
  colores: string[] = [];
  color = ['#ff7f0e',];
  etiquetas: string[] = [];
  etiqueta = ['Vivienda'];
  datos: number[] =[];
  dato: number[] = [4];
  primera: boolean;
  cantidadGastos: number;
  saldo: number;
  usuarioCargado: UsuarioLocal = this.datosService.usuarioCarga;
  gastosCero: boolean = true;

  public doughnutChartLabels: Label[] = this.etiqueta;
  public doughnutChartData: SingleDataSet = [] = this.dato;
  public doughnutChartType: ChartType = 'doughnut';
  public chartColors: Array<any> = 
  [{
    backgroundColor: [ ] = this.color
  }];

  public legend = false;

  constructor(public datosService: DatosService,
              private modalCtrl: ModalController,
              private nav: NavController,
              private event: Events) {}

  ngOnInit() {
    console.log(this.usuarioCargado);
    if(this.datosService.primera === true)
    {
      this.nav.navigateRoot('/modal-registro-page');
    }

    this.event.subscribe('usuarioActualizado', () => {
      this.usuarioCargado = this.datosService.usuarioCarga;
      this.datos = [];
      this.datosService.usuarioCarga.gastos.forEach(element => {
        if(element.cantidad != 0){
          this.gastosCero = false;
        }
      this.datos.push(Number(element.porcentaje));
      this.mostrarSaldo();
      });

      this.doughnutChartData = this.datos;
    });

    this.event.publish('usuarioInsertado', () => {
      this.usuarioCargado = this.datosService.usuarioCarga;
      this.mostrarSaldo();
    });
    this.rubros = this.datosService.getRubros();

    this.datosService.getColores().subscribe(val => {

      val.colores.forEach(element => {
        this.colores.push(element.toString())
      });

    });

    this.chartColors = [{
      backgroundColor: [ ] = this.colores
    }];

    this.datosService.getEtiquetasTab1().subscribe(val => {
      val.nombre.forEach(element => {
        this.etiquetas.push(element.toString() + ' %')
      });
    });

    this.doughnutChartLabels = this.etiquetas;

    this.datosService.cargarDatos();
    this.datosService.usuarioCarga.gastos.forEach(element => {
      this.datos.push(Number(element.porcentaje));
      if(element.cantidad != 0){
        this.gastosCero = false;
      }
    });

    this.doughnutChartData = this.datos;
  }

  async abrirDescripcionGasto(seleccion: string, diseño: string) {

    const modal = await this.modalCtrl.create({
      component: DescripcionGastoPage,
      componentProps: {
        color: diseño,
        rubro: seleccion,
        gastos: this.datosService.usuarioCarga.gastos
      }
    });
    await modal.present();
  }

  ionViewWillEnter() {
    this.datosService.cargarDatos();
    this.datos = [];
    this.datosService.usuarioCarga.gastos.forEach(element => {
      this.datos.push(Number(element.porcentaje));
    });
    this.doughnutChartData = this.datos;

    this.mostrarSaldo();
  }
  ionViewWillLeave() {
    this.datosService.cargarDatos();
  }

  mostrarSaldo() {
    var gastosCantidad = 0;
      for( var i = 0; i < 17; i++ ) {
        if ( this.usuarioCargado.gastos[i].cantidad != 0 ){
      gastosCantidad += this.usuarioCargado.gastos[i].cantidad;
        } 
      }
      this.cantidadGastos = gastosCantidad;
      var saldo = this.usuarioCargado.ingresoCantidad - gastosCantidad;
      this.saldo = saldo;
  }

  }