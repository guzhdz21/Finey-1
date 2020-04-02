import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AcomodarPage } from '../acomodar/acomodar.page';

@Component({
  selector: 'app-acomodar-page',
  templateUrl: './acomodar-page.page.html',
  styleUrls: ['./acomodar-page.page.scss'],
})
export class AcomodarPagePage implements OnInit {

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    this.abrirModal();
  }

  async abrirModal() {

    const modal = await this.modalCtrl.create({
      component: AcomodarPage
    });
    await modal.present();
  }
}
