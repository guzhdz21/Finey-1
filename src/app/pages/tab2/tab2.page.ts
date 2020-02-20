import { Component, OnInit } from '@angular/core';
import { Label, SingleDataSet } from 'ng2-charts';
import { ChartType } from 'chart.js';
import { PlanDisplay } from '../../interfaces/interfaces';
import { ModalController, NavController, Events } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { DatosService } from '../../services/datos.service';
import { AccionesService } from '../../services/acciones.service';
import { Router } from '@angular/router';

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
  plan: PlanDisplay = {
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
  };
  planes: PlanDisplay[] = [
    this.plan
  ];

  planesExiste: boolean = false;

  public doughnutChartLabels: Label[] = this.etiquetas;
  public doughnutChartType: ChartType = 'doughnut';
  public chartColors: Array<any> = 
  [{
    backgroundColor: [ ] = this.colores
  }];

  public legend = false;

  constructor(private nav: NavController,
              private event: Events,
              private datosService: DatosService,
              private accionesService: AccionesService,
              private router: Router) {}

  ngOnInit() {
    this.datosService.cargarDatosPlan();
    this.event.subscribe('planesCargados', () =>
    {
      this.planesExiste = true;
      this.planes = [];
      this.datosService.planesCargados.forEach(element => {
      this.planes.push({
        doughnutChartData: [
          (element.cantidadAcumulada*100)/element.cantidadTotal,
          ((element.cantidadTotal - element.cantidadAcumulada)*100)/element.cantidadTotal
        ],
        plan: element
      });
    });
    });
  }

  abrirFormulario(opcion: string, i: number) {
    if(opcion == 'planNuevo') {
      this.nav.navigateRoot('/plan-form-page');
      this.router.navigate(['/plan-form-page'],
      {
        queryParams: {
          value: false
        }
      });
    }
    else if(opcion == 'modificar'){
      this.nav.navigateRoot('/plan-modificar-page');
      this.router.navigate(['/plan-modificar-page'],
      {
        queryParams: {
          index: i
        }
      });
    }
  }

  descripcion(descripcion: string) {
    this.accionesService.presentAlertGenerica('Descripcion', descripcion);
  }

  async borrarPlan(i: number) {
    await this.accionesService.presentAlertPlan([{text: 'Cancelar', handler: (blah) => {this.accionesService.borrar = false}},
                                          {text: 'Borrar', handler: (blah) => {this.accionesService.borrar = true}}], '¿Estas seguro de que quieres borrar este plan?', 'No podrás recuperar el progreso guardado en este plan');
    
    if(this.accionesService.borrar==true) {
      this.datosService.borrarPlan(i);
      location.reload();
    } 
  }

}
