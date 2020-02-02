import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { ModalRegistroPage } from '../modal-registro/modal-registro.page';

@Component({
  selector: 'app-modal-registro-page',
  templateUrl: './modal-registro-page.page.html',
  styleUrls: ['./modal-registro-page.page.scss'],
})
export class ModalRegistroPagePage implements OnInit {

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    this.abrirRegistro();
  }

  async abrirRegistro() {

    const modal = await this.modalCtrl.create({
      component: ModalRegistroPage
    });
    await modal.present();
  }
}
