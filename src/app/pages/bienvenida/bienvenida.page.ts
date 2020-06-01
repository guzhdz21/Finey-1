import { Component, OnInit } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';
import { ModalRegistroPage } from '../modal-registro/modal-registro.page';

@Component({
  selector: 'app-bienvenida',
  templateUrl: './bienvenida.page.html',
  styleUrls: ['./bienvenida.page.scss'],
})
export class BienvenidaPage implements OnInit {

  constructor(private modalCtrl: ModalController,
              private nav: NavController) { }

  ngOnInit() {
  }

  irARegistro() {
    this.modalCtrl.dismiss();
    this.nav.navigateRoot('tabs/tab1');
    this.abrirRegistro();
  }

  async abrirRegistro() {
    const modal = await this.modalCtrl.create({
      component: ModalRegistroPage
    });
     modal.present();
    await modal.onDidDismiss();
  }

}
