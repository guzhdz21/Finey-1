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
              private plt: Platform ) {
                this.plt.ready().then(() => {
                  this.localNotifications.on('trigger').subscribe( res =>
                    {
                      this.datosService.presentToast('notificacion aparece');
                    });
                });
              }


  mandarNotificacion() {
this.localNotifications.schedule({
  title: 'Guz gay',
  text: 'Es demasiado gay',
  trigger: { in: 10, unit: ELocalNotificationTriggerUnit.SECOND }
});

this.datosService.presentToast('boton oprimido');
  }

}
