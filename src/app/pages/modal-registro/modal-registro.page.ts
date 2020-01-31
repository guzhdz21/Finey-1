import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DatosService } from '../../services/datos.service';

@Component({
  selector: 'app-modal-registro',
  templateUrl: './modal-registro.page.html',
  styleUrls: ['./modal-registro.page.scss'],
})
export class ModalRegistroPage implements OnInit {

  etiquetas: string[] = [];

  constructor( private modalCtrl: ModalController, private datosService: DatosService) { }

ngOnInit() {
    this.datosService.getEtiquetasTab1().subscribe (val => {
      this.etiquetas=val.nombre
      });
}

salirSinArgumentos() {
  this.modalCtrl.dismiss();
}

}
