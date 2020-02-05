import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalAvatarPage } from '../modal-avatar/modal-avatar.page';

@Component({
  selector: 'app-modal-avatar-page',
  templateUrl: './modal-avatar-page.page.html',
  styleUrls: ['./modal-avatar-page.page.scss'],
})
export class ModalAvatarPagePage implements OnInit {

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    this.abrirModal();
  }

  async abrirModal() {
    const modal = await this.modalCtrl.create({
      component: ModalAvatarPage
    });
    await modal.present();
  }

}
