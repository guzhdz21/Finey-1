import { Component, OnInit, Input } from '@angular/core';
import { GastoMayor } from '../../interfaces/interfaces';
import { ModalController } from '@ionic/angular';
import { GastoMayorJustifyPage } from '../gasto-mayor-justify/gasto-mayor-justify.page';
import { AccionesService } from '../../services/acciones.service';

@Component({
  selector: 'app-gastos-mayores',
  templateUrl: './gastos-mayores.page.html',
  styleUrls: ['./gastos-mayores.page.scss'],
})
export class GastosMayoresPage implements OnInit {

  @Input() gastosMayores: GastoMayor[];

  data: boolean;

  fin: boolean = true;
  
  constructor(private modalCtrl: ModalController,
              private modalCtrl2: ModalController,
              private accionesService: AccionesService) { }

  ngOnInit() {
  }

  async seleccion(gasto) {
    await this.abrirJustificacion(gasto);
    gasto.mayor = this.data;
    for(var mayor of this.gastosMayores) {
      if(mayor.mayor) {
        return;
      }
    }
    this.accionesService.presentAlertGenerica('Felicidades','Has terminado de justificar todos los gastos, por favor pulsa "Finalizar"');
    this.fin = false;
  }

  async abrirJustificacion(gasto: GastoMayor) {

    const modal = await this.modalCtrl2.create({
      component: GastoMayorJustifyPage,
      componentProps: {
        gasto: gasto
      }
    });
     modal.present();
    const {data}  = await modal.onDidDismiss();
    this.data = data.mayor;
  }

  salir() {
    this.modalCtrl.dismiss();
  }
}
