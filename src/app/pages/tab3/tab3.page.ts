import { Component } from '@angular/core';
import { LocalNotifications} from '@ionic-native/local-notifications/ngx'
import { DatosService } from '../../services/datos.service';
import { Platform, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  backButtonSub: Subscription;

  constructor(private localNotifications: LocalNotifications,
              private datosService: DatosService,
              private plt: Platform,
              private nav: NavController) {}


  async mandarNotificacion() {
    await this.localNotifications.schedule({
      id: 1,
      title: 'Arlex gay y joto',
      text: 'Es demasiado gay',
      trigger: {at: new Date(new Date().getTime() + 10000)},
      foreground: true,
      vibrate: true,
      icon: 'alarm'
    });

    this.datosService.presentToast('boton oprimido');
  }

  ionViewDidEnter() {
    this.backButtonSub = this.plt.backButton.subscribeWithPriority( 10000, () => {
      this.nav.navigateRoot('/tabs/tab1');
    });
  }
}
