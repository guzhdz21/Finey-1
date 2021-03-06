import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MisGastosPage } from '../mis-gastos/mis-gastos.page';
import { DatosService } from '../../services/datos.service';

@Component({
  selector: 'app-mis-gastos-page',
  templateUrl: './mis-gastos-page.page.html',
  styleUrls: ['./mis-gastos-page.page.scss'],
})
export class MisGastosPagePage implements OnInit {

  constructor(private modalCtrl: ModalController,
              private datosService: DatosService) { }

  ngOnInit() {
    this.datosService.cargarDatos();
    this.abrirModal();
  }

async abrirModal() {
      const modal = await this.modalCtrl.create({
        component: MisGastosPage
   });
      await modal.present();
 }
 
}
