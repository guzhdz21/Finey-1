import { Component } from '@angular/core';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx'

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  constructor( public localNotifications: LocalNotifications ) {}


  mandarNotificacion() {
this.localNotifications.schedule({
  title: 'Guz gay',
  text: 'Es demasiado gay',
  trigger: { at: new Date(2020, 2, 16, 17, 25) }
});
  }

}
