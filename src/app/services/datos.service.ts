import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Rubro, ColorArray, LabelArray, UsuarioLocal, Gasto } from '../interfaces/interfaces';
import { Storage } from '@ionic/storage';
import { ToastController, Events, NavController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class DatosService {

  constructor(private http: HttpClient, 
              private storage: Storage,
              private toastCtrl: ToastController,
              private event: Events,
              public alertCtrl: AlertController,
              private nav: NavController) { 
    this.cargarPrimeraVez();
    this.cargarDatos();
  }

  registrarseAdvertencia: boolean;

  usuarioCarga: UsuarioLocal = 
  {
    nombre: 'G',
    sexo: '',
    tipoIngreso: '',
    ingresoCantidad: null,
    gastos: [
      {
        nombre: '',
        cantidad: null,
        tipo: '',
        porcentaje: '1',
        icono: '',
        margenMin: null,
        margenMax: null
      }   
    ]
  };
  primera: boolean;

  getRubros() {
    return this.http.get<Rubro[]>('/assets/data/rubros.json');
  }

  getColores() {
    return this.http.get<ColorArray>('/assets/data/colores.json');
  }

  getEtiquetasTab1() {
    return this.http.get<LabelArray>('/assets/data/etiquetastab1.json');
  }

  getGastosJson() {
    return this.http.get<Gasto[]>('/assets/data/gastos.json');
  }

  guardarUsuarioInfo(usuario: UsuarioLocal) {
    this.usuarioCarga = usuario;
    this.storage.set('Usuario', this.usuarioCarga);
  }

  guardarPrimeraVez(primera: boolean)
  {
    this.primera = primera;
    this.storage.set('Primera', primera);
  }

   async cargarPrimeraVez()
  {
    const primera = await this.storage.get('Primera');
    if(primera === false) {
      this.primera = primera;
    } else {
      this.primera = true;
    }
  }

   async cargarDatos() {
    const Usuario = await this.storage.get('Usuario');
    if(Usuario)
    {
      this.usuarioCarga = Usuario;
    }
    this.event.publish('usuarioInsertado');
  }

  async presentToast( message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      mode: "ios",
      color: "success",
    });
    toast.present();
  }

  async presentAlertaIngreso() {
      
    const alert = await this.alertCtrl.create({
      header: 'Advertencia',
      message: 'Tus gastos son mayores que tus ingresos, si deseas continuar presiona Ok, si quieres modificar algun dato presiona Configurar.',
      buttons: [
        {
          text: 'Ok',
          handler: (blah) => {
            this.registrarseAdvertencia = true;
          }
        },
        {
          text: 'Configurar',
          handler: (blah) => { 
            this.registrarseAdvertencia = false;
          }
        }
    ]
    });
    alert.present();
    await alert.onDidDismiss();
  }
  
}
