import { Component, OnInit } from '@angular/core';
import { PlanesTerminadosPage } from '../planes-terminados/planes-terminados.page';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-planes-terminados-page',
  templateUrl: './planes-terminados-page.page.html',
  styleUrls: ['./planes-terminados-page.page.scss'],
})
export class PlanesTerminadosPagePage implements OnInit {

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
  }

  async abrirModal() {
    const modal = await this.modalCtrl.create({
    component: PlanesTerminadosPage,
    });
    await modal.present();
  }
}
