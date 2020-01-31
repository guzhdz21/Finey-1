import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MisGastosPage } from '../mis-gastos/mis-gastos.page';

@Component({
  selector: 'app-mis-gastos-page',
  templateUrl: './mis-gastos-page.page.html',
  styleUrls: ['./mis-gastos-page.page.scss'],
})
export class MisGastosPagePage implements OnInit {

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    this.abrirModal();
  }

async abrirModal() {
      const modal = await this.modalCtrl.create({
        component: MisGastosPage
   });
      await modal.present();
 }
 
}
