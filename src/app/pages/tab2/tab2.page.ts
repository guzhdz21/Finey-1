import { Component } from '@angular/core';
import { ModalRegistroPage } from '../modal-registro/modal-registro.page';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  constructor( private modalCtrl: ModalController) {}

  async abrirModal() {
     const modal = await this.modalCtrl.create({
       component: ModalRegistroPage
  });
     await modal.present();
}
}
