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
   tipoTransferencia: boolean;
   cantidadTransferir: number;
  
   // Metodo para presentar presentar un plan con botones dinamicos
  async presentAlertPlan( botones: any[], header: string, message: string) {
      
    const alert = await this.alertCtrl.create({
      header: header,
      message: message,
      buttons: [] = botones,
      mode: "ios",
      backdropDismiss: true
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
      ],
      mode: "ios",
      backdropDismiss: true
    });
    alert.present();
    await alert.onDidDismiss();
  }
  

  async presentAlertConsejo( header: string, message: string, ultimo: boolean) {
      
    if(ultimo){
    var botonTexto: string = "Cerrar";
    }
    else{
    var botonTexto: string = "Siguiente";
    }

    const alert = await this.alertCtrl.create({
      header: header,
      message: message,
      buttons: [
        {
          text: botonTexto,
          handler: (bla) => {}
        }
      ],
      mode: "ios",
      backdropDismiss: true
    });
    alert.present();
    await alert.onDidDismiss();
  }


  async presentAlertTiempo(botones: any[],tiempo: number) {
      
    const alert = await this.alertCtrl.create({
      header: 'Ingrese el nuevo tiempo',
      message: 'Tiempo anterior: ' + tiempo + ' meses',
      inputs: [ {
          name: 'tiempo',
          type: 'number',
          value: tiempo
        }
      ],
      buttons: [] = botones,
      mode: "ios",
      backdropDismiss: true
    });
    alert.present();
    await alert.onDidDismiss();
  }

  async presentAlertAhorrado(botones: any[], ahorrar: number) {
      
    const alert = await this.alertCtrl.create({
      header: '¿Cuanto ahorraste?',
      message: 'Este mes deberias haber ahorrado: ' + ahorrar + ' pesos pero, ¿con cuanto cuentas fisicamente?',
      inputs: [ {
          name: 'ahorrado',
          type: 'number',
          value: ahorrar
        }
      ],
      buttons: [] = botones,
      mode: "ios",
      backdropDismiss: true
    });
    alert.present();
    await alert.onDidDismiss();
  }

  async presentAlertIngresoExtra(botones: any[]) {
      
    const alert = await this.alertCtrl.create({
      header: 'Ingreso extra',
      message: 'Inserta la cantidad del ingreso extra que deseas añadir a tu fondo de ahorro',
      inputs: [ {
          name: 'ingresoExtra',
          type: 'number',
          value: null
        }
      ],
      buttons: [] = botones,
      mode: "ios",
      backdropDismiss: true
    });
    alert.present();
    await alert.onDidDismiss();
  }

  async presentAlertTransfer(botones: any[]) {
      
    const alert = await this.alertCtrl.create({
      header: 'Selecciona el tipo de transferencia',
      message: 'Ingresa la cantidad de dinero que quieres transferir',
      inputs: [ {
          name: 'cantidadTransferir',
          type: 'number',
          value: null
        }
      ],
      buttons: [] = botones,
      mode: "ios",
      backdropDismiss: true
    });
    alert.present();
    await alert.onDidDismiss();
  }

  async presentAlertOpciones( botones: any[], header: string, message: string) {
      
    const alert = await this.alertCtrl.create({
      header: header,
      message: message,
      buttons: [] = botones,
      mode: "ios",
      backdropDismiss: true
    });
    alert.present();
    await alert.onDidDismiss();
  }

  async presentAlertTransferencia() {
      
    const alert = await this.alertCtrl.create({
      header: 'Selecciona el tipo de transferencia',
      message: 'Selecciona si quieres tranferir todo el dinero o solo cierta cantidad',
      buttons: [
        {
          text: 'Todo',
          handler: (blah) => {
            this.tipoTransferencia = false;
          }
        },
        {
          text: 'Cierta cantidad',
          handler: (blah) => { 
            this.tipoTransferencia = true;
          }
        }
    ],
    mode: "ios",
    backdropDismiss: true
    });
    alert.present();
    await alert.onDidDismiss();
  }
}
