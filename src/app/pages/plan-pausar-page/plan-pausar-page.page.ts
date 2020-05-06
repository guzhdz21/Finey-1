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
    this.activatedRoute.queryParams.subscribe((res) =>
    {
      this.planesPrioritarios = JSON.parse(res.planesPrioritarios);
      this.margenMax = Number(res.margenMax);
      this.margenMin = Number(res.margenMin);
      this.planesOriginales = JSON.parse(res.planesOriginales);
      this.diferenciaFondo = Number(res.diferenciaFondo);
      this.planesPausados = JSON.parse(res.planesPausados);
    });
  }

  margenMax: number;
  margenMin: number;
  planesPrioritarios: Plan[];
  planesOriginales: Plan[];
  planesPausados: Plan[];
  diferenciaFondo: number;
  ngOnInit() {
    this.abrirModal();
  }

  async abrirModal() {
    const modal = await this.modalCtrl.create({
    component: PlanPausarPage,
    componentProps: {
      planesPrioritarios: this.planesPrioritarios,
      margenMax: this.margenMax,
      margenMin: this.margenMin,
      planesOriginales: this.planesOriginales,
      diferenciaFondo: this.diferenciaFondo,
      planesPausados: this.planesPausados
    }
    });
    await modal.present();
  }

}
