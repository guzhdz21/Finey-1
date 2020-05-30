import { Component, OnInit, OnDestroy } from '@angular/core';

import { Platform, Events } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { DatosService } from './services/datos.service';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';

declare var window;
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit{

  nombre: string = '';
  sexo: string = '/assets/icon/favicon.png';

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private datosService: DatosService,
    private event: Events) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
  async ngOnInit() {
    this.event.subscribe('usuarioInsertado', () => {
      this.nombre = this.datosService.usuarioCarga.nombre;
      this.sexo = this.datosService.usuarioCarga.sexo;
    });

    this.event.subscribe('avatarActualizado', () => {
      this.nombre = this.datosService.usuarioCarga.nombre;
      this.sexo = this.datosService.usuarioCarga.sexo;
    });
  }
}
