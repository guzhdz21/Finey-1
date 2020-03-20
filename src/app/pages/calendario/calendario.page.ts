import { Component, OnInit, ViewChild, Inject, LOCALE_ID } from '@angular/core';
import { CalendarComponent } from 'ionic2-calendar/calendar';
import { AlertController, Events, Platform, ModalController, NavController } from '@ionic/angular';
import { formatDate } from '@angular/common';
import { AccionesService } from '../../services/acciones.service';
import { DatosService } from 'src/app/services/datos.service';
import { Recordatorio } from '../../interfaces/interfaces';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.page.html',
  styleUrls: ['./calendario.page.scss'],
})
export class CalendarioPage implements OnInit {

//Declaracion vacia de la estructura del evento
event = {
  title: '',
  desc: '',
  startTime: '',
  endTime: ''
};

//Declaracion vacia de la estructura del recordatorio
recordatorioFull: Recordatorio =
  {
    title: '',
    mensaje: '',
    inicio: null,
    fin: null
  };

//Declaracion vacia de la estructura del arreglo de los recordatorios 
  recordatoriosCargados: Recordatorio[] = [
    {
      title: '',
      mensaje: '',
      inicio: null,
      fin: null
    }
  ];

cargaYa = false; //Variable que le indica cuando ya cargar el calendario
minDate = new Date(new Date().getHours()).toISOString();  
viewTitle = ''; //Es la etiqueta que te indica el nombre del mes
eventSource=[];
collapseCard: boolean = false;
backButtonSub: Subscription;

    markDisabled = (date: Date) => {
        var hola = new Date();
        var current = new Date(new Date().getTime() - 86400000);
        return date < current;
    };

//Declaracion del calendario
calendar = {
  mode: 'month',
  currentDate: new Date(),
  locale: 'es-MX'
}  

@ViewChild(CalendarComponent, { static: false}) myCal: CalendarComponent;

//Metodo que le cambia el nombre a la etiqueta del mes
 onViewTitleChanged(title) {
  this.viewTitle = title;
}

//Metodo que selecciona una fecha
onTimeSelected(ev) {
  let selected = new Date(ev.selectedTime);
  this.event.startTime = selected.toISOString();
  selected.setHours(selected.getHours() + 1);
  this.event.endTime = (selected.toISOString());
}

//Metodo que resetea el formulario del recordatorio
resetEvent() { 
  this.event = {
    title: '',
    desc: '',
    startTime: new Date().toISOString(),
    endTime: new Date().toISOString(),
  };
}

//Metodo que carga los recordatorios desde el storage
cargarEventosStorage(){ 
  this.eventSource=[];

  this.datosService.recordatoriosCargados.forEach(element => {

    let eventCopy = { 
      title: element.title,
      startTime: new Date(element.inicio),
      endTime: new Date(element.fin),
      desc: element.mensaje
    }

  this.eventSource.push(eventCopy);
  });
}

//Boton para irte al mes anterior
back() { 
  var swiper = document.querySelector('.swiper-container')['swiper'];
  swiper.slidePrev();
}

//Boton para irte al mes posterior
next() { 
  var swiper = document.querySelector('.swiper-container')['swiper'];
  swiper.slideNext();
}

//Metodo que te posiciona en el dia actual
today() {
  this.calendar.currentDate = new Date();
}

//Asignacion a los valores de start y end del recordatorio
async onEventSelected(event) {
let start = formatDate(event.startTime, 'medium', this.locale);
let end = formatDate(event.endTime, 'medium', this.locale);

//Alerta que muestra la informacion de los recordatorios
const alert = await this.alertCtrl.create({ 
  header: event.title,
  message: 'Descripcion: '+ event.desc + '<br><br>Inicio:  ' + start + '<br><br>Fin:  ' + end,
  buttons: [{text: 'Borrar', handler: (blah) => { this.borrarRecordatorio(event)}},
            {text: 'Ok'}],
  mode: "ios"
    });
    alert.present();  
 }

 //Metodo que le otorga los datos ingresador del recordatorio a nuestra interface Recordatorio e invoca la funcion para guardarlo en storage
async registrarNuevoRecordatorio() {
  await this.datosService.cargarDatosRecordatorios();
  this.recordatorioFull.title = this.event.title;
  this.recordatorioFull.mensaje = this.event.desc;
  this.recordatorioFull.inicio = formatDate(this.event.startTime, 'medium',this.locale);
  this.recordatorioFull.fin = formatDate(this.event.endTime, 'medium',this.locale);
  await this.datosService.guardarNuevoRecordatorio(this.recordatorioFull);
  this.resetEvent();
}

// Metodo que muestra una alert para borrar un recordatorio del storage
 async borrarRecordatorio(event) {
  await this.accionesService.presentAlertPlan([{text: 'Cancelar', handler: (blah) => {this.accionesService.borrarRecordatorio = false}},
                                        {text: 'Borrar', handler: (blah) => {this.accionesService.borrarRecordatorio = true}}], 
                                        '¿Estas seguro de que quieres borrar este recordatorio?', 'En caso de que te retractes tendrías que crear uno nuevo similar');
  
  if(this.accionesService.borrarRecordatorio == true) {
    this.recordatorioFull.title = event.title;
    this.recordatorioFull.mensaje = event.desc;
    this.recordatorioFull.inicio = formatDate(event.startTime, 'medium', this.locale)
    this.recordatorioFull.fin = formatDate(event.endTime, 'medium',this.locale);
   await this.datosService.borrarRecordatorio(this.recordatorioFull);
  } 
}

  constructor(private alertCtrl: AlertController,
              @Inject(LOCALE_ID) private locale: string,
              private accionesService: AccionesService,
              private datosService: DatosService,
              private eventP: Events,
              private plt: Platform, 
              private modalCtrl: ModalController,
              private nav: NavController) { }

  ngOnInit() {
    this.resetEvent();
    this.today();

    this.datosService.cargarDatosRecordatorios();
    this.recordatoriosCargados = this.datosService.recordatoriosCargados;

    this.cargaYa=false;
  }

  //Este metodo cambia de valor la variable "cargaYa" para que pueda cargar el calendario sin problemas 
  ionViewWillEnter()
  {
    this.cargarEventosStorage();
    this.cargaYa=true;

     //Evento que escucha cuando el usuario es insertado para cambiar los datos de la grafica
     this.eventP.subscribe('recordatoriosCargados', () => {
      this.recordatoriosCargados = this.datosService.recordatoriosCargados;
      this.cargarEventosStorage();
      this.myCal.loadEvents();
    });

  }

  //Metodo que te regresa a la pantalla tab1 en este caso
  ionViewDidEnter() {
    this.backButtonSub = this.plt.backButton.subscribeWithPriority( 10000, () => {
      this.modalCtrl.dismiss();
      this.nav.navigateRoot('/tabs/tab1');
    });
  }

}
