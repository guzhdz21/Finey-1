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
      this.indexPrioritario = Number(res.indexPrioritario);
    });
  }

  indexPrioritario: number;
  ngOnInit() {
    this.abrirModal();
  }

  async abrirModal() {
    const modal = await this.modalCtrl.create({
    component: PlanPausarPage,
    componentProps: {
      indexPrioritario: this.indexPrioritario
    }
    });
    await modal.present();
  }

}
