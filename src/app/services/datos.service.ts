import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Rubro, ColorArray, LabelArray, UsuarioLocal, Gasto, Plan, AlertaGeneral, Recordatorio } from '../interfaces/interfaces';
import { Storage } from '@ionic/storage';
import { ToastController, Events} from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';

@Injectable({
  providedIn: 'root'
})
export class DatosService {

  constructor(private http: HttpClient, 
              private storage: Storage,
              private toastCtrl: ToastController,
              private event: Events,
              public alertCtrl: AlertController,
              private localNotifications: LocalNotifications) { 
    this.cargarPrimeraVez();
    this.cargarDatos();
    this.cargarDatosPlan();
  }

// Advertencia sobre si el usuario puede satisfacer sus necesidades basicas con sus datos ingresados
  registrarseAdvertencia: boolean; 
  hola = true;

  // Declaracion de el usuario cargado
  usuarioCarga: UsuarioLocal = 
  {
    nombre: 'G',
    sexo: '',
    tipoIngreso: '',
    ingresoCantidad: null,
    gastos: [
      {
        nombre: '',
        cantidad: 1,
        tipo: '',
        porcentaje: '1',
        icono: '',
        margenMin: null,
        margenMax: null
      }   
    ]
  };

  primera: boolean; // Variable para saber si es la primera vez que el usuario corre la app
  planesExisten: boolean = false; // Variable para saber si hay planes existentes
  recordatoriosExisten: boolean = false; // Variable para saber si hay planes existentes

  // Variable de tipo plan que adquiere los valores del storage
  planesCargados: Plan[] = [
    {
      nombre: '',
      cantidadTotal: null,
      tiempoTotal: null,
      cantidadAcumulada: null,
      tiempoRestante: null,
      descripcion: '',
      aportacionMensual: null,
      pausado: false
    }
  ];

  recordatoriosCargados: Recordatorio[] = [
    {
      title: '',
      mensaje: '',
      inicio: null,
      fin: null
    }
  ];
  
  // Metodos para obtener caracteristicas de archivos json
  getRubros() {
    return this.http.get<Rubro[]>('/assets/data/rubros.json');
  }

  getColores() {
    return this.http.get<ColorArray>('/assets/data/colores.json');
  }

  getEtiquetas() {
    return this.http.get<LabelArray>('/assets/data/etiquetastab1.json');
  }

  getGastosJson() {
    return this.http.get<Gasto[]>('/assets/data/gastos.json');
  }

  getAlertasJson() {
    return this.http.get<AlertaGeneral[]>('/assets/data/alerts.json');
  }

  // Metodo que guarda el usuario en el local storage
  guardarUsuarioInfo(usuario: UsuarioLocal) {
    this.usuarioCarga = usuario;
    this.storage.set('Usuario', this.usuarioCarga);
  }

  // Metodo que guarda la variable primera, registrandola para saber que no es la primera vez que el usuario corre la app
  guardarPrimeraVez(primera: boolean)
  {
    this.primera = primera;
    this.storage.set('Primera', primera);
  }

  // Metodo que le da un valor a la variable "primera" segun si la encuentra en el storage o no
   async cargarPrimeraVez()
  {
    const primera = await this.storage.get('Primera');
    if(primera === false) {
      this.primera = primera;
    } else {
      this.primera = true;
    }
  }

  // metodo que carga los datos de el usuario
   async cargarDatos() {
    const Usuario = await this.storage.get('Usuario');
    if(Usuario)
    {
      this.usuarioCarga = Usuario;
    }
    await this.event.publish('usuarioInsertado');
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

  // Metodo que guarda un nuevo plan en el storage
  guardarNuevoPlan(plan: Plan) {
    if(this.planesExisten == false){
      this.planesCargados = [];
    }
    this.planesCargados.push(plan);
    this.storage.set('Planes', this.planesCargados);
    this.event.publish('planesCargados');
  }

  // Metodo que actualiza los planes en el storage
  actualizarPlanes(plan: Plan[]) {
    this.planesCargados = [];
    this.planesCargados = plan;
    this.storage.set('Planes', this.planesCargados);
    this.event.publish('planesCargados');
  }
  
  // Metodo que carga los datos de un plan desde el storage
  async cargarDatosPlan() {
    const Planes = await this.storage.get('Planes');
    if(Planes) {
      this.planesCargados = Planes;
      this.planesExisten = true;
      this.event.publish('planesCargados');
    }
    else {
      this.planesExisten = false;
    }
  }

  // Metodo que borra un plan del storage
  async borrarPlan(i:number) {
    this.planesCargados = this.planesCargados.filter( plan => plan != this.planesCargados[i]);
    await this.storage.set('Planes', this.planesCargados);
    this.event.publish('planesModificados');
  }

  // Metodo que guarda un nuevo recordatorio en el storage
  guardarNuevoRecordatorio(recordatorio: Recordatorio) {
    if(this.recordatoriosExisten == false) {
      this.recordatoriosCargados = [];
    }
    this.recordatoriosCargados.push(recordatorio);
    this.storage.set('Recordatorios', this.recordatoriosCargados);
    this.event.publish('recordatoriosCargados');

    //this.mandarNotificacion(recordatorio);
  }

  // Metodo que actualiza los recordatorios en el storage
  actualizarRecordatorios(recordatorio: Recordatorio[]) {
    this.recordatoriosCargados = [];
    this.recordatoriosCargados = recordatorio;
    this.storage.set('Recordatorios', this.recordatoriosCargados);
    this.event.publish('recordatoriosCargados');
  }
  
  // Metodo que carga los datos de un recordatorio desde el storage
  async cargarDatosRecordatorios() {
    const Recordatorios = await this.storage.get('Recordatorios');
    if(Recordatorios) {
      this.recordatoriosCargados = Recordatorios;
      this.recordatoriosExisten = true;
    }
    else {
      this.recordatoriosExisten = false;
    }
  }

  // Metodo que borra un recordatorio del storage
  async borrarRecordatorio(recordatorio_eliminar: Recordatorio) {

    //this.recordatoriosCargados = this.recordatoriosCargados.filter(this.Encontrado);
    await this.cargarDatosRecordatorios();
    let nuevosRecordatorios: Recordatorio[] = []; 
    this.recordatoriosCargados.forEach(element => {
      if(element.title == recordatorio_eliminar.title 
        && element.mensaje == recordatorio_eliminar.mensaje
        && element.fin == recordatorio_eliminar.fin 
        && element.inicio == recordatorio_eliminar.inicio) {
        } else {
          nuevosRecordatorios.push(element);
        }
    });
    this.recordatoriosCargados = nuevosRecordatorios;
    await this.storage.set('Recordatorios', this.recordatoriosCargados);
    this.event.publish('recordatoriosCargados');
}

  async mandarNotificacion( recordatorio: Recordatorio) {
    await this.localNotifications.schedule({
      id: 1,
      title: recordatorio.title,
      text: recordatorio.mensaje,
      trigger: {at: new Date(recordatorio.inicio)},
      foreground: true,
      vibrate: true,
      //sticky: true,
      icon: 'alarm'
    });
  }
}
