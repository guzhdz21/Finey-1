import { Component } from '@angular/core';
import { LocalNotifications} from '@ionic-native/local-notifications/ngx'
import { DatosService } from '../../services/datos.service';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  constructor( public localNotifications: LocalNotifications,
              private datosService: DatosService,
              private plt: Platform ) {}


mandarNotificacion() {
this.localNotifications.schedule({
  id: 1,
  title: 'Arlex gay y joto',
  text: 'Es demasiado gay',
  trigger: {at: new Date(new Date().getTime() + 2000)},
  foreground: true,
  vibrate: true,
  icon: 'alarm'
});

this.datosService.presentToast('boton oprimido');
  }

}
