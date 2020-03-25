import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TestPage } from '../test/test.page';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-test-page',
  templateUrl: './test-page.page.html',
  styleUrls: ['./test-page.page.scss'],
})
export class TestPagePage implements OnInit {

  idTransportado=null;

  constructor( private modalCtrl: ModalController,
               private activeRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activeRoute.queryParams.subscribe(params => {
      this.idTransportado = params["idParametro"];
  });
  console.log(this.idTransportado);
    this.abrirModal();
  }

  async abrirModal(){
    const modal = await this.modalCtrl.create({
      component: TestPage,
      componentProps: {
        id: this.idTransportado
      }
    });

    await modal.present();
  }

}
