import { Component, OnInit, ViewChild } from '@angular/core';
import { DatosService } from '../../services/datos.service';
import { UsuarioLocal, AlertaGeneral } from '../../interfaces/interfaces';
import { IonRadioGroup, ModalController, Events, NavController, Platform } from '@ionic/angular';
import { AccionesService } from '../../services/acciones.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-modal-avatar',
  templateUrl: './modal-avatar.page.html',
  styleUrls: ['./modal-avatar.page.scss'],
})
export class ModalAvatarPage implements OnInit {

  //Declaracion de variable para manejar el valor de elementos HTML
  @ViewChild('sexo',{static: true}) sexo: IonRadioGroup;

  //Variable donde se guardan los datos cargados de la informacion de las alertas
  alertas: AlertaGeneral[] = [];

  //Variable para guardar los datos cargados del ususario
  usuarioCargado: UsuarioLocal = this.datosService.usuarioCarga;

  backButtonSub: Subscription;

  //Constructor con las inyecciones y constructores necesarios
  constructor(private datosService: DatosService,
              private modalCtrl: ModalController,
              private event: Events,
              private nav: NavController,
              private accionesService: AccionesService,
              private plt: Platform) { }

  ngOnInit() {
    //Metodo para cargar los datos del ussuario
    this.datosService.cargarDatos();

    //Metodo para cargar la informacion de las alertas de un archivo
    this.datosService.getAlertasJson().subscribe(val => {
      this.alertas = val;
    });

    //Asignacion a la variable que muestra el sexo actual de usuario
    this.sexo.value = this.usuarioCargado.sexo;
  }

  //Metodo que cambia el sexo del ussuario cuando este lo cambia
  sexoRadio(event)
  {
    this.usuarioCargado.sexo = event.detail.value;
  }

  //Metodo que modifica la informacion del usuario y lo guarda en el storage
  modificar() {
    this.datosService.guardarUsuarioInfo(this.usuarioCargado);
    this.event.publish('avatarActualizado');
    this.modalCtrl.dismiss();
    this.nav.navigateRoot('/tabs/tab1');
    this.datosService.presentToast('Cambios modificados');
  }

  //Metodo que muestra la informacion al pulsar el boton de un elemento
  botonInfo(titulo: string) {
    this.alertas.forEach(element => {
      if(titulo == element.titulo) {
        this.accionesService.presentAlertGenerica(element.titulo, element.mensaje);
        return;
      }
    });
  }

  ionViewDidEnter() {
    this.backButtonSub = this.plt.backButton.subscribeWithPriority( 10000, () => {
      this.modalCtrl.dismiss();
      this.nav.navigateRoot('/tabs/tab1');
    });
  }
}
