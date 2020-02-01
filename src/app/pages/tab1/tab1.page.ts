import { Component, OnInit } from '@angular/core';
import { ChartType } from 'chart.js';
import { SingleDataSet, Label } from 'ng2-charts';
import { Rubro} from '../../interfaces/interfaces';
import {Observable} from 'rxjs';
import { DatosService } from '../../services/datos.service';
import { ModalController } from '@ionic/angular';
import { ModalRegistroPage } from '../modal-registro/modal-registro.page';

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
  primera: boolean;

  vivienda = 15;
  agua = 15;
  luz = 15;
  gas = 15;
  comida = 15;
  ropa = 15;
  mobiliario = 15;
  limpieza = 15;
  transporte = 15;
  seguro = 15;
  ITT = 15;
  electrodomesticos = 15;
  electronicos = 15;
  educacion = 15;
  ocio = 15;
  salud = 15;
  extra = 15;

  public doughnutChartLabels: Label[] = this.etiqueta;
  public doughnutChartData: SingleDataSet =
  [
      this.vivienda,
      this.agua,
      this.luz,
      this.gas,
      this.comida,
      this.ropa,
      this.mobiliario,
      this.limpieza,
      this.transporte,
      this.seguro,
      this.ITT,
      this.electrodomesticos,
      this.electronicos,
      this.educacion,
      this.ocio,
      this.salud,
      this.extra
  ];
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
      this.abrirModal();
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
  }

  async abrirModal() {

    const modal = await this.modalCtrl.create({
      component: ModalRegistroPage
    });
    await modal.present();
  }

  }