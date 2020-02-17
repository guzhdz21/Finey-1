import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PlanModificarPage } from '../plan-modificar/plan-modificar.page';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-plan-modificar-page',
  templateUrl: './plan-modificar-page.page.html',
  styleUrls: ['./plan-modificar-page.page.scss'],
})
export class PlanModificarPagePage implements OnInit {

  index: string;

  constructor(private modalCtrl: ModalController,
              private activatedRoute: ActivatedRoute) { 
    this.activatedRoute.queryParams.subscribe((res) =>
    {
      this.index = res.value;
    });
  }

  ngOnInit() {
    this.abrirModal();
  }

  async abrirModal() {
    const modal = await this.modalCtrl.create({
      component: PlanModificarPage,
      componentProps: {
        index: this.index
      }
    });
    await modal.present();
  }
}
