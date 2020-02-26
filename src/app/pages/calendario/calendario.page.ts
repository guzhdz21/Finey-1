import { Component, OnInit, ViewChild, Inject, LOCALE_ID } from '@angular/core';
import { CalendarComponent } from 'ionic2-calendar/calendar';
import { AlertController } from '@ionic/angular';
import { formatDate } from '@angular/common';
import { AccionesService } from '../../services/acciones.service';
import { DatosService } from 'src/app/services/datos.service';
import { Recordatorio } from '../../interfaces/interfaces';

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.page.html',
  styleUrls: ['./calendario.page.scss'],
})
export class CalendarioPage implements OnInit {

//Declaracion vacia de la estructura del recordatorio
event = {
  title: '',
  desc: '',
  startTime: '',
  endTime: ''
};

recordatorio: Recordatorio[] = [
  {
    title: '',
    mensaje: '',
    inicio: null,
    fin: null
  }
];

cargaYa = false; //Variable que le indica cuando ya cargar el calendario
minDate = new Date().toISOString();  
viewTitle = ''; //Es la etiqueta que te indica el nombre del mes
eventSource=[];
collapseCard: boolean = false;

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

//Metodo que añade un evento
addEvent() { 
  let eventCopy = { 
    title: this.event.title,
    startTime: new Date(this.event.startTime),
    endTime: new Date(this.event.endTime),
    desc: this.event.desc
  }
  this.eventSource.push(eventCopy);
  this.myCal.loadEvents();
  this.resetEvent();
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
  subHeader: event.desc,
  message: 'Inicio:  ' + start + '<br><br>Fin:  ' + end,
  buttons: [
  {text: 'Borrar', handler: (blah) => {this.borrarRecordatorio(2)}},
  {text: 'Ok'}]
    });
    alert.present();  
 }

registrarNuevoRecordatorio(){
 this.datosService.guardarNuevoRecordatorio(this.recordatorio[2]);
}

// Metodo que muestra una alert para borrar un recordatorio del storage
 async borrarRecordatorio(i: number) {
  await this.accionesService.presentAlertPlan([{text: 'Cancelar', handler: (blah) => {this.accionesService.borrarRecordatorio = false}},
                                        {text: 'Borrar', handler: (blah) => {this.accionesService.borrarRecordatorio = true}}], 
                                        '¿Estas seguro de que quieres borrar este recordatorio?', 'En caso de que te retractes tendrías que crear uno nuevo similar');
  
  if(this.accionesService.borrarRecordatorio==true) {
    this.datosService.borrarRecordatorio(i);
  } 
}

  constructor(private alertCtrl: AlertController,
              @Inject(LOCALE_ID) private locale: string,
              private accionesService: AccionesService,
              private datosService: DatosService) { }

  ngOnInit() {
    this.resetEvent();
    this.today();
    this.cargaYa=false;
  }

  //Este metodo cambia de valor la variable "cargaYa" para que pueda cargar el calendario sin problemas 
  ionViewWillEnter()
  {
    this.cargaYa=true;
  }
}
