import { Component, OnInit, ɵConsole } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModificarTiempoPage } from '../modificar-tiempo/modificar-tiempo.page';
import { ActivatedRoute } from '@angular/router';
import { Plan } from '../../interfaces/interfaces';

@Component({
  selector: 'app-modificar-tiempo-page',
  templateUrl: './modificar-tiempo-page.page.html',
  styleUrls: ['./modificar-tiempo-page.page.scss'],
})
export class ModificarTiempoPagePage implements OnInit {

  constructor(private modalCtrl: ModalController, 
              private activatedRoute: ActivatedRoute) { 
    this.activatedRoute.queryParams.subscribe((res) =>
    {
      this.planesOriginales = JSON.parse(res.planesOriginales);
    });
  }

  planesOriginales: Plan[] = [];
  ngOnInit() {
    this.abrirModal();
  }
  async abrirModal() {
    const modal = await this.modalCtrl.create({
      component: ModificarTiempoPage,
      componentProps: {
        planesOriginales: this.planesOriginales
      }
    });
    await modal.present();
  }
}
