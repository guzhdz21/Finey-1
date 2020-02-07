import { Component, OnInit } from '@angular/core';
import { Label, SingleDataSet } from 'ng2-charts';
import { ChartType } from 'chart.js';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit{

  etiquetas = ['Progreso', 'Restante'];
  dato: number[] = [60,40];
  datos: number[] =[];
  colores = ['#32CD32','#B0C4DE'];
  info = [
    {
      etiqueta: 'Porcentaje de avance',
      cantidad: ''
    }
  ];

  public doughnutChartLabels: Label[] = this.etiquetas;
  public doughnutChartData: SingleDataSet = [] = this.dato;
  public doughnutChartType: ChartType = 'doughnut';
  public chartColors: Array<any> = 
  [{
    backgroundColor: [ ] = this.colores
  }];

  public legend = false;

  constructor() {}

  ngOnInit() {

  }

}
