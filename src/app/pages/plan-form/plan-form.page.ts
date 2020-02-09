import { Component, OnInit } from '@angular/core';
import { Plan, PlanDisplay} from '../../interfaces/interfaces';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-plan-form',
  templateUrl: './plan-form.page.html',
  styleUrls: ['./plan-form.page.scss'],
})
export class PlanFormPage implements OnInit {

planNuevo: Plan = {
  nombre: '',
  cantidadTotal: null,
  tiempoTotal: null,
  cantidadAcumulada: null,
  tiempoRestante: null,
  descripcion: '',
  aportacionMensual: null,
};

planes: PlanDisplay[] = [
  {
    doughnutChartData: [20, 80],
    plan: {
      nombre: '',
      cantidadTotal: 1,
      tiempoTotal: 2,
      cantidadAcumulada: 3,
      tiempoRestante: 4,
      descripcion: '',
      aportacionMensual: 5
    }
  }
];

  constructor( private storage: Storage ) { }

  ngOnInit() { }

  llamarFuncion() {
    this.calcularYRegistrar( this.planNuevo )
  }

  calcularYRegistrar( planStorage: Plan) {
    planStorage.aportacionMensual = planStorage.cantidadTotal / planStorage.tiempoTotal;
    planStorage.cantidadAcumulada = 0;
    planStorage.tiempoRestante = planStorage.tiempoTotal; 

    this.planes[0].plan = this.planNuevo;
    this.planes[0].doughnutChartData= [20,80];

    this.storage.set('planesStorage', this.planes[0]);
    console.log(this.planes[0]);
  }
}
