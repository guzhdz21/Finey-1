import { Component, OnInit } from '@angular/core';
import { Label, SingleDataSet } from 'ng2-charts';
import { ChartType } from 'chart.js';
import { PlanDisplay } from '../../interfaces/interfaces';
import { ModalController, NavController, Events } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { DatosService } from '../../services/datos.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit{

  etiquetas = ['Progreso %', 'Restante %'];
  dato: number[] = [60,40];
  datos: number[] =[];
  colores = ['#32CD32','#B0C4DE'];
  planes: PlanDisplay[] = [
    {
      doughnutChartData: [20, 80],
      plan: {
        nombre: 'Moto',
        cantidadTotal: 1,
        tiempoTotal: 1,
        cantidadAcumulada: 1,
        tiempoRestante: 1,
        descripcion: '400 cc',
        aportacionMensual: 1
      }
    }
  ];

  public doughnutChartLabels: Label[] = this.etiquetas;
  public doughnutChartData: number[] = this.dato;
  public doughnutChartType: ChartType = 'doughnut';
  public chartColors: Array<any> = 
  [{
    backgroundColor: [ ] = this.colores
  }];

  public legend = false;

  constructor(private modalCtrl: ModalController,
              private nav: NavController,
              private storage: Storage,
              private event: Events,
              private DatosService: DatosService) {}

  ngOnInit() { 

  }

  async abrirFormulario() {
    this.nav.navigateRoot('/plan-form-page');
  }

}
