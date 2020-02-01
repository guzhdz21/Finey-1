import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
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

  etiquetas: string[] = [];
  hombre: string = this.datosService.hombre;
  mujer: string = this.datosService.mujer;
  fijo: string = this.datosService.fijo;
  variable: string = this.datosService.variable;

  usuarioCargado: UsuarioLocal = this.datosService.usuarioCarga;

  constructor(private modalCtrl: ModalController,
              private nav: NavController,
              public datosService: DatosService) { }

  ngOnInit() {
    this.datosService.getEtiquetasTab1().subscribe (val => {
      this.etiquetas=val.nombre;
      });
      this.datosService.cargarDatos();

      if(this.datosService.usuarioCarga.sexo === "/assets/Hombre.png")
      {
        this.datosService.hombre = 'true';
        this.datosService.mujer = 'false';
      }
        else
        {
          this.datosService.mujer = 'true';
          this.datosService.hombre = 'false';
        }

        if(this.datosService.usuarioCarga.tipoIngreso === "Fijo")
        {
          this.datosService.fijo = 'true';
          this.datosService.variable = 'false';
        }
          else
          {
            this.datosService.variable = 'true';
            this.datosService.fijo = 'false';
          }

          this.actualiza();
  }

  regresar() {
    this.modalCtrl.dismiss();
    this.nav.navigateRoot('/tabs/tab1');
  }

  actualiza() {
    this.hombre = this.datosService.hombre;
    this.mujer = this.datosService.mujer;
    this.fijo = this.datosService.fijo;
    this.variable = this.datosService.variable;
  }

}