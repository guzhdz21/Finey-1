import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AccionesService {

  constructor( private http: HttpClient,
               public alertCtrl: AlertController) { }


   alertaPlanCrear: boolean; // Variable que de ser true, confirma que el usuario quiere crear el plan, de lo contrario indica que quiere modificar parametros del plan antes de crearlo
   borrar: boolean; // Variable que de estar en true, indica que el usuario confirmo el querer borrar un plan
   borrarRecordatorio: boolean; // Variable que de estar en true, indica que el usuario confirmo el querer borrar un recordatorio
  
   // Metodo para presentar presentar un plan con botones dinamicos
  async presentAlertPlan( botones: any[], header: string, message: string) {
      
    const alert = await this.alertCtrl.create({
      header: header,
      message: message,
      buttons: [] = botones
    });
    alert.present();
    await alert.onDidDismiss();
  }

  // Metodo para presnetar un plan genericamente con un solo boton de OK
  async presentAlertGenerica( header: string, message: string) {
      
    const alert = await this.alertCtrl.create({
      header: header,
      message: message,
      buttons: [
        {
          text: 'Ok',
          handler: (bla) => {}
        }
      ]
    });
    alert.present();
    await alert.onDidDismiss();
  }
}
