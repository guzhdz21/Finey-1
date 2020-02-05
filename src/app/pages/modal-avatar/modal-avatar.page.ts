import { Component, OnInit, ViewChild } from '@angular/core';
import { DatosService } from '../../services/datos.service';
import { UsuarioLocal } from '../../interfaces/interfaces';
import { IonRadioGroup, ModalController, Events, NavController } from '@ionic/angular';

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
              private nav: NavController) { }

  usuarioCargado: UsuarioLocal = this.datosService.usuarioCarga;

  ngOnInit() {
      this.datosService.cargarDatos();
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

}
