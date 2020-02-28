import { Component, OnInit } from '@angular/core';
import { Label} from 'ng2-charts';
import { ChartType } from 'chart.js';
import { PlanDisplay, Plan } from '../../interfaces/interfaces';
import { NavController, Events } from '@ionic/angular';
import { DatosService } from '../../services/datos.service';
import { AccionesService } from '../../services/acciones.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit{

  //Variable donde se establece el valor inicial 
  plan: PlanDisplay = {
    doughnutChartData: [20, 80],
      plan: {
        nombre: 'Moto',
        cantidadTotal: 1,
        tiempoTotal: 1,
        cantidadAcumulada: 1,
        tiempoRestante: 1,
        descripcion: '400 cc',
        aportacionMensual: 1,
        pausado: false
      }
  };

  //Arreglo donde se guardan los planes cargados
  planes: PlanDisplay[] = [
    this.plan
  ];

  planesExiste: boolean = false; // Variable utilizada para saber si existen planes o no

  //Variables del chart
  public doughnutChartLabels: Label[] = ['Progreso %', 'Restante %'];
  public doughnutChartType: ChartType = 'doughnut';
  public chartColors: Array<any> = 
  [{
    backgroundColor: [ ] = ['#32CD32','#B0C4DE']
  }];

  public legend = false;

  constructor(private nav: NavController,
              private event: Events,
              private datosService: DatosService,
              private accionesService: AccionesService,
              private router: Router) {}

  ngOnInit() {
    //Metodo para cargar los planes haya o no
    this.datosService.cargarDatosPlan();
    this.event.subscribe('planesCargados', () => {
      if(this.datosService.planesCargados.length <= 0) {
        this.planesExiste = false;
        this.planes = [this.plan];
        return;
      }
      else {
        this.planesExiste = true;
      }
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

    // Comprobamos que existen los planes y asignamos su progreso a la grafica pastel
    this.event.subscribe('planesModificados', () => {
      if(this.datosService.planesCargados.length <= 0) {
        this.planesExiste = false;
        this.planes = [this.plan];
        return;
      }
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

  // Metodo que abre el formulario para insertar un nuevo plan o modificar alguno ya existente
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

  // Alerta que presenta la descripcion de un plan
  descripcion(descripcion: string) {
    this.accionesService.presentAlertGenerica('Descripcion', descripcion);
  }

  // Metodo para borrar un plan del storage
  async borrarPlan(i: number) {
    await this.accionesService.presentAlertPlan([{text: 'Cancelar', handler: (blah) => {this.accionesService.borrar = false}},
                                                {text: 'Borrar', handler: (blah) => {this.accionesService.borrar = true}}], 
                                                '¿Estas seguro de que quieres borrar este plan?', 'No podrás recuperar el progreso guardado en este plan');
    
    if(this.accionesService.borrar == true) {
      this.datosService.borrarPlan(i);
    } 
  }

  //Funcion para pausar planes
  pausarPlan(i) {
    var planes: Plan[] = [];
    this.planes[i].plan.pausado = true;
    this.planes.forEach(element => {
      planes.push(element.plan);
    });
    this.datosService.actualizarPlanes(planes);
  }

  //Funcion para renaudar planes
  renaudarPlan(i) {
    var planes: Plan[] = [];
    this.planes[i].plan.pausado = false; 
    this.planes.forEach(element => {
      planes.push(element.plan);
    });
    this.datosService.actualizarPlanes(planes); 
  }
}
