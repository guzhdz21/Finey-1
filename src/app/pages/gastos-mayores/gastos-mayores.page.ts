import { Component, OnInit, Input } from '@angular/core';
import { GastoMayor } from '../../interfaces/interfaces';
import { ModalController } from '@ionic/angular';
import { GastoMayorJustifyPage } from '../gasto-mayor-justify/gasto-mayor-justify.page';

@Component({
  selector: 'app-gastos-mayores',
  templateUrl: './gastos-mayores.page.html',
  styleUrls: ['./gastos-mayores.page.scss'],
})
export class GastosMayoresPage implements OnInit {

  @Input() gastosMayores: GastoMayor[];

  fin: boolean = true;
  
  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
  }

  async seleccion(gasto) {
    console.log(gasto);
    
    await this.abrirJustificacion(gasto);
    
    for(var mayor of this.gastosMayores) {
      if(mayor.mayor) {
        this.fin = true;
        return;
      }
    }
    this.fin = false;
  }

  async abrirJustificacion(gasto: GastoMayor) {

    const modal = await this.modalCtrl.create({
      component: GastoMayorJustifyPage,
      componentProps: {
        gasto: gasto
      }
    });
     modal.present();
    await modal.onDidDismiss();
  }

  finalizar() {
    console.log('fin');
  }
}
