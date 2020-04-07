import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Platform, ModalController, NavController } from '@ionic/angular';
import { DatosService } from '../../services/datos.service';
import { Plan } from '../../interfaces/interfaces';

@Component({
  selector: 'app-acomodar',
  templateUrl: './acomodar.page.html',
  styleUrls: ['./acomodar.page.scss'],
})
export class AcomodarPage implements OnInit {

  backButtonSub: Subscription;

  planes: Plan[] = this.datosService.planesCargados;

  constructor(private plt: Platform,
              private modalCtrl: ModalController,
              private nav: NavController,
              private datosService: DatosService) { }

  async ngOnInit() {
    await this.datosService.cargarDatosPlan();
    this.planes = this.datosService.planesCargados;
  }

  ordenar(event) {
    var planMover = this.planes.splice(event.detail.from, 1)[0];
    this.planes.splice(event.detail.to, 0, planMover);
    event.detail.complete();
  }

  guardar() {
    this.datosService.actualizarPlanes(this.planes);
    this.modalCtrl.dismiss();
    this.datosService.presentToast("Planes reordenados");
    this.nav.navigateRoot('/tabs/tab2');
  }

  ionViewDidEnter() {
    this.backButtonSub = this.plt.backButton.subscribeWithPriority( 10000, () => {
      this.modalCtrl.dismiss();
      this.nav.navigateRoot("tabs/tab2");
    });
  }
}
