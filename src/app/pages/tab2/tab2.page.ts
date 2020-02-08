import { Component, OnInit } from '@angular/core';
import { Label, SingleDataSet } from 'ng2-charts';
import { ChartType } from 'chart.js';
import { PlanDisplay } from '../../interfaces/interfaces';
import { ModalController, NavController } from '@ionic/angular';

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
        cantidadTotal: 1500,
        tiempoTotal: 10,
        cantidadAcumulada: 300,
        tiempoRestante: 8,
        descripcion: 'Moto chingona',
        aportacionMensual: 150
      }
    },
    {
      doughnutChartData: [50, 50],
      plan: {
        nombre: 'Laptop',
      cantidadTotal: 2000,
      tiempoTotal: 10,
      cantidadAcumulada: 1000,
      tiempoRestante: 5,
      descripcion: 'Laptop chingona',
      aportacionMensual: 200
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
              private nav: NavController) {}

  ngOnInit() { }

  async abrirFormulario() {
    this.nav.navigateRoot('/plan-form-page');
  }

}
