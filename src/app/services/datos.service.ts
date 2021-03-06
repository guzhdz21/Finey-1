import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Rubro, ColorArray, LabelArray, UsuarioLocal, Gasto, Plan, AlertaGeneral, Recordatorio, Test, SubTest, Pregunta, GastosMensuales, FechaMensual } from '../interfaces/interfaces';
import { Storage } from '@ionic/storage';
import { ToastController, Events, Platform } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { LocalNotifications, ELocalNotificationTriggerUnit } from '@ionic-native/local-notifications/ngx';
import { AccionesService } from './acciones.service';
import { File } from '@ionic-native/file/ngx';

@Injectable({
  providedIn: 'root'
})
export class DatosService {

  constructor(private http: HttpClient, 
              private storage: Storage,
              private toastCtrl: ToastController,
              private event: Events,
              public alertCtrl: AlertController,
              public localNotifications: LocalNotifications,
              public accionesService: AccionesService,
              public plt: Platform,
              private file: File) { 

    this.cargarPrimeraVez();
    this.cargarDatos();
    this.cargarDatosPlan();
    this.cargarIdsRecordatorios();
    this.cargarFechaDiaria();
    this.cargarGastosMensuales();
    this.cargarDiaDelMes();
    this.cargarMes();
    this.cargarPlanesTerminados();
    this.cargarIngresoExtra();
    this.cargarPerdida();
    
    this.localNotifications.fireQueuedEvents();

    this.plt.ready().then(() => {
      this.localNotifications.on('click').subscribe(res => {

          var inicio = res.data ? res.data.inicio : true;
          var horainicio = res.data ? res.data.horaInicio : true;
          var horafin = res.data ? res.data.horaFin : true;
    
          let recordatorio: Recordatorio = {
            title: res.title,
            mensaje: res.text,
            inicio: horainicio,
            fin: horafin
          }
    
          if(inicio == false){
            this.borrarRecordatorio(recordatorio);
            var id = res.data ? res.data.id : 0;
            this.borrarId(id);
          }
      });
  
      this.localNotifications.on('clear').subscribe(res => {
  
        var inicio = res.data ? res.data.inicio : true;
        var horainicio = res.data ? res.data.horaInicio : true;
        var horafin = res.data ? res.data.horaFin : true;
  
        let recordatorio: Recordatorio = {
          title: res.title,
          mensaje: res.text,
          inicio: horainicio,
          fin: horafin
        }
  
        if(inicio == false){
          this.borrarRecordatorio(recordatorio);
          var id = res.data ? res.data.id : 0;
          this.borrarId(id);
        }
      });

    });
  }

// Advertencia sobre si el usuario puede satisfacer sus necesidades basicas con sus datos ingresados
  registrarseAdvertencia: boolean; 
  notificacionTipoRecordatorio: boolean;

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
    ],
    fondoPlanes: null,
    fondoAhorro: null 
  };

  primera: boolean; // Variable para saber si es la primera vez que el usuario corre la app
  planesExisten: boolean = false; // Variable para saber si hay planes existentes
  recordatoriosExisten: boolean = false; // Variable para saber si hay planes existentes
  idsExisten: boolean;
  fechaDiaria: number;
  fechaMes: FechaMensual;
  notificacion: Date;
  mes: number;
  diferencia: number;
  ingresoExtra: number;
  bloquearModulos: boolean = false;
  perdida: number;
  folder = '';

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

  planASumar: Plan = {
    nombre: '',
    cantidadTotal: null,
    tiempoTotal: null,
    cantidadAcumulada: null,
    tiempoRestante: null,
    descripcion: '',
    aportacionMensual: null,
    pausado: false
  };

  planesTerminados: Plan[] = [];

  gastosMensualesCargados: GastosMensuales[] = [
    {
      mes: 0,
      gastos: [
        {
          nombre: '',
          cantidad: null,
        }
      ]
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

  idsRecordatorios: number[] = [];

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

  getTests() {
    return this.http.get<Test[]>('/assets/data/tests.json');
  }

  getSubTests() {
    return this.http.get<SubTest[]>('/assets/data/subTests.json');
  }

  getPreguntas() {
    return this.http.get<Pregunta[]>('/assets/data/preguntas.json');
  }

  getArchivos(route) {
    this.folder = route.snapshot.paramMap.get('folder') || '';
    return this.http.get<UsuarioLocal>(this.file.dataDirectory + '/' + this.folder + '/hola.json');
  }

  // Metodo que guarda el usuario en el local storage
  async guardarUsuarioInfo(usuario: UsuarioLocal) {
    this.usuarioCarga = usuario;
    this.storage.set('Usuario', this.usuarioCarga);
    await this.event.publish('usuarioInsertado');
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

  async guardarFechaDiaria(fechaDiaria: number)
  {
    this.fechaDiaria = fechaDiaria;
    this.storage.set('FechaDiaria', fechaDiaria);
  }

  async cargarFechaDiaria()
  {
    const fechaDiaria = await this.storage.get('FechaDiaria');
    if(fechaDiaria) {
      this.fechaDiaria = fechaDiaria;
    } else {
      this.fechaDiaria = null;
    }
  }

  guardarDiaDelMes(dia: number, mes: number)
  {
    var fecha: FechaMensual =  {
      dia: dia,
      mes: mes
    }
    this.fechaMes = fecha;
    this.storage.set('FechaMes', fecha);
  }

  async cargarDiaDelMes()
  {
    const fecha = await this.storage.get('FechaMes');
    if(fecha) {
      this.fechaMes = fecha;
    } else {
      this.fechaMes = null;
    }
  }

  guardarNotificacion(fecha: Date)
  {
    this.notificacion = fecha;
    this.storage.set('Notificacion', fecha);
  }

  guardarIngresoExtra(ingreso: number)
  {
    this.ingresoExtra = ingreso;
    this.storage.set('Ingreso extra', this.ingresoExtra);
  }

  async cargarIngresoExtra()
  {
    const ingresoExtra = await this.storage.get('Ingreso extra');
    if(ingresoExtra) {
      this.ingresoExtra = ingresoExtra;
    } else {
      this.ingresoExtra = 0;
      this.guardarIngresoExtra(this.ingresoExtra);
    } 
  }

  guardarPerdida(perdida: number)
  {
    this.perdida = perdida;
    this.storage.set('Perdida', this.perdida);
  }

  async cargarPerdida()
  {
    const perdida = await this.storage.get('Perdida');
    if(perdida) {
      this.perdida = perdida;
    } else {
      this.perdida = 0;
      this.guardarPerdida(this.perdida);
    } 
  }

  guardarBloqueoModulos(bloqueado: boolean)
  {
    this.bloquearModulos = bloqueado;
    this.storage.set('Bloqueo modulos', bloqueado);
  }

  async cargarBloqueoModulos()
  {
    const bloqueo = await this.storage.get('Bloqueo modulos');
    this.bloquearModulos = bloqueo;
  }

  async cargarNotificacion()
  {
    const fecha = await this.storage.get('Notificacion');
    if(fecha) {
      this.notificacion = fecha;
    } else {
      this.notificacion = new Date();
      this.guardarNotificacion(this.notificacion);
    }
  }

  guardarMes(mes: number)
  {
    this.mes = mes;
    this.storage.set('Mes', mes);
  }

  async cargarMes()
  {
    const mes = await this.storage.get('Mes');
    if(mes) {
      this.mes = mes;
    } else {
      this.mes = 1;
      this.guardarMes(this.mes);
    }
  }

  guardarGastosMensuales(gastos: GastosMensuales[])
  {
    this.gastosMensualesCargados = gastos;
    this.storage.set('GastosMensuales', gastos);
  }


  async cargarGastosMensuales()
  {
    const gastos = await this.storage.get('GastosMensuales');
    if(gastos) {
      this.gastosMensualesCargados = gastos;
    } else {
      this.gastosMensualesCargados = [];
    }
  }

  guardarDiferencia(diferencia: number)
  {
    this.diferencia = diferencia;
    this.storage.set('Diferencia', diferencia);
  }

  async cargarDiferencia()
    {
      const diferencia = await this.storage.get('Diferencia');
      if(diferencia) {
        this.diferencia = diferencia;
      } else {
        this.diferencia = 0;
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

  // Metodo que guarda un nuevo plan en el storage
  guardarNuevoPlan(plan: Plan) {
    if(this.planesExisten == false){
      this.planesCargados = [];
    }
    this.planesCargados.push(plan);
    this.planesCargados.forEach(element => {
      element.aportacionMensual = Math.round(element.aportacionMensual*100)/100;
    });
    this.storage.set('Planes', this.planesCargados);
    this.event.publish('planesCargados');
    this.planesExisten = true;
  }

  // Metodo que actualiza los planes en el storage
  actualizarPlanes(plan: Plan[]) {
    this.planesCargados = [];
    this.planesCargados = plan;
    this.planesCargados.forEach(element => {
      element.aportacionMensual = Math.round(element.aportacionMensual*100)/100;
    });
    this.storage.set('Planes', this.planesCargados);
    this.event.publish('planesCargados');
    this.planesExisten = true;
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

  actualizarPlanesTerminados(plan: Plan[]) {
    this.planesTerminados = [];
    this.planesTerminados = plan;
    this.storage.set('Planes Terminados', this.planesTerminados);
    this.event.publish('planesTerminados');
  }

  // Metodo que carga los datos de un plan desde el storage
  async cargarPlanesTerminados() {
    const Planes = await this.storage.get('Planes Terminados');
    if(Planes) {
      this.planesTerminados = Planes;
    }
    else {
      this.planesTerminados = [];
    }
    this.event.publish('planesTerminados');
  }

  // Metodo que borra un plan del storage
  async borrarPlan(i:number) {
    this.planesCargados = this.planesCargados.filter( plan => plan != this.planesCargados[i]);
    await this.storage.set('Planes', this.planesCargados);
    this.event.publish('planesModificados');
  }

  // Metodo que guarda un nuevo recordatorio en el storage
  async guardarNuevoRecordatorio(recordatorio: Recordatorio) {
    await this.cargarDatosRecordatorios();
    if(this.recordatoriosExisten == false) {
      this.recordatoriosCargados = [];
    }
    if(await this.compararSiYaExiste(this.recordatoriosCargados, recordatorio)) {
      await this.accionesService.presentAlertGenerica("Este recordatorio ya existe", "Este recordatorio ya existe con exactamente los mismos campos, y por ende, no se puede crear");
      return;
    }
    else{
      await this.cargarIdsRecordatorios();
      await this.mandarNotificacionInicio(recordatorio);
      await this.mandarNotificacionFin(recordatorio);
      this.recordatoriosCargados.push(recordatorio);
      this.storage.set('Recordatorios', this.recordatoriosCargados);
      this.event.publish('recordatoriosCargados');
    }
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
      var recordatoriosNuevos: Recordatorio[] = [];
      this.recordatoriosCargados.forEach(element => {
        let fin = new Date(element.fin);
        if( fin > new Date()) {
          recordatoriosNuevos.push(element);
        } 
      });
      this.recordatoriosCargados = recordatoriosNuevos;
      this.actualizarRecordatorios(recordatoriosNuevos);
      if(recordatoriosNuevos.length == 0) {
        this.recordatoriosCargados = [];
        this.recordatoriosExisten = false;
        return;
      }
      this.recordatoriosExisten = true;
    }
    else {
      this.recordatoriosExisten = false;
    }
  }

  async cargarIdsRecordatorios() {
    const ids = await this.storage.get('Ids');
    if(ids) {
      this.idsRecordatorios = ids;
      this.idsExisten = true;
    }
    else {
      this.idsExisten = false;
    }
  }

  actualizarIds() {
    this.storage.set('Ids', this.idsRecordatorios);
  }

  // Metodo que borra un recordatorio del storage
  async borrarRecordatorio(recordatorio_eliminar: Recordatorio) {

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
    await this.volverHacerSchedule(this.recordatoriosCargados);
    this.event.publish('recordatoriosCargados');
}

  async mandarNotificacionInicio( recordatorio: Recordatorio) {
    await this.cargarIdsRecordatorios();
    var aux = true;
    var id = (Math.random() * (10000 - 1)) + 1;
    if(this.idsExisten) {
      while(aux) {
        id = (Math.random() * (10000 - 1)) + 1;
        aux = false;
        this.idsRecordatorios.forEach(element => {
          if(element == id) {
            aux = true;
          }
        });
      }
    }
    this.idsRecordatorios.push(id);
    this.actualizarIds();
    await this.localNotifications.schedule({
      id: id,
      title: recordatorio.title,
      text: recordatorio.mensaje,
      trigger: {at: new Date(recordatorio.inicio)},
      foreground: true,
      vibrate: true,
      icon: 'alarm',
      data: { inicio: true, horaInicio: recordatorio.inicio, horaFin: recordatorio.fin },
      launch: true
    });
    return;   
  }

  async mandarNotificacionFin( recordatorio: Recordatorio) {
    await this.cargarIdsRecordatorios();
    var aux = true;
    var id = (Math.random() * (10000 - 1)) + 1;
    if(this.idsExisten) {
      while(aux) {
        id = (Math.random() * (10000 - 1)) + 1;
        aux = false;
        this.idsRecordatorios.forEach(element => {
          if(element == id) {
            aux = true;
          }
        });
      }
    }
    this.idsRecordatorios.push(id);
    this.actualizarIds();
    await this.localNotifications.schedule({
      id: id,
      title: recordatorio.title,
      text: recordatorio.mensaje,
      trigger: {at: new Date(recordatorio.fin)},
      foreground: true,
      vibrate: true,
      icon: 'alarm',
      data: { inicio: false, horaInicio: recordatorio.inicio, horaFin: recordatorio.fin },
      launch: true
    });
    return;
  }

  async borrarId(i: number) {
    this.idsRecordatorios = this.idsRecordatorios.filter( id => id != i);
    await this.storage.set('Ids', this.idsRecordatorios);
  }

 async volverHacerSchedule(recordatorios: Recordatorio[]) {
    await this.localNotifications.cancelAll();
    this.idsRecordatorios = [];
    await this.mandarNotificacionDiaria();
    await recordatorios.forEach(element => {
      this.mandarNotificacionInicio(element);
      this.mandarNotificacionFin(element);
    });
  }

  compararSiYaExiste (recordatorios: Recordatorio[], recordatorio: Recordatorio) {
    var aux = false;
    recordatorios.forEach(element => {
      if(element.title == recordatorio.title 
        && element.inicio == recordatorio.inicio 
        && element.mensaje == recordatorio.mensaje 
        && element.fin == recordatorio.fin) {
        aux = true;
      }
      });
        return aux;
  }

  async mandarNotificacionDiaria() {
    this.cargarNotificacion();
    var id = 0;
    this.idsRecordatorios = [];
    this.idsRecordatorios.push(id);
    var mes = new Date().getMonth();
    var año = new Date().getFullYear();
    var dia = new Date().getDate() + 1;
    await this.localNotifications.schedule({
      id: 0,
      title: 'Gastos del Dia',
      text: 'Entra a la aplicacion para los gastos que realizaste en este dia',
      trigger: { every: {hour: this.notificacion.getHours(), minute: this.notificacion.getMinutes()}, 
      firstAt: new Date(año, mes, dia)},
      foreground: true,
      vibrate: true,
      icon: 'alarm',
      launch: true
    });
    this.actualizarIds();
  }
}
