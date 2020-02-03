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

  public doughnutChartLabels: Label[] = this.etiqueta;
  public doughnutChartData: SingleDataSet = [] = this.dato;
  public doughnutChartType: ChartType = 'doughnut';
  public chartColors: Array<any> = 
  [{
    backgroundColor: [ ] = this.color
  }];

  public legend = false;

  constructor(private datosService: DatosService,
              private modalCtrl: ModalController,
              private nav: NavController,
              private event: Events) {}

  ngOnInit() {
    if(this.datosService.primera === true)
    {
      this.nav.navigateRoot('/modal-registro-page');
    }

    this.event.subscribe('userUpdate', (usuario: UsuarioLocal) => {
      this.datos = [];
      this.datosService.usuarioCarga.gastos.forEach(element => {
      this.datos.push(Number(element.porcentaje));
      });
      this.doughnutChartData = this.datos;
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

    this.datosService.usuarioCarga.gastos.forEach(element => {
      this.datos.push(Number(element.porcentaje));
    });
    this.doughnutChartData = this.datos;

    this.datosService.cargarDatos();
    this.datosService.usuarioCarga.gastos.forEach(element => {
      this.datos.push(Number(element.porcentaje));
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

  ionViewDidEnter() {
    this.datosService.cargarDatos();
    this.datos = [];
    this.datosService.usuarioCarga.gastos.forEach(element => {
      this.datos.push(Number(element.porcentaje));
    });
    this.doughnutChartData = this.datos;
  }

  }