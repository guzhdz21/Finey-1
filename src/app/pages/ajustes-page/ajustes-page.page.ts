import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AjustesPage } from '../ajustes/ajustes.page';

@Component({
  selector: 'app-ajustes-page',
  templateUrl: './ajustes-page.page.html',
  styleUrls: ['./ajustes-page.page.scss'],
})
export class AjustesPagePage implements OnInit {

  constructor( private modalCtrl: ModalController ) { }

  ngOnInit() {
    this.abrirModal();
  }

  async abrirModal(){
    const modal = await this.modalCtrl.create({
      component: AjustesPage
    });

    await modal.present();
  }

}
