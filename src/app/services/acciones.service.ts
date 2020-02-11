import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AccionesService {

  constructor( private http: HttpClient,
               public alertCtrl: AlertController) { }


   alertaPlanCrear: boolean;
  
  async presentAlertPlan( botones: any[], header: string, message: string) {
      
    const alert = await this.alertCtrl.create({
      header: header,
      message: message,
      buttons: [] = botones
    });
    alert.present();
    await alert.onDidDismiss();
  }
}
