import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AccionesService {

  constructor( private http: HttpClient,
               public alertCtrl: AlertController) { }



  async presentAlert1( boton1: string, header: string, message: string) {
      
    const alert = await this.alertCtrl.create({
      header: header,
      message: message,
      buttons: [
        {
          text: boton1,
          handler: (blah) => {
            
          }
        }
    ]
    });
    alert.present();
    await alert.onDidDismiss();
  }

  async presentAlert2( boton1: string, boton2: string, header: string, message: string) {
      
    const alert = await this.alertCtrl.create({
      header: header,
      message: message,
      buttons: [
        {
          text: boton1,
          handler: (blah) => {
            
          }
        },
        {
          text: boton2,
          handler: (blah) => { 
            
          }
        }
    ]
    });
    alert.present();
    await alert.onDidDismiss();
  }


}
