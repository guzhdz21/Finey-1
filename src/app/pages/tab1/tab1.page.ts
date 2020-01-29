import { Component } from '@angular/core';
import { ChartType } from 'chart.js';
import { SingleDataSet, Label } from 'ng2-charts';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  rubros =
  [
    {
      nombre: 'home',
      color: 'FF0000',
      texto: 'Vivienda'
    },
    {
      nombre: 'water',
      color: 'FFA500',
      texto: 'Agua'
    },
    {
      nombre: 'flash',
      color: 'FFFF00',
      texto: 'Luz'
    },
    {
      nombre: 'cloud',
      color: 'c00FF00',
      texto: 'Gas'
    },
    {
      nombre: 'pizza',
      color: 'c00BFFF',
      texto: 'Comida'
    },
    {
      nombre: 'body',
      color: 'c8A2BE2',
      texto: 'Ropa'
    },
    {
      nombre: 'bed',
      color: 'FA8072',
      texto: 'Mobiliario'
    },
    {
      nombre: 'trash',
      color: 'FFD700',
      texto: 'Limpieza'
    },
    {
      nombre: 'logo-model-s',
      color: 'c00FF7F',
      texto: 'Transporte'
    },
    {
      nombre: 'contact',
      color: 'c00FFFF',
      texto: 'Seguro'
    },
    {
      nombre: 'wifi',
      color: 'D2691E',
      texto: 'Internet/Television/Telefonia'
    },
    {
      nombre: 'cafe',
      color: 'c008000',
      texto: 'Electrodomesticos'
    },
    {
      nombre: 'battery-charging',
      color: 'c808080',
      texto: 'Electronicos'
    },
    {
      nombre: 'book',
      color: 'FUCHSIA',
      texto: 'Educacion'
    },
    {
      nombre: 'logo-game-controller-b',
      color: 'FF1493',
      texto: 'Ocio'
    },
    {
      nombre: 'medkit',
      color: 'c0000FF',
      texto: 'Salud'
    },
    {
      nombre: 'add-circle',
      color: 'c000000',
      texto: 'Extra'
    }
  ];

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
  electrodomesticos: 15,
  electronicos = 15;
  educacion = 15;
  ocio = 15;
  salud = 15;
  extra = 15;



  public doughnutChartLabels: Label[] =
  [
    'Vivienda',
    'Agua',
    'Luz',
    'Gas',
    'Comida',
    'Ropa',
    'Mobiliario',
    'Limpieza',
    'Transporte',
    'Seguro',
    'Internet/Television/Telefonia',
    'Electrodomesticos',
    'Electronicos',
    'Educacion',
    'Ocio',
    'Salud',
    'Extra'
  ];
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
    backgroundColor: [
      '#FF0000',
      '#FFA500',
      '#FFFF00',
      '#00FF00',
      '#00BFFF',
      '#8A2BE2',
      '#FA8072',
      '#FFD700',
      '#00FF7F',
      '#00FFFF',
      '#D2691E',
      '#008000',
      '#808080',
      'FUCHSIA',
      '#FF1493',
      '#0000FF',
      '#000000'
    ]
  }];

  public legend = false;


  constructor() {}

  }



