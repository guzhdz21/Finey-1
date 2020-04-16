import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { GastosDiariosPage } from '../gastos-diarios/gastos-diarios.page';

@Component({
  selector: 'app-gastos-diarios-page',
  templateUrl: './gastos-diarios-page.page.html',
  styleUrls: ['./gastos-diarios-page.page.scss'],
})
export class GastosDiariosPagePage implements OnInit {

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    this.abrirModal();
  }

  async abrirModal() {
    const modal = await this.modalCtrl.create({
      component: GastosDiariosPage
    });
    await modal.present();
}

}
