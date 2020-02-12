import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CalendarioPage } from '../calendario/calendario.page';

@Component({
  selector: 'app-calendario-page',
  templateUrl: './calendario-page.page.html',
  styleUrls: ['./calendario-page.page.scss'],
})
export class CalendarioPagePage implements OnInit {

  constructor( private modalCtrl: ModalController) { }

  async ngOnInit() {
    const modal = await this.modalCtrl.create({
      component: CalendarioPage
     });
     await modal.present();
  }

}
