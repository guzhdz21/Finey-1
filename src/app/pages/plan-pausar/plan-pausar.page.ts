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

  @Input() indexPrioritario;

  planes: Plan[] = this.datosService.planesCargados;
  planes2: Plan[] = [];

  valido: boolean = true;
  constructor(private datosService: DatosService,
              private nav: NavController,
              private modalCtrl: ModalController) { }

  ngOnInit() {
    for (let index = 0; index < this.planes.length; index++) {
      if(index != this.indexPrioritario) {
        this.planes2.push(this.planes[index]);
      } 
    }
  }
  
  accionPausar(i) {
    var contador = 0;
    this.valido = false;
    this.planes2[i].pausado = !this.planes[i].pausado
    this.planes2.forEach(element => {
      if(element.pausado == false){
        contador++;
      }
    });
    if(contador > 1) {
      this.valido = true;
    }
  }

  registrarCambios() {
    this.planes2.forEach(element => {
      if(element.pausado) {
        element.aportacionMensual = 0;
      } else {
        
      }
    });
  }

}
