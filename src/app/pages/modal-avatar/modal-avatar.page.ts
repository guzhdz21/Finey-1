import { Component, OnInit, ViewChild } from '@angular/core';
import { DatosService } from '../../services/datos.service';
import { UsuarioLocal, AlertaGeneral } from '../../interfaces/interfaces';
import { IonRadioGroup, ModalController, Events, NavController } from '@ionic/angular';
import { AccionesService } from '../../services/acciones.service';

@Component({
  selector: 'app-modal-avatar',
  templateUrl: './modal-avatar.page.html',
  styleUrls: ['./modal-avatar.page.scss'],
})
export class ModalAvatarPage implements OnInit {

  @ViewChild('sexo',{static: true}) sexo: IonRadioGroup;

  constructor(private datosService: DatosService,
              private modalCtrl: ModalController,
              private event: Events,
              private nav: NavController,
              private accionesService: AccionesService) { }

  alertas: AlertaGeneral[] = [];
  usuarioCargado: UsuarioLocal = this.datosService.usuarioCarga;

  ngOnInit() {
      this.datosService.cargarDatos();

      this.datosService.getAlertasJson().subscribe(val => {
        this.alertas = val;
      });

      this.sexo.value = this.usuarioCargado.sexo;
  }

  sexoRadio(event)
  {
    this.usuarioCargado.sexo = event.detail.value;
  }

  modificar() {
    this.datosService.guardarUsuarioInfo(this.usuarioCargado);
    this.event.publish('avatarActualizado');
    this.event.publish('salirAvatar');
    this.modalCtrl.dismiss();
    this.nav.navigateRoot('/tabs/tab1');
    this.datosService.presentToast('Cambios modificados');
  }

  botonInfo(titulo: string) {
    this.alertas.forEach(element => {
      if(titulo == element.titulo)
      {
        this.accionesService.presentAlertGenerica(element.titulo, element.mensaje);
        return;
      }
    });
  }
}
