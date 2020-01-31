import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { Tab1Page } from '../tab1/tab1.page';
import { DatosService } from '../../services/datos.service';

@Component({
  selector: 'app-mis-gastos',
  templateUrl: './mis-gastos.page.html',
  styleUrls: ['./mis-gastos.page.scss'],
})
export class MisGastosPage implements OnInit {

  etiquetas: string[] = [];

  constructor(private modalCtrl: ModalController,
              private nav: NavController,
              private datosService: DatosService) { }

  ngOnInit() {
    this.datosService.getEtiquetasTab1().subscribe (val => {
      this.etiquetas=val.nombre;
      });
  }

  regresar() {
    this.modalCtrl.dismiss();
    this.nav.navigateRoot('/tabs/tab1');
  }
}