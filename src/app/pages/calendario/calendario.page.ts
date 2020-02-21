import { Component, OnInit, ViewChild, Inject, LOCALE_ID } from '@angular/core';
import { CalendarComponent } from 'ionic2-calendar/calendar';
import { AlertController } from '@ionic/angular';
import { formatDate } from '@angular/common';

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
  endTime: '',
  allDay: false
};

cargaYa = false; //Variable que le indica cuando ya cargar el calendario
minDate = new Date().toISOString();  
viewTitle = ''; //Es la etiqueta que te indica el nombre del mes
eventSource=[];
collapseCard: boolean = false;

//Declaracion del calendario
calendar = {
  mode: 'month',
  currentDate: new Date()
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
    allDay: false
  };
}

//Metodo que añade un evento
addEvent() { 
  let eventCopy = { 
    title: this.event.title,
    startTime: new Date(this.event.startTime),
    endTime: new Date(this.event.endTime),
    allDay: this.event.allDay,
    desc: this.event.desc
  }
  if (eventCopy.allDay) { 
    let start = eventCopy.startTime;
    let end = eventCopy.endTime;

    eventCopy.startTime = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate()));
    eventCopy.endTime = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate() + 1));
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
  message: 'Inicio: ' + start + '<br><br>Fin: ' + end,
  buttons: ['OK']
});
    alert.present();  
 }

  constructor(private alertCtrl: AlertController,
              @Inject(LOCALE_ID) private locale: string) { }

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
