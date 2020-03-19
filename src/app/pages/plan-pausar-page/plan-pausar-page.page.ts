import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PlanPausarPage } from '../plan-pausar/plan-pausar.page';
import { ActivatedRoute } from '@angular/router';
import { Plan } from '../../interfaces/interfaces';

@Component({
  selector: 'app-plan-pausar-page',
  templateUrl: './plan-pausar-page.page.html',
  styleUrls: ['./plan-pausar-page.page.scss'],
})
export class PlanPausarPagePage implements OnInit {

  constructor(private modalCtrl: ModalController,
              private activatedRoute: ActivatedRoute) { 
    this.activatedRoute.queryParams.subscribe((res: Plan) =>
    {
      this.planPrioritario.nombre = res.nombre;
      this.planPrioritario.cantidadTotal = Number(res.cantidadTotal);
      this.planPrioritario.cantidadAcumulada = Number(res.cantidadAcumulada);
      this.planPrioritario.descripcion = res.descripcion;
      this.planPrioritario.tiempoTotal = Number(res.tiempoTotal);
      this.planPrioritario.tiempoRestante = Number(res.tiempoRestante);
      this.planPrioritario.pausado = Boolean(res.pausado);
    });
  }

  planPrioritario: Plan = {
    nombre: "",
    cantidadTotal: 0,
    tiempoTotal: 0,
    cantidadAcumulada: 0,
    tiempoRestante: 0,
    descripcion: "",
    aportacionMensual: 0,
    pausado: false
  };
  ngOnInit() {
    this.abrirModal();
  }

  async abrirModal() {
    const modal = await this.modalCtrl.create({
    component: PlanPausarPage,
    componentProps: {
      planPrioritario: this.planPrioritario
    }
    });
    await modal.present();
  }

}
