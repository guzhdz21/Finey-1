import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, NavController, IonRadioGroup } from '@ionic/angular';
import { Tab1Page } from '../tab1/tab1.page';
import { DatosService } from '../../services/datos.service';
import { UsuarioLocal, Gasto, Rubro } from '../../interfaces/interfaces';
import { hostViewClassName } from '@angular/compiler';

@Component({
  selector: 'app-mis-gastos',
  templateUrl: './mis-gastos.page.html',
  styleUrls: ['./mis-gastos.page.scss'],
})
export class MisGastosPage implements OnInit {

  @ViewChild('sexo',{static: true}) sexo: IonRadioGroup;
  @ViewChild('tipoIngreso',{static: true}) tipoIngreso: IonRadioGroup;

  etiquetas: string[] = [];

  usuarioCargado: UsuarioLocal = this.datosService.usuarioCarga;

  constructor(private modalCtrl: ModalController,
              private nav: NavController,
              public datosService: DatosService) { }

  ngOnInit() {
    this.datosService.getEtiquetasTab1().subscribe (val => {
      this.etiquetas=val.nombre;
      });
      this.datosService.cargarDatos();
      this.sexo.value = this.usuarioCargado.sexo;
      this.tipoIngreso.value = this.usuarioCargado.tipoIngreso;
  }

  regresar() {
    this.modalCtrl.dismiss();
    this.nav.navigateRoot('/tabs/tab1');
  }
}