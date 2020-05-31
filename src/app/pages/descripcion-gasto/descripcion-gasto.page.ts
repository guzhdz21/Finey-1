import { Component, OnInit, Input } from '@angular/core';
import { Gasto } from '../../interfaces/interfaces';
import { ModalController, NavController, Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { DatosService } from '../../services/datos.service';

@Component({
  selector: 'app-descripcion-gasto',
  templateUrl: './descripcion-gasto.page.html',
  styleUrls: ['./descripcion-gasto.page.scss'],
})
export class DescripcionGastoPage implements OnInit {

  //Variables que recibe del Tabs1 para verificar cual selecciono
  @Input() color;
  @Input() rubro;
  @Input() gastos;

  //Variable para el HTML
  info: Gasto  = {
    nombre: '',
    cantidad: null,
    tipo: '',
    porcentaje: '',
    icono: '',
    margenMin: null,
    margenMax: null
  }

  backButtonSub: Subscription;

  constructor(private modalCtrl: ModalController,
              private nav: NavController,
              private plt: Platform, 
              private datosService: DatosService) { }

  ngOnInit() {
    //For each que verifica y asigna la informacion del gasto selecionado a la variable del HTML
    this.gastos.forEach(element => {
      if(this.rubro === element.nombre) {
        this.info = element;
        return
      }
    });
  }

  ionViewDidEnter() {
    this.backButtonSub = this.plt.backButton.subscribeWithPriority( 10000, () => {
      this.modalCtrl.dismiss();
        this.nav.navigateRoot("tabs/tab1");
    });
  }

}
