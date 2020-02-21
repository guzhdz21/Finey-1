import { Component } from '@angular/core';
import { LocalNotifications, ELocalNotificationTriggerUnit } from '@ionic-native/local-notifications/ngx'
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
  title: 'Guz gay',
  text: 'Es demasiado gay',
  data: {secret: 'secret'},
  trigger: {at: new Date(new Date().getTime())},
  foreground: true
});

this.datosService.presentToast('boton oprimido');
  }

}
