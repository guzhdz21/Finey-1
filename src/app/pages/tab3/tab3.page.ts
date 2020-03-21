import { Component } from '@angular/core';
import { LocalNotifications} from '@ionic-native/local-notifications/ngx'
import { DatosService } from '../../services/datos.service';
import { Platform, NavController, ModalController } from '@ionic/angular';
import { Subscription, Observable } from 'rxjs';
import { Test } from '../../interfaces/interfaces';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  backButtonSub: Subscription;
  tests: Observable<Test[]> = this.datosService.getTests();

  constructor(private localNotifications: LocalNotifications,
              public datosService: DatosService,
              private plt: Platform,
              private nav: NavController,
              private modalCtrl: ModalController) {}

  ionViewDidEnter() {
    this.backButtonSub = this.plt.backButton.subscribeWithPriority( 10000, () => {
      this.nav.navigateRoot('/tabs/tab1');
    });
  }

}
