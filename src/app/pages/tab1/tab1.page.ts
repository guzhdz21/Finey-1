import { Component, OnInit } from '@angular/core';
import { ChartType } from 'chart.js';
import { SingleDataSet, Label } from 'ng2-charts';
import { Rubro } from '../../interfaces/interfaces';
import {Observable} from 'rxjs';
import { DatosService } from '../../services/datos.service';
import { ModalController } from '@ionic/angular';
import { ModalRegistroPage } from '../modal-registro/modal-registro.page';
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
  datos: number[] = [];
  dato: number[] = [4];
  primera: boolean;

  public doughnutChartLabels: Label[] = this.etiqueta;
  public doughnutChartData: SingleDataSet = [] = this.dato;
  public doughnutChartType: ChartType = 'doughnut';
  public chartColors: Array<any> = 
  [{
    backgroundColor: [ ] = this.color
  }];

  public legend = false;

  constructor(private datosService: DatosService,
              private modalCtrl: ModalController) {}

  ngOnInit() {
    if(this.datosService.primera === true)
    {
      this.abrirRegistro();
    }
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
  }



  async abrirRegistro() {

    const modal = await this.modalCtrl.create({
      component: ModalRegistroPage
    });
    await modal.present();
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
  }

  }