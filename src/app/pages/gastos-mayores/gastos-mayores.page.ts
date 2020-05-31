import { Component, OnInit, Input } from '@angular/core';
import { GastoMayor } from '../../interfaces/interfaces';
import { ModalController, Platform } from '@ionic/angular';
import { GastoMayorJustifyPage } from '../gasto-mayor-justify/gasto-mayor-justify.page';
import { AccionesService } from '../../services/acciones.service';
import { Subscription } from 'rxjs';
import { DatosService } from '../../services/datos.service';

@Component({
  selector: 'app-gastos-mayores',
  templateUrl: './gastos-mayores.page.html',
  styleUrls: ['./gastos-mayores.page.scss'],
})
export class GastosMayoresPage implements OnInit {

  @Input() gastosMayores: GastoMayor[];

  data: boolean;
  backButtonSub: Subscription;
  
  constructor(private modalCtrl: ModalController,
              private modalCtrl2: ModalController,
              private accionesService: AccionesService,
              private datosService: DatosService,
              private plt: Platform) { }

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
    this.accionesService.presentAlertOpciones([{text: 'Ok', handler: (blah) => {this.modalCtrl.dismiss()}}],
     'Terminaste', 'Bien has terminado de justificar todos los gastos');
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
  
  ionViewDidEnter() {
    this.backButtonSub = this.plt.backButton.subscribeWithPriority( 10000, () => {
      this.datosService.presentToast("Debes justificar todos los gastos");
    });
  }
}
