import { Component, OnInit, Input } from '@angular/core';
import { DatosService } from '../../services/datos.service';
import { Plan } from '../../interfaces/interfaces';
import { NavController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-plan-pausar',
  templateUrl: './plan-pausar.page.html',
  styleUrls: ['./plan-pausar.page.scss'],
})
export class PlanPausarPage implements OnInit {

  @Input() planPrioritario: Plan;
  planes: Plan[] = this.datosService.planesCargados;

  valido: boolean = true;
  constructor(private datosService: DatosService,
              private nav: NavController,
              private modalCtrl: ModalController) { }

  ngOnInit() {
    console.log(this.planPrioritario);
  }
  
  accionPausar(i) {
    this.valido = true;
    this.planes[i].pausado = !this.planes[i].pausado
    this.planes.forEach(element => {
      if(element.pausado){
        this.valido = false;
        return;
      }
    });
  }

  registrarCambios() {
    if(this.planes.length == 2) {
      this.planes.forEach(element => {
        if(element.pausado) {
          element.aportacionMensual = 0;
        } else {
          element.aportacionMensual = (element.cantidadTotal - element.cantidadAcumulada)/element.tiempoRestante;
        }
      });
      this.datosService.actualizarPlanes(this.planes);
      this.modalCtrl.dismiss();
      this.nav.navigateRoot('/tabs/tab2');
    } else {
      
    }
  }

}
